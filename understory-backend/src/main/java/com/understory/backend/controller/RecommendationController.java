package com.understory.backend.controller;

import com.understory.backend.dto.RecommendationPayload;
import com.understory.backend.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * Get hybrid AI recommendations for a user based on a recently viewed product.
     * Combines multiple algorithms: content-based + collaborative filtering + deep learning
     *
     * GET /api/recommendations/user/{userId}/product/{productId}?top=8
     */
    @GetMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<List<RecommendationPayload>> getHybridRecommendations(
            @PathVariable int userId,
            @PathVariable int productId,
            @RequestParam(defaultValue = "8") int top) {

        List<RecommendationPayload> recommendations = 
            recommendationService.getHybridRecommendations(userId, productId, top);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get content-based recommendations (similar products)
     *
     * GET /api/recommendations/content-based/{productId}?top=5
     */
    @GetMapping("/content-based/{productId}")
    public ResponseEntity<List<RecommendationPayload>> getContentBasedRecommendations(
            @PathVariable int productId,
            @RequestParam(defaultValue = "5") int top) {

        List<RecommendationPayload> recommendations =
            recommendationService.getContentBasedRecommendations(productId, top);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get all products with images
     *
     * GET /api/products
     */
    @GetMapping("/products")
    public ResponseEntity<List<RecommendationPayload>> getAllProducts() {
        List<RecommendationPayload> products = recommendationService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * Get a single product with image by ID
     *
     * GET /api/products/{productId}
     */
    @GetMapping("/products/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable int productId) {
        RecommendationPayload product = recommendationService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
}
