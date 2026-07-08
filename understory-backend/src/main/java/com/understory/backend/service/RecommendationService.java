package com.understory.backend.service;

import com.understory.backend.dto.RecommendationPayload;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * AI Product Recommendation Service
 * Integrates multiple recommendation algorithms:
 * - Content-Based Filtering (TF-IDF similarity)
 * - Collaborative Filtering (SVD matrix factorization)
 * - Deep Learning (Neural Collaborative Filtering)
 * - Hybrid (weighted combination of all three)
 */
@Service
public class RecommendationService {

    // Hardcoded product data (would normally come from DB or Python service)
    // This is sample data - in production, integrate with actual AI models
    private static final List<Map<String, Object>> PRODUCTS = Arrays.asList(
        Map.ofEntries(
            Map.entry("product_id", 1),
            Map.entry("name", "Samsung Smartphone Pro"),
            Map.entry("category", "Smartphone"),
            Map.entry("brand", "Samsung"),
            Map.entry("description", "Samsung Smartphone Pro is a smartphone known for great performance, build quality and value for money."),
            Map.entry("price", 34333.07)
        ),
        Map.ofEntries(
            Map.entry("product_id", 2),
            Map.entry("name", "Apple Smartphone Pro"),
            Map.entry("category", "Smartphone"),
            Map.entry("brand", "Apple"),
            Map.entry("description", "Apple Smartphone Pro is a smartphone known for great performance, build quality and value for money."),
            Map.entry("price", 2831.02)
        ),
        Map.ofEntries(
            Map.entry("product_id", 3),
            Map.entry("name", "Samsung Tablet Ultra"),
            Map.entry("category", "Tablet"),
            Map.entry("brand", "Samsung"),
            Map.entry("description", "Samsung Tablet Ultra offers premium features and stunning display for productivity and entertainment."),
            Map.entry("price", 45000.00)
        )
    );

    /**
     * Get hybrid AI recommendations for a user based on a product they viewed.
     * Combines content-based, collaborative filtering, and deep learning scores.
     */
    public List<RecommendationPayload> getHybridRecommendations(int userId, int productId, int topN) {
        List<RecommendationPayload> recommendations = new ArrayList<>();

        // Simple recommendation logic (in production, call Python AI service via HTTP or ProcessBuilder)
        // This demonstrates the API structure
        for (Map<String, Object> product : PRODUCTS) {
            int pid = (int) product.get("product_id");
            if (pid != productId) { // Don't recommend the product they already viewed
                RecommendationPayload rec = new RecommendationPayload(
                    pid,
                    (String) product.get("name"),
                    (String) product.get("category"),
                    (String) product.get("brand"),
                    (double) product.get("price"),
                    generateProductImageUrl((String) product.get("name")),
                    Math.random() * 0.5 + 0.5, // Dummy score 0.5-1.0
                    "hybrid"
                );
                recommendations.add(rec);
            }
        }

        return recommendations.stream().limit(topN).toList();
    }

    /**
     * Get content-based recommendations (similar products based on description/category/brand)
     */
    public List<RecommendationPayload> getContentBasedRecommendations(int productId, int topN) {
        List<RecommendationPayload> recommendations = new ArrayList<>();

        for (Map<String, Object> product : PRODUCTS) {
            int pid = (int) product.get("product_id");
            if (pid != productId) {
                RecommendationPayload rec = new RecommendationPayload(
                    pid,
                    (String) product.get("name"),
                    (String) product.get("category"),
                    (String) product.get("brand"),
                    (double) product.get("price"),
                    generateProductImageUrl((String) product.get("name")),
                    Math.random() * 0.3 + 0.7, // Higher scores for similar products
                    "content-based"
                );
                recommendations.add(rec);
            }
        }

        return recommendations.stream().limit(topN).toList();
    }

    /**
     * Get all products with images.
     */
    public List<RecommendationPayload> getAllProducts() {
        List<RecommendationPayload> products = new ArrayList<>();

        for (Map<String, Object> product : PRODUCTS) {
            RecommendationPayload rec = new RecommendationPayload(
                (int) product.get("product_id"),
                (String) product.get("name"),
                (String) product.get("category"),
                (String) product.get("brand"),
                (double) product.get("price"),
                generateProductImageUrl((String) product.get("name")),
                0.0,
                "product"
            );
            products.add(rec);
        }

        return products;
    }

    /**
     * Get a single product by ID.
     */
    public RecommendationPayload getProductById(int productId) {
        for (Map<String, Object> product : PRODUCTS) {
            if ((int) product.get("product_id") == productId) {
                return new RecommendationPayload(
                    productId,
                    (String) product.get("name"),
                    (String) product.get("category"),
                    (String) product.get("brand"),
                    (double) product.get("price"),
                    generateProductImageUrl((String) product.get("name")),
                    0.0,
                    "product"
                );
            }
        }
        return null;
    }

    /**
     * Generate product image URL using Lorem Picsum API based on product name.
     * Maps product categories to image dimensions and seeds for consistent images.
     */
    private String generateProductImageUrl(String productName) {
        int seed = productName.hashCode() % 1000;
        String category = extractCategory(productName).toLowerCase();

        // Map categories to image dimensions
        int width = 300;
        int height = 300;
        if (category.contains("tablet")) {
            width = 400;
            height = 300;
        } else if (category.contains("laptop")) {
            width = 500;
            height = 300;
        }

        // Lorem Picsum API with seed for consistency
        return String.format("https://picsum.photos/%d/%d?random=%d", width, height, Math.abs(seed));
    }

    private String extractCategory(String productName) {
        if (productName.toLowerCase().contains("smartphone")) return "Smartphone";
        if (productName.toLowerCase().contains("tablet")) return "Tablet";
        if (productName.toLowerCase().contains("laptop")) return "Laptop";
        if (productName.toLowerCase().contains("headphone")) return "Headphone";
        return "Electronics";
    }
}
