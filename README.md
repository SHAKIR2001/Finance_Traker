[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)# 📊 Personal Finance Tracker API (In Development)

A secure RESTful API for managing personal finances, tracking expenses, setting budgets, and generating financial reports.

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js  
**Database:** MongoDB (Atlas or Local)  
**Authentication:** JWT (Implemented)  
**Documentation:** Postman  

## 📊 Project Status

**Current Progress:**
- Project setup completed (Express.js, MongoDB connection, environment configuration).
- Basic Express server running on `http://localhost:5000/`.
- MongoDB connected successfully.
- User authentication (JWT-based login, registration, and role management) completed.
- Admin functionalities (view and delete users) implemented.

**Next Steps:**
- Implement CRUD operations for transactions (in progress).
- Add budget tracking and financial reports.

## 📦 Dependencies

This project uses the following NPM packages:

### Main Dependencies (Required for Production)

| Package       | Version | Description                       |
|---------------|---------|-----------------------------------|
| express       | latest  | Web framework for Node.js         |
| mongoose      | latest  | MongoDB ODM for Node.js           |
| dotenv        | latest  | Loads environment variables       |
| cors          | latest  | Enables Cross-Origin Resource Sharing |
| morgan        | latest  | HTTP request logger for debugging |
| jsonwebtoken  | latest  | JWT-based authentication          |
| bcryptjs      | latest  | Secure password hashing           |

### Dev Dependencies (For Development & Testing)

| Package       | Version | Description                       |
|---------------|---------|-----------------------------------|
| nodemon       | latest  | Auto-restarts the server on file changes |
| jest          | latest  | JavaScript testing framework      |
| supertest     | latest  | API testing library for HTTP assertions |

## 📖 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the Server

```bash
npm run dev
```

The API should be running at `http://localhost:5000/`

## 🧪 Testing (To Be Implemented)

Unit and integration tests will be added later using Jest and Supertest.

## 📌 API Endpoints (Coming Soon)

A full list of API routes will be documented once implemented.


2nd update

# 📊 Transaction Management - Personal Finance Tracker API

A module for managing **income and expenses** in the **Personal Finance Tracker API**. Users can **create, view, update, delete**, and **filter** transactions by type, category, and date range.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas or Local)
- **Authentication:** JWT (Implemented)
- **Documentation:** Postman

## 📊 Features

✅ **Create, Read, Update, Delete (CRUD)** transactions.  
✅ **Filter transactions** by type, category, and date range.  
✅ **Secure transaction management** with JWT authentication.  
✅ **User-specific access** to manage personal transactions.

## 📁 Project Structure (Relevant to Transactions)

```
finance-tracker/
├── controllers/
│    └── transactionController.js
├── models/
│    └── Transaction.js
├── routes/
│    └── transactionRoutes.js
└── server.js
```

## 📦 Dependencies

| Package       | Version | Description                       |
|---------------|---------|-----------------------------------|
| express       | latest  | Web framework for Node.js         |
| mongoose      | latest  | MongoDB ODM for Node.js           |
| jsonwebtoken  | latest  | JWT-based authentication          |
| bcryptjs      | latest  | Secure password hashing           |
| dotenv        | latest  | Environment variables management  |

## 📖 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the Server

```bash
node server.js
```

The API should be running at `http://localhost:5000/`

## 🧪 Transaction Endpoints

### 1. Create a Transaction

**POST** `/api/transactions`

Request Body (JSON):
```json
{
  "type": "income",
  "amount": 1500,
  "category": "Salary",
  "date": "2025-02-27",
  "description": "Monthly Salary"
}
```

✅ **Response:**
```json
{
  "_id": "transaction-id",
  "user": "user-id",
  "type": "income",
  "amount": 1500,
  "category": "Salary",
  "date": "2025-02-27",
  "description": "Monthly Salary"
}
```

### 2. Get User Transactions (With Filters)

**GET** `/api/transactions`

**Available Query Parameters:**
- `type` - Filter by transaction type (`income` or `expense`)
- `category` - Filter by transaction category
- `startDate` - Start of the date range (YYYY-MM-DD)
- `endDate` - End of the date range (YYYY-MM-DD)

**Example Request:**
```
GET /api/transactions?type=income&category=Freelance&startDate=2024-01-01&endDate=2024-12-31
```

✅ **Response:**
```json
[
  {
    "_id": "transaction-id",
    "user": "user-id",
    "type": "income",
    "amount": 2000,
    "category": "Freelance",
    "date": "2025-02-27",
    "description": "Updated freelance project payment"
  }
]
```

### 3. Update a Transaction

**PUT** `/api/transactions/:id`

Request Body (JSON):
```json
{
  "amount": 2000,
  "category": "Freelance",
  "description": "Updated freelance project payment"
}
```

✅ **Response:**
```json
{
  "_id": "transaction-id",
  "user": "user-id",
  "type": "income",
  "amount": 2000,
  "category": "Freelance",
  "date": "2025-02-27",
  "description": "Updated freelance project payment"
}
```

### 4. Delete a Transaction

**DELETE** `/api/transactions/:id`

✅ **Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

## 📌 Next Steps

- Implement pagination for large transaction lists.
- Add admin access to view all user transactions.
- Create financial reports and summaries.

# Personal Finance Tracker API (In Development)

A secure RESTful API for managing personal finances, tracking expenses, setting budgets, and generating financial reports.

## 📊 Feature: Improved Notification Alerts for Unusual Spending

### 🛠️ What We Implemented
Enhanced the system to monitor spending behavior and trigger alerts when unusual patterns are detected. This feature provides more comprehensive tracking by detecting:
- **Budget Exceeding Alerts**: Warns users when spending crosses 80% or exceeds the budget.
- **Unusual Spending Alerts**: Detects if spending exceeds 2x the average spending in a category.
- **Spending Spike Alerts**: Notifies users when a transaction is 1.5x higher than the previous maximum amount.

### 🧰 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Postman

### 📌 Dependencies

Main Dependencies:

| Package     | Version | Description                            |
|-------------|---------|----------------------------------------|
| express     | latest  | Web framework for Node.js               |
| mongoose    | latest  | MongoDB ODM for Node.js                 |
| dotenv      | latest  | Loads environment variables             |
| jsonwebtoken| latest  | JWT-based authentication                |
| bcryptjs    | latest  | Secure password hashing                 |
| node-cron   | latest  | Schedules recurring tasks                |

### 📊 Endpoints for Alerts

1. **Check for Budget and Unusual Spending Alerts**
   - **Method**: `GET`
   - **Endpoint**: `/api/budgets/alerts`
   - **Authorization**: Required (Bearer Token)

#### Example Response:
```json
[
  {
    "category": "Food",
    "type": "budget_exceeded",
    "message": "You have exceeded your monthly budget for Food."
  },
  {
    "category": "Entertainment",
    "type": "unusual_spending",
    "message": "Unusual spending detected! You spent more than twice your average in Entertainment."
  },
  {
    "category": "Travel",
    "type": "spending_spike",
    "message": "Spending spike detected! Your latest spending in Travel is unusually high."
  }
]
```

### 📋 Setup Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/your-repo-url.git
cd finance-tracker
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Environment Variables**
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. **Start the Server**
```bash
npm run dev
```

### ✅ Next Steps
- Further optimization of alert accuracy.
- Continue adding advanced financial tracking features.

