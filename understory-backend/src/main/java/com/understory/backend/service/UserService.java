package com.understory.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.understory.backend.dto.ProfilePayload;
import com.understory.backend.model.ProfileRow;
import com.understory.backend.model.User;
import com.understory.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final JdbcTemplate jdbc;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserService(UserRepository userRepository, JdbcTemplate jdbc) {
        this.userRepository = userRepository;
        this.jdbc = jdbc;
    }

    public static class UsernameTakenException extends RuntimeException {}
    public static class InvalidCredentialsException extends RuntimeException {}

    /** Creates a new user with a hashed password and an empty profile row. */
    public void signup(String username, String rawPassword) {
        String uname = normalize(username);
        if (userRepository.existsByUsername(uname)) {
            throw new UsernameTakenException();
        }
        long now = System.currentTimeMillis();
        User user = User.builder()
                .username(uname)
                .email(uname + "@understory.local")
                .passwordHash(passwordEncoder.encode(rawPassword))
                .createdAt(now)
                .updatedAt(now)
                .build();
        userRepository.save(user);
        insertEmptyProfile(uname, now);
    }

    /** Verifies credentials and returns the saved profile. */
    public ProfilePayload login(String username, String rawPassword) {
        String uname = normalize(username);
        User user = userRepository.findByUsername(uname)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return toPayload(findProfile(uname).orElse(null));
    }

    public ProfilePayload getProfile(String username) {
        return toPayload(findProfile(normalize(username)).orElse(null));
    }

    /** Upserts the likes/cart/taste-profile JSON blobs for a user. */
    public void saveProfile(String username, ProfilePayload payload) {
        String uname = normalize(username);
        String likesJson = writeJson(payload.getLikes());
        String cartJson = writeJson(payload.getCart());
        String profileJson = writeJson(payload.getProfile());
        upsertProfile(uname, likesJson, cartJson, profileJson, System.currentTimeMillis());
    }

    public List<String> listUsernames() {
        return userRepository.findAll().stream()
                .map(User::getUsername)
                .toList();
    }

    /** For the admin panel: every user's profile, keyed by username. */
    public Map<String, ProfilePayload> allProfilesByUsername() {
        Map<String, ProfilePayload> result = new HashMap<>();
        for (User user : userRepository.findAll()) {
            Optional<ProfileRow> profile = findProfile(user.getUsername());
            if (profile.isPresent()) {
                result.put(user.getUsername(), toPayload(profile.get()));
            }
        }
        return result;
    }

    private String normalize(String username) {
        return username == null ? "" : username.trim().toLowerCase();
    }

    private ProfilePayload toPayload(ProfileRow row) {
        ProfilePayload payload = new ProfilePayload();
        if (row == null) {
            payload.setLikes(Collections.emptyMap());
            payload.setCart(Collections.emptyMap());
            payload.setProfile(Collections.emptyMap());
            return payload;
        }
        payload.setLikes(readJson(row.likesJson()));
        payload.setCart(readJson(row.cartJson()));
        payload.setProfile(readJson(row.profileJson()));
        return payload;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> readJson(String json) {
        if (json == null || json.isBlank()) return Collections.emptyMap();
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            return Collections.emptyMap();
        }
    }

    private String writeJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map == null ? Collections.emptyMap() : map);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    public void insertEmptyProfile(String username, long updatedAt) {
        jdbc.update(
                "INSERT INTO user_profiles (username, likes_json, cart_json, profile_json, updated_at) " +
                        "VALUES (?, ?, ?, ?, ?)",
                username, "{}", "{}", "{}", updatedAt);
    }

    private void upsertProfile(String username, String likesJson, String cartJson, String profileJson, long updatedAt) {
        jdbc.update(
                "INSERT INTO user_profiles (username, likes_json, cart_json, profile_json, updated_at) " +
                        "VALUES (?, ?, ?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE likes_json = VALUES(likes_json), " +
                        "cart_json = VALUES(cart_json), profile_json = VALUES(profile_json), updated_at = VALUES(updated_at)",
                username, likesJson, cartJson, profileJson, updatedAt);
    }

    private Optional<ProfileRow> findProfile(String username) {
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
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
