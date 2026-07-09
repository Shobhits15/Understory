package com.understory.backend.dto;

public class VerifyEmailRequest {
    private String email;
    private String otp;

    public VerifyEmailRequest() {
    }

    public VerifyEmailRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String email;
        private String otp;

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public VerifyEmailRequest build() {
            VerifyEmailRequest dto = new VerifyEmailRequest();
            dto.email = this.email;
            dto.otp = this.otp;
            return dto;
        }
    }
}
