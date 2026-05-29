# lyceeDZ — Development Roadmap

## Phase 1 — Foundation

### Backend

| Task | Details |
|---|---|
| **Refresh tokens** | Add a `/refresh` endpoint that issues a new short-lived access token from a long-lived refresh token. Store refresh tokens in the DB or an httpOnly cookie. |
| **Password reset** | Email-based reset flow: generate a one-time token, send via Nodemailer, validate and allow new password on a `/reset-password` endpoint. |
| **Card upload on register** | During registration, accept a card image (student ID or teacher card) as a `multipart/form-data` upload. Upload the file to **Supabase Storage** (bucket: `id-cards`), then store the returned public URL in `users.card_url` in MySQL. Use `multer` for the file buffer on the Express side. |

### Frontend

| Task | Details |
|---|---|
| **Project scaffold** | Init with Vite + React. Install React Router v6 and Axios. Set up folder structure: `pages/`, `components/`, `services/`, `context/`. |
| **Auth context + token storage** | Create an `AuthContext` storing the JWT in memory (or httpOnly cookie). Add an Axios request interceptor to attach `Authorization: Bearer <token>` automatically. |
| **Login / Register pages** | Build controlled forms with client-side validation feedback (inline error messages, disabled submit while loading). Registration form must include a file input for the ID/teacher card (`accept="image/*"`), with a preview before submit. |
| **Pending approval screen** | After successful registration, show a "your account is pending admin approval" holding screen instead of logging the user in. Block access to the app until `status === 'approved'`. |
| **Protected routes** | Wrap private routes in a `<ProtectedRoute>` component that redirects to `/login` if no valid token is present. |

---

## Phase 2 — Core Features

### Backend

| Task | Details |
|---|---|
| **Admin approval endpoints** | Add `GET /api/admin/pending` (list users with `status = 'pending'`, includes `card_url`), `PUT /api/admin/approve/:id`, and `PUT /api/admin/reject/:id`. All three locked to `admin` role via `roleMiddleware`. The login endpoint must reject users whose `status` is not `'approved'` with a clear 403 message. |
| **Pagination + search** | Add `?page=&limit=&name=` query params to `GET /api/students`. Use `LIMIT`/`OFFSET` and a `LIKE` filter in the MySQL query. |
| **Grades / subjects tables** | Design and create new tables: `subjects`, `grades` (with FKs to `students` and `subjects`). Add full CRUD routes. |
| **Classes / teachers CRUD** | Add `classes` and `teachers` tables. A class belongs to a teacher and contains students. Build routes, controllers, and services following the existing layered pattern. |
| **Error handling + logging** | Add a global error-handling middleware (4-argument Express middleware). Add `morgan` for HTTP request logging in development. |

### Frontend

| Task | Details |
|---|---|
| **Admin approval page** | A dedicated page listing all `pending` users. Each row shows the user's name, role, registration date, and an **inline card image viewer** (click to enlarge the Supabase-hosted image). Approve / Reject buttons call the respective API endpoints and update the row status in place. |
| **Students list page** | Fetch and display students in a table. Include a search bar (debounced input), column sorting, and pagination controls. |
| **Add / edit student modal** | A modal form for creating and updating students. On submit, call the relevant API endpoint and refresh the list. |
| **Role-based UI** | Read `role` from the auth context. Conditionally render the delete button and admin-only nav links based on the user's role. |
| **Admin dashboard** | A stats overview page showing total students, total users, and recent activity using metric cards. |

---

## Phase 3 — Polish

### Backend

| Task | Details |
|---|---|
| **Rate limiting** | Add `express-rate-limit` to the `/api/users/login` and `/api/users/register` routes to prevent brute-force attacks. |
| **CSV / PDF export** | Add a `GET /api/students/export` endpoint that streams a CSV (or PDF via `pdfkit`) of the full student list. |
| **Unit + integration tests** | Write tests with Jest and Supertest. Cover: register, login, auth middleware rejection, role gating, and student CRUD. |

### Frontend

| Task | Details |
|---|---|
| **Toast notifications** | Show success/error toasts on every API action (student added, update failed, etc.) using `react-hot-toast` or a custom context. |
| **Dark mode** | Add a CSS variable-based theme toggle. Persist preference in `localStorage`. |
| **Deployment** | Deploy the frontend to Vercel and the Express API to Railway (or Render). Use `.env` for all environment-specific config. |

---

## Tech Stack Summary

| Layer | Stack |
|---|---|
| Runtime | Node.js + Express |
| Database | MySQL (mysql2) |
| File storage | Supabase Storage (ID card images) |
| Auth | bcryptjs + jsonwebtoken |
| File upload | multer (buffer → Supabase) |
| Validation | express-validator |
| Frontend | React + Vite |
| Routing | React Router v6 |
| HTTP client | Axios |
| Testing | Jest + Supertest |
| Deployment | Vercel (FE) + Railway (BE) |