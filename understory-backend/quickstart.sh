#!/bin/bash

# Email OTP Verification System - Quick Start Guide
# This script helps you quickly set up and test the Email OTP Verification system

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Email OTP Verification - Quick Start${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to print step
print_step() {
    echo -e "\n${GREEN}✓${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Java is installed
print_step "Checking Java installation..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "\K[^"]*' || echo "unknown")
    echo "  Java version: $JAVA_VERSION"
else
    print_error "Java not found! Please install Java 17 or higher"
    exit 1
fi

# Check if Maven is installed
print_step "Checking Maven installation..."
if command -v mvn &> /dev/null; then
    MVN_VERSION=$(mvn -v 2>&1 | grep "Apache Maven" || echo "unknown")
    echo "  $MVN_VERSION"
else
    print_error "Maven not found! Please install Maven 3.6 or higher"
    exit 1
fi

# Check if MySQL is running
print_step "Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    if mysql -u root -e "SELECT 1" &> /dev/null 2>&1 || mysql -u root -p -e "SELECT 1" &> /dev/null 2>&1; then
        echo "  MySQL connection: OK"
    else
        print_warning "MySQL may not be running. You can start it manually if needed."
    fi
else
    print_warning "MySQL client not found. Ensure MySQL server is running."
fi

# Guide for environment variables
print_step "Setting up environment variables..."
echo -e "${YELLOW}Please set the following environment variables:${NC}"
echo ""
echo "  # Database Configuration"
echo "  export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/understory?useSSL=false&serverTimezone=UTC"
echo "  export SPRING_DATASOURCE_USERNAME=root"
echo "  export SPRING_DATASOURCE_PASSWORD=your_db_password"
echo ""
echo "  # Email Configuration (Resend SMTP)"
echo "  export MAIL_USERNAME=resend"
echo "  export MAIL_PASSWORD=your_resend_api_key"
echo "  export MAIL_FROM=noreply@understory.com"
echo ""
echo "  # Server Configuration"
echo "  export PORT=8080"
echo ""

read -p "Press Enter after setting environment variables (or Ctrl+C to cancel): "

# Create database
print_step "Setting up database..."
echo "Creating 'understory' database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS understory;" 2>/dev/null || print_warning "Could not create database automatically. Please create it manually: mysql -u root -p -e 'CREATE DATABASE understory;'"

# Build project
print_step "Building project..."
mvn clean package -DskipTests -q || { print_error "Build failed!"; exit 1; }
echo "  Build successful: target/understory-backend-1.0.0.jar"

# Provide options
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Choose an option:"
echo ""
echo "1) Run application with Spring Boot Maven plugin"
echo "2) Run application with Java -jar"
echo "3) Display API testing examples"
echo "4) View documentation"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        print_step "Starting application with mvn spring-boot:run..."
        echo ""
        mvn spring-boot:run
        ;;
    2)
        print_step "Starting application with java -jar..."
        echo ""
        java -jar target/understory-backend-1.0.0.jar
        ;;
    3)
        print_step "API Testing Examples"
        echo ""
        echo "1. Register a new user:"
        echo "   curl -X POST http://localhost:8080/api/auth/register \\"
        echo "     -H 'Content-Type: application/json' \\"
        echo "     -d '{"
        echo "       \"username\": \"john_doe\","
        echo "       \"email\": \"john@example.com\","
        echo "       \"password\": \"Secure@Pass123\""
        echo "     }'"
        echo ""
        echo "2. Verify email (use OTP from email):"
        echo "   curl -X POST http://localhost:8080/api/auth/verify-email \\"
        echo "     -H 'Content-Type: application/json' \\"
        echo "     -d '{"
        echo "       \"email\": \"john@example.com\","
        echo "       \"otp\": \"123456\""
        echo "     }'"
        echo ""
        echo "3. Login:"
        echo "   curl -X POST http://localhost:8080/api/auth/login \\"
        echo "     -H 'Content-Type: application/json' \\"
        echo "     -d '{"
        echo "       \"username\": \"john_doe\","
        echo "       \"password\": \"Secure@Pass123\""
        echo "     }'"
        echo ""
        echo "For more examples, see API_DOCUMENTATION.md"
        ;;
    4)
        print_step "Documentation files:"
        echo ""
        echo "1. API_DOCUMENTATION.md"
        echo "   - Complete API reference"
        echo "   - Request/response examples"
        echo "   - Error codes and handling"
        echo ""
        echo "2. SETUP_GUIDE.md"
        echo "   - Detailed configuration guide"
        echo "   - Resend setup instructions"
        echo "   - Docker deployment"
        echo ""
        echo "3. OTP_IMPLEMENTATION_README.md"
        echo "   - Implementation overview"
        echo "   - Features and architecture"
        echo "   - Security details"
        echo ""
        echo "4. IMPLEMENTATION_CHECKLIST.md"
        echo "   - Complete checklist of what was implemented"
        echo "   - File list and status"
        echo ""
        ;;
    5)
        print_step "Exiting. Don't forget to:"
        echo "  1. Start the application: mvn spring-boot:run"
        echo "  2. Check the API: http://localhost:8080/api/auth/register"
        echo "  3. Read the documentation"
        echo ""
        exit 0
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac
