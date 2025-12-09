# Resend SMTP Configuration

## ✅ Updated Configuration

Your email service has been updated to use **Resend SMTP** instead of the API.

## SMTP Settings

- **Host**: `smtp.resend.com`
- **Port**: `465` (SSL/TLS)
- **Username**: `resend`
- **Password**: Your Resend API Key (`re_77Yc3f5D_EvwW5hRNdD4EW9dXUKgUtXJB`)

## Environment Variables (.env)

Make sure your `.env` file has:

```env
# Resend API Key (used as SMTP password)
RESEND_API_KEY=re_77Yc3f5D_EvwW5hRNdD4EW9dXUKgUtXJB

# Resend SMTP Configuration
RESEND_SMTP_HOST=smtp.resend.com
RESEND_SMTP_PORT=465
RESEND_SMTP_USER=resend
RESEND_SMTP_PASSWORD=re_77Yc3f5D_EvwW5hRNdD4EW9dXUKgUtXJB

# Email From Address
RESEND_FROM_EMAIL=ImmaCare+ <noreply@immacare-clinic.it.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Important Notes

1. **Domain Verification Still Required**: Even with SMTP, your domain `immacare-clinic.it.com` must be verified in Resend dashboard
2. **DNS Records**: You still need to add DNS records in Namecheap (see `NAMECHEAP_DNS_SETUP.md`)
3. **Port 465**: Uses SSL/TLS encryption (secure connection)

## Testing

1. Restart your server:
   ```bash
   npm start
   ```

2. Register a test account
3. Check email inbox

## Troubleshooting

### Connection Errors
- Verify SMTP settings are correct
- Check firewall isn't blocking port 465
- Ensure domain is verified in Resend

### Authentication Errors
- Double-check API key is correct
- Verify username is `resend` (lowercase)
- Make sure password is your full API key

### Domain Errors
- Domain must be verified in Resend dashboard
- DNS records must be properly configured
- Wait for DNS propagation (15-30 minutes)

---

**Note**: SMTP approach uses `nodemailer` which is already installed in your project. This should work once your domain is verified in Resend!






