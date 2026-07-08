package com.understory.backend.dto;

public class RecommendationPayload {
    private int productId;
    private String name;
    private String category;
    private String brand;
    private double price;
    private String imageUrl;
    private double score;
    private String scoreType; // "hybrid", "content-based", "collaborative", "deep-learning"

    public RecommendationPayload() {}

    public RecommendationPayload(int productId, String name, String category, String brand, 
                                 double price, String imageUrl, double score, String scoreType) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.imageUrl = imageUrl;
        this.score = score;
        this.scoreType = scoreType;
    }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getScoreType() { return scoreType; }
    public void setScoreType(String scoreType) { this.scoreType = scoreType; }
}
