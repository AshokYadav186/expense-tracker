# 💸 Smart Expense Tracker & AI Financial Advisor

> An enterprise-grade, production-ready full-stack application built with React 19, Node.js, Express, PostgreSQL, Prisma ORM, Google Gemini AI, Docker, and GitHub Actions CI/CD. Features multi-tenant JWT authentication, PostgreSQL query aggregations, real-time analytics, and automated reporting.

---

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Advisor-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[React 19 Frontend + Tailwind CSS] -->|HTTP / JSON + Bearer JWT| API[Express.js Node Backend API]
    API -->|Auth Check| Middleware[JWT Security Middleware]
    Middleware -->|Prisma ORM Queries| Postgres[(PostgreSQL Database)]
    API -->|Aggregations & Filters| Postgres
    API -->|AI Prompts| Gemini[Google Gemini 2.5 AI Engine]
    API -->|CSV Stream| Client
```

---

## ⚡ Core Engineering Features

- 🔐 **Stateless Multi-Tenant JWT Authentication**: Secure user registration & login using `jsonwebtoken` and `bcryptjs` salted password hashing with route guard middleware.
- ⚡ **PostgreSQL & Prisma Analytics Aggregations**: High-performance database query grouping and transactional statistics for real-time category breakdowns, average transaction costs, and monthly spending trends.
- 🤖 **AI Financial Advisor (Google Gemini 2.5)**: Personalized spending habit analysis, budget anomaly detection, and actionable saving recommendations.
- 📊 **Interactive Analytics Dashboard**: Responsive category donut chart (Recharts), budget usage progress bars with threshold alerts, and date-range filters.
- 📥 **CSV Financial Report Exporter**: Streaming data exporter utilizing `json2csv` to generate spreadsheet reports for accounting and tax filing.
- 🐳 **Docker & Docker Compose Containerization**: Multi-stage Dockerfiles with Nginx web server for production assets and single-command orchestration (`docker-compose up`).
- 🔄 **Automated CI/CD Pipeline**: GitHub Actions workflow that executes backend syntax checks and verifies frontend production builds on every push/PR.

---

## 🔌 API Endpoint Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account & return JWT token |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/budget` | Private | Update user's target monthly budget |
| `GET` | `/api/expenses` | Private | Fetch transactions with search, category, & date filters |
| `POST` | `/api/expenses` | Private | Create new expense or income record |
| `PUT` | `/api/expenses/:id` | Private | Update transaction by ID |
| `DELETE` | `/api/expenses/:id` | Private | Delete transaction by ID |
| `GET` | `/api/analytics/summary` | Private | Fetch PostgreSQL Aggregation metrics (Category %, Monthly Trends) |
| `GET` | `/api/analytics/export/csv` | Private | Stream transactions as downloadable CSV file |
| `POST` | `/api/insight` | Private | Generate AI financial advisory insights via Gemini |

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js v18+](https://nodejs.org/)
- [PostgreSQL v14+](https://www.postgresql.org/) (or PostgreSQL Docker container)
- [Docker & Docker Compose](https://www.docker.com/) (Optional)

---

### Option A: Running with Docker Compose (Recommended)

1. **Clone Repository**:
   ```bash
   git clone https://github.com/AshokYadav186/expense-tracker.git
   cd expense-tracker
   ```

2. **Spin up Microservices Stack**:
   ```bash
   docker-compose up --build
   ```
   - **Frontend**: Access at `http://localhost:3000`
   - **Backend API**: Access at `http://localhost:5000`

---

### Option B: Running Locally

1. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `/backend`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public"
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Run Prisma Migrations:
   ```bash
   npm run db:migrate
   ```
   Start Backend:
   ```bash
   npm run dev
   ```

2. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Access application at `http://localhost:5173`.

---


## 👨‍💻 Author

**Ashok Yadav**
- GitHub: [https://github.com/AshokYadav186](https://github.com/AshokYadav186)
- Project: Smart Expense Tracker & AI Advisor
