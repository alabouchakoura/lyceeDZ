# lyceeDZ

High School Management Backend System built with Node.js, Express, and MySQL.

## Overview

This project is a RESTful backend API for a high school management system. It follows a layered architecture (Routes -> Controllers -> Services) for better maintainability and separation of concerns. The system handles user authentication, role-based access control (RBAC), and basic CRUD operations for students and users.

## Project Structure

- **`config/`**: Contains configuration files, specifically the MySQL database connection pool (`db.js`).
- **`controllers/`**: Handles incoming HTTP requests, reading payloads, mapping them to service calls, and returning responses (`userController.js`, `studentController.js`).
- **`middleware/`**: Functions intercepting the request pipeline. Contains authentication logic (`authMiddleware.js`) and role-based authorization rules (`roleMiddleware.js`).
- **`models/`**: SQL scripts detailing the database schema design (`students.sql`, `users.sql`).
- **`routes/`**: Translates and maps URI endpoints to controller methods and applies route-specific middleware (`userRoutes.js`, `studentRoutes.js`).
- **`services/`**: The Core layer encapsulating business logic and performing direct database queries (`userService.js`, `studentService.js`).

## Core Technologies & Dependencies

As listed in `package.json`:
- **Express (`express`)**: The core web framework running the application.
- **MySQL2 (`mysql2`)**: Database driver featuring native Promise support for async/await interactions.
- **Bcrypt (`bcryptjs`)**: Employed for secure, one-way password hashing and comparison.
- **JSON Web Tokens (`jsonwebtoken`)**: Generates verifiable tokens to handle stateless authentication.
- **Dotenv (`dotenv`)**: Securely loads environment variables from a `.env` file.
- **Nodemon (`nodemon`)**: Utility tool ensuring auto-restarting of the node server during active development.

## Database Schema

Defined in the `models/` folder. It contains two main entities: `users` and `students`.

### Users Table (`models/users.sql`)
```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Students Table (`models/students.sql`)
```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication & Users (`/api/users`)
- `POST /api/users/register`: Registers a new user. Automatically hashes the provided password and creates a subsequent student record mapping. 
- `POST /api/users/login`: Authenticates an existing user and returns a JSON Web Token (JWT) identifying the user's `id` and `role`.

### Students (`/api/students`)
Accessing these endpoints requires an Authorization header containing a valid JWT (`Bearer <token>`).

- `GET /api/students/`: Fetches all students. (Allowed Roles: `teacher`, `admin`)
- `POST /api/students/add`: Adds a new student record manually. (Allowed Roles: `teacher`, `admin`)
- `PUT /api/students/update/:id`: Updates an existing student by ID. (Allowed Roles: `teacher`, `admin`)
- `DELETE /api/students/:id`: Removes a student from the database. (Allowed Roles: `admin` ONLY)

## Middlewares

- **`authMiddleware`**: Verifies the JWT provided in the HTTP Authorization header. If the token is valid, it decodes it and attaches the payload (`id`, `role`) to the `req.user` object to be processed downstream.
- **`roleMiddleware`**: Acts as an Authorization gatekeeper. Used sequentially after validating the user through `authMiddleware`, it verifys if `req.user.role` matches the expected permissions dynamically passed to it (e.g., `allowRoles('admin')`).

## Getting Started

1. Clone the repository locally.
2. Run `npm install` to install all necessary dependencies.
3. Establish your MySQL database credentials by creating a `.env` file at the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=lyceedz_database
PORT=3000
```
4. Access your MySQL environment and execute the SQL structure scripts located in `models/users.sql` and `models/students.sql` to provision the necessary application tables.
5. Run `npm run dev` to boot the local development server (listening on the port provided in the `.env` file).
