import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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
  photo?: {
    content: string;
    filename: string;
    type: string;
  } | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, phone, email, message, captchaToken, photo } = formData;

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

    // Prepare email payload
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

    // Send email via Resend
    const emailResponse = await resend.emails.send(emailPayload);

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log('Email sent successfully via Resend:', emailResponse);

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
