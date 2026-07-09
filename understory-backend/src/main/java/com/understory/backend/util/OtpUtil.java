package com.understory.backend.util;

import java.security.SecureRandom;

public class OtpUtil {

    private static final SecureRandom random = new SecureRandom();
    private static final int OTP_LENGTH = 6;

    private OtpUtil() {
    }

    /**
     * Generates a secure random 6-digit OTP
     */
    public static String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    /**
     * Checks if OTP is valid (6 digits)
     */
    public static boolean isValidOtpFormat(String otp) {
        return otp != null && otp.matches("\\d{6}");
    }

    /**
     * Checks if OTP has expired
     */
    public static boolean isOtpExpired(Long otpExpiry) {
        if (otpExpiry == null) {
            return true;
        }
        return System.currentTimeMillis() > otpExpiry;
    }
}
