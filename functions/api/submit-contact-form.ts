interface Env {
  RESEND_API_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
}

interface EventContext<E> {
  request: Request;
  env: E;
}

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  captchaToken: string;
  photo?: {
    content: string;
    filename: string;
    type: string;
  } | null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async ({ request, env }: EventContext<Env>) => {
  let formData: ContactFormData;
  try {
    formData = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const { name, phone, email, message, captchaToken, photo } = formData;

  if (!name || !phone || !email || !message || !captchaToken) {
    return jsonResponse(400, { error: "Missing required fields" });
  }

  const recaptchaResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(env.RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(captchaToken)}`,
    },
  );
  const recaptchaData = (await recaptchaResponse.json()) as { success: boolean };
  if (!recaptchaData.success) {
    return jsonResponse(400, { error: "CAPTCHA verification failed" });
  }

  const emailPayload: Record<string, unknown> = {
    from: "Balustrading Concepts NZ <noreply@balustrading.co.nz>",
    to: ["admin@balustrading.co.nz"],
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
    emailPayload.attachments = [
      { filename: photo.filename, content: photo.content },
    ];
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  if (!resendResponse.ok) {
    const errorBody = await resendResponse.text();
    console.error("Resend API error:", resendResponse.status, errorBody);
    return jsonResponse(502, { error: "Failed to send email" });
  }

  return jsonResponse(200, { success: true, message: "Form submitted successfully" });
};
