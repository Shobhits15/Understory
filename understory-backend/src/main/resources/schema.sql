CREATE TABLE IF NOT EXISTS users (
  username       VARCHAR(64) PRIMARY KEY,
  password_hash  VARCHAR(100) NOT NULL,
  created_at     BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_profiles (
  username       VARCHAR(64) PRIMARY KEY,
  likes_json     JSON NOT NULL,
  cart_json      JSON NOT NULL,
  profile_json   JSON NOT NULL,
  updated_at     BIGINT NOT NULL,
  CONSTRAINT fk_profile_user FOREIGN KEY (username)
    REFERENCES users(username) ON DELETE CASCADE
);
