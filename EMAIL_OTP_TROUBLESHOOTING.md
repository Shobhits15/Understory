# Email OTP Configuration - Setup & Troubleshooting

## Issue: "Authentication Failed" Error

This error occurs when the backend cannot authenticate with the email service (Resend SMTP).

## Solution: Configure Email Service

### Step 1: Set Environment Variables

For Windows (PowerShell as Administrator):
```powershell
[Environment]::SetEnvironmentVariable("MAIL_PASSWORD", "ubidlnhazvwsanfw", "User")
[Environment]::SetEnvironmentVariable("MAIL_FROM", "adm22004021@rmlau.ac.in", "User")
```

Or set in current session only:
```powershell
$env:MAIL_PASSWORD = "ubidlnhazvwsanfw"
$env:MAIL_FROM = "adm22004021@rmlau.ac.in"
```

### Step 2: Verify Configuration

Check `application.properties`:
```properties
spring.mail.host=smtp.resend.com
spring.mail.port=587
spring.mail.username=resend
spring.mail.password=${MAIL_PASSWORD:ubidlnhazvwsanfw}
email.from=${MAIL_FROM:adm22004021@rmlau.ac.in}
```

### Step 3: Restart Backend

```bash
# Kill existing Java processes
Get-Process java -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }

# Start fresh
cd understory-backend
mvn clean spring-boot:run
```

## Email Service Details

- **Provider:** Resend SMTP
- **Host:** smtp.resend.com
- **Port:** 587 (TLS)
- **Username:** resend
- **Password:** ubidlnhazvwsanfw (API Key)
- **From Email:** adm22004021@rmlau.ac.in

## Common Errors & Fixes

### Error: "550 Invalid from address"
- The MAIL_FROM email doesn't match your Resend account
- **Fix:** Use the email address registered with Resend

### Error: "535 Authentication failed"
- API key is incorrect or expired
- Credentials not set in environment
- **Fix:** Verify API key and restart backend

### Error: "Connection refused"
- SMTP server unreachable
- Firewall blocking port 587
- **Fix:** Check firewall, test connectivity: `Test-NetConnection smtp.resend.com -Port 587`

## Testing Email Sending

After backend is running, test with:

```bash
curl -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "your-email@example.com",
    "password": "Test@123"
  }'
```

Expected response:
- **201 Created** = Success, OTP sent
- **400 Bad Request** = Validation error
- **500 Internal Server Error** = Email sending failed

## Check Backend Logs

Look for email sending status:
```
✅ Success: "Email sent successfully"
❌ Error: "Failed to send OTP" or "Authentication failed"
```

## Next Steps

1. Verify environment variables are set
2. Restart backend with clean build
3. Check email inbox for OTP
4. If still not receiving emails, check spam folder or Resend dashboard

---

**Note:** If using local testing without real email, you can bypass email and test OTP verification logic separately.
