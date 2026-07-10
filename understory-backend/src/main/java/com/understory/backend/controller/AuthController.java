package com.understory.backend.controller;

import com.understory.backend.dto.*;
import com.understory.backend.util.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.understory.backend.service.AuthService;
import com.understory.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService,
                          UserService userService) {
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
                    .body(ApiResponse.ok("Registration successful.", response));
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
         * POST /api/auth/login
         * Logs in user (email must be verified)
         */
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<ProfilePayload>> login (@RequestBody AuthRequest request){
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


        private boolean isBlank (String s){
            return s == null || s.trim().isEmpty();
        }
    }

