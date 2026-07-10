package com.understory.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_email", columnList = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 64)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(length = 6)
    private String otp;

    @Column
    private Long otpExpiry;

    @Column
    private Integer otpAttempts = 0;

    @Column
    private Long lastOtpSent;

    @Column
    private Long lastPasswordResetOtp;

    @Column(nullable = false)
    private Long createdAt;

    @Column(nullable = false)
    private Long updatedAt;

    // Constructors
    public User() {}

    public User(String username, String email, String passwordHash, Boolean emailVerified, String otp, Long otpExpiry, Integer otpAttempts, Long lastOtpSent, Long lastPasswordResetOtp, Long createdAt, Long updatedAt) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.emailVerified = emailVerified;
        this.otp = otp;
        this.otpExpiry = otpExpiry;
        this.otpAttempts = otpAttempts;
        this.lastOtpSent = lastOtpSent;
        this.lastPasswordResetOtp = lastPasswordResetOtp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }




    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }



    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = System.currentTimeMillis();
    }

    // Builder pattern
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String username;
        private String email;
        private String passwordHash;
        private Boolean emailVerified = false;
        private String otp;
        private Long otpExpiry;
        private Integer otpAttempts = 0;
        private Long lastOtpSent;
        private Long lastPasswordResetOtp;
        private Long createdAt;
        private Long updatedAt;

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder passwordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }

        public UserBuilder emailVerified(Boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }

        public UserBuilder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public UserBuilder otpExpiry(Long otpExpiry) {
            this.otpExpiry = otpExpiry;
            return this;
        }

        public UserBuilder otpAttempts(Integer otpAttempts) {
            this.otpAttempts = otpAttempts;
            return this;
        }

        public UserBuilder lastOtpSent(Long lastOtpSent) {
            this.lastOtpSent = lastOtpSent;
            return this;
        }

        public UserBuilder lastPasswordResetOtp(Long lastPasswordResetOtp) {
            this.lastPasswordResetOtp = lastPasswordResetOtp;
            return this;
        }

        public UserBuilder createdAt(Long createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserBuilder updatedAt(Long updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public User build() {
            return new User(username, email, passwordHash, emailVerified, otp, otpExpiry, otpAttempts, lastOtpSent, lastPasswordResetOtp, createdAt, updatedAt);
        }
    }
}

