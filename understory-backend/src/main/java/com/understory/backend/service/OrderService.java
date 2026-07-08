package com.understory.backend.service;

import com.understory.backend.dto.CheckoutRequest;
import com.understory.backend.dto.CheckoutResponse;
import com.understory.backend.model.Order;
import com.understory.backend.model.OrderItem;
import com.understory.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public CheckoutResponse createOrder(CheckoutRequest request) {
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }
        if (request.getAddress() == null || request.getAddress().isBlank()) {
            throw new IllegalArgumentException("Address is required");
        }
        if (request.getCity() == null || request.getCity().isBlank()) {
            throw new IllegalArgumentException("City is required");
        }
        if (request.getPincode() == null || request.getPincode().isBlank()) {
            throw new IllegalArgumentException("Pincode is required");
        }
        if (request.getPaymentMode() == null || request.getPaymentMode().isBlank()) {
            throw new IllegalArgumentException("Payment mode is required");
        }
        if (request.getTotalAmount() == null || request.getTotalAmount() <= 0) {
            throw new IllegalArgumentException("Total amount must be greater than 0");
        }

        // Generate unique order ID
        String orderId = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create order
        Order order = new Order(
            orderId,
            request.getUsername() != null ? request.getUsername() : "guest",
            request.getFullName(),
            request.getEmail(),
            request.getPhone(),
            request.getAddress(),
            request.getCity(),
            request.getPincode(),
            request.getPaymentMode(),
            request.getTotalAmount()
        );

        // Add items to order
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CheckoutRequest.OrderItemRequest itemRequest : request.getItems()) {
                OrderItem item = new OrderItem(
                    order,
                    itemRequest.getId(),
                    itemRequest.getName(),
                    itemRequest.getPrice(),
                    itemRequest.getQty()
                );
                order.getItems().add(item);
            }
        }

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Convert to response
        return convertToResponse(savedOrder);
    }

    public CheckoutResponse getOrder(String orderId) {
        Optional<Order> order = orderRepository.findByOrderId(orderId);
        if (order.isEmpty()) {
            throw new IllegalArgumentException("Order not found: " + orderId);
        }
        return convertToResponse(order.get());
    }

    public List<CheckoutResponse> getUserOrders(String username) {
        List<Order> orders = orderRepository.findByUsername(username);
        return orders.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public List<CheckoutResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public CheckoutResponse updateOrderStatus(String orderId, String status) {
        Optional<Order> order = orderRepository.findByOrderId(orderId);
        if (order.isEmpty()) {
            throw new IllegalArgumentException("Order not found: " + orderId);
        }
        
        Order existingOrder = order.get();
        existingOrder.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(existingOrder);
        
        return convertToResponse(updatedOrder);
    }

    private CheckoutResponse convertToResponse(Order order) {
        List<CheckoutResponse.OrderItemResponse> itemResponses = order.getItems().stream()
            .map(item -> new CheckoutResponse.OrderItemResponse(
                item.getProductName(),
                item.getPrice(),
                item.getQuantity()
            ))
            .collect(Collectors.toList());

        return new CheckoutResponse(
            order.getOrderId(),
            order.getUsername(),
            order.getFullName(),
            order.getEmail(),
            order.getPhone(),
            order.getAddress(),
            order.getCity(),
            order.getPincode(),
            order.getPaymentMode(),
            order.getTotalAmount(),
            order.getOrderStatus(),
            itemResponses,
            order.getCreatedAt()
        );
    }
}
