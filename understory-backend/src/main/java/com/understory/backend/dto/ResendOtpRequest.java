package com.understory.backend.dto;

public class ResendOtpRequest {
    private String email;

    public ResendOtpRequest() {
    }

    public ResendOtpRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String email;

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public ResendOtpRequest build() {
            ResendOtpRequest dto = new ResendOtpRequest();
            dto.email = this.email;
            return dto;
        }
    }
}
