# Frontend OTP Implementation - Quick Start Guide

## What's New

✅ **New OTP Verification Flow** after signup
✅ **Email field** in signup form
✅ **OTP Verification Screen** with 6-digit code entry
✅ **Resend OTP** functionality with 60-second cooldown
✅ **Back to Signup** option to modify details
✅ **Rate limiting** and error handling

## Sign Up Flow (New)

### Before (Old Flow)
```
User enters username & password → Account created immediately → Logged in
```

### After (New Flow)
```
User enters username, email & password
    ↓
POST /api/auth/register
    ↓
OTP generated and sent to email
    ↓
User enters 6-digit code → POST /api/auth/verify-email
    ↓
Email verified → Account activated → Logged in
```

## Updated Frontend Files

| File | Changes |
|------|---------|
| `src/api/client.js` | +`apiRegister()`, +`apiVerifyEmail()`, +`apiResendOtp()` |
| `src/components/AuthScreen.jsx` | +email input field (signup mode only) |
| `src/components/OtpVerificationScreen.jsx` | NEW - OTP entry & verification UI |
| `src/App.jsx` | +OTP state management & flow handlers |

## Local Testing Setup

### Step 1: Configure Environment
```bash
# For local development (understory-frontend/.env)
VITE_API_BASE=http://localhost:8082/api
```

### Step 2: Start Backend (Spring Boot)
```bash
cd understory-backend
mvn spring-boot:run
# Should start on port 8082
```

### Step 3: Start Frontend (React)
```bash
cd understory-frontend
npm run dev
# Should start on port 5173
```

### Step 4: Test Signup Flow
1. Open http://localhost:5173
2. Click "Sign up" tab
3. Enter:
   - Username: `testuser`
   - Email: `your-email@example.com`
   - Password: `Test123!`
4. Click "Create account"
5. Should see OTP verification screen with email displayed
6. Check your email inbox for OTP code
7. Enter 6-digit code and click "Verify Email"
8. Should redirect to shop screen and be logged in

## Key Implementation Details

### API Changes

**Old Endpoint (Deprecated but still works):**
```
POST /api/auth/signup
Body: { username, password }
```

**New Endpoint:**
```
POST /api/auth/register
Body: { username, email, password }
Response: { success, message, timestamp, data: { email, otpExpiryMinutes } }

POST /api/auth/verify-email
Body: { email, otp }
Response: { success, message, timestamp }

POST /api/auth/resend-otp
Body: { email }
Response: { success, message, timestamp }
```

### State Flow in App.jsx

```javascript
// State variables added:
const [authEmail, setAuthEmail] = useState("");
const [otpVerificationMode, setOtpVerificationMode] = useState(false);
const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(10);

// New handlers:
handleSignup()        // Email validation, calls apiRegister
handleVerifyEmail()   // OTP verification, logs user in
handleResendOtp()     // Resend OTP with rate limiting
handleBackFromOtp()   // Return to signup form
```

## Component Communication

### AuthScreen → OtpVerificationScreen
```
AuthScreen (signup form)
    ↓ onSignup click
App.handleSignup()
    ↓ success
App.state: otpVerificationMode = true
    ↓ render
OtpVerificationScreen
```

### OtpVerificationScreen Actions
```
onVerify(email, otp)     → handleVerifyEmail() → login & redirect to shop
onResendOtp()            → handleResendOtp()  → get new OTP
onBack()                 → handleBackFromOtp() → return to signup form
```

## Error Handling

| Error | User Sees | Solution |
|-------|-----------|----------|
| Invalid OTP | "OTP verification failed" | Check email for correct code |
| Expired OTP | "OTP verification failed" | Click "Resend Code" |
| Max attempts | "OTP verification failed" | Click "Back to Sign Up" and retry |
| Resend too fast | Button shows cooldown "Resend in 45s" | Wait for cooldown |
| Invalid email | "Please enter a valid email address." | Fix email typo |
| Email exists | "Email already registered." | Use different email or login |

## Testing Checklist

- [ ] Signup with new email address
- [ ] Receive OTP in email inbox
- [ ] Enter correct OTP code
- [ ] Successfully log in after verification
- [ ] Click "Back to Sign Up" and modify email
- [ ] Test invalid OTP (wrong digits)
- [ ] Test expired OTP (wait 10 minutes)
- [ ] Test resend cooldown (60 seconds)
- [ ] Test max attempts (5 wrong tries)
- [ ] Login with verified account

## Debugging Tips

### Browser Console Errors
```javascript
// API errors logged with details
console.error(err) in handleSignup, handleVerifyEmail, handleResendOtp

// Check network tab for:
// - POST /api/auth/register (201 Created)
// - POST /api/auth/verify-email (200 OK)
// - POST /api/auth/resend-otp (200 OK)
```

### Backend Logs
```bash
# Check backend logs for:
# - OTP generation
# - Email sending
# - Email verification
# - OTP expiry checks

# In understory-backend:
tail -f logs/application.log
```

### Email Testing
```bash
# For testing without real email service:
# 1. Use a test email service (e.g., MailHog, Mailtrap)
# 2. Or use your Gmail with test credentials
# 3. Check spam folder

# Verify email was sent:
# - Backend logs should show "Email sent successfully"
# - Check email inbox/spam
```

## Common Issues & Fixes

### "Cannot find module" errors
```bash
# Install dependencies
npm install
```

### CORS errors
```bash
# Ensure backend has CORS configured for localhost:5173
# Check backend application.properties:
# spring.web.cors.allowed-origins=http://localhost:5173
```

### OTP not sending
```bash
# Verify backend email configuration:
# - MAIL_FROM set correctly
# - MAIL_PASSWORD (API key) valid
# - Check backend logs for SMTP errors
```

### Still in OTP screen after verification
```bash
# Check browser console for errors
# Verify API response format is correct
# Ensure backend OTP verification logic works
```

## Next Steps

1. **Test the complete flow locally**
   - Follow the setup steps above
   - Test all scenarios in the checklist

2. **Deploy to production**
   - Update frontend .env with production API URL
   - Ensure backend is running on production server
   - Test signup/OTP on production

3. **Monitor and iterate**
   - Watch server logs for errors
   - Collect user feedback
   - Iterate on UX if needed

4. **Security review**
   - Verify OTP not exposed in responses
   - Check rate limiting is working
   - Audit email sending logs

## Questions?

Refer to `FRONTEND_OTP_IMPLEMENTATION.md` for detailed documentation.
