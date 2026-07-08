package com.understory.backend.dto;

import java.util.Map;

public class ProfilePayload {
    private Map<String, Object> likes;
    private Map<String, Object> cart;
    private Map<String, Object> profile;

    public Map<String, Object> getLikes() { return likes; }
    public void setLikes(Map<String, Object> likes) { this.likes = likes; }

    public Map<String, Object> getCart() { return cart; }
    public void setCart(Map<String, Object> cart) { this.cart = cart; }

    public Map<String, Object> getProfile() { return profile; }
    public void setProfile(Map<String, Object> profile) { this.profile = profile; }
}
