import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  captchaToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, phone, email, message, captchaToken } = formData;

    console.log('Received contact form submission from:', email);

    // Verify reCAPTCHA
    const recaptchaSecret = Deno.env.get('RECAPTCHA_SECRET_KEY');
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${recaptchaSecret}&response=${captchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();
    
    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData);
      return new Response(
        JSON.stringify({ error: 'CAPTCHA verification failed' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('reCAPTCHA verification successful');

    // Send email via Mailtrap API
    const mailtrapToken = Deno.env.get('MAILTRAP_API_KEY');
    
    const emailPayload = {
      from: {
        email: "hello@demoatmailtrap.com",
        name: "Balustrading Concepts NZ",
      },
      to: [
        {
          email: "admin@balustrading.co.nz",
        },
      ],
      subject: `New Quote Request from ${name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This message was sent from the contact form at balustrading.co.nz</p>
      `,
      text: `
New Quote Request

Name: ${name}
Phone: ${phone}
Email: ${email}

Message:
${message}

---
This message was sent from the contact form at balustrading.co.nz
      `,
    };

    const mailtrapResponse = await fetch('https://send.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mailtrapToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!mailtrapResponse.ok) {
      const errorData = await mailtrapResponse.text();
      console.error('Mailtrap API error:', errorData);
      throw new Error(`Failed to send email: ${mailtrapResponse.status}`);
    }

    const emailResult = await mailtrapResponse.json();
    console.log('Email sent successfully via Mailtrap:', emailResult);

    return new Response(
      JSON.stringify({ success: true, message: 'Form submitted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in submit-contact-form function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
