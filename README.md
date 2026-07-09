# Understory - AI-Powered E-Commerce Platform

A complete, production-ready e-commerce platform with AI-powered product recommendations, personalized shopping experience, and comprehensive order management.

**Live Demo:** https://understory-production-cec9.up.railway.app

---

## 📋 Project Overview

Understory is a full-stack e-commerce application featuring:

### Frontend
- **React + Vite** - Fast, modern web application
- **24 Handcrafted Products** - 6 categories (Ceramics, Textiles, Plants, Lighting, Kitchen, Electronics)
- **AI Recommendations** - Hybrid content-based and collaborative filtering
- **Interactive UI** - Personalized product discovery, shopping cart, checkout
- **Order Tracking** - Users can view order history and status

### Backend
- **Spring Boot 3.3.4** - Robust Java REST API
- **MySQL 8.0+** - Persistent data storage
- **User Authentication** - Sign up, login, password hashing with BCrypt
- **Admin Dashboard** - Manage orders, users, and fulfillment
- **RESTful API** - 20+ endpoints for all operations

### Deployment
- **Frontend:** Vite dev server (local) or static hosting
- **Backend:** Railway.app (production) or local Spring Boot
- **Database:** Railway PostgreSQL (production) or local MySQL

---

## 📁 Project Structure

```
understory/
├── understory-frontend/              # React + Vite frontend
│   ├── README.md                     # Frontend documentation
│   ├── package.json                  # Dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── .env                          # Environment (production URL)
│   └── src/
│       ├── api/                      # API client modules
│       ├── components/               # React components
│       ├── constants/                # Design tokens & products
│       └── utils/                    # Helper functions
│
├── understory-backend/               # Spring Boot backend
│   ├── README.md                     # Backend documentation
│   ├── pom.xml                       # Maven dependencies
│   ├── src/main/java/com/understory/backend/
│   │   ├── controller/               # REST endpoints
│   │   ├── service/                  # Business logic
│   │   ├── repository/               # Database access
│   │   ├── model/                    # Entity classes
│   │   └── config/                   # Configuration
│   └── src/main/resources/
│       ├── application.properties    # Configuration
│       └── schema.sql                # Database schema
│
├── aiIN/                             # AI recommendation data
│   └── products.json                 # Product embeddings
│
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Option 1: Use Production Backend (Recommended)

Frontend automatically configured to use: `https://understory-production-cec9.up.railway.app`

```bash
cd understory-frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Option 2: Local Development (Both Frontend & Backend)

#### Step 1: Setup Backend

```bash
cd understory-backend

# Configure database in src/main/resources/application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/understory
# spring.datasource.username=root
# spring.datasource.password=your_password

# Start backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8088`

#### Step 2: Configure Frontend

```bash
cd understory-frontend

# Create .env file pointing to local backend
cp .env.example .env
# Edit .env: VITE_API_BASE=http://localhost:8088/api

npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🛒 Features

### For Users
- ✅ **Sign Up & Login** - Secure authentication
- ✅ **Browse Products** - 24+ handcrafted items with rich details
- ✅ **AI Recommendations** - Smart product suggestions based on preferences
- ✅ **Like Products** - Save favorites and build taste profile
- ✅ **Shopping Cart** - Add/remove items, adjust quantities
- ✅ **Detailed Checkout** - Address, contact, payment method
- ✅ **Order History** - Track all purchases
- ✅ **Order Status** - Real-time updates (pending → delivered)

### For Admins
- ✅ **User Management** - View all users and their preferences
- ✅ **Order Dashboard** - See all orders with customer details
- ✅ **Order Fulfillment** - Update status (pending → confirmed → shipped → delivered)
- ✅ **Statistics** - Orders, users, total sales data
- ✅ **Admin Passcode** - Secured access to admin features

---

## 📊 Database Schema

### Users
Stores authentication and user accounts.

### User Profiles
Stores personalized data:
- **likes** - Product IDs user has liked
- **cart** - Items in shopping cart with quantities
- **profile** - Tag weights (e.g., "ceramic": 0.8, "minimal": 0.6)

### Orders
Complete order history with:
- Order ID, customer info, delivery address
- Payment method (COD, Card, Internet Banking, UPI)
- Order items (products, prices, quantities)
- Status tracking (pending → confirmed → shipped → delivered)

### Order Items
Line items for each order with product details.

---

## 🔌 API Endpoints

All endpoints documented in respective README files:

### Frontend API Calls
See `understory-frontend/README.md` for JavaScript examples.

### Backend REST API
See `understory-backend/README.md` for complete API reference.

**Quick Reference:**
```
Authentication:   POST /api/auth/signup, /api/auth/login
User Profiles:    GET/PUT /api/users/{username}/profile
Products:         GET /api/recommendations/products
Recommendations:  GET /api/recommendations/user/{userId}/product/{id}
Orders:           POST /api/orders/create, GET /api/orders/user/{username}
Admin:            GET /api/admin/users, PUT /api/orders/{id}/status
```

---

## 🔐 Security

- **Password Hashing** - BCrypt (never stored in plaintext)
- **CORS Protection** - Configured allow-list for frontend origins
- **Admin Authentication** - Passcode-protected endpoints
- **Input Validation** - Server-side validation on all endpoints
- **SSL/HTTPS** - Required for production deployment

---

## 🎨 Design System

Understory uses a curated color palette optimized for e-commerce:

- **Primary Background:** `#FAF8F5` (warm cream)
- **Card Background:** `#FFFCF8` (off-white)
- **Primary Text:** `#202B22` (dark ink)
- **Accent Color:** `#D4A574` (gold)
- **Link Color:** `#8B6B7A` (plum)
- **Borders:** `#E8E3DD` (light)

Each product category has unique gradient backgrounds.

---

## 📦 Deployment

### Frontend Deployment

**Static Hosting (GitHub Pages, Netlify, Vercel):**
```bash
# Build production bundle
VITE_API_BASE=https://your-backend-url/api npm run build

# Deploy dist/ folder to your host
```

### Backend Deployment

**Railway (Recommended):**
1. Push code to GitHub
2. Connect GitHub to Railway
3. Set environment variables
4. Railway auto-deploys with git push

**Traditional Server:**
```bash
mvn clean package
java -jar target/understory-backend-1.0.0.jar
```

---

## 🧪 Testing

### Test Users (for development)

```
Username: testuser
Password: test123
```

### Admin Access

**Passcode:** `Admin`

Access admin panel from header after login.

### Test Orders

Place test orders with:
- Any product (e.g., p1, p2, etc.)
- Any payment method (all supported)
- View in order history or admin panel

---

## 📚 Documentation

- **[Frontend README](./understory-frontend/README.md)** - React component architecture, API clients, styling
- **[Backend README](./understory-backend/README.md)** - Spring Boot endpoints, database schema, configuration
- **[AI Recommendations](./aiIN/)** - Product embeddings and recommendation algorithm

---

## 🛠 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.2+ |
| Build Tool | Vite | 5.0+ |
| Styling | CSS-in-JS | Native |
| Backend | Spring Boot | 3.3.4 |
| Database | MySQL | 8.0+ |
| Language | Java | 17+ |
| Build | Maven | 3.8+ |
| Auth | BCrypt | Spring Security |
| Deployment | Railway | Production |

---

## 📞 Support & Troubleshooting

### Common Issues

**Frontend shows blank page:**
- Check browser console (F12) for errors
- Verify backend URL in `.env`
- Restart dev server

**Cannot place order:**
- Ensure all form fields filled
- Verify backend is running/accessible
- Check network tab in DevTools

**CORS errors:**
- Backend allow-list doesn't include frontend origin
- Check `CorsConfig.java` in backend
- Restart backend after changes

**Database connection failed:**
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database exists: `CREATE DATABASE understory;`

---

## 🚀 Future Enhancements

- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications for orders
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Product search and filters
- [ ] Inventory management
- [ ] Customer support chat

---

## 📄 License

This project is part of the Understory platform.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Development Tips

- Use `npm run dev` for frontend hot-reload during development
- Use `mvn spring-boot:run` for backend with automatic restart
- Check browser DevTools Network tab when debugging API issues
- Use Postman or cURL for direct API testing
- Database changes auto-apply via `schema.sql`
- Keep `.env` file out of version control

---

## 📞 Contact & Support

For questions, issues, or feature requests:
1. Check the respective README files for detailed documentation
2. Review existing GitHub issues
3. Create a new issue with detailed description
4. Include error messages and steps to reproduce

---

**Made with ❤️ for thoughtful shopping**
