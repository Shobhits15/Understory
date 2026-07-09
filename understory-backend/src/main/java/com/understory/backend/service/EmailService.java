package com.understory.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${email.from}")
    private String emailFrom;

    @Value("${email.from.name}")
    private String emailFromName;

    @Value("${otp.expiry.minutes}")
    private int otpExpiryMinutes;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends OTP verification email to the user
     */
    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
        String subject = "Your Understory Email Verification Code";
        String htmlContent = buildOtpEmailTemplate(otp);
        sendHtmlEmail(toEmail, subject, htmlContent);
        logger.info("OTP email sent to: {}", toEmail);
    }

    /**
     * Sends password reset OTP email to the user
     */
    public void sendPasswordResetOtpEmail(String toEmail, String otp) throws MessagingException {
        String subject = "Your Understory Password Reset Code";
        String htmlContent = buildPasswordResetEmailTemplate(otp);
        sendHtmlEmail(toEmail, subject, htmlContent);
        logger.info("Password reset OTP email sent to: {}", toEmail);
    }

    /**
     * Generic method to send HTML email
     */
    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailFrom, emailFromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (java.io.UnsupportedEncodingException e) {
            throw new MessagingException("Failed to configure email: unsupported encoding", e);
        }
    }

    /**
     * Builds the HTML template for OTP verification email
     */
    private String buildOtpEmailTemplate(String otp) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <style>\n" +
                "        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }\n" +
                "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }\n" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }\n" +
                "        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }\n" +
                "        .content { padding: 30px 20px; }\n" +
                "        .welcome { font-size: 16px; color: #333; margin-bottom: 20px; }\n" +
                "        .otp-section { background-color: #f9f9f9; border: 2px solid #667eea; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0; }\n" +
                "        .otp-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }\n" +
                "        .otp-code { font-size: 40px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace; }\n" +
                "        .expiry-notice { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; font-size: 14px; color: #856404; }\n" +
                "        .security-warning { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; font-size: 13px; color: #721c24; }\n" +
                "        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; }\n" +
                "        .footer p { margin: 5px 0; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <h1>🌿 Understory Shop</h1>\n" +
                "            <p>Email Verification</p>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <p class=\"welcome\">Hello,</p>\n" +
                "            <p class=\"welcome\">Welcome to Understory! To complete your registration and secure your account, please verify your email by entering the code below:</p>\n" +
                "            <div class=\"otp-section\">\n" +
                "                <div class=\"otp-label\">Your Verification Code</div>\n" +
                "                <div class=\"otp-code\">" + otp + "</div>\n" +
                "            </div>\n" +
                "            <div class=\"expiry-notice\">\n" +
                "                ⏱️ <strong>This code expires in " + otpExpiryMinutes + " minutes.</strong> Please verify your email before the code expires.\n" +
                "            </div>\n" +
                "            <div class=\"security-warning\">\n" +
                "                🔒 <strong>Security Notice:</strong> If you did not request this verification code, please disregard this email. Your account remains secure.\n" +
                "            </div>\n" +
                "            <p style=\"margin-top: 20px; color: #666; font-size: 14px;\">Best regards,<br><strong>The Understory Team</strong></p>\n" +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            <p>© 2026 Understory Shop. All rights reserved.</p>\n" +
                "            <p>This is an automated message. Please do not reply to this email.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    /**
     * Builds the HTML template for password reset email
     */
    private String buildPasswordResetEmailTemplate(String otp) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <style>\n" +
                "        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }\n" +
                "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }\n" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }\n" +
                "        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }\n" +
                "        .content { padding: 30px 20px; }\n" +
                "        .welcome { font-size: 16px; color: #333; margin-bottom: 20px; }\n" +
                "        .otp-section { background-color: #f9f9f9; border: 2px solid #667eea; border-radius: 8px; padding: 25px; text-align: center; margin: 25px 0; }\n" +
                "        .otp-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }\n" +
                "        .otp-code { font-size: 40px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: 'Courier New', monospace; }\n" +
                "        .expiry-notice { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; font-size: 14px; color: #856404; }\n" +
                "        .security-warning { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; font-size: 13px; color: #721c24; }\n" +
                "        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; }\n" +
                "        .footer p { margin: 5px 0; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <h1>🌿 Understory Shop</h1>\n" +
                "            <p>Password Reset</p>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <p class=\"welcome\">Hello,</p>\n" +
                "            <p class=\"welcome\">We received a request to reset your Understory account password. To proceed, please enter the verification code below:</p>\n" +
                "            <div class=\"otp-section\">\n" +
                "                <div class=\"otp-label\">Your Password Reset Code</div>\n" +
                "                <div class=\"otp-code\">" + otp + "</div>\n" +
                "            </div>\n" +
                "            <div class=\"expiry-notice\">\n" +
                "                ⏱️ <strong>This code expires in " + otpExpiryMinutes + " minutes.</strong> Please reset your password before the code expires.\n" +
                "            </div>\n" +
                "            <div class=\"security-warning\">\n" +
                "                🔒 <strong>Security Notice:</strong> If you did not request a password reset, please disregard this email and your account will remain secure. Do not share this code with anyone.\n" +
                "            </div>\n" +
                "            <p style=\"margin-top: 20px; color: #666; font-size: 14px;\">Best regards,<br><strong>The Understory Team</strong></p>\n" +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            <p>© 2026 Understory Shop. All rights reserved.</p>\n" +
                "            <p>This is an automated message. Please do not reply to this email.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }
}
