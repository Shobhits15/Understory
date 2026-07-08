package com.understory.backend.controller;

import com.understory.backend.dto.AuthRequest;
import com.understory.backend.dto.ProfilePayload;
import com.understory.backend.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @Value("${app.admin.passcode}")
    private String adminPasscode;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest req) {
        if (isBlank(req.getUsername()) || isBlank(req.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required."));
        }
        try {
            userService.signup(req.getUsername(), req.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("username", req.getUsername().trim().toLowerCase()));
        } catch (UserService.UsernameTakenException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "That username is taken."));
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        if (isBlank(req.getUsername()) || isBlank(req.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required."));
        }
        try {
            ProfilePayload profile = userService.login(req.getUsername(), req.getPassword());
            return ResponseEntity.ok(profile);
        } catch (UserService.InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Wrong username or password."));
        }
    }

    @GetMapping("/users/{username}/profile")
    public ResponseEntity<ProfilePayload> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getProfile(username));
    }

    @PutMapping("/users/{username}/profile")
    public ResponseEntity<Void> saveProfile(@PathVariable String username, @RequestBody ProfilePayload payload) {
        userService.saveProfile(username, payload);
        return ResponseEntity.noContent().build();
    }

    /** Mirrors the admin panel in the frontend: pass the passcode as a header. */
    @GetMapping("/admin/users")
    public ResponseEntity<?> adminListUsers(@RequestHeader("X-Admin-Passcode") String passcode) {
        if (!adminPasscode.equals(passcode)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Wrong passcode."));
        }
        List<String> usernames = userService.listUsernames();
        Map<String, ProfilePayload> profiles = userService.allProfilesByUsername();
        List<Map<String, Object>> results = usernames.stream()
                .map(u -> {
                    ProfilePayload p = profiles.getOrDefault(u, null);
                    return Map.<String, Object>of(
                            "username", u,
                            "likes", p != null ? p.getLikes() : Map.of(),
                            "cart", p != null ? p.getCart() : Map.of(),
                            "profile", p != null ? p.getProfile() : Map.of());
                })
                .toList();
        return ResponseEntity.ok(results);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
