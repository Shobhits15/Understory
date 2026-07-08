package com.understory.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CheckoutResponse {
    private String orderId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String pincode;
    private String paymentMode;
    private Double totalAmount;
    private String orderStatus;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;

    public CheckoutResponse() {
    }

    public CheckoutResponse(String orderId, String username, String fullName, String email,
                           String phone, String address, String city, String pincode,
                           String paymentMode, Double totalAmount, String orderStatus,
                           List<OrderItemResponse> items, LocalDateTime createdAt) {
        this.orderId = orderId;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.pincode = pincode;
        this.paymentMode = paymentMode;
        this.totalAmount = totalAmount;
        this.orderStatus = orderStatus;
        this.items = items;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class OrderItemResponse {
        private String productName;
        private Double price;
        private Integer quantity;

        public OrderItemResponse() {
        }

        public OrderItemResponse(String productName, Double price, Integer quantity) {
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
