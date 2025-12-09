# Resend Email Setup Guide for Namecheap Domain

This guide will walk you through setting up Resend email service with your Namecheap domain for the ImmaCare+ application.

## Prerequisites

- A Namecheap account with a domain
- A Resend account (sign up at https://resend.com)
- Access to your Namecheap domain DNS settings

---

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

---

## Step 2: Add Your Domain to Resend

1. Log in to your Resend dashboard
2. Click on **"Domains"** in the left sidebar
3. Click **"Add Domain"**
4. Enter your domain name (e.g., `yourdomain.com`)
5. Click **"Add Domain"**

---

## Step 3: Configure DNS Records in Namecheap

Resend will provide you with DNS records that need to be added to your Namecheap domain. Follow these steps:

### 3.1 Access Namecheap DNS Settings

1. Log in to your Namecheap account
2. Go to **"Domain List"** from the left sidebar
3. Click **"Manage"** next to your domain
4. Navigate to the **"Advanced DNS"** tab

### 3.2 Add SPF Record

1. In the **"Host Records"** section, click **"Add New Record"**
2. Select **"TXT Record"** from the dropdown
3. Fill in:
   - **Host**: `@` (or leave blank)
   - **Value**: Copy the SPF value from Resend (usually something like `v=spf1 include:resend.com ~all`)
   - **TTL**: `Automatic` or `600`
4. Click the **✓** (checkmark) to save

### 3.3 Add DKIM Records

Resend will provide **2 DKIM records** (CNAME records):

1. **First DKIM Record:**
   - Click **"Add New Record"**
   - Select **"CNAME Record"**
   - **Host**: Copy the hostname from Resend (e.g., `resend._domainkey`)
   - **Value**: Copy the value from Resend (e.g., `resend._domainkey.resend.com`)
   - **TTL**: `Automatic` or `600`
   - Click **✓** to save

2. **Second DKIM Record:**
   - Repeat the same process for the second DKIM record

### 3.4 Add DMARC Record (Optional but Recommended)

1. Click **"Add New Record"**
2. Select **"TXT Record"**
3. Fill in:
   - **Host**: `_dmarc`
   - **Value**: `v=DMARC1; p=none; rua=mailto:your-email@yourdomain.com`
   - **TTL**: `Automatic` or `600`
4. Click **✓** to save

### 3.5 Verify Domain Ownership (if required)

If Resend requires domain verification:
1. Add a TXT record with:
   - **Host**: `@` (or as specified by Resend)
   - **Value**: The verification code provided by Resend
   - **TTL**: `Automatic`

---

## Step 4: Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate. Typically:
- **Namecheap**: 15-30 minutes
- **Full propagation**: Up to 24-48 hours

You can check DNS propagation status using:
- [https://dnschecker.org](https://dnschecker.org)
- [https://mxtoolbox.com](https://mxtoolbox.com)

---

## Step 5: Verify Domain in Resend

1. Go back to your Resend dashboard
2. Navigate to **"Domains"**
3. Click on your domain
4. Click **"Verify Domain"** or wait for automatic verification
5. Resend will check your DNS records. Once verified, you'll see a green checkmark ✅

**Note**: If verification fails, double-check:
- All DNS records are correctly entered
- TTL values are set correctly
- You've waited enough time for DNS propagation

---

## Step 6: Get Your Resend API Key

1. In Resend dashboard, go to **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name (e.g., "ImmaCare Production")
4. Select permissions (usually **"Sending access"**)
5. Click **"Add"**
6. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!

---

## Step 7: Configure Environment Variables

1. Create or edit the `.env` file in your `web_immacare` directory
2. Add the following environment variables:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=ImmaCare+ <noreply@yourdomain.com>

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
# In production, change to: https://yourdomain.com
```

**Important Notes:**
- Replace `re_your_api_key_here` with your actual Resend API key
- Replace `yourdomain.com` with your actual domain
- The `RESEND_FROM_EMAIL` format is: `Display Name <email@yourdomain.com>`
- Make sure the email address matches your verified domain

---

## Step 8: Test Email Sending

1. Start your server:
   ```bash
   cd web_immacare
   npm start
   ```

2. Register a new account through the signup page
3. Check the email inbox for the verification email
4. If email doesn't arrive:
   - Check spam folder
   - Verify API key is correct
   - Check server logs for errors
   - Verify domain is verified in Resend

---

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify `RESEND_API_KEY` in `.env` is correct
2. **Check Domain Verification**: Ensure domain shows as verified in Resend dashboard
3. **Check DNS Records**: Use DNS checker tools to verify records are propagated
4. **Check Server Logs**: Look for error messages in your server console
5. **Check Resend Dashboard**: Go to "Logs" in Resend to see email sending status

### DNS Records Not Working

1. **Wait Longer**: DNS propagation can take up to 48 hours
2. **Check Record Types**: Ensure you're using TXT for SPF/DMARC and CNAME for DKIM
3. **Check Host Values**: Make sure host values match exactly what Resend provided
4. **Remove Old Records**: Delete any conflicting DNS records

### Domain Verification Failing

1. **Double-check DNS Records**: Ensure all records are added correctly
2. **Check TTL**: Set TTL to 600 or Automatic
3. **Wait for Propagation**: Wait at least 30 minutes after adding records
4. **Contact Support**: If issues persist, contact Resend support

---

## Resend Free Tier Limits

- **3,000 emails/month**
- **100 emails/day**
- Perfect for small to medium healthcare clinics

---

## Production Checklist

Before going live:

- [ ] Domain is verified in Resend
- [ ] All DNS records are properly configured
- [ ] API key is stored securely in `.env` (never commit to git)
- [ ] `FRONTEND_URL` is set to your production domain
- [ ] `RESEND_FROM_EMAIL` uses your verified domain
- [ ] Test email sending works
- [ ] Monitor Resend dashboard for any issues

---

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Domain Setup Guide](https://resend.com/docs/dashboard/domains/introduction)
- [Namecheap DNS Management](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [DNS Propagation Checker](https://dnschecker.org)

---

## Support

If you encounter issues:
1. Check Resend dashboard logs
2. Review server error logs
3. Verify DNS records are correct
4. Contact Resend support: support@resend.com

---

**Last Updated**: 2024






