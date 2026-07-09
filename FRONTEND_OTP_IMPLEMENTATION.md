# Frontend OTP Implementation Guide

## Overview

This document describes the complete frontend OTP verification flow implemented in the Understory React application. The implementation includes a signup flow with email verification, OTP entry, and resend functionality.

## Architecture

### Components

#### 1. **AuthScreen.jsx**
- Main authentication screen supporting both Login and Signup modes
- **New in this update**: Added email field that appears only during signup
- Props:
  - `mode`: "login" or "signup"
  - `email`: Email state (only used in signup mode)
  - `setEmail`: Email setter function
  - Other existing props for username, password, etc.

#### 2. **OtpVerificationScreen.jsx** (NEW)
- Dedicated component for OTP verification after signup
- Features:
  - 6-digit OTP input with numeric validation
  - Real-time countdown for resend cooldown (60 seconds)
  - Timer showing OTP expiry (10 minutes)
  - "Resend Code" button with rate limiting
  - "Back to Sign Up" button to go back and modify registration details
  - Professional UI with error messaging
- Props:
  - `email`: User's email address
  - `otpExpiryMinutes`: OTP expiry time in minutes (default: 10)
  - `error`: Error message to display
  - `busy`: Loading state
  - `onVerify`: Callback function `(email, otp) => Promise`
  - `onResendOtp`: Callback function `() => Promise`
  - `onBack`: Callback function `() => void`

### API Functions (client.js)

#### 1. **apiRegister(username, email, password)**
```javascript
// Replaces the old apiSignup function
// POST /api/auth/register
// Request: { username, email, password }
// Response: { success: true, message: string, timestamp: string, data: { message, email, otpExpiryMinutes } }
// Throws: Error with message if registration fails
```

#### 2. **apiVerifyEmail(email, otp)**
```javascript
// POST /api/auth/verify-email
// Request: { email, otp }
// Response: { success: true, message: string, timestamp: string }
// Throws: Error if OTP is invalid, expired, or max attempts exceeded
```

#### 3. **apiResendOtp(email)**
```javascript
// POST /api/auth/resend-otp
// Request: { email }
// Response: { success: true, message: string, timestamp: string }
// Throws: Error if resend rate limit exceeded or user not found
```

#### 4. **apiSignup(username, password)** (DEPRECATED)
- Kept for backward compatibility
- No longer used in the new OTP flow

### State Management (App.jsx)

New state variables added:
- `authEmail`: User's email during signup
- `otpVerificationMode`: Boolean to track if we're in OTP verification screen
- `otpExpiryMinutes`: OTP expiry time from backend response

### Sign-Up Flow

#### Step 1: Registration Form
1. User switches to "Sign up" mode in AuthScreen
2. User enters: username, email, password
3. Validation:
   - All fields required
   - Email format validation (must contain "@")
4. User clicks "Create account"

#### Step 2: OTP Sent
1. Frontend calls `apiRegister(username, email, password)`
2. Backend generates 6-digit OTP, saves with 10-minute expiry
3. Backend sends OTP via email
4. Frontend receives response with `otpExpiryMinutes`
5. Frontend transitions to `OtpVerificationScreen`

#### Step 3: OTP Verification
1. User enters 6-digit code
2. Input validation: only numeric, exactly 6 digits
3. User clicks "Verify Email"
4. Frontend calls `apiVerifyEmail(email, otp)`
5. Backend verifies:
   - OTP matches
   - OTP not expired
   - Attempt count < 5
6. Backend marks email as verified, clears OTP
7. Frontend logs user in automatically and redirects to shop screen

#### Step 4: Resend OTP
1. User can click "Resend Code" button
2. Frontend enforces 60-second cooldown (displays countdown)
3. Frontend calls `apiResendOtp(email)`
4. Backend:
   - Checks resend rate limit (60 seconds)
   - Generates new OTP
   - Invalidates old OTP
   - Updates expiry time
   - Sends new OTP to email
5. Frontend resets OTP input and error messages

#### Step 5: Back to Signup
1. User can click "Back to Sign Up"
2. Frontend returns to signup form
3. User can modify username/email/password and re-submit

## Key Features

### Security

1. **OTP Validation**
   - 6-digit numeric only
   - Expires after 10 minutes
   - Maximum 5 verification attempts
   - OTP deleted after successful verification

2. **Rate Limiting**
   - Resend OTP allowed once every 60 seconds
   - Frontend enforces UI cooldown
   - Backend enforces server-side rate limit

3. **Data Protection**
   - OTP never exposed in API responses
   - Passwords hashed on backend
   - Email verified before account activation

### User Experience

1. **Responsive UI**
   - Clear instructions and messaging
   - Countdown timers for transparency
   - Error messages guide user actions
   - Button states indicate disabled/loading states

2. **Error Handling**
   - Invalid OTP message
   - Expired OTP message
   - Rate limit exceeded message
   - Network error handling

3. **Accessibility**
   - Semantic HTML
   - Color-coded feedback (danger/success)
   - Clear button labels and states

## Configuration

### Environment Variables

**Development (.env)**
```
VITE_API_BASE=http://localhost:8082/api
```

**Production (.env)**
```
VITE_API_BASE=https://understory-production-cec9.up.railway.app/api
```

### Backend Requirements

Ensure the backend is running with these endpoints:
- `POST /api/auth/register` - Registration with OTP
- `POST /api/auth/verify-email` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - Login (checks email verified)

## Testing

### Manual Testing Checklist

1. **Signup Flow**
   - [ ] Navigate to Sign up tab
   - [ ] Enter valid username, email, password
   - [ ] Click "Create account"
   - [ ] Should redirect to OTP verification screen
   - [ ] OTP should be sent to email

2. **OTP Verification**
   - [ ] Enter 6-digit code
   - [ ] Click "Verify Email"
   - [ ] Should see success and redirect to shop
   - [ ] User should be logged in

3. **Resend OTP**
   - [ ] Click "Resend Code" multiple times
   - [ ] Should see 60-second cooldown between sends
   - [ ] New OTP should arrive in email

4. **Error Scenarios**
   - [ ] Invalid OTP (wrong digits) → error message
   - [ ] Expired OTP (wait 10 minutes) → error message
   - [ ] Max attempts exceeded (5 wrong attempts) → error message
   - [ ] Go back and modify details → should work

5. **Login After Verification**
   - [ ] Switch to Log in tab
   - [ ] Enter verified account credentials
   - [ ] Should successfully log in

## Files Modified/Created

### Modified Files
- `src/api/client.js` - Added apiRegister, apiVerifyEmail, apiResendOtp
- `src/components/AuthScreen.jsx` - Added email field for signup
- `src/App.jsx` - Added OTP verification flow and new state variables

### New Files
- `src/components/OtpVerificationScreen.jsx` - New OTP verification component

## API Response Examples

### Registration Success
```json
{
  "success": true,
  "message": "Registration successful. OTP sent to your email.",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "data": {
    "message": "Registration successful",
    "email": "user@example.com",
    "otpExpiryMinutes": 10
  }
}
```

### Registration Error (Email Already Exists)
```json
{
  "success": false,
  "message": "Email already registered.",
  "error": "USER_ALREADY_EXISTS",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### OTP Verification Success
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in.",
  "timestamp": "2024-01-15T10:35:12.456Z"
}
```

### OTP Verification Error (Invalid/Expired)
```json
{
  "success": false,
  "message": "Invalid or expired OTP. Please try again or request a new code.",
  "error": "INVALID_OTP",
  "timestamp": "2024-01-15T10:35:12.456Z"
}
```

## Troubleshooting

### Issue: OTP email not received
**Solution:**
1. Check spam/junk folder
2. Verify email address is correct (check typo)
3. Click "Resend Code" button
4. Check backend logs for email sending errors

### Issue: "OTP verification failed" error
**Solution:**
1. Verify you entered the correct 6-digit code
2. Check if OTP has expired (10 minutes)
3. If expired, click "Resend Code" to get new OTP
4. If still failing after 5 attempts, must restart signup

### Issue: Stuck on OTP verification screen
**Solution:**
1. Click "Back to Sign Up" to return to form
2. Modify any details and try again
3. Or close and restart the signup process

### Issue: "Resend in Xs" button not working
**Solution:**
1. This is the rate limit cooldown - wait for countdown
2. After 60 seconds, button becomes clickable again
3. This prevents spam and abuse

## Future Enhancements

1. **Email Verification Resend UI**
   - Show which email OTP was sent to
   - Allow user to change email before verifying

2. **OTP Input Enhancement**
   - Auto-focus between OTP input fields (6 separate inputs)
   - Auto-submit when all 6 digits entered
   - Copy-paste support

3. **Remember Email**
   - Option to remember email for next login attempt
   - Auto-fill email on future signups

4. **Multi-factor Authentication**
   - SMS OTP option in addition to email
   - Backup codes for account recovery

## Support

For issues or questions about the OTP implementation:
1. Check this documentation
2. Review error messages in UI
3. Check browser console for network errors
4. Verify backend configuration and logs
