CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  likes_json LONGTEXT DEFAULT '{}',
  cart_json LONGTEXT DEFAULT '{}',
  profile_json LONGTEXT DEFAULT '{}',
  updated_at BIGINT NOT NULL,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
  INDEX idx_username (username)
);
