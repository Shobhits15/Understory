# Understory Backend API Documentation

## Overview

REST API for the Understory e-commerce platform. Handles user authentication, profiles, product recommendations, and order management.

## Base URL
```
http://localhost:8088/api
```

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {...},        // Optional, only when applicable
  "error": "ERROR_CODE" // Optional, only on errors
}
```

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

Register a new user.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response Success (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "username": "john_doe",
    "likes": {},
    "cart": {},
    "profile": {}
  }
}
```

**Response Errors:**
- `400 Bad Request`: Missing or invalid fields
- `409 Conflict`: Username or email already exists

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

Log in user with username and password.

**Request:**
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response Success (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "likes": {...},
    "cart": {...},
    "profile": {...}
  }
}
```

**Response Errors:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing username or password

---

## User Profiles

### Get User Profile

**Endpoint:** `GET /api/users/{username}/profile`

Retrieve user's profile including likes, cart, and preferences.

**Response (200 OK):**
```json
{
  "likes": { "p1": true, "p3": true },
  "cart": { "p1": 2 },
  "profile": { "ceramic": 0.8, "warm": 0.6 }
}
```

---

### Update User Profile

**Endpoint:** `PUT /api/users/{username}/profile`

Update user's profile, likes, and cart.

**Request:**
```json
{
  "likes": { "p1": true, "p5": true },
  "cart": { "p2": 2, "p4": 1 },
  "profile": { "ceramic": 1.0, "warm": 0.8 }
}
```

**Response (204 No Content)**

---

## Products & Recommendations

### Get All Products

**Endpoint:** `GET /api/recommendations/products`

Retrieve all products in the catalog.

**Response (200 OK):**
```json
[
  {
    "id": "p1",
    "name": "Terra vase",
    "price": 58,
    "category": "Ceramics",
    "image": "🏺",
    "description": "Handcrafted ceramic vase...",
    "tags": { "ceramic": 1.0, "warm": 0.8 }
  },
  ...
]
```

---

### Get Single Product

**Endpoint:** `GET /api/recommendations/products/{productId}`

Retrieve a specific product.

**Response (200 OK):**
```json
{
  "id": "p1",
  "name": "Terra vase",
  "price": 58,
  "category": "Ceramics",
  "image": "🏺",
  "description": "Handcrafted ceramic vase...",
  "tags": { "ceramic": 1.0, "warm": 0.8 }
}
```

---

### Get Personalized Recommendations

**Endpoint:** `GET /api/recommendations/user/{userId}/product/{productId}?top=8`

Get AI-powered recommendations based on user taste profile.

**Response (200 OK):**
```json
[
  { "id": "p2", "name": "Ash bowl set", ... },
  { "id": "p5", "name": "Woven throw", ... },
  ...
]
```

---

### Get Content-Based Recommendations

**Endpoint:** `GET /api/recommendations/content-based/{productId}?top=5`

Get similar products based on content attributes.

**Response (200 OK):**
```json
[
  { "id": "p2", "name": "Similar product", ... },
  ...
]
```

---

## Orders

### Create Order

**Endpoint:** `POST /api/orders/create`

Place a new order.

**Request:**
```json
{
  "username": "john_doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main Street",
  "city": "New York",
  "pincode": "10001",
  "paymentMode": "card",
  "items": [
    { "id": "p1", "name": "Terra vase", "price": 58, "qty": 2 },
    { "id": "p5", "name": "Woven throw", "price": 89, "qty": 1 }
  ],
  "totalAmount": 205
}
```

**Response (201 Created):**
```json
{
  "orderId": "ORD-1704067200000-ABC123XYZ",
  "message": "Order placed successfully"
}
```

---

### Get User Orders

**Endpoint:** `GET /api/orders/user/{username}`

Retrieve all orders for a user.

**Response (200 OK):**
```json
[
  {
    "orderId": "ORD-1704067200000-ABC123XYZ",
    "username": "john_doe",
    "fullName": "John Doe",
    "totalAmount": 205,
    "orderStatus": "pending",
    "createdAt": "2024-01-01T10:00:00",
    "items": [
      { "productId": "p1", "productName": "Terra vase", "price": 58, "quantity": 2 }
    ]
  }
]
```

---

### Get Order by ID

**Endpoint:** `GET /api/orders/{orderId}`

Retrieve a specific order.

**Response (200 OK):**
```json
{
  "orderId": "ORD-1704067200000-ABC123XYZ",
  "username": "john_doe",
  "orderStatus": "pending",
  "totalAmount": 205,
  "items": [...]
}
```

---

### Get All Orders (Admin)

**Endpoint:** `GET /api/orders/all`

Retrieve all orders in the system (admin only).

**Response (200 OK):**
```json
[
  {
    "orderId": "ORD-...",
    "username": "user1",
    "orderStatus": "pending",
    ...
  },
  ...
]
```

---

### Update Order Status

**Endpoint:** `PUT /api/orders/{orderId}/status`

Update the status of an order.

**Request:**
```json
{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

**Response (200 OK):**
```json
{
  "orderId": "ORD-...",
  "orderStatus": "confirmed",
  "message": "Order status updated"
}
```

---

## Admin

### List All Users

**Endpoint:** `GET /api/admin/users`

**Header:**
```
X-Admin-Passcode: Admin
```

Retrieve all users and their profiles.

**Response (200 OK):**
```json
[
  {
    "username": "john_doe",
    "likes": { "p1": true },
    "cart": { "p2": 1 },
    "profile": { "ceramic": 0.8 }
  },
  ...
]
```

**Response Errors:**
- `403 Forbidden`: Wrong admin passcode

---

## Error Codes

| Error Code | HTTP Status | Description |
|---|---|---|
| VALIDATION_ERROR | 400 | Input validation failed |
| REGISTRATION_ERROR | 400 | Registration failed |
| USER_EXISTS | 409 | User/Email already registered |
| USER_NOT_FOUND | 404 | User doesn't exist |
| AUTH_ERROR | 401 | Authentication failed |
| INTERNAL_ERROR | 500 | Server error |

---

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:8088/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:8088/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Get all products
curl http://localhost:8088/api/recommendations/products

# Get user profile
curl http://localhost:8088/api/users/testuser/profile

# Create order
curl -X POST http://localhost:8088/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "fullName":"Test User",
    "email":"test@example.com",
    "phone":"9876543210",
    "address":"123 Test St",
    "city":"Test City",
    "pincode":"123456",
    "paymentMode":"cod",
    "items":[{"id":"p1","name":"Product 1","price":50,"qty":1}],
    "totalAmount":50
  }'

# List all users (admin)
curl http://localhost:8088/api/admin/users \
  -H "X-Admin-Passcode: Admin"
```

---

## Support

For issues or questions, please contact the development team.
