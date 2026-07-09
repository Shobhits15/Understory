# Understory - AI-Powered E-Commerce Platform

A modern, fully-featured e-commerce application with AI product recommendations, personalized shopping experience, and complete order management system.

Built with **React + Vite** (frontend) and **Spring Boot + MySQL** (backend).

## 🌟 Features

### Shopping Experience
- **AI-Powered Recommendations** - Hybrid content-based and collaborative filtering
- **Personalized Taste Profile** - Your preferences evolve as you interact with products
- **Interactive Product Catalog** - Browse 24+ handcrafted products across 6 categories
- **Clickable Product Details** - View detailed specs, features, and product info
- **Smart Cart** - Add/remove products, adjust quantities with real-time totals
- **Detailed Checkout** - Complete form with address, contact, and payment method selection

### Order Management
- **Order History** - Users can view all their past orders with order IDs and dates
- **Order Tracking** - Real-time status updates (pending → confirmed → shipped → delivered)
- **Admin Dashboard** - Manage all orders, update statuses, view user stats
- **Payment Methods** - Support for COD, Cards, Internet Banking, and UPI Apps

### Product Features
- **Beautiful UI** - 24 handpicked products with emoji images and rich descriptions
- **Category Filtering** - Browse by Ceramics, Textiles, Plants, Lighting, Kitchen, Electronics
- **Product Tags** - Filter by attributes like "handmade", "eco-friendly", "minimalist", etc.
- **Smart Search** - Find products matching your style preferences

### User Management
- **Sign Up & Login** - Secure authentication with user profiles
- **Guest Browsing** - Browse without account, save preferences by signing up
- **Admin Passcode** - Secured admin access to manage users and orders
- **Profile Persistence** - Likes, cart, and preferences auto-saved to backend

---

## 📁 Project Structure

```
understory-frontend/
├── index.html                          # HTML entry point
├── vite.config.js                      # Vite configuration
├── package.json                        # Dependencies
├── .env                                # Environment variables (production URL)
├── .env.example                        # Environment template
├── README.md                           # This file
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Root component with global state
    ├── api/
    │   ├── client.js                   # Auth & user API calls
    │   ├── checkout.js                 # Order & checkout API calls
    │   └── recommendations.js          # AI recommendation API calls
    ├── constants/
    │   ├── colors.js                   # Design tokens & color palette
    │   ├── config.js                   # App configuration (admin passcode)
    │   └── products.js                 # 24 products with emoji, tags, descriptions
    ├── utils/
    │   └── productUtils.js             # Recommendation algorithms & utilities
    └── components/
        ├── GlobalStyle.jsx             # Global fonts & CSS animations
        ├── AuthScreen.jsx              # Login/signup/guest screen
        ├── Header.jsx                  # Top navigation bar
        ├── TasteProfilePanel.jsx       # Preference chips & hero section
        ├── RecommendationsSection.jsx  # Personalized product carousel
        ├── CatalogSection.jsx          # Full product grid with filters
        ├── ProductCard.jsx             # Reusable product card (emoji + details)
        ├── ProductDetail.jsx           # Product modal with full info
        ├── CartDrawer.jsx              # Slide-out shopping cart
        ├── CheckoutForm.jsx            # Checkout form with address & payment
        ├── OrderHistory.jsx            # User's order history viewer
        ├── OrderManagement.jsx         # Admin order manager
        └── AdminPanel.jsx              # Admin dashboard (users & orders)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm (for frontend)
- **Java 17+** and Maven (for backend)
- **MySQL** 8.0+ (for database)

### 1. Clone & Setup Frontend

```bash
cd understory-frontend
npm install
```

### 2. Configure Backend URL

The frontend is currently configured to use the **production backend**:
```
VITE_API_BASE=https://understory-production-cec9.up.railway.app/api
```

To use **local backend** instead, edit `.env`:
```bash
cp .env.example .env
# Edit .env and set:
# VITE_API_BASE=http://localhost:8088/api
```

### 3. Start Frontend Dev Server

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:3000`). Open it in your browser.

### 4. [Optional] Setup & Run Local Backend

**From `understory-backend` project:**

```bash
cd understory-backend

# Configure database in src/main/resources/application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/understory
# spring.datasource.username=root
# spring.datasource.password=your_password

# Start the backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8088` (configured in `application.properties`).

Verify it's working:
```bash
curl http://localhost:8088/api/recommendations/products
```

---

## 🔌 Backend API Endpoints

### Authentication
```
POST /api/auth/signup              # Create new account
POST /api/auth/login               # Login & receive user data
```

### User Profiles
```
GET  /api/users/{username}/profile    # Get user's preferences
PUT  /api/users/{username}/profile    # Save preferences
```

### Products & Recommendations
```
GET  /api/recommendations/products                    # All products
GET  /api/recommendations/products/{productId}        # Single product
GET  /api/recommendations/user/{userId}/product/{id}  # Personalized recommendations
GET  /api/recommendations/content-based/{productId}   # Similar products
```

### Orders
```
POST /api/orders/create                    # Place new order
GET  /api/orders/user/{username}           # User's orders
GET  /api/orders/{orderId}                 # Order details
GET  /api/orders/all                       # All orders (admin)
PUT  /api/orders/{orderId}/status          # Update order status
```

### Admin
```
GET  /api/admin/users                      # List all users (with X-Admin-Passcode header)
```

---

## 🎨 Design System

The app uses a curated color palette (`constants/colors.js`):
- **Ink** (`#202B22`) - Primary text
- **Gold** (`#D4A574`) - Accent, highlights, tags
- **Background** (`#FAF8F5`) - Main background
- **Card** (`#FFFCF8`) - Card backgrounds
- **Plum** (`#8B6B7A`) - Link color

Product categories have unique gradient backgrounds for visual distinction.

---

## 🛒 Key Workflows

### User Signup & Shopping
1. **Sign up** with username/password
2. **Browse catalog** or wait for **AI recommendations**
3. **Like products** to refine your taste profile
4. **Click products** to view detailed info, features, and reviews
5. **Add to cart** and proceed to checkout
6. **Fill checkout form** with address and payment details
7. **Place order** and receive order confirmation

### Order Fulfillment (Admin)
1. Click **Admin** button (top right)
2. Enter passcode: `Admin` (or `pro` for user management)
3. Navigate to **Orders** tab
4. View all orders with customer details
5. Update status: pending → confirmed → shipped → delivered
6. Monitor order statistics and customer information

### Recommendations Algorithm
- **Tagging System** - Each product has weighted tags (ceramic: 1.0, minimal: 0.7, etc.)
- **Preference Tracking** - User profile accumulates weights as they like/unlike products
- **Scoring** - Products scored by overlap with user preferences
- **Content-Based** - Similar products recommended based on tag similarity

---

## 🔧 Configuration

### Environment Variables

**Production (Railway):**
```
VITE_API_BASE=https://understory-production-cec9.up.railway.app/api
```

**Local Development:**
```
VITE_API_BASE=http://localhost:8088/api
```

The `.env` file is read at build time by Vite. For development, changes take effect on next hot reload.

### Admin Passcode
Set in backend `application.properties`:
```
app.admin.passcode=Admin
```

Display text in frontend `constants/config.js`:
```javascript
export const ADMIN_PASSCODE = "Admin";
```

---

## 📦 Build for Production

```bash
npm run build
```

Creates optimized static files in `dist/`. Deploy to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting (AWS S3, Azure, etc.)

**Important:** Set `VITE_API_BASE` before building:
```bash
VITE_API_BASE=https://your-backend-url/api npm run build
```

---

## 🔐 CORS Configuration

The backend allows cross-origin requests on `/api/**` for development.

**Production CORS Policy** (in backend `CorsConfig.java`):
- Ensure your frontend's deployed origin is whitelisted
- Example: `https://shop.example.com` must be in the allow-list
- Without it, all `fetch()` calls fail silently

---

## 📊 Database Schema

### Users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Profiles
```sql
CREATE TABLE user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  likes JSON,                    # { "p1": true, "p2": true, ... }
  cart JSON,                     # { "p1": 2, "p2": 1, ... }
  profile JSON,                  # { "ceramic": 0.8, "warm": 0.6, ... }
  updated_at TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username)
);
```

### Orders
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,    # ORD-{timestamp}-{hash}
  username VARCHAR(50) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  payment_mode VARCHAR(50),      # COD, CARD, NETBANKING, UPI
  order_status VARCHAR(50),      # pending, confirmed, shipped, delivered, cancelled
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username)
);
```

---

## 🐛 Troubleshooting

### "Connection refused" errors
- Check backend is running: `curl http://localhost:8088/api/recommendations/products`
- Verify `.env` has correct `VITE_API_BASE` URL
- Restart dev server after changing `.env`

### CORS errors in console
- Backend CORS allow-list doesn't include frontend URL
- Check `CorsConfig.java` in backend project
- Local development should work by default

### Frontend shows blank white page
- Check browser console for errors (F12)
- Verify backend API is accessible
- Restart `npm run dev`

### Order creation fails
- Ensure all required fields filled in checkout form
- Verify backend order endpoint is working: `GET /api/orders/all`
- Check order data structure matches backend expectations

---

## 📝 API Usage Examples

### Sign Up
```javascript
const response = await fetch('https://backend-url/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user1', password: 'pass123' })
});
const data = await response.json(); // { likes, cart, profile }
```

### Get Recommendations
```javascript
const recs = await fetch(
  'https://backend-url/api/recommendations/user/user1/product/p1?top=8'
).then(r => r.json());
// Returns top 8 personalized product recommendations
```

### Place Order
```javascript
const order = await fetch('https://backend-url/api/orders/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'user1',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    address: '123 Main St',
    city: 'New York',
    pincode: '10001',
    paymentMode: 'card',
    items: [{ id: 'p1', name: 'Product 1', price: 50, qty: 2 }],
    totalAmount: 100
  })
}).then(r => r.json());
// Returns { orderId: 'ORD-...', message: 'Order placed successfully' }
```

---

## 📄 License

This project is part of the Understory e-commerce platform.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or feature requests, please create an issue in the repository.
