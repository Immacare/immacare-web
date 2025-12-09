# Test Email Verification Setup

## ✅ Checklist Before Testing

### 1. Environment Variables (.env file)
- [ ] `RESEND_API_KEY` is set correctly: `re_77Yc3f5D_EvwW5hRNdD4EW9dXUKgUtXJB`
- [ ] `RESEND_FROM_EMAIL` is in correct format: `ImmaCare+ <noreply@immacare-clinic.it.com>`
- [ ] `FRONTEND_URL` is set: `http://localhost:3000`

### 2. Resend Domain Setup
- [ ] Domain `immacare-clinic.it.com` is added in Resend dashboard
- [ ] All DNS records are added in Namecheap:
  - [ ] DKIM TXT record (`resend._domainkey`)
  - [ ] SPF MX record (`send` → `feedback-smtp.ap-northeast-1.amazonaws.com`)
  - [ ] SPF TXT record (`send` → `v=spf1 include:amazonses.com ~all`)
  - [ ] DMARC TXT record (`_dmarc` → `v=DMARC1; p=none;`)
- [ ] Domain shows as "Verified" in Resend dashboard (green checkmarks ✅)

### 3. Server Setup
- [ ] Server is running on port 3000
- [ ] MongoDB connection is working
- [ ] No errors in server console

---

## 🧪 How to Test

### Step 1: Start Your Server
```bash
cd web_immacare
npm start
```

### Step 2: Register a Test Account
1. Go to: `http://localhost:3000/signup/signup.html`
2. Fill out the registration form
3. Submit the form
4. You should see: "Registration Successful! A verification email has been sent..."

### Step 3: Check Email
1. Check the email inbox you used for registration
2. Look for email from: `ImmaCare+ <noreply@immacare-clinic.it.com>`
3. Subject: "Verify Your ImmaCare+ Account"
4. **Check spam folder if not in inbox**

### Step 4: Verify Email
1. Click the "Verify Email Address" button in the email
2. OR copy the verification link and paste in browser
3. Should redirect to verification page showing "Email Verified!"

### Step 5: Test Login
1. Go to: `http://localhost:3000/login/login.html`
2. Try logging in with the account you just registered
3. Should work after email verification

---

## 🔍 Troubleshooting

### Email Not Sending?

**Check Server Logs:**
Look for errors in your server console. Common issues:

1. **"Invalid API Key"**
   - Check `RESEND_API_KEY` in `.env` is correct
   - Make sure no extra spaces or quotes

2. **"Invalid from email"**
   - Check `RESEND_FROM_EMAIL` format: `ImmaCare+ <noreply@immacare-clinic.it.com>`
   - Make sure domain matches verified domain in Resend

3. **"Domain not verified"**
   - Go to Resend dashboard → Domains
   - Check if domain shows as verified
   - Verify all DNS records are correct

**Check Resend Dashboard:**
1. Go to Resend dashboard → Logs
2. Check if email sending attempts are logged
3. Look for error messages

### Domain Not Verified?

1. **Check DNS Records:**
   - Use [dnschecker.org](https://dnschecker.org) to verify records are propagated
   - Check each record type:
     - TXT record for `resend._domainkey.immacare-clinic.it.com`
     - MX record for `send.immacare-clinic.it.com`
     - TXT record for `send.immacare-clinic.it.com`
     - TXT record for `_dmarc.immacare-clinic.it.com`

2. **Wait for Propagation:**
   - DNS changes can take 15-30 minutes (up to 48 hours)
   - Namecheap usually propagates within 30 minutes

3. **Verify in Resend:**
   - Go to Resend dashboard → Domains
   - Click on your domain
   - Click "Verify Domain" or wait for auto-verification
   - All records should show green checkmarks ✅

### Verification Link Not Working?

1. **Check Token:**
   - Token expires after 24 hours
   - Request a new verification email if expired

2. **Check URL:**
   - Make sure `FRONTEND_URL` in `.env` matches your server URL
   - Verification link format: `http://localhost:3000/verify-email?token=xxx`

3. **Check Server:**
   - Make sure server is running
   - Check server logs for errors

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Registration shows "verification email sent" message
2. ✅ Email arrives in inbox (or spam) within 1-2 minutes
3. ✅ Email has proper formatting and verification button
4. ✅ Clicking verification link shows "Email Verified!" page
5. ✅ Can log in after verification
6. ✅ Cannot log in before verification (shows verification required message)

---

## 📝 Quick Fix for Your .env

Replace this line:
```
RESEND_FROM_EMAIL=immacare-clinic.it.com 
```

With this:
```
RESEND_FROM_EMAIL=ImmaCare+ <noreply@immacare-clinic.it.com>
```

**Important:** 
- Use the exact format: `Display Name <email@domain.com>`
- The email domain must match your verified domain in Resend
- No extra spaces or quotes






