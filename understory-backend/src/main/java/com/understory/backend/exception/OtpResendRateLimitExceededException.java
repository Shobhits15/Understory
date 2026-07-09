package com.understory.backend.exception;

public class OtpResendRateLimitExceededException extends RuntimeException {
    public OtpResendRateLimitExceededException(String message) {
        super(message);
    }
}
