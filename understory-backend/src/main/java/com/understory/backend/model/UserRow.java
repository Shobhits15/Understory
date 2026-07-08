package com.understory.backend.model;

public record UserRow(String username, String passwordHash, long createdAt) {
}
