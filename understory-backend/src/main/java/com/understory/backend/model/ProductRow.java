package com.understory.backend.model;

public record ProductRow(
    int productId,
    String name,
    String category,
    String brand,
    String description,
    double price,
    String imageUrl
) {}
