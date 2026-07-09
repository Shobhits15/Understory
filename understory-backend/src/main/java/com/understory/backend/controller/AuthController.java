package com.understory.backend.controller;

import com.understory.backend.dto.*;
import com.understory.backend.service.AuthService;
import com.understory.backend.service.UserService;
import com.understory.backend.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;
import com.understory.backend.service.EmailService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserService userService;


    public AuthController(
            AuthService authService,
            UserService userService,
            EmailService emailService) {

        this.authService = authService;
        this.userService = userService;

    }

    /**
     * POST /api/auth/register
     * Registers a new user and sends OTP to their email
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@RequestBody RegisterRequest request) {
        try {
            RegisterResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Registration successful. OTP sent to your email.", response));
        } catch (MessagingException e) {
            logger.error("Email sending failed during registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("EMAIL_ERROR", "Failed to send OTP. Please try again later."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            logger.error("Registration error", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("REGISTRATION_ERROR", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/verify-email
     * Verifies user's email using OTP
     */
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestBody VerifyEmailRequest request) {
        try {
            authService.verifyEmail(request.getEmail(), request.getOtp());
            return ResponseEntity.ok(ApiResponse.ok("Email verified successfully. You can now log in."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            logger.error("Email verification error", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VERIFICATION_ERROR", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/resend-otp
     * Resends OTP to user's email
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Void>> resendOtp(@RequestBody ResendOtpRequest request) {
        try {
            authService.resendOtp(request.getEmail());
            return ResponseEntity.ok(ApiResponse.ok("OTP resent to your email. Please check your inbox."));
        } catch (MessagingException e) {
            logger.error("Email sending failed during resend OTP", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("EMAIL_ERROR", "Failed to send OTP. Please try again later."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            logger.error("Resend OTP error", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("RESEND_ERROR", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Logs in user (email must be verified)
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<ProfilePayload>> login(@RequestBody AuthRequest request) {
        if (isBlank(request.getUsername()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", "Username and password are required."));
        }
        try {
            ProfilePayload profile = userService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(ApiResponse.ok("Login successful", profile));
        } catch (Exception e) {
            logger.debug("Login error for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("AUTH_ERROR", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/forgot-password
     * Initiates password reset by sending OTP
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authService.initiatePasswordReset(request.getEmail());
            return ResponseEntity.ok(ApiResponse.ok("Password reset OTP sent to your email. Please check your inbox."));
        } catch (MessagingException e) {
            logger.error("Email sending failed during forgot password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("EMAIL_ERROR", "Failed to send reset code. Please try again later."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            logger.error("Forgot password error", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("FORGOT_PASSWORD_ERROR", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/verify-reset-otp
     * Verifies OTP for password reset
     */
    @PostMapping("/verify-reset-otp")
    public ResponseEntity<ApiResponse<Void>> verifyResetOtp(@RequestBody VerifyResetOtpRequest request) {
        try {
            authService.verifyPasswordResetOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok(ApiResponse.ok("OTP verified. You can now reset your password."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            logger.error("Reset OTP verification error", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VERIFICATION_ERROR", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/reset-password
     * Resets user password after OTP verification
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getEmail(), request.getNewPassword(), request.getOtp());
            return ResponseEntity.ok(ApiResponse.ok("Password reset successfully. You can now log in with your new password."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            logger.error("Password reset error", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("RESET_ERROR", e.getMessage()));
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
