# lyceeDZ — UML Diagrams
---
## 1. Database Diagram (ERD)

```mermaid
erDiagram
    USERS {
        int id PK
        varchar name
        varchar email UK
        int age
        varchar password
        enum role "student | teacher | admin"
        enum status "pending | approved | rejected"
        varchar card_url
        timestamp createdAt
    }

    REFRESH_TOKENS {
        int id PK
        int user_id FK
        varchar token UK
        timestamp expiresAt
        timestamp createdAt
    }

    PASSWORD_RESET_TOKENS {
        int id PK
        int user_id FK
        varchar token UK
        boolean used
        timestamp expiresAt
        timestamp createdAt
    }

    STUDENTS {
        int id PK
        int user_id FK
        varchar name
        int age
        timestamp createdAt
        timestamp updatedAt
    }

    TEACHERS {
        int id PK
        int user_id FK
        varchar name
        varchar specialty
        timestamp createdAt
    }

    CLASSES {
        int id PK
        int teacher_id FK
        varchar name
        enum level "values defined at build time"
        timestamp createdAt
    }

    CLASS_STUDENTS {
        int class_id FK
        int student_id FK
    }

    SUBJECTS {
        int id PK
        varchar name
        varchar description
        timestamp createdAt
    }

    LEVEL_SUBJECTS {
        enum level FK
        int subject_id FK
    }

    GRADES {
        int id PK
        int student_id FK
        int subject_id FK
        decimal value
        timestamp recordedAt
    }

    USERS ||--o| STUDENTS : "has profile"
    USERS ||--o| TEACHERS : "has profile"
    USERS ||--o{ REFRESH_TOKENS : "owns"
    USERS ||--o{ PASSWORD_RESET_TOKENS : "requests"
    TEACHERS ||--o{ CLASSES : "teaches"
    CLASSES ||--o{ CLASS_STUDENTS : "contains"
    STUDENTS ||--o{ CLASS_STUDENTS : "enrolled in"
    STUDENTS ||--o{ GRADES : "receives"
    SUBJECTS ||--o{ GRADES : "assessed by"
    SUBJECTS ||--o{ LEVEL_SUBJECTS : "assigned to"
    CLASSES }o--o{ LEVEL_SUBJECTS : "level determines subjects"
```

---

## 2. Use Case Diagrams

### 2.1 — Authentication

```mermaid
graph LR
    Guest([Guest])
    User([Student / Teacher])

    Guest --> UC1[Register + Upload ID Card]
    Guest --> UC2[Login]
    Guest --> UC3[Request Password Reset]
    User  --> UC4[Reset Password via Email]
    User  --> UC5[Refresh Access Token]
```

---

### 2.2 — Admin Panel

```mermaid
graph LR
    Admin([Admin])

    Admin --> UC1[View Pending Users]
    Admin --> UC2[Approve User]
    Admin --> UC3[Reject User]
    Admin --> UC4[View Dashboard Stats]
```

---

### 2.3 — Student Management

```mermaid
graph LR
    Teacher([Teacher])
    Admin([Admin])

    Teacher --> UC1[View Students]
    Teacher --> UC2[Add Student]
    Teacher --> UC3[Edit Student]

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4[Delete Student]
    Admin --> UC5[Export CSV / PDF]
```

---

### 2.4 — Grades & Classes

```mermaid
graph LR
    Student([Student])
    Teacher([Teacher])
    Admin([Admin])

    Student --> UC1[View Subjects]
    Student --> UC2[View My Grades]

    Teacher --> UC1
    Teacher --> UC2
    Teacher --> UC3[Manage Grades]
    Teacher --> UC4[View Classes]

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5[Manage Classes]
```

---

## 3. Sequence Diagrams

### 3.1 — Registration with ID Card Upload

```mermaid
sequenceDiagram
    actor Client
    participant Router as Express Router
    participant Multer as multer
    participant Service as userService
    participant Supabase as Supabase Storage
    participant DB as MySQL

    Client->>Router: POST /api/users/register [multipart/form-data]
    Router->>Multer: parse file buffer
    Multer-->>Router: req.file, req.body
    Router->>Service: registerUser(data, fileBuffer)
    Service->>DB: SELECT * FROM users WHERE email = ?
    DB-->>Service: empty
    Service->>Supabase: upload(buffer) → bucket: id-cards
    Supabase-->>Service: publicUrl
    Service->>Service: bcrypt.hash(password)
    Service->>DB: INSERT INTO users (..., card_url, status='pending')
    DB-->>Service: insertId
    Service-->>Router: { userId }
    Router-->>Client: 201 Created — pending admin approval
```

---

### 3.2 — Login & JWT Issuance

```mermaid
sequenceDiagram
    actor Client
    participant Router as Express Router
    participant Service as userService
    participant DB as MySQL

    Client->>Router: POST /api/users/login { email, password }
    Router->>Service: loginUser(email, password)
    Service->>DB: SELECT * FROM users WHERE email = ?
    DB-->>Service: user row

    alt status != approved
        Service-->>Router: 403 Account not approved
        Router-->>Client: 403 Forbidden
    else password invalid
        Service->>Service: bcrypt.compare → false
        Router-->>Client: 401 Unauthorized
    else valid
        Service->>Service: jwt.sign({ id, role })
        Service-->>Router: { accessToken, refreshToken }
        Router-->>Client: 200 OK { accessToken, refreshToken }
    end
```

---

### 3.3 — Authenticated Request with Role Guard

```mermaid
sequenceDiagram
    actor Client
    participant Auth as authMiddleware
    participant Role as roleMiddleware
    participant Service as studentService
    participant DB as MySQL

    Client->>Auth: GET /api/students/ [Bearer token]
    alt token invalid
        Auth-->>Client: 401 Unauthorized
    else token valid
        Auth->>Role: req.user = { id, role }
        alt role not permitted
            Role-->>Client: 403 Forbidden
        else permitted
            Role->>Service: getAllStudents()
            Service->>DB: SELECT * FROM students
            DB-->>Service: rows[]
            Service-->>Client: 200 OK { students[] }
        end
    end
```

---

### 3.4 — Admin Approval Flow

```mermaid
sequenceDiagram
    actor Admin
    participant Router as Express Router
    participant Service as adminService
    participant DB as MySQL

    Admin->>Router: GET /api/admin/pending [Bearer token]
    Router->>Service: listPending()
    Service->>DB: SELECT * FROM users WHERE status = 'pending'
    DB-->>Service: users[]
    Service-->>Admin: 200 OK { users[] with card_url }

    Admin->>Router: PUT /api/admin/approve/:id [Bearer token]
    Router->>Service: updateStatus(userId, 'approved')
    Service->>DB: UPDATE users SET status='approved' WHERE id=?
    DB-->>Service: OK
    Service-->>Admin: 200 OK — User approved
```

---

### 3.5 — Password Reset Flow

```mermaid
sequenceDiagram
    actor Client
    participant Router as Express Router
    participant Service as userService
    participant DB as MySQL
    participant Mail as Nodemailer

    Client->>Router: POST /api/users/forgot-password { email }
    Router->>Service: initiateReset(email)
    Service->>DB: SELECT user WHERE email = ?
    Service->>Service: crypto.randomBytes() → token
    Service->>DB: INSERT INTO password_reset_tokens
    Service->>Mail: sendMail(resetLink)
    Mail-->>Client: Email with reset link
    Router-->>Client: 200 OK — Email sent

    Client->>Router: POST /api/users/reset-password { token, newPassword }
    Router->>Service: resetPassword(token, newPassword)
    Service->>DB: SELECT token WHERE valid & not expired
    Service->>Service: bcrypt.hash(newPassword)
    Service->>DB: UPDATE users SET password
    Service->>DB: UPDATE token SET used=true
    Router-->>Client: 200 OK — Password reset
```

---

### 3.6 — Token Refresh Flow

```mermaid
sequenceDiagram
    actor Client
    participant Router as Express Router
    participant Service as userService
    participant DB as MySQL

    Client->>Router: POST /api/users/refresh { refreshToken }
    Router->>Service: refreshAccessToken(token)
    Service->>DB: SELECT * FROM refresh_tokens WHERE token=? AND expiresAt > NOW()
    DB-->>Service: token row

    alt not found or expired
        Service-->>Client: 401 Unauthorized
    else valid
        Service->>Service: jwt.sign({ id, role }) → new accessToken
        Service-->>Client: 200 OK { accessToken }
    end
```

---
