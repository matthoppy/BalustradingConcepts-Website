interface Env {
  RESEND_API_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
}

interface ContactFormBody {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  captchaToken?: string;
  photo?: { content: string; filename: string; type: string } | null;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: ContactFormBody;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { name, phone, email, message, captchaToken, photo } = payload;

  if (!name || !phone || !email || !message || !captchaToken) {
    return json({ error: "Missing required fields" }, 400);
  }

  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(env.RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(captchaToken)}`,
  });
  const verifyData = (await verifyRes.json()) as { success?: boolean };
  if (!verifyData.success) {
    return json({ error: "CAPTCHA verification failed" }, 400);
  }

  const emailPayload: Record<string, unknown> = {
    from: "Balustrading Concepts NZ <noreply@balustrading.co.nz>",
    to: ["admin@balustrading.co.nz"],
    reply_to: email,
    subject: `New Quote Request from ${name}`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
      ${photo ? "<p><em>Photo attached</em></p>" : ""}
      <hr>
      <p style="color: #666; font-size: 12px;">This message was sent from the contact form at balustrading.co.nz</p>
    `,
  };

  if (photo) {
    emailPayload.attachments = [{ filename: photo.filename, content: photo.content }];
  }

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    console.error("Resend API error:", resendRes.status, detail);
    return json({ error: "Failed to send email" }, 502);
  }

  return json({ success: true }, 200);
};
