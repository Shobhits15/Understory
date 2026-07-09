CREATE TABLE IF NOT EXISTS users (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  username          VARCHAR(64) UNIQUE NOT NULL,
  email             VARCHAR(100) UNIQUE NOT NULL,
  password_hash     VARCHAR(100) NOT NULL,
  email_verified    BOOLEAN DEFAULT FALSE,
  otp               VARCHAR(6),
  otp_expiry        BIGINT,
  otp_attempts      INT DEFAULT 0,
  last_otp_sent     BIGINT,
  last_password_reset_otp BIGINT,
  created_at        BIGINT NOT NULL,
  updated_at        BIGINT NOT NULL,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  username       VARCHAR(64) PRIMARY KEY,
  likes_json     TEXT NOT NULL,
  cart_json      TEXT NOT NULL,
  profile_json   TEXT NOT NULL,
  updated_at     BIGINT NOT NULL,
  CONSTRAINT fk_profile_user FOREIGN KEY (username)
    REFERENCES users(username) ON DELETE CASCADE
);
