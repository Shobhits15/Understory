package com.understory.backend.repository;

import com.understory.backend.model.ProfileRow;
import com.understory.backend.model.UserRow;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean existsByUsername(String username) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE username = ?",
                Integer.class, username);
        return count != null && count > 0;
    }

    public void insertUser(String username, String passwordHash, long createdAt) {
        jdbc.update(
                "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
                username, passwordHash, createdAt);
    }

    public Optional<UserRow> findByUsername(String username) {
        try {
            UserRow row = jdbc.queryForObject(
                    "SELECT username, password_hash, created_at FROM users WHERE username = ?",
                    (rs, rowNum) -> new UserRow(
                            rs.getString("username"),
                            rs.getString("password_hash"),
                            rs.getLong("created_at")),
                    username);
            return Optional.ofNullable(row);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void insertEmptyProfile(String username, long updatedAt) {
        jdbc.update(
                "INSERT INTO user_profiles (username, likes_json, cart_json, profile_json, updated_at) " +
                        "VALUES (?, JSON_OBJECT(), JSON_OBJECT(), JSON_OBJECT(), ?)",
                username, updatedAt);
    }

    public void upsertProfile(String username, String likesJson, String cartJson, String profileJson, long updatedAt) {
        jdbc.update(
                "INSERT INTO user_profiles (username, likes_json, cart_json, profile_json, updated_at) " +
                        "VALUES (?, ?, ?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE likes_json = VALUES(likes_json), " +
                        "cart_json = VALUES(cart_json), profile_json = VALUES(profile_json), updated_at = VALUES(updated_at)",
                username, likesJson, cartJson, profileJson, updatedAt);
    }

    public Optional<ProfileRow> findProfile(String username) {
        try {
            ProfileRow row = jdbc.queryForObject(
                    "SELECT username, likes_json, cart_json, profile_json, updated_at FROM user_profiles WHERE username = ?",
                    (rs, rowNum) -> new ProfileRow(
                            rs.getString("username"),
                            rs.getString("likes_json"),
                            rs.getString("cart_json"),
                            rs.getString("profile_json"),
                            rs.getLong("updated_at")),
                    username);
            return Optional.ofNullable(row);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<String> listUsernames() {
        return jdbc.queryForList("SELECT username FROM users ORDER BY created_at", String.class);
    }

    public List<ProfileRow> findAllProfiles() {
        return jdbc.query(
                "SELECT username, likes_json, cart_json, profile_json, updated_at FROM user_profiles",
                (rs, rowNum) -> new ProfileRow(
                        rs.getString("username"),
                        rs.getString("likes_json"),
                        rs.getString("cart_json"),
                        rs.getString("profile_json"),
                        rs.getLong("updated_at")));
    }
}
