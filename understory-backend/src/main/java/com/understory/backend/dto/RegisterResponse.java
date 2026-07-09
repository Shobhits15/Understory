package com.understory.backend.dto;

public class RegisterResponse {
    private String message;
    private String email;
    private int otpExpiryMinutes;

    public RegisterResponse() {
    }

    public RegisterResponse(String message, String email, int otpExpiryMinutes) {
        this.message = message;
        this.email = email;
        this.otpExpiryMinutes = otpExpiryMinutes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getOtpExpiryMinutes() {
        return otpExpiryMinutes;
    }

    public void setOtpExpiryMinutes(int otpExpiryMinutes) {
        this.otpExpiryMinutes = otpExpiryMinutes;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String message;
        private String email;
        private int otpExpiryMinutes;

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder otpExpiryMinutes(int otpExpiryMinutes) {
            this.otpExpiryMinutes = otpExpiryMinutes;
            return this;
        }

        public RegisterResponse build() {
            RegisterResponse dto = new RegisterResponse();
            dto.message = this.message;
            dto.email = this.email;
            dto.otpExpiryMinutes = this.otpExpiryMinutes;
            return dto;
        }
    }
}
