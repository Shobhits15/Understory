package com.understory.backend.service;

import com.understory.backend.dto.RegisterRequest;
import com.understory.backend.dto.RegisterResponse;
import com.understory.backend.exception.*;
import com.understory.backend.model.User;
import com.understory.backend.repository.UserRepository;
import com.understory.backend.util.OtpUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.mail.MessagingException;

import java.util.regex.Pattern;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${otp.expiry.minutes:10}")
    private int otpExpiryMinutes;

    @Value("${otp.max.attempts:5}")
    private int maxOtpAttempts;

    @Value("${otp.resend.cooldown.seconds:60}")
    private int resendCooldownSeconds;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    );

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
    );

    public AuthService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Registers a new user and sends OTP to their email
     */
    public RegisterResponse register(RegisterRequest request) throws MessagingException {
        validateRegistrationRequest(request);

        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername().toLowerCase())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        // Create new user
        String otp = OtpUtil.generateOtp();
        long now = System.currentTimeMillis();
        long otpExpiry = now + (otpExpiryMinutes * 60 * 1000L);

        User user = User.builder()
                .username(request.getUsername().toLowerCase().trim())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .otp(otp)
                .otpExpiry(otpExpiry)
                .otpAttempts(0)
                .lastOtpSent(now)
                .emailVerified(false)
                .createdAt(now)
                .updatedAt(now)
                .build();

        userRepository.save(user);

        // Send OTP email
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
            logger.info("OTP sent to user: {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send OTP email to: {}", user.getEmail(), e);
            throw e;
        }

        return RegisterResponse.builder()
                .message("Registration successful. Please verify your email with the OTP sent to your inbox.")
                .email(user.getEmail())
                .otpExpiryMinutes(otpExpiryMinutes)
                .build();
    }

    /**
     * Verifies the OTP for email verification
     */
    public void verifyEmail(String email, String otp) {
        validateEmail(email);

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (user.getEmailVerified()) {
            throw new IllegalStateException("Email is already verified");
        }

        // Check OTP attempts
        if (user.getOtpAttempts() != null && user.getOtpAttempts() >= maxOtpAttempts) {
            throw new InvalidOtpException("Maximum OTP attempts exceeded. Please request a new OTP.");
        }

        // Check if OTP is expired
        if (OtpUtil.isOtpExpired(user.getOtpExpiry())) {
            throw new OtpExpiredException("OTP has expired. Please request a new one.");
        }

        // Validate OTP format and match
        if (!OtpUtil.isValidOtpFormat(otp) || !otp.equals(user.getOtp())) {
            int attempts = (user.getOtpAttempts() != null ? user.getOtpAttempts() : 0) + 1;
            user.setOtpAttempts(attempts);
            userRepository.save(user);
            throw new InvalidOtpException("Invalid OTP. Attempt " + attempts + " of " + maxOtpAttempts);
        }

        // Mark email as verified and clear OTP
        user.setEmailVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setUpdatedAt(System.currentTimeMillis());
        userRepository.save(user);

        logger.info("Email verified for user: {}", user.getEmail());
    }

    /**
     * Resends OTP to user's email
     */
    public void resendOtp(String email) throws MessagingException {
        validateEmail(email);

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (user.getEmailVerified()) {
            throw new IllegalStateException("Email is already verified");
        }

        // Check rate limiting (resend cooldown)
        long now = System.currentTimeMillis();
        if (user.getLastOtpSent() != null) {
            long timeSinceLastOtp = (now - user.getLastOtpSent()) / 1000;
            if (timeSinceLastOtp < resendCooldownSeconds) {
                long remainingTime = resendCooldownSeconds - timeSinceLastOtp;
                throw new OtpResendRateLimitExceededException(
                        "Please wait " + remainingTime + " seconds before requesting a new OTP"
                );
            }
        }

        // Generate new OTP
        String newOtp = OtpUtil.generateOtp();
        long otpExpiry = now + (otpExpiryMinutes * 60 * 1000L);

        user.setOtp(newOtp);
        user.setOtpExpiry(otpExpiry);
        user.setOtpAttempts(0);
        user.setLastOtpSent(now);
        user.setUpdatedAt(now);
        userRepository.save(user);

        // Send OTP email
        emailService.sendOtpEmail(user.getEmail(), newOtp);
        logger.info("OTP resent to user: {}", user.getEmail());
    }

    /**
     * Initiates password reset by sending OTP
     */
    public void initiatePasswordReset(String email) throws MessagingException {
        validateEmail(email);

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!user.getEmailVerified()) {
            throw new EmailNotVerifiedException("Please verify your email before resetting password");
        }

        // Generate OTP for password reset
        String otp = OtpUtil.generateOtp();
        long now = System.currentTimeMillis();
        long otpExpiry = now + (otpExpiryMinutes * 60 * 1000L);

        user.setOtp(otp);
        user.setOtpExpiry(otpExpiry);
        user.setOtpAttempts(0);
        user.setLastPasswordResetOtp(now);
        user.setUpdatedAt(now);
        userRepository.save(user);

        // Send password reset OTP email
        emailService.sendPasswordResetOtpEmail(user.getEmail(), otp);
        logger.info("Password reset OTP sent to user: {}", user.getEmail());
    }

    /**
     * Verifies the OTP for password reset
     */
    public void verifyPasswordResetOtp(String email, String otp) {
        validateEmail(email);

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check OTP attempts
        if (user.getOtpAttempts() != null && user.getOtpAttempts() >= maxOtpAttempts) {
            throw new InvalidOtpException("Maximum OTP attempts exceeded. Please request a new OTP.");
        }

        // Check if OTP is expired
        if (OtpUtil.isOtpExpired(user.getOtpExpiry())) {
            throw new OtpExpiredException("OTP has expired. Please request a new one.");
        }

        // Validate OTP format and match
        if (!OtpUtil.isValidOtpFormat(otp) || !otp.equals(user.getOtp())) {
            int attempts = (user.getOtpAttempts() != null ? user.getOtpAttempts() : 0) + 1;
            user.setOtpAttempts(attempts);
            userRepository.save(user);
            throw new InvalidOtpException("Invalid OTP. Attempt " + attempts + " of " + maxOtpAttempts);
        }

        logger.info("Password reset OTP verified for user: {}", user.getEmail());
    }

    /**
     * Resets user password after OTP verification
     */
    public void resetPassword(String email, String newPassword, String otp) {
        validateEmail(email);
        validatePassword(newPassword);
        verifyPasswordResetOtp(email, otp);

        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setLastPasswordResetOtp(null);
        user.setUpdatedAt(System.currentTimeMillis());
        userRepository.save(user);

        logger.info("Password reset successfully for user: {}", user.getEmail());
    }

    // Validation methods
    private void validateRegistrationRequest(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        validateEmail(request.getEmail());
        validatePassword(request.getPassword());

        if (request.getUsername().length() < 3 || request.getUsername().length() > 64) {
            throw new IllegalArgumentException("Username must be between 3 and 64 characters");
        }
    }

    private void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "Password must contain at least one letter, one number, and one special character (@$!%*#?&)"
            );
        }
    }
}
