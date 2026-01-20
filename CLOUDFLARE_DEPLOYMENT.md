# Cloudflare Pages Deployment Guide

This project is configured to deploy on Cloudflare Pages with Resend email integration.

## Prerequisites

1. A Cloudflare account
2. A Resend API key (sign up at https://resend.com)
3. A Google reCAPTCHA v3 site and secret key (https://www.google.com/recaptcha/admin)

## Deployment Steps

### 1. Connect Your Repository to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Click **Create a project**
4. Select **Connect to Git**
5. Choose your repository (matthoppy/BalustradingConcepts-Website)
6. Configure the build settings:
   - **Framework preset**: None (or Vite)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave default)

### 2. Configure Environment Variables

In the Cloudflare Pages project settings, add the following environment variables:

#### Required Variables (Production & Preview):

- **`RESEND_API_KEY`**: Your Resend API key
  - Get this from: https://resend.com/api-keys
  - Example: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

- **`RECAPTCHA_SECRET_KEY`**: Your Google reCAPTCHA v3 secret key
  - Get this from: https://www.google.com/recaptcha/admin
  - Example: `6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Note:** The reCAPTCHA site key (`6LeUNBgsAAAAACpEykq296IxdhZPgjl1gNAP1scs`) is hardcoded in the Contact component. If you need to change it, update `src/components/Contact.tsx` line 292.

### 3. Deploy

Once configured, Cloudflare Pages will automatically:
- Build your project on every push to your main branch
- Deploy to a production URL
- Create preview deployments for pull requests

### 4. Configure Custom Domain (Optional)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Add your custom domain (e.g., `balustrading.co.nz`)
3. Follow the instructions to update your DNS records

## Project Structure

```
/
├── functions/              # Cloudflare Pages Functions (API routes)
│   └── api/
│       └── submit-contact-form.ts  # Contact form handler
├── src/                    # React application
│   ├── components/         # React components
│   │   └── Contact.tsx     # Contact form component
│   └── pages/              # Route pages
├── dist/                   # Build output (generated)
├── wrangler.toml          # Cloudflare configuration
└── package.json           # Dependencies and scripts
```

## API Endpoints

### POST /api/submit-contact-form

Handles contact form submissions with:
- reCAPTCHA verification
- Email sending via Resend
- File attachment support (up to 5MB images)

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "09 123 4567",
  "email": "john@example.com",
  "message": "I'd like a quote...",
  "captchaToken": "03...",
  "photo": {
    "content": "base64-encoded-image",
    "filename": "project.jpg",
    "type": "image/jpeg"
  }
}
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. For local testing of Cloudflare Functions:
   ```bash
   npm install -g wrangler
   wrangler pages dev -- npm run dev
   ```

   Note: You'll need to set up environment variables in `.dev.vars`:
   ```
   RESEND_API_KEY=your_key_here
   RECAPTCHA_SECRET_KEY=your_key_here
   ```

## Email Configuration

Emails are sent via Resend using the following configuration:
- **From**: `Balustrading Concepts NZ <noreply@balustrading.co.nz>`
- **To**: `admin@balustrading.co.nz`
- **Subject**: `New Quote Request from [Name]`

To change these settings, edit `functions/api/submit-contact-form.ts`.

## Troubleshooting

### Contact form not working
- Check that environment variables are set correctly in Cloudflare Pages dashboard
- Verify your Resend API key is valid
- Check Cloudflare Pages function logs for errors

### reCAPTCHA errors
- Verify the reCAPTCHA site key in `Contact.tsx` matches your domain
- Check that the secret key environment variable is correct
- Ensure your domain is registered in the reCAPTCHA admin console

### Build failures
- Check build logs in Cloudflare Pages dashboard
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version compatibility (project uses Node 22+)

## Support

For issues with:
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **Resend**: https://resend.com/docs
- **reCAPTCHA**: https://developers.google.com/recaptcha/docs/v3
