# Understory Backend - Spring Boot + MySQL

A robust REST API backend for the Understory e-commerce platform. Handles authentication, user profiles, product recommendations, and order management.

**Tech Stack:** Spring Boot 3.3.4 | MySQL 8.0+ | Java 17+ | Maven

---

## 🚀 Quick Start

### 1. Configure Database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/understory?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password

server.port=8088
app.admin.passcode=Admin
```

The database and tables are created automatically on startup from `schema.sql`.

### 2. Run the Backend

```bash
cd understory-backend
mvn spring-boot:run
```

Backend starts on `http://localhost:8088` (or the port in `application.properties`).

Verify it's working:
```bash
curl http://localhost:8088/api/recommendations/products
```

### 3. [Optional] Build JAR for Deployment

```bash
mvn clean package
java -jar target/understory-backend-1.0.0.jar
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  likes JSON DEFAULT '{}',           # { "p1": true, "p2": true, ... }
  cart JSON DEFAULT '{}',            # { "p1": 2, "p2": 1, ... }
  profile JSON DEFAULT '{}',         # { "ceramic": 0.8, "warm": 0.6, ... }
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,        # ORD-{timestamp}-{random}
  username VARCHAR(50) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  pincode VARCHAR(10),
  payment_mode VARCHAR(50),         # COD, CARD, NETBANKING, UPI
  order_status VARCHAR(50),         # pending, confirmed, shipped, delivered, cancelled
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(10),           # e.g., "p1", "p2", etc.
  product_name VARCHAR(255),
  price DECIMAL(10, 2),
  quantity INT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

---

## 🔌 REST API Endpoints

### Authentication

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response (201 Created):
{
  "likes": {},
  "cart": {},
  "profile": {}
}

Response (409 Conflict if username taken)
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response (200 OK):
{
  "likes": { "p1": true, "p3": true },
  "cart": { "p1": 2 },
  "profile": { "ceramic": 0.8, "warm": 0.6 }
}

Response (401 Unauthorized for invalid credentials)
```

### User Profiles

#### Get User Profile
```
GET /api/users/{username}/profile
Content-Type: application/json

Response (200 OK):
{
  "likes": { "p1": true },
  "cart": { "p2": 3 },
  "profile": { "ceramic": 0.8, "natural": 0.6 }
}
```

#### Update User Profile
```
PUT /api/users/{username}/profile
Content-Type: application/json

{
  "likes": { "p1": true, "p5": true },
  "cart": { "p2": 2, "p4": 1 },
  "profile": { "ceramic": 1.0, "warm": 0.8, "natural": 0.5 }
}

Response (200 OK): Profile updated
```

### Products & Recommendations

#### Get All Products
```
GET /api/recommendations/products

Response (200 OK):
[
  {
    "id": "p1",
    "name": "Terra vase",
    "price": 58,
    "category": "Ceramics",
    "image": "🏺",
    "description": "Handcrafted ceramic vase...",
    "tags": { "ceramic": 1.0, "warm": 0.8, "minimal": 0.6 }
  },
  ...
]
```

#### Get Single Product
```
GET /api/recommendations/products/{productId}

Response (200 OK):
{
  "id": "p1",
  "name": "Terra vase",
  ...
}
```

#### Get Personalized Recommendations
```
GET /api/recommendations/user/{userId}/product/{productId}?top=8

Response (200 OK):
[
  { "id": "p2", "name": "Ash bowl set", ... },
  { "id": "p5", "name": "Woven throw", ... },
  ...
]
```

#### Get Content-Based Recommendations
```
GET /api/recommendations/content-based/{productId}?top=5

Response (200 OK):
[
  { "id": "p2", "name": "Similar product", ... },
  ...
]
```

### Orders

#### Create Order
```
POST /api/orders/create
Content-Type: application/json

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

Response (201 Created):
{
  "orderId": "ORD-1704067200000-ABC123XYZ",
  "message": "Order placed successfully"
}
```

#### Get User Orders
```
GET /api/orders/user/{username}

Response (200 OK):
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

#### Get Order by ID
```
GET /api/orders/{orderId}

Response (200 OK):
{
  "orderId": "ORD-1704067200000-ABC123XYZ",
  "username": "john_doe",
  "orderStatus": "pending",
  "totalAmount": 205,
  "items": [ ... ]
}
```

#### Get All Orders (Admin)
```
GET /api/orders/all

Response (200 OK):
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

#### Update Order Status
```
PUT /api/orders/{orderId}/status
Content-Type: application/json

{
  "status": "confirmed"
}

Valid statuses: pending, confirmed, shipped, delivered, cancelled

Response (200 OK):
{
  "orderId": "ORD-...",
  "orderStatus": "confirmed",
  "message": "Order status updated"
}
```

### Admin

#### List All Users
```
GET /api/admin/users
X-Admin-Passcode: Admin

Response (200 OK):
[
  {
    "username": "john_doe",
    "likes": { "p1": true },
    "cart": { "p2": 1 },
    "profile": { "ceramic": 0.8 }
  },
  ...
]

Response (401 Unauthorized for wrong passcode)
```

---

## 🔐 Security Features

- **Password Hashing** - BCrypt (spring-security-crypto) hashes all passwords before storage
- **Admin Passcode** - Configurable passcode required for admin endpoints
- **CORS** - Configured to allow frontend origins (see `CorsConfig.java`)
- **Input Validation** - All user inputs validated on the server side

---

## 📁 Project Structure

```
understory-backend/
├── pom.xml                           # Maven dependencies
├── src/main/
│   ├── java/com/understory/backend/
│   │   ├── BackendApplication.java          # Entry point
│   │   ├── config/
│   │   │   ├── CorsConfig.java              # CORS configuration
│   │   │   └── SecurityConfig.java          # Security config
│   │   ├── controller/
│   │   │   ├── AuthController.java          # Auth endpoints
│   │   │   ├── UserController.java          # User profile endpoints
│   │   │   ├── ProductController.java       # Product endpoints
│   │   │   ├── RecommendationController.java # Recommendation endpoints
│   │   │   ├── OrderController.java         # Order endpoints
│   │   │   └── AdminController.java         # Admin endpoints
│   │   ├── model/
│   │   │   ├── User.java                    # User entity
│   │   │   ├── UserProfile.java             # User profile entity
│   │   │   ├── Order.java                   # Order entity
│   │   │   └── OrderItem.java               # Order item entity
│   │   ├── repository/
│   │   │   ├── UserRepository.java          # User JDBC operations
│   │   │   ├── UserProfileRepository.java   # Profile JDBC operations
│   │   │   ├── OrderRepository.java         # Order JDBC operations
│   │   │   └── ProductRepository.java       # Product operations
│   │   ├── service/
│   │   │   ├── UserService.java             # User business logic
│   │   │   ├── RecommendationService.java   # Recommendation algorithm
│   │   │   ├── OrderService.java            # Order business logic
│   │   │   └── ProductService.java          # Product operations
│   │   └── util/
│   │       ├── PasswordUtils.java           # Password hashing
│   │       └── JsonUtils.java               # JSON parsing
│   └── resources/
│       ├── application.properties           # Configuration
│       └── schema.sql                       # Database schema
└── README.md
```

---

## 🛠 Configuration

### application.properties

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/understory?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=always

# Server
server.port=8088

# Admin
app.admin.passcode=Admin
```

### Environment Variables (for deployment)

For **Railway** or other cloud platforms, set these environment variables:
```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-host:3306/understory
SPRING_DATASOURCE_USERNAME=db_user
SPRING_DATASOURCE_PASSWORD=db_password
SERVER_PORT=8088
APP_ADMIN_PASSCODE=YourSecurePasscode
```

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Signup
curl -X POST http://localhost:8088/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Login
curl -X POST http://localhost:8088/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Get all products
curl http://localhost:8088/api/recommendations/products

# Place order
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

# Get all orders (admin)
curl http://localhost:8088/api/orders/all \
  -H "X-Admin-Passcode: Admin"
```

### Using Postman

1. Create a collection "Understory API"
2. Add requests for each endpoint
3. Set `Authorization` header: `X-Admin-Passcode: Admin`
4. Test against `http://localhost:8088`

---

## 📦 Deployment

### Deploy to Railway

1. Push code to GitHub
2. Connect GitHub to Railway
3. Set environment variables (see above)
4. Railway auto-builds and deploys
5. Get production URL: `https://your-app.railway.app`

### Deploy to AWS/Azure

1. Build JAR: `mvn clean package`
2. Upload to cloud platform
3. Set environment variables
4. Configure MySQL database
5. Run: `java -jar understory-backend-1.0.0.jar`

---

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database name is correct

### Port Already in Use
- Check what's running on port 8088: `netstat -ano | findstr :8088`
- Change port in `application.properties`

### CORS Errors from Frontend
- Check `CorsConfig.java` allows frontend origin
- For production, add specific frontend URL to allow-list

### Order Creation Fails
- Verify all required fields in request body
- Check items array has correct structure
- Ensure order status values are valid

---

## 📝 Notes for Developers

- **No ORM** - Uses raw JDBC for direct SQL control and clarity
- **JSON Storage** - User preferences stored as JSON in MySQL
- **Stateless API** - Each request is independent, no session management
- **CORS Enabled** - Allows cross-origin requests for frontend integration

---

## 📄 License

Part of the Understory e-commerce platform.
