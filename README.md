# 🚀 NestJS Task Manager API

A production-ready REST API built with **NestJS**, **Prisma ORM**, and **PostgreSQL**, fully containerized with **Docker**.

This application provides a robust backend for managing users and tasks, featuring secure authentication (JWT), refresh tokens, and Role-Based Access Control (RBAC).

---

## ✨ Features

- **🔐 Authentication & Security**

  - User Registration & Login
  - JWT Access & Refresh Tokens
  - Password Hashing (Bcrypt)
  - Protected Routes (Guards)

- **👤 Role-Based Access Control (RBAC)**

  - Roles: `USER` and `ADMIN`
  - Granular permission handling (e.g., only Admins can delete certain tasks)

- **📝 Task Management**

  - Create, Read, Update, and Delete tasks
  - Pagination support
  - User-specific data isolation

- **🛠️ Tech Stack**
  - **Framework**: [NestJS](https://nestjs.com/)
  - **Database**: PostgreSQL
  - **ORM**: [Prisma](https://www.prisma.io/)
  - **Containerization**: Docker & Docker Compose
  - **Language**: TypeScript

---

## 🛠️ Prerequisites

Before running this project, ensure you have the following installed:

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Required for the database)
- **[Node.js](https://nodejs.org/en/)** (v18+ recommended)
- **npm** or **yarn**

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/ssantoshhhhh/prisma-docker.git
cd prisma-docker/task-manager
```

### 2. Environment Configuration

Create a `.env` file in the `task-manager` directory. You can use the example provided:

```bash
cp .env.example .env
```

Ensure your `.env` contains the following variables (adjust as needed for your Docker setup):

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

# JWT Secrets (Change these for production!)
JWT_SECRET="YOUR_ACCESS_SECRET_KEY"
JWT_REFRESH_SECRET="YOUR_REFRESH_SECRET_KEY"
```

### 3. Spin Up the Database (Docker)

Start the PostgreSQL container using Docker Compose:

```bash
docker-compose up -d
```

Check if the container is running:

```bash
docker ps
```

### 4. Setup Prisma

Run the migrations to create tables in your Database:

```bash
npx prisma migrate dev
```

Generate the Prisma Client types:

```bash
npx prisma generate
```

### 5. Run the Application

**Development Mode:**

```bash
npm run start:dev
```

**Production Mode:**

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000` (or the port specified in your env).

---

## 📡 API Endpoints

Here is a quick overview of the available API routes.

### **Authentication** (`/auth`)

| Method | Endpoint         | Description             | Body                        |
| :----- | :--------------- | :---------------------- | :-------------------------- |
| `POST` | `/auth/register` | Register a new user     | `{ email, password, name }` |
| `POST` | `/auth/login`    | Login user & get tokens | `{ email, password }`       |
| `POST` | `/auth/refresh`  | Refresh access token    | `{ refreshToken }`          |

### **Tasks** (`/tasks`)

| Method   | Endpoint     | Description                | Protected      |
| :------- | :----------- | :------------------------- | :------------- |
| `GET`    | `/tasks`     | Get all tasks (Paginated)  | ✅ Yes         |
| `POST`   | `/tasks`     | Create a new task          | ✅ Yes         |
| `GET`    | `/tasks/:id` | Get specific task details  | ✅ Yes         |
| `PATCH`  | `/tasks/:id` | Update a task              | ✅ Yes         |
| `DELETE` | `/tasks/:id` | Delete a task (Admin Only) | ✅ Yes (Admin) |

---

## 🏗️ Project Structure

```
prisma-docker/
├── task-manager/
│   ├── src/
│   │   ├── auth/          # Authentication logic (Guards, Strategies, Service)
│   │   ├── tasks/         # Task modules (Controller, Service, DTOs)
│   │   ├── users/         # User management
│   │   ├── prisma/        # Database connection service
│   │   └── main.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema definition
│   ├── docker-compose.yml # Docker configuration
│   └── Dockerfile         # App containerization
└── README.md              # Project documentation
```

---

## 🔍 Prisma Studio

To view and manage your data in a GUI:

```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555`.

---

## 🧪 Testing

This project includes a comprehensive test suite using Jest.

### Unit Tests

Run unit tests for individual components:

```bash
npm run test
```

### End-to-End (E2E) Tests

Run integration tests to verify the entire flow:

```bash
npm run test:e2e
```

### Test Coverage

Generate a code coverage report:

```bash
npm run test:cov
```

---

**Happy Coding! 🚀**
