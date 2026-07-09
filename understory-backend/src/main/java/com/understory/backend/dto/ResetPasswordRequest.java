package com.understory.backend.dto;

public class ResetPasswordRequest {
    private String email;
    private String newPassword;
    private String otp;

    public ResetPasswordRequest() {
    }

    public ResetPasswordRequest(String email, String newPassword, String otp) {
        this.email = email;
        this.newPassword = newPassword;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
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
        private String newPassword;
        private String otp;

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder newPassword(String newPassword) {
            this.newPassword = newPassword;
            return this;
        }

        public Builder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public ResetPasswordRequest build() {
            ResetPasswordRequest dto = new ResetPasswordRequest();
            dto.email = this.email;
            dto.newPassword = this.newPassword;
            dto.otp = this.otp;
            return dto;
        }
    }
}
