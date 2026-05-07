# Email Delivery Setup Guide

## Quick Setup for Real Email Delivery

### Step 1: Copy Production Configuration
```bash
cp .env.production .env
```

### Step 2: Configure Gmail SMTP

1. **Enable 2-Factor Authentication** on your Google Account
2. **Create an App Password**:
   - Go to https://myaccount.google.com/
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update your .env file**:
```bash
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=security@yourcompany.com
```

### Step 3: Restart Server
```bash
# Kill existing server
pkill -f node

# Start with new configuration
npm run dev
```

### Step 4: Test Real Email Delivery
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

You should receive a real email with the OTP code!

## Alternative SMTP Providers

### SendGrid (Recommended for Production)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
```

### AWS SES (Production)
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=YOUR_SES_SMTP_USERNAME
SMTP_PASS=YOUR_SES_SMTP_PASSWORD
```

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

## Troubleshooting

### Gmail Authentication Failed
- Use App Password, not regular password
- Check "Less secure app access" is enabled if not using App Password
- Verify 2FA is enabled

### Connection Issues
- Check SMTP host and port
- Verify firewall allows SMTP traffic
- Try port 465 with SSL: `SMTP_SECURE=true, SMTP_PORT=465`

### Email Not Sending
- Verify `OTP_FALLBACK_TO_PREVIEW=false`
- Check SMTP credentials are correct
- Monitor email quota limits

## Security Notes

- Never commit `.env` file to git
- Use environment variables in production
- Use dedicated email service for production
- Set up SPF/DKIM records for your domain
