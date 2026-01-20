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

interface Env {
  RESEND_API_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  try {
    const formData: ContactFormData = await context.request.json();
    const { name, phone, email, message, captchaToken, photo } = formData;

    console.log('Received contact form submission from:', email);

    // Verify reCAPTCHA
    const recaptchaSecret = context.env.RECAPTCHA_SECRET_KEY;
    const recaptchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${recaptchaSecret}&response=${captchaToken}`,
      }
    );

    const recaptchaData: any = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData);
      return new Response(
        JSON.stringify({ error: 'CAPTCHA verification failed' }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    console.log('reCAPTCHA verification successful');

    // Prepare email payload for Resend API
    const emailPayload: any = {
      from: "Balustrading Concepts NZ <noreply@balustrading.co.nz>",
      to: ["admin@balustrading.co.nz"],
      subject: `New Quote Request from ${name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        ${photo ? '<p><em>Photo attached</em></p>' : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">This message was sent from the contact form at balustrading.co.nz</p>
      `,
    };

    // Add attachment if photo exists
    if (photo) {
      emailPayload.attachments = [{
        filename: photo.filename,
        content: photo.content,
      }];
    }

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData: any = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      throw new Error(`Failed to send email: ${resendData.message || 'Unknown error'}`);
    }

    console.log('Email sent successfully via Resend:', resendData);

    return new Response(
      JSON.stringify({ success: true, message: 'Form submitted successfully' }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error('Error in submit-contact-form function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
};
