package com.understory.backend.service;

import com.understory.backend.dto.RegisterRequest;
import com.understory.backend.dto.RegisterResponse;
import com.understory.backend.exception.*;
import com.understory.backend.model.User;
import com.understory.backend.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.regex.Pattern;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    );

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
    );

    public AuthService(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    /**
     * Registers a new user and sends OTP to their email
     */
    public RegisterResponse register(RegisterRequest request) {
        validateRegistrationRequest(request);

        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername().toLowerCase())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }
        long now = System.currentTimeMillis();

        User user = User.builder()
                .username(request.getUsername().toLowerCase().trim())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .emailVerified(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        userRepository.save(user);
         
        // Create empty profile for the user
        userService.insertEmptyProfile(request.getUsername().toLowerCase().trim(), now);

        return RegisterResponse.builder()
                .message("Registration successful.")
                .email(user.getEmail())
                .build();

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
