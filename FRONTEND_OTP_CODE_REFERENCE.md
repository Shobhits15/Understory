# Frontend OTP Implementation - Code Reference

## Quick Reference Guide

### Component Props & Functions

#### AuthScreen.jsx
```jsx
// Props
{
  mode: "login" | "signup",
  setMode: (mode: string) => void,
  username: string,
  setUsername: (username: string) => void,
  email: string,              // NEW
  setEmail: (email: string) => void,  // NEW
  password: string,
  setPassword: (password: string) => void,
  error: string,
  busy: boolean,
  onLogin: () => void,
  onSignup: () => void,
  onGuest: () => void,
}

// NEW: Email input appears only in signup mode
{!isLogin && <input ... email input ... />}
```

#### OtpVerificationScreen.jsx (NEW)
```jsx
// Props
{
  email: string,              // User's email address
  otpExpiryMinutes: number,   // Minutes until OTP expires
  error: string,              // Error message to display
  busy: boolean,              // Loading state
  onVerify: (email: string, otp: string) => Promise<void>,
  onResendOtp: () => Promise<void>,
  onBack: () => void,
}

// Key Features
- Auto-numeric input (only digits)
- 6-digit validation
- Resend cooldown timer (60 seconds)
- Expiry timer display
- Error messaging
- Back button to return to signup
```

### API Functions

#### client.js - API Functions
```javascript
// NEW: Replace apiSignup with apiRegister
export async function apiRegister(username, email, password) {
  // POST /api/auth/register
  // Request:  { username, email, password }
  // Response: { success, message, timestamp, data: { message, email, otpExpiryMinutes } }
  // Error:    throws Error
  
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.data?.message || data.message || "Registration failed.");
  return data.data;  // Returns { message, email, otpExpiryMinutes }
}

// NEW: Verify OTP
export async function apiVerifyEmail(email, otp) {
  // POST /api/auth/verify-email
  // Request:  { email, otp }
  // Response: { success, message, timestamp }
  // Error:    throws Error
  
  const res = await fetch(`${API_BASE}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "OTP verification failed.");
  return data;
}

// NEW: Resend OTP
export async function apiResendOtp(email) {
  // POST /api/auth/resend-otp
  // Request:  { email }
  // Response: { success, message, timestamp }
  // Error:    throws Error
  
  const res = await fetch(`${API_BASE}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to resend OTP.");
  return data;
}
```

### App.jsx State & Handlers

#### New State Variables
```javascript
const [authEmail, setAuthEmail] = useState("");              // Email during signup
const [otpVerificationMode, setOtpVerificationMode] = useState(false);  // OTP screen flag
const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(10);  // OTP expiry time
```

#### New/Modified Handlers
```javascript
// MODIFIED: Now includes email and triggers OTP
async function handleSignup() {
  setAuthError("");
  const uname = authUsername.trim().toLowerCase();
  const email = authEmail.trim().toLowerCase();
  
  // Validation
  if (!uname || !email || !authPassword) {
    setAuthError("Enter a username, email, and password.");
    return;
  }
  if (!email.includes("@")) {
    setAuthError("Please enter a valid email address.");
    return;
  }
  
  setAuthBusy(true);
  try {
    const response = await apiRegister(uname, email, authPassword);
    setOtpExpiryMinutes(response.otpExpiryMinutes || 10);
    setOtpVerificationMode(true);  // Go to OTP screen
    setAuthError("");
  } catch (err) {
    setAuthError(err.message || "Signup failed.");
  } finally {
    setAuthBusy(false);
  }
}

// NEW: Verify OTP and login
async function handleVerifyEmail(email, otp) {
  setAuthError("");
  if (!otp || otp.length !== 6) {
    setAuthError("Please enter a valid 6-digit code.");
    return;
  }
  
  setAuthBusy(true);
  try {
    await apiVerifyEmail(email, otp);
    
    // Auto-login after verification
    setCurrentUser(authUsername);
    setIsGuest(false);
    setLikes({});
    setCart({});
    setProfile({});
    setProfileVersion((v) => v + 1);
    
    // Leave OTP screen and go to shop
    setOtpVerificationMode(false);
    setScreen("shop");
  } catch (err) {
    setAuthError(err.message || "OTP verification failed.");
  } finally {
    setAuthBusy(false);
  }
}

// NEW: Resend OTP (with error handling)
async function handleResendOtp() {
  setAuthError("");
  setAuthBusy(true);
  try {
    await apiResendOtp(authEmail);
    setAuthError("");
    // Don't clear OTP input - let user enter new code
  } catch (err) {
    setAuthError(err.message || "Failed to resend OTP.");
  } finally {
    setAuthBusy(false);
  }
}

// NEW: Go back to signup form from OTP screen
function handleBackFromOtp() {
  setOtpVerificationMode(false);
  setAuthError("");
  // Keep username, email, password for user to modify
}

// MODIFIED: Reset OTP state on logout
function handleLogout() {
  setCurrentUser(null);
  setIsGuest(false);
  setLikes({});
  setCart({});
  setProfile({});
  setProfileVersion((v) => v + 1);
  setAuthUsername("");
  setAuthEmail("");           // NEW
  setAuthPassword("");
  setAuthMode("login");
  setOtpVerificationMode(false);  // NEW
  setScreen("auth");
}
```

#### Auth Screen Rendering Logic
```javascript
if (screen === "auth") {
  // Show OTP verification screen if in OTP mode
  if (otpVerificationMode) {
    return (
      <OtpVerificationScreen
        email={authEmail}
        otpExpiryMinutes={otpExpiryMinutes}
        error={authError}
        busy={authBusy}
        onVerify={handleVerifyEmail}
        onResendOtp={handleResendOtp}
        onBack={handleBackFromOtp}
      />
    );
  }
  
  // Otherwise show normal auth screen (signup or login)
  return (
    <AuthScreen
      mode={authMode}
      setMode={setAuthMode}
      username={authUsername}
      setUsername={setAuthUsername}
      email={authEmail}              // NEW
      setEmail={setAuthEmail}        // NEW
      password={authPassword}
      setPassword={setAuthPassword}
      error={authError}
      busy={authBusy}
      onLogin={handleLogin}
      onSignup={handleSignup}
      onGuest={handleGuest}
    />
  );
}
```

## Data Flow Diagrams

### Signup Flow State Changes
```
Initial State:
  authMode: "signup"
  authUsername: "testuser"
  authEmail: "test@example.com"
  authPassword: "Test123!"
  otpVerificationMode: false
  otpExpiryMinutes: 10
  currentUser: null

↓ User clicks "Create account"

Call: handleSignup()
  ↓ Calls: apiRegister(username, email, password)
  ↓ Backend sends OTP email

State Update:
  otpVerificationMode: true  ← KEY CHANGE
  authError: ""

Render: OtpVerificationScreen (because otpVerificationMode = true)

↓ User enters OTP

Call: handleVerifyEmail(email, otp)
  ↓ Calls: apiVerifyEmail(email, otp)
  ↓ Backend verifies and marks email verified

State Update:
  currentUser: "testuser"    ← KEY CHANGE
  otpVerificationMode: false ← KEY CHANGE
  screen: "shop"             ← KEY CHANGE
  authError: ""

Render: Shop screen (because screen = "shop")
```

### Error Flow
```
User: Wrong OTP entered

↓ handleVerifyEmail(email, "000000")

↓ apiVerifyEmail fails

↓ catch (err)
  setAuthError(err.message)
  ↓ "Invalid or expired OTP"

State Update:
  authError: "Invalid or expired OTP"
  authBusy: false

Re-render: OtpVerificationScreen with error message

User can:
  1. Enter correct OTP again
  2. Click "Resend Code"
  3. Click "Back to Sign Up"
```

### Resend Flow with Rate Limiting
```
User: Clicks "Resend Code"

↓ OtpVerificationScreen.handleResendOtp()
  ↓ const [resendCooldown, setResendCooldown] = useState(0)
  ↓ if (resendCooldown > 0) return  ← Skip if cooldown active

↓ Call: handleResendOtp()
  ↓ Calls: apiResendOtp(authEmail)
  ↓ Backend generates new OTP, sends email

↓ OtpVerificationScreen:
  setResendCooldown(60)  ← Start 60-second cooldown
  
  // Countdown interval
  const interval = setInterval(() => {
    setResendCooldown((prev) => prev - 1)
  }, 1000)  ← Decrement every second

UI Effect:
  Button shows "Resend in 59s" → "Resend in 58s" → ... → "Resend Code"
  Button disabled during countdown
  After 60 seconds: Button becomes clickable again
```

## Key Implementation Patterns

### 1. Conditional Rendering
```javascript
// Show different screen based on state
if (screen === "auth") {
  if (otpVerificationMode) {
    return <OtpVerificationScreen />;
  }
  return <AuthScreen />;
}
```

### 2. Async Error Handling
```javascript
setAuthBusy(true);
try {
  const response = await apiFunction(...);
  // Update state on success
  setState(newValue);
} catch (err) {
  // Show error to user
  setAuthError(err.message || "Default error");
} finally {
  setAuthBusy(false);
}
```

### 3. Rate Limiting with Countdown
```javascript
// In OtpVerificationScreen.jsx
const [resendCooldown, setResendCooldown] = useState(0);

const handleResendOtp = async () => {
  if (resendCooldown > 0) return;  ← Skip if still cooling down
  
  try {
    await onResendOtp();
    setResendCooldown(60);  ← Start 60-second cooldown
    
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } catch (err) {
    // Handle error
  }
};
```

### 4. Form Validation
```javascript
// Email validation
if (!email.includes("@")) {
  setAuthError("Please enter a valid email address.");
  return;
}

// OTP validation
if (!otp || otp.length !== 6) {
  setAuthError("Please enter a valid 6-digit code.");
  return;
}

// Required fields
if (!uname || !email || !authPassword) {
  setAuthError("Enter a username, email, and password.");
  return;
}
```

### 5. Numeric Input Only
```javascript
// In OtpVerificationScreen.jsx
<input
  type="text"
  maxLength="6"
  value={otp}
  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
  // .replace(/\D/g, "") removes all non-digits
/>
```

## Testing Helper Functions

### Simulate Successful Flow
```javascript
// Browser Console
localStorage.clear();
// Then manually:
// 1. Sign up with email
// 2. Check backend logs for OTP
// 3. Enter OTP
```

### Check State
```javascript
// Browser Console (if state exposed)
console.log({
  authMode,
  authEmail,
  otpVerificationMode,
  currentUser,
  screen
});
```

### Monitor API Calls
```javascript
// DevTools Network Tab
// Look for:
// 1. POST /api/auth/register
// 2. POST /api/auth/verify-email
// 3. POST /api/auth/resend-otp
```

## Common Modifications

### Change OTP Length
```javascript
// In OtpVerificationScreen.jsx, line with maxLength:
maxLength="8"  // Change from 6 to 8

// In validation:
if (!otp || otp.length !== 8) {  // Change from 6 to 8
```

### Change Resend Cooldown
```javascript
// In OtpVerificationScreen.jsx, handleResendOtp:
setResendCooldown(120);  // Change from 60 to 120 (2 minutes)
```

### Change OTP Expiry Display
```javascript
// In OtpVerificationScreen.jsx:
<p>Code expires in <strong>{otpExpiryMinutes} minutes</strong></p>
// Display value comes from backend response
```

### Add Custom Styling
```javascript
// All components use COLORS theme from constants/colors
// Modify colors in COLORS object to change all UI colors
import { COLORS } from "../constants/colors";

// Common properties:
COLORS.bg          // Background
COLORS.card        // Card background
COLORS.ink         // Text color
COLORS.inkSoft     // Soft text color
COLORS.line        // Border color
COLORS.gold        // Accent color
COLORS.danger      // Error color
```

---

## Debugging Checklist

- [ ] Check browser console for JavaScript errors
- [ ] Open DevTools Network tab to inspect API requests
- [ ] Verify VITE_API_BASE environment variable is set
- [ ] Check backend logs for errors during registration
- [ ] Verify email is received after registration
- [ ] Inspect OTP verification request body in Network tab
- [ ] Check for CORS errors (red in console)
- [ ] Test with different email addresses
- [ ] Test with invalid OTP values
- [ ] Clear localStorage and try again if stuck

---

**This reference guide covers all code patterns used in the OTP implementation.**
