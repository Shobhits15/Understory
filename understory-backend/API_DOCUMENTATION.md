# Email OTP Verification API Documentation

## Overview

This document describes the complete Email OTP Verification API endpoints implemented in the Understory e-commerce platform. All endpoints return consistent JSON responses with `success`, `message`, `data`, `timestamp`, and optional `error` fields.

## Base URL
```
http://localhost:8080/api
```

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "timestamp": "2026-07-09T12:00:00Z",
  "data": {...},        // Optional, only when applicable
  "error": "ERROR_CODE" // Optional, only on errors
}
```

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

Register a new user and send OTP to their email.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Secure@Pass123"
}
```

**Request Validation:**
- `username`: 3-64 characters, alphanumeric with underscores allowed
- `email`: Valid email format
- `password`: At least 8 characters, must contain:
  - At least one letter (a-z, A-Z)
  - At least one number (0-9)
  - At least one special character (@$!%*#?&)

**Response Success (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. OTP sent to your email.",
  "timestamp": "2026-07-09T12:00:00Z",
  "data": {
    "message": "Registration successful. Please verify your email with the OTP sent to your inbox.",
    "email": "john@example.com",
    "otpExpiryMinutes": 10
  }
}
```

**Response Errors:**
- `400 Bad Request`: Missing or invalid fields
  - "Username is required"
  - "Email is required"
  - "Invalid email format"
  - "Password must be at least 8 characters long"
  - "Password must contain at least one letter, one number, and one special character"

- `409 Conflict`: User already exists
  - "Username is already taken"
  - "Email is already registered"

- `500 Internal Server Error`: Email sending failed
  - "Failed to send OTP. Please try again later."

---

### 2. Verify Email (OTP Verification)

**Endpoint:** `POST /api/auth/verify-email`

Verify user's email using the OTP sent to their email.

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in.",
  "timestamp": "2026-07-09T12:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request`: Invalid OTP or validation failed
  - "Invalid OTP. Attempt 1 of 5"
  - "OTP has expired. Please request a new one."
  - "Maximum OTP attempts exceeded. Please request a new OTP."

- `404 Not Found`: User not found
  - "User not found"

- `409 Conflict`: Email already verified
  - "Email is already verified"

---

### 3. Resend OTP

**Endpoint:** `POST /api/auth/resend-otp`

Resend OTP to user's email (rate-limited to once per 60 seconds).

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "OTP resent to your email. Please check your inbox.",
  "timestamp": "2026-07-09T12:00:00Z"
}
```

**Response Errors:**
- `429 Too Many Requests`: Rate limit exceeded
  - "Please wait 45 seconds before requesting a new OTP"

- `400 Bad Request`: Email already verified or invalid
  - "Email is already verified"
  - "Invalid email format"

- `404 Not Found`: User not found
  - "User not found"

- `500 Internal Server Error`: Email sending failed
  - "Failed to send OTP. Please try again later."

---

### 4. Login

**Endpoint:** `POST /api/auth/login`

Log in user with username and password. Email must be verified.

**Request:**
```json
{
  "username": "john_doe",
  "password": "Secure@Pass123"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "timestamp": "2026-07-09T12:00:00Z",
  "data": {
    "likes": {...},
    "cart": {...},
    "profile": {...}
  }
}
```

**Response Errors:**
- `401 Unauthorized`: Invalid credentials or email not verified
  - "Invalid credentials"
  - "Please verify your email before logging in"

- `400 Bad Request`: Missing fields
  - "Username and password are required."

---

### 5. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

Initiate password reset by sending OTP to user's email.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email. Please check your inbox.",
  "timestamp": "2026-07-09T12:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request`: Email not verified
  - "Please verify your email before resetting password"
  - "Invalid email format"

- `404 Not Found`: User not found
  - "User not found"

- `500 Internal Server Error`: Email sending failed
  - "Failed to send reset code. Please try again later."

---

### 6. Verify Reset OTP

**Endpoint:** `POST /api/auth/verify-reset-otp`

Verify the OTP for password reset.

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "OTP verified. You can now reset your password.",
  "timestamp": "2026-07-09T12:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request`: Invalid OTP
  - "Invalid OTP. Attempt 1 of 5"
  - "OTP has expired. Please request a new one."
  - "Maximum OTP attempts exceeded. Please request a new OTP."

- `404 Not Found`: User not found
  - "User not found"

---

### 7. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

Reset user password after OTP verification.

**Request:**
```json
{
  "email": "john@example.com",
  "newPassword": "NewSecure@Pass456",
  "otp": "123456"
}
```

**Password Requirements:**
Same as registration (min 8 chars, must include letter, number, special char)

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password.",
  "timestamp": "2026-07-09T12:00:00Z"
}
```

**Response Errors:**
- `400 Bad Request`: Invalid password or OTP
  - "Password must be at least 8 characters long"
  - "Password must contain at least one letter, one number, and one special character"
  - "Invalid OTP. Attempt 1 of 5"
  - "OTP has expired. Please request a new one."

- `404 Not Found`: User not found
  - "User not found"

---

## Security Features

### OTP Management
- **OTP Length:** 6 digits, randomly generated using SecureRandom
- **OTP Expiry:** 10 minutes (configurable via `otp.expiry.minutes`)
- **Maximum Attempts:** 5 wrong attempts (configurable via `otp.max.attempts`)
- **Resend Cooldown:** 60 seconds between resend requests (configurable via `otp.resend.cooldown.seconds`)

### Rate Limiting
- Resend OTP is rate-limited to prevent abuse
- Maximum 5 OTP verification attempts before requiring a new OTP

### Password Security
- Passwords are hashed using BCrypt with salt
- Passwords are never stored or returned in API responses
- OTP is never returned in successful verification responses

### Email Verification
- Email verification is mandatory before login
- Users cannot log in until their email is verified
- Account creation is completed immediately, but login requires email verification

---

## Configuration

Update `application.properties` with your email settings:

```properties
# Email Configuration - Resend SMTP
spring.mail.host=smtp.resend.com
spring.mail.port=587
spring.mail.username=resend
spring.mail.password=YOUR_RESEND_API_KEY
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# OTP Configuration
otp.length=6
otp.expiry.minutes=10
otp.resend.cooldown.seconds=60
otp.max.attempts=5

# Email Configuration
email.from=noreply@understory.com
email.from.name=Understory Shop
```

---

## Database Schema

The following fields are added to the `users` table:

```sql
ALTER TABLE users ADD COLUMN (
    email VARCHAR(100) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    otp VARCHAR(6),
    otp_expiry BIGINT,
    otp_attempts INT DEFAULT 0,
    last_otp_sent BIGINT,
    last_password_reset_otp BIGINT
);

CREATE INDEX idx_email ON users(email);
```

---

## Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| VALIDATION_ERROR | 400 | Input validation failed |
| REGISTRATION_ERROR | 400 | Registration failed |
| USER_EXISTS | 409 | User/Email already registered |
| USER_NOT_FOUND | 404 | User doesn't exist |
| INVALID_OTP | 400 | OTP is incorrect |
| OTP_EXPIRED | 400 | OTP has expired |
| EMAIL_NOT_VERIFIED | 403 | Email verification required |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| EMAIL_ERROR | 500 | Email sending failed |
| AUTH_ERROR | 401 | Authentication failed |
| INTERNAL_ERROR | 500 | Server error |

---

## Email Templates

### OTP Verification Email
- Company branding with logo
- Welcome message
- Large, prominently displayed OTP code
- Expiry notice (10 minutes)
- Security warning for unsolicited emails

### Password Reset Email
- Company branding with logo
- Password reset notification
- Large, prominently displayed OTP code
- Expiry notice (10 minutes)
- Security warning and instructions

---

## Usage Examples

### Example: Complete Registration and Login Flow

1. **Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Secure@Pass123"
  }'
```

2. **Verify Email (after receiving OTP from email):**
```bash
curl -X POST http://localhost:8080/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

3. **Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "Secure@Pass123"
  }'
```

### Example: Forgot Password Flow

1. **Request Password Reset:**
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

2. **Verify Reset OTP:**
```bash
curl -X POST http://localhost:8080/api/auth/verify-reset-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

3. **Reset Password:**
```bash
curl -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "newPassword": "NewSecure@Pass456",
    "otp": "123456"
  }'
```

---

## Troubleshooting

### Common Issues

1. **"Failed to send OTP"**
   - Verify Resend SMTP credentials are correct
   - Check internet connection
   - Verify email configuration in `application.properties`

2. **"Maximum OTP attempts exceeded"**
   - Request a new OTP using the resend endpoint
   - Wait for the cooldown period to expire

3. **"Email is already verified"**
   - User has already verified their email
   - Proceed to login

4. **"Please verify your email before logging in"**
   - User must complete email verification first
   - Check spam folder for verification email
   - Use resend-otp if initial email not received

---

## Support

For issues or questions regarding the Email OTP Verification system, please contact the development team.
