# Checkout & Order Management System

## Overview
Complete end-to-end checkout flow with user details collection, multiple payment modes, and order tracking.

---

## 🎯 Features

### User Details Collection
- **Full Name** - Customer's complete name
- **Email Address** - Contact email with validation
- **Phone Number** - 10-digit phone number validation
- **Delivery Address** - Full street address textarea
- **City** - Delivery city
- **Pincode** - 6-digit postal code with validation

### Payment Modes
- 💵 **Cash on Delivery (COD)**
- 💳 **Debit/Credit Cards**
- 📱 **UPI Apps** (Google Pay, PhonePe, Paytm, etc.)
- 🏦 **Net Banking** (All major banks)

### Order Features
- Real-time order validation
- Auto-generated order ID (ORD-{timestamp}-{uuid})
- Order summary display
- Order status tracking (pending/confirmed/shipped/delivered)
- Order history per user

---

## 📁 File Structure

### Frontend Components
```
understory-frontend/src/
├── components/
│   ├── CheckoutForm.jsx (✨ NEW - 400+ lines)
│   ├── CartDrawer.jsx (Modified - checkout button)
│   └── App.jsx (Modified - checkout state)
├── api/
│   ├── checkout.js (✨ NEW - API client)
│   └── client.js (Existing)
```

### Backend
```
understory-backend/src/main/java/com/understory/backend/
├── model/
│   ├── Order.java (✨ NEW - JPA Entity)
│   └── OrderItem.java (✨ NEW - JPA Entity)
├── repository/
│   └── OrderRepository.java (✨ NEW - JPA Repository)
├── dto/
│   ├── CheckoutRequest.java (✨ NEW)
│   ├── CheckoutResponse.java (✨ NEW)
│   └── CheckoutRequest.OrderItemRequest.java
├── service/
│   └── OrderService.java (✨ NEW - 150+ lines)
├── controller/
│   └── OrderController.java (✨ NEW - 5 REST endpoints)
├── config/
│   └── CorsConfig.java (Existing)
└── pom.xml (Modified - Added spring-boot-starter-data-jpa)
```

---

## 🔌 REST API Endpoints

### Create Order
```http
POST /api/orders/create
Content-Type: application/json

{
  "username": "john_doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main Street, Apt 4B",
  "city": "New York",
  "pincode": "110001",
  "paymentMode": "cod",
  "items": [
    {
      "id": 1,
      "name": "Premium Coffee",
      "price": 29.99,
      "qty": 2
    }
  ],
  "totalAmount": 59.98
}

Response: 201 Created
{
  "orderId": "ORD-1783518085442-261DBDDE",
  "username": "john_doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main Street, Apt 4B",
  "city": "New York",
  "pincode": "110001",
  "paymentMode": "cod",
  "totalAmount": 59.98,
  "orderStatus": "pending",
  "items": [
    {
      "productName": "Premium Coffee",
      "price": 29.99,
      "quantity": 2
    }
  ],
  "createdAt": "2026-07-08T19:11:25.442"
}
```

### Get Order Details
```http
GET /api/orders/{orderId}

Response: 200 OK
{ ... full order object ... }
```

### Get User's Orders
```http
GET /api/orders/user/{username}

Response: 200 OK
[ ... array of order objects ... ]
```

### Update Order Status
```http
PUT /api/orders/{orderId}/status
Content-Type: application/json

{
  "status": "confirmed"
}

Response: 200 OK
{ ... updated order object ... }
```

---

## ✅ Form Validation

All fields are validated both client-side and server-side:

| Field | Validation | Error Message |
|-------|-----------|---------------|
| Full Name | Required, non-empty | "Name is required" |
| Email | Required, valid email format | "Invalid email" |
| Phone | Required, 10 digits | "Phone must be 10 digits" |
| Address | Required, non-empty | "Address is required" |
| City | Required, non-empty | "City is required" |
| Pincode | Required, exactly 6 digits | "Pincode must be 6 digits" |
| Payment Mode | Required, one of: cod/card/upi/netbanking | "Select a payment mode" |

---

## 🎨 UI/UX Features

### CheckoutForm Component
- **Modal Dialog** - Overlay with smooth animations
- **Order Summary** - Product list with quantities and prices
- **Form Sections**:
  - Personal Details (Name, Email, Phone)
  - Delivery Address (Street, City, Pincode)
  - Payment Mode (4 radio button options)
- **Error Handling**:
  - Field-level validation with red border and error text
  - Submit-level error messages with alert icon
  - Form state management
- **Loading State** - Button shows "Processing..." while submitting
- **Success State** - Checkmark icon with success message, auto-closes after 2 seconds
- **Responsive Design** - Works on mobile (max-width: 600px)

### Checkout Flow
1. User adds items to cart
2. Clicks "Checkout" button in CartDrawer
3. CheckoutForm modal opens with order summary
4. User enters all required details
5. Selects payment mode (radio buttons with emoji icons)
6. Clicks "Place Order - $X.XX"
7. Form validates all fields
8. Submits to `/api/orders/create`
9. Success message appears with order ID
10. Modal closes automatically
11. Cart is cleared

---

## 💾 Database Schema

### orders table
```sql
CREATE TABLE orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(255) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  order_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### order_items table
```sql
CREATE TABLE order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

---

## 🧪 Testing

### Manual API Test
```bash
# Create order
curl -X POST http://localhost:8088/api/orders/create \
  -H "Content-Type: application/json" \
  -d @test_checkout.json

# Get order details
curl http://localhost:8088/api/orders/ORD-1783518085442-261DBDDE

# Get user's orders
curl http://localhost:8088/api/orders/user/testuser

# Update order status
curl -X PUT http://localhost:8088/api/orders/ORD-1783518085442-261DBDDE/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

### Browser Test
1. Login as any user or proceed as guest
2. Add products to cart
3. Click "Checkout" button in cart drawer
4. Fill in all fields:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Address: 123 Main St
   - City: New York
   - Pincode: 110001
   - Payment: Select one of 4 modes
5. Click "Place Order - $X.XX"
6. Verify success message with order ID
7. Check backend logs for confirmation

---

## 🔧 Configuration

### Backend (application.properties)
```properties
# MySQL connection (existing)
spring.datasource.url=jdbc:mysql://localhost:3306/understory
spring.datasource.username=root
spring.datasource.password=shobhit15

# JPA/Hibernate (updated)
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=always

# Port
server.port=8088
```

### Frontend (.env)
```env
VITE_API_BASE=http://localhost:8088/api
```

---

## 📊 Order Statuses

- **pending** - Order created, awaiting confirmation
- **confirmed** - Payment confirmed, preparing shipment
- **shipped** - Order dispatched
- **delivered** - Order delivered to customer
- **cancelled** - Order cancelled by user

---

## 🚀 Future Enhancements

1. **Payment Gateway Integration**
   - Razorpay/PayPal for card and UPI payments
   - Webhook handling for payment confirmation

2. **Email Notifications**
   - Order confirmation email
   - Shipment tracking updates
   - Delivery confirmation

3. **SMS Integration**
   - OTP verification for orders
   - Delivery status updates

4. **Order Tracking**
   - Real-time tracking page
   - Estimated delivery time
   - Carrier integration (Courier company)

5. **Admin Dashboard**
   - Order management
   - Refund processing
   - Delivery coordination

6. **Analytics**
   - Order trends
   - Popular payment modes
   - Regional delivery data
   - Customer segmentation

---

## 🐛 Error Handling

### Frontend Errors
- Form validation errors with field-level messages
- Network errors with retry capability
- Checkout API errors with alert dialog

### Backend Errors
- 400 Bad Request - Validation errors
- 404 Not Found - Order not found
- 500 Internal Server Error - Database or server errors
- All errors return JSON with `message` field

---

## 📝 Testing Checklist

- [x] Backend: Order creation with validation
- [x] Backend: Database tables created (JPA auto-create)
- [x] Backend: All 4 REST endpoints working
- [x] Frontend: CheckoutForm component renders
- [x] Frontend: Form validation working
- [x] Frontend: API client properly configured
- [x] Frontend: Payment mode selection
- [x] Integration: Checkout flow end-to-end
- [ ] Payment gateway: Integration (Future)
- [ ] Email: Notification system (Future)

---

## 📞 Support

For issues or questions:
1. Check backend logs: `target/understory-backend-1.0.0.jar` console
2. Check browser console: F12 → Console tab
3. Check MySQL: Verify tables exist `SHOW TABLES;`
4. Verify ports: Backend 8088, Frontend 3000/3002

---

**Created:** July 8, 2026  
**Last Updated:** July 8, 2026  
**Status:** ✅ Complete and Tested
