# Email OTP Verification - Setup & Configuration Guide

## Quick Start

### 1. Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Resend account (for email sending)

### 2. Environment Variables Setup

Before running the application, set these environment variables:

```bash
# Database Configuration
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/understory?useSSL=false&serverTimezone=UTC
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=your_db_password

# Email Configuration (Resend SMTP)
export MAIL_USERNAME=resend
export MAIL_PASSWORD=your_resend_api_key
export MAIL_FROM=noreply@understory.com

# Server Configuration
export PORT=8080
```

### 3. Getting Resend API Key

1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new API key for SMTP
5. Copy the API key and use it as `MAIL_PASSWORD`

### 4. MySQL Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE understory;
USE understory;
```

The application will automatically create the tables when it starts (via `schema.sql`).

### 5. Build and Run

```bash
# Clone repository
git clone <repository-url>
cd understory-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Or run the JAR directly:
```bash
java -jar target/understory-backend-1.0.0.jar
```

### 6. Verify Installation

Check if the application is running:

```bash
curl http://localhost:8080/api/auth/register
# Should return: 400 Bad Request (since we didn't send a valid request body)
```

---

## Configuration Details

### application.properties

The application uses the following configuration:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/understory
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=always

# Email - Resend SMTP
spring.mail.host=smtp.resend.com
spring.mail.port=587
spring.mail.username=resend
spring.mail.password=YOUR_RESEND_API_KEY
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.protocols=TLSv1.2

# OTP Configuration
otp.length=6
otp.expiry.minutes=10
otp.resend.cooldown.seconds=60
otp.max.attempts=5

# Email Configuration
email.from=noreply@understory.com
email.from.name=Understory Shop

# Admin Passcode
app.admin.passcode=pro
```

### Environment Variable Mapping

| Environment Variable | Property | Example |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `spring.datasource.url` | `jdbc:mysql://localhost:3306/understory` |
| `SPRING_DATASOURCE_USERNAME` | `spring.datasource.username` | `root` |
| `SPRING_DATASOURCE_PASSWORD` | `spring.datasource.password` | `db_password` |
| `MAIL_HOST` | `spring.mail.host` | `smtp.resend.com` |
| `MAIL_PORT` | `spring.mail.port` | `587` |
| `MAIL_USERNAME` | `spring.mail.username` | `resend` |
| `MAIL_PASSWORD` | `spring.mail.password` | `re_xxxxxxxxxxxxx` |
| `MAIL_FROM` | `email.from` | `noreply@understory.com` |
| `PORT` | `server.port` | `8080` |

---

## Email Configuration

### Using Resend SMTP

Resend provides SMTP access for sending emails. Here's how to configure it:

1. **Get SMTP Credentials:**
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Your API Key from Resend Dashboard

2. **Email From Address:**
   - Use `noreply@yourdomain.com` (must be from your domain)
   - Sender Name: `Understory Shop` (configurable)

3. **Configuration in `application.properties`:**
   ```properties
   spring.mail.host=smtp.resend.com
   spring.mail.port=587
   spring.mail.username=resend
   spring.mail.password=your_api_key
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   spring.mail.properties.mail.smtp.starttls.required=true
   ```

### Testing Email Configuration

After setting up Resend, you can test the email configuration:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@yourdomain.com",
    "password": "Test@123456"
  }'
```

Check the email inbox for the OTP verification code.

---

## Database Schema

The application automatically creates the following table structure:

```sql
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  otp VARCHAR(6),
  otp_expiry BIGINT,
  otp_attempts INT DEFAULT 0,
  last_otp_sent BIGINT,
  last_password_reset_otp BIGINT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

CREATE TABLE user_profiles (
  username VARCHAR(64) PRIMARY KEY,
  likes_json JSON NOT NULL,
  cart_json JSON NOT NULL,
  profile_json JSON NOT NULL,
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);
```

---

## Docker Deployment (Optional)

### Docker Compose Setup

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: understory
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: .
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/understory?useSSL=false&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root_password
      MAIL_PASSWORD: your_resend_api_key
      MAIL_FROM: noreply@understory.com
      PORT: 8080
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

Run with:
```bash
docker-compose up -d
```

---

## Production Deployment Checklist

- [ ] Set strong database password (not `root`)
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS/SSL in production
- [ ] Configure proper CORS settings
- [ ] Set up logging and monitoring
- [ ] Configure automated backups for database
- [ ] Test email delivery thoroughly
- [ ] Monitor OTP generation and usage
- [ ] Set up rate limiting at API gateway level
- [ ] Enable authentication middleware for protected endpoints
- [ ] Configure proper error handling and alerts
- [ ] Test password reset and email verification flows
- [ ] Set up email templates for different locales if needed
- [ ] Configure firewall rules and security groups
- [ ] Implement audit logging for security events

---

## Troubleshooting

### Email Not Sending

**Problem:** "Failed to send OTP" error

**Solution:**
1. Verify Resend API key is correct
2. Check SMTP settings in `application.properties`
3. Verify email address is correctly formatted
4. Check application logs for detailed error messages
5. Ensure network connectivity to `smtp.resend.com:587`

### Database Connection Error

**Problem:** "Unable to connect to database"

**Solution:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check database URL is correct
3. Verify credentials are correct
4. Ensure database `understory` exists
5. Check firewall rules allow port 3306

### OTP Expired Too Quickly

**Problem:** "OTP has expired" when trying to verify

**Solution:**
1. Increase `otp.expiry.minutes` in `application.properties`
2. Default is 10 minutes, try 15-20 minutes
3. Example: `otp.expiry.minutes=15`

### Rate Limit Issues

**Problem:** "Please wait X seconds before requesting a new OTP"

**Solution:**
1. Wait for the specified cooldown period
2. Or reduce `otp.resend.cooldown.seconds` in `application.properties` (default: 60)
3. For testing, set to `10` seconds

### Build Errors

**Problem:** Maven compilation fails

**Solution:**
1. Ensure Java 17+ is installed: `java -version`
2. Clear Maven cache: `mvn clean`
3. Update dependencies: `mvn dependency:resolve`
4. Check that all environment variables are set

---

## Monitoring & Logging

### Enable Debug Logging

Add to `application.properties`:

```properties
logging.level.root=INFO
logging.level.com.understory.backend=DEBUG
logging.level.org.springframework.mail=DEBUG
```

### View Application Logs

```bash
# If running with Spring Boot CLI
tail -f application.log

# Or in Docker
docker-compose logs -f app
```

### Monitor Email Sending

Check Resend dashboard for email statistics:
- Delivered emails
- Bounced emails
- Failed deliveries

---

## Testing the Implementation

### Test Script (Bash)

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"

# 1. Register
echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123456"
  }')
echo $REGISTER_RESPONSE | jq '.'

# 2. Resend OTP
echo "2. Resending OTP..."
RESEND_RESPONSE=$(curl -s -X POST $BASE_URL/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }')
echo $RESEND_RESPONSE | jq '.'

# 3. Try login before verification (should fail)
echo "3. Attempting login before verification..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123456"
  }')
echo $LOGIN_RESPONSE | jq '.'

echo "✓ All tests completed!"
```

---

## Support & Documentation

- **API Documentation:** See `API_DOCUMENTATION.md`
- **GitHub Issues:** Report bugs via repository issues
- **Security Issues:** Report to security@understory.com

---

## License

This implementation is part of the Understory project and follows the project's license.
