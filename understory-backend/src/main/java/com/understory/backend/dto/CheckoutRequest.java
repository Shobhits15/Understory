package com.understory.backend.dto;

import java.util.List;

public class CheckoutRequest {
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String pincode;
    private String paymentMode;
    private List<OrderItemRequest> items;
    private Double totalAmount;

    public CheckoutRequest() {
    }

    public CheckoutRequest(String username, String fullName, String email, String phone,
                          String address, String city, String pincode, String paymentMode,
                          List<OrderItemRequest> items, Double totalAmount) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.pincode = pincode;
        this.paymentMode = paymentMode;
        this.items = items;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
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

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public static class OrderItemRequest {
       private String id;
        private String name;
        private Double price;
        private Integer qty;

        public OrderItemRequest() {
        }

       public OrderItemRequest(String id, String name, Double price, Integer qty) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.qty = qty;
        }

       public String getId() {
            return id;
        }

       public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public Integer getQty() {
            return qty;
        }

        public void setQty(Integer qty) {
            this.qty = qty;
        }
    }
}
