/**
 * POST /api/submit-contact-form — the quote forms' enquiry handler.
 *
 * The home page form, the "Request a quote" modal and the heat pump cover
 * form all post here. The function verifies the Turnstile token, keeps the
 * enquiry for the admin dashboard (D1, with the photo in the file store),
 * then emails the office and the customer through Resend.
 *
 * Received means kept or emailed. The dashboard copy never blocks the email
 * and the email never blocks the dashboard copy; only when neither happened
 * does the customer hear "something went wrong".
 *
 * Secrets (Pages project → Settings → Variables and Secrets):
 *   RESEND_API_KEY        required to email; the enquiry is still kept without it
 *   TURNSTILE_SECRET_KEY  required in production; skipped if unset (local dev)
 *   BUSINESS_EMAIL        optional, defaults to admin@balustrading.co.nz
 *   FROM_EMAIL            optional, defaults to Balustrading Concepts NZ <noreply@balustrading.co.nz>
 * Bindings: DB (D1), FILES (R2) or FILES_KV (KV) — see functions/_lib/admin.ts.
 */

import type { Env, PagesContext } from '../_lib/bindings';
import { businessHtml, customerHtml, markEmailed, persistEnquiry, readEnquiry, sendEmail } from '../_lib/enquiries';
import { setting } from '../_lib/util';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

export const onRequestOptions = async () => new Response(null, { headers: corsHeaders });

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
  });
  const data = (await res.json().catch(() => ({ success: false }))) as { success?: boolean };
  return !!data.success;
}

export async function handleSubmit(request: Request, env: Env): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }
  const q = readEnquiry(body);
  if (!q.name || !q.phone || !q.email || !q.message || !q.captchaToken) {
    return jsonResponse(400, { error: 'Missing required fields' });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    let ok = false;
    try {
      ok = await verifyTurnstile(q.captchaToken, env.TURNSTILE_SECRET_KEY);
    } catch (err) {
      console.error('Turnstile verification failed', String(err));
    }
    if (!ok) return jsonResponse(400, { error: 'CAPTCHA verification failed' });
  }

  const businessEmail = setting(env as Record<string, unknown>, 'BUSINESS_EMAIL', 'admin@balustrading.co.nz');
  const fromEmail = setting(env as Record<string, unknown>, 'FROM_EMAIL', 'Balustrading Concepts NZ <noreply@balustrading.co.nz>');
  const adminOrigin = setting(env as Record<string, unknown>, 'ADMIN_ORIGIN', 'https://www.balustrading.co.nz');

  // The dashboard copy first, so the email can carry the enquiry number.
  const enquiryId = await persistEnquiry(env, q);

  let emailed = false;
  if (env.RESEND_API_KEY) {
    const subject = q.kind === 'heatpump' ? `Heat pump cover enquiry from ${q.name}` : `New Quote Request from ${q.name}`;
    const attachments = q.photo && !q.photo.tooBig ? [{ filename: q.photo.name, content: q.photo.data }] : [];
    emailed = await sendEmail(env, {
      from: fromEmail,
      to: [businessEmail],
      reply_to: q.email,
      subject: `${subject}${enquiryId ? ` (${enquiryId})` : ''}`,
      html: businessHtml(q, enquiryId, enquiryId ? `${adminOrigin}/admin/enquiries?open=${enquiryId}` : null),
      ...(attachments.length ? { attachments } : {}),
    });
    if (emailed) {
      await sendEmail(env, {
        from: fromEmail,
        to: [q.email],
        subject: q.kind === 'heatpump' ? 'We have your heat pump cover enquiry — Balustrading Concepts' : 'We have your quote request — Balustrading Concepts',
        html: customerHtml(q, businessEmail),
      });
      if (enquiryId) await markEmailed(env, enquiryId);
    }
  } else {
    console.error('No RESEND_API_KEY on this project; the enquiry was kept but not emailed');
  }

  if (!enquiryId && !emailed) {
    return jsonResponse(502, { error: 'Failed to send email' });
  }
  return jsonResponse(200, { success: true, enquiryId, message: 'Form submitted successfully' });
}

export const onRequestPost = async ({ request, env }: PagesContext<Env>) => handleSubmit(request, env);
