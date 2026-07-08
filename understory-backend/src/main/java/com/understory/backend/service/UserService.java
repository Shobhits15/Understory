package com.understory.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.understory.backend.dto.ProfilePayload;
import com.understory.backend.model.ProfileRow;
import com.understory.backend.model.UserRow;
import com.understory.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public static class UsernameTakenException extends RuntimeException {}
    public static class InvalidCredentialsException extends RuntimeException {}

    /** Creates a new user with a hashed password and an empty profile row. */
    public void signup(String username, String rawPassword) {
        String uname = normalize(username);
        if (repository.existsByUsername(uname)) {
            throw new UsernameTakenException();
        }
        long now = System.currentTimeMillis();
        repository.insertUser(uname, passwordEncoder.encode(rawPassword), now);
        repository.insertEmptyProfile(uname, now);
    }

    /** Verifies credentials and returns the saved profile (likes/cart/taste profile). */
    public ProfilePayload login(String username, String rawPassword) {
        String uname = normalize(username);
        UserRow user = repository.findByUsername(uname).orElseThrow(InvalidCredentialsException::new);
        if (!passwordEncoder.matches(rawPassword, user.passwordHash())) {
            throw new InvalidCredentialsException();
        }
        return toPayload(repository.findProfile(uname).orElse(null));
    }

    public ProfilePayload getProfile(String username) {
        return toPayload(repository.findProfile(normalize(username)).orElse(null));
    }

    /** Upserts the likes/cart/taste-profile JSON blobs for a user. */
    public void saveProfile(String username, ProfilePayload payload) {
        String uname = normalize(username);
        String likesJson = writeJson(payload.getLikes());
        String cartJson = writeJson(payload.getCart());
        String profileJson = writeJson(payload.getProfile());
        repository.upsertProfile(uname, likesJson, cartJson, profileJson, System.currentTimeMillis());
    }

    public List<String> listUsernames() {
        return repository.listUsernames();
    }

    /** For the admin panel: every user's profile, keyed by username. */
    public Map<String, ProfilePayload> allProfilesByUsername() {
        Map<String, ProfilePayload> result = new HashMap<>();
        for (ProfileRow row : repository.findAllProfiles()) {
            result.put(row.username(), toPayload(row));
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
}
