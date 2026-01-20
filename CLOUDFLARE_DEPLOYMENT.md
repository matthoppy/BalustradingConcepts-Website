# Cloudflare Pages Deployment Guide

This project uses a hybrid architecture:
- **Frontend**: Hosted on Cloudflare Pages (static React app)
- **Backend API**: Supabase Edge Functions
- **Email**: Resend

## Prerequisites

1. A Cloudflare account for hosting the frontend
2. An existing Supabase project (already configured)
3. Resend API key configured in Supabase Edge Function secrets
4. Google reCAPTCHA v3 configured in Supabase Edge Function secrets

## Architecture Overview

```
┌─────────────────────┐
│  Cloudflare Pages   │  <- Static React frontend
│   (Frontend Host)   │
└──────────┬──────────┘
           │
           │ API calls to
           │ /functions/v1/submit-contact-form
           ▼
┌─────────────────────┐
│ Supabase Edge Func  │  <- Backend API
│   (Deno Runtime)    │
└──────────┬──────────┘
           │
           │ Sends emails via
           ▼
┌─────────────────────┐
│      Resend         │  <- Email service
│   (Email Delivery)  │
└─────────────────────┘
```

## Deployment Steps

### 1. Connect Your Repository to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Click **Create a project**
4. Select **Connect to Git**
5. Choose your repository (matthoppy/BalustradingConcepts-Website)
6. Configure the build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave default)
   - **Node.js version**: 18 or later

### 2. Configure Environment Variables in Cloudflare Pages

In the Cloudflare Pages project settings, add the following environment variables for **both Production and Preview**:

```
VITE_SUPABASE_PROJECT_ID=zbvlkuhpxpbyafpbkaxt
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidmxrdWhweHBieWFmcGJrYXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Nzk2MzQsImV4cCI6MjA3OTI1NTYzNH0.raL8581wh4qPqP0GYcK7C_4tBSqAsWGXaVrB11SBuvk
VITE_SUPABASE_URL=https://zbvlkuhpxpbyafpbkaxt.supabase.co
```

**Note:** These are public keys and are safe to expose in the frontend. The actual secrets (RESEND_API_KEY, RECAPTCHA_SECRET_KEY) are configured in Supabase, not in Cloudflare Pages.

### 3. Verify Supabase Edge Function Configuration

Your Supabase Edge Function should already be deployed. Verify it's working:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/zbvlkuhpxpbyafpbkaxt)
2. Navigate to **Edge Functions**
3. Verify `submit-contact-form` is deployed
4. Check that the following secrets are configured:
   - `RESEND_API_KEY`: Your Resend API key
   - `RECAPTCHA_SECRET_KEY`: Your Google reCAPTCHA v3 secret key

If you need to update secrets:
```bash
supabase secrets set RESEND_API_KEY=re_xxxxx
supabase secrets set RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXX
```

### 4. Deploy

Once configured, Cloudflare Pages will automatically:
- Build your project on every push to your main branch
- Deploy the static frontend to a Cloudflare Pages URL
- Create preview deployments for pull requests

The frontend will make API calls to your existing Supabase Edge Function endpoint.

### 5. Configure Custom Domain (Optional)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Add your custom domain (e.g., `balustrading.co.nz`)
3. Follow the instructions to update your DNS records
4. Ensure HTTPS is enabled (automatic with Cloudflare)

## Project Structure

```
/
├── supabase/               # Supabase configuration
│   ├── functions/          # Edge Functions (backend API)
│   │   └── submit-contact-form/
│   │       └── index.ts    # Contact form handler with Resend
│   └── config.toml         # Supabase project config
├── src/                    # React application (frontend)
│   ├── components/         # React components
│   │   └── Contact.tsx     # Contact form (calls Supabase function)
│   ├── integrations/
│   │   └── supabase/       # Supabase client setup
│   └── pages/              # Route pages
├── dist/                   # Build output (generated)
├── wrangler.toml          # Cloudflare Pages configuration
├── .env                   # Local environment variables
└── package.json           # Dependencies and scripts
```

## API Endpoints

The frontend calls the Supabase Edge Function:

### POST {VITE_SUPABASE_URL}/functions/v1/submit-contact-form

Handles contact form submissions with:
- reCAPTCHA verification (server-side)
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

### Frontend Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:8080

The local frontend will connect to your live Supabase Edge Function.

### Testing Supabase Edge Functions Locally

If you need to test the Edge Function locally:

1. Install Supabase CLI:
   ```bash
   brew install supabase/tap/supabase  # macOS
   # or download from https://github.com/supabase/cli
   ```

2. Start Supabase locally:
   ```bash
   supabase start
   supabase functions serve
   ```

3. Update your `.env` to point to local Supabase:
   ```
   VITE_SUPABASE_URL=http://localhost:54321
   ```

## Email Configuration

Emails are sent via Resend from the Supabase Edge Function:
- **From**: `Balustrading Concepts NZ <noreply@balustrading.co.nz>`
- **To**: `admin@balustrading.co.nz`
- **Subject**: `New Quote Request from [Name]`

To change these settings, edit `supabase/functions/submit-contact-form/index.ts` and redeploy:
```bash
supabase functions deploy submit-contact-form
```

## Benefits of This Architecture

1. **Fast Static Hosting**: Cloudflare Pages provides global CDN distribution for fast page loads
2. **Serverless Backend**: Supabase Edge Functions handle API logic without managing servers
3. **Cost Effective**: Both services have generous free tiers
4. **Easy Updates**: Push to Git → Cloudflare auto-deploys frontend
5. **Secure**: Secrets stored in Supabase, not exposed in frontend
6. **Reliable Emails**: Resend provides high deliverability

## Troubleshooting

### Contact form not working
- Check that Supabase Edge Function is deployed and running
- Verify environment variables in Cloudflare Pages dashboard
- Check Supabase Edge Function logs for errors
- Ensure RESEND_API_KEY and RECAPTCHA_SECRET_KEY are set in Supabase secrets

### CORS errors
- Verify the Edge Function has proper CORS headers (it should already)
- Check that VITE_SUPABASE_URL is correctly set in Cloudflare Pages

### reCAPTCHA errors
- Verify the reCAPTCHA site key in `Contact.tsx` (line 292) matches your domain
- Check that RECAPTCHA_SECRET_KEY is set in Supabase Edge Function secrets
- Ensure your domain is registered in the reCAPTCHA admin console

### Build failures
- Check build logs in Cloudflare Pages dashboard
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version is 18 or later

## Migration from Lovable

This project has been migrated from Lovable to be self-hosted on Cloudflare Pages:
- ✅ Removed Lovable-specific dependencies (`lovable-tagger`)
- ✅ Static frontend now deploys to Cloudflare Pages
- ✅ Backend API remains on Supabase Edge Functions
- ✅ Resend integration unchanged
- ✅ Full Git-based deployment workflow

## Support

For issues with:
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **Supabase**: https://supabase.com/docs
- **Resend**: https://resend.com/docs
- **reCAPTCHA**: https://developers.google.com/recaptcha/docs/v3
