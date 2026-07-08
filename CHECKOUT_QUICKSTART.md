# 🛒 Quick Start: Checkout Feature

## ⚡ Start the Project (2 terminals)

### Terminal 1 - Backend
```bash
cd e:\RecomdationSys\understory\understory-backend\target
java -jar understory-backend-1.0.0.jar
```
**Wait for**: `Tomcat initialized with port 8088`

### Terminal 2 - Frontend
```bash
cd e:\RecomdationSys\understory\understory-frontend
npm run dev
```
**Note**: May start on port 3000, 3001, or 3002 (will show in output)

---

## 🌐 Access the App
Open your browser → **http://localhost:3000** (or 3002)

---

## 📋 Test Checkout Flow

### Step 1: Login or Continue as Guest
- Click "Continue as Guest" or login with any username/password

### Step 2: Add Products to Cart
- Browse products by category or recommendations
- Click heart icon to like products
- Click products to see details or "Add to cart" button
- Add 2-3 products with different quantities

### Step 3: Open Cart
- Click cart icon (top right) showing item count
- Cart drawer slides in from right
- Shows all items with quantity controls

### Step 4: Click Checkout
- Bottom of cart drawer shows subtotal
- Click blue **"Checkout"** button
- Checkout modal opens

### Step 5: Fill Checkout Form

**Personal Details:**
- Full Name: `John Doe`
- Email: `john@example.com`
- Phone: `9876543210`

**Delivery Address:**
- Address: `123 Main Street, Apt 4B`
- City: `New York`
- Pincode: `110001`

**Payment Mode:** Select one
- 💵 Cash on Delivery
- 💳 Debit/Credit Card
- 📱 UPI Apps
- 🏦 Net Banking

### Step 6: Place Order
- Click **"Place Order - $X.XX"** button
- Form validates automatically
- Shows loading state while processing

### Step 7: Success! 🎉
- See checkmark icon with order ID
- Message: "Order #ORD-xxxx placed successfully!"
- Auto-closes after 2 seconds
- Cart is cleared
- Back to shop page

---

## ✅ Validation Examples

### Valid Form
```
✓ Name: John Doe
✓ Email: john@example.com
✓ Phone: 9876543210
✓ Address: 123 Main Street
✓ City: New York
✓ Pincode: 110001
✓ Payment: Checked
```

### Invalid Form (Will Show Errors)
```
✗ Name: (empty) → "Name is required"
✗ Email: invalid → "Invalid email"
✗ Phone: 123 → "Phone must be 10 digits"
✗ Address: (empty) → "Address is required"
✗ City: (empty) → "City is required"
✗ Pincode: 123 → "Pincode must be 6 digits"
✗ Payment: (none selected) → "Select a payment mode"
```

---

## 🔍 Test via API (curl)

### Create Order
```bash
curl -X POST http://localhost:8088/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9123456789",
    "address": "456 Oak Avenue",
    "city": "Mumbai",
    "pincode": "400001",
    "paymentMode": "upi",
    "items": [
      {"id": 1, "name": "Coffee", "price": 29.99, "qty": 2}
    ],
    "totalAmount": 59.98
  }'
```

**Response:**
```json
{
  "orderId": "ORD-1783518085442-261DBDDE",
  "username": "testuser",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9123456789",
  "address": "456 Oak Avenue",
  "city": "Mumbai",
  "pincode": "400001",
  "paymentMode": "upi",
  "totalAmount": 59.98,
  "orderStatus": "pending",
  "items": [
    {"productName": "Coffee", "price": 29.99, "quantity": 2}
  ],
  "createdAt": "2026-07-08T19:11:25.442"
}
```

### Get Order Details
```bash
curl http://localhost:8088/api/orders/ORD-1783518085442-261DBDDE
```

### Get User's Orders
```bash
curl http://localhost:8088/api/orders/user/testuser
```

### Update Order Status
```bash
curl -X PUT http://localhost:8088/api/orders/ORD-1783518085442-261DBDDE/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

---

## 🎯 What's New

| Feature | Details |
|---------|---------|
| **Checkout Form** | Full-screen modal with validation |
| **User Details** | Name, Email, Phone collection |
| **Address Fields** | Street, City, Pincode |
| **Payment Modes** | 4 options (COD, Card, UPI, NetBanking) |
| **Database** | 2 tables: orders, order_items |
| **API Endpoints** | 4 routes (Create, Get, List, Update) |
| **Validation** | Client-side + Server-side |
| **Order ID** | Auto-generated unique format |

---

## 🛠️ Troubleshooting

### Checkout Button Not Working?
1. Make sure backend is running on port 8088
2. Check browser console (F12 → Console tab)
3. Look for network errors

### Form Not Submitting?
1. Check all red error messages
2. Make sure Phone is 10 digits
3. Make sure Pincode is 6 digits
4. Make sure Payment Mode is selected

### Database Errors?
1. Ensure MySQL is running
2. Check credentials in `application.properties`
3. Verify `understory` database exists

### Frontend Not Loading?
1. Check if npm started successfully
2. Look for port conflicts (3000/3001/3002)
3. Check .env file has `VITE_API_BASE=http://localhost:8088/api`

---

## 📊 Test Cases

### Test Case 1: Successful Checkout (COD)
1. Add products to cart
2. Enter all valid details
3. Select "💵 Cash on Delivery"
4. Click Place Order
5. ✓ Should show success with Order ID

### Test Case 2: Invalid Email
1. Enter email: "invalidemail"
2. See error: "Invalid email"
3. Change to: "valid@email.com"
4. Error disappears ✓

### Test Case 3: Wrong Phone Length
1. Enter phone: "12345"
2. See error: "Phone must be 10 digits"
3. Change to: "1234567890"
4. Error disappears ✓

### Test Case 4: Wrong Pincode Length
1. Enter pincode: "123"
2. See error: "Pincode must be 6 digits"
3. Change to: "123456"
4. Error disappears ✓

### Test Case 5: Guest Checkout
1. Continue as Guest (no login)
2. Add items to cart
3. Checkout with valid details
4. ✓ Order creates with username = "guest"

### Test Case 6: Multiple Payments
1. Checkout with Cash on Delivery ✓
2. Checkout with Card ✓
3. Checkout with UPI ✓
4. Checkout with Net Banking ✓

---

## 📈 Expected Behavior

### Cart → Checkout Flow
```
Cart Open
  ↓
User clicks "Checkout"
  ↓
CheckoutForm Modal Opens
  ↓
User fills form
  ↓
User clicks "Place Order"
  ↓
Frontend validates form
  ↓
Valid? → POST to /api/orders/create
  ↓
Backend validates
  ↓
Valid? → Save to database
  ↓
Generate Order ID
  ↓
Return 201 + OrderResponse
  ↓
Show success message with Order ID
  ↓
Auto-close after 2 seconds
  ↓
Cart cleared
  ↓
Back to Shop Page ✓
```

---

## 📚 Documentation Files

- **CHECKOUT_IMPLEMENTATION_SUMMARY.md** - Complete technical overview
- **CHECKOUT_FEATURE.md** - Detailed feature documentation
- **CHECKOUT_FLOW_DIAGRAM.txt** - Visual diagrams and flows

---

## 🎓 Key Points

1. **No Real Payment** - Currently demos order creation (integrate payment gateway later)
2. **Order Status** - All orders created with status "pending"
3. **Order ID** - Unique format: ORD-{timestamp}-{8-char-uuid}
4. **Guest Orders** - Supported with username = "guest"
5. **Validation** - Both client-side (React) and server-side (Spring Boot)
6. **Database** - Automatically creates/updates tables via Hibernate
7. **CORS** - Enabled for localhost (configure for production)

---

## 🚀 Ready to Test!

Everything is set up and ready to go. Open http://localhost:3000 and try the checkout flow!

**Expected Time to Complete**: 5-10 minutes

**Success Indicator**: See order confirmation with Order ID

---

Need help? Check the detailed docs:
- `CHECKOUT_IMPLEMENTATION_SUMMARY.md` - Full details
- `CHECKOUT_FEATURE.md` - API documentation
- `CHECKOUT_FLOW_DIAGRAM.txt` - Visual flows
