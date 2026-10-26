# Leads Tracking App (API + Web)

A full-stack Leads Management and Tracking portal built with **Node.js, Express, SQLite, TypeScript, and React (Vite + Tailwind CSS)**.

This project was developed according to the **AgreeM Technologies** trial task specification.

---

## 🚀 Features

### Core Features (Must-Have)
- **Leads CRUD**:
  - Full management of leads (`id`, `name`, `email`, `phone`, `status`, `createdAt`).
  - Supported statuses: `new`, `contacted`, `qualified`, `lost`.
  - Cascading deletion: deleting a lead automatically deletes all associated notes.
- **Notes per Lead**:
  - Add multiple notes to each lead (`id`, `leadId`, `content`, `createdAt`).
  - Chronological timeline display on the lead detail page.
- **Web Portal (UI)**:
  - **Leads Overview**: Table with search by name/email, status filter dropdown, and pagination.
  - **Create Lead**: Interactive modal form with instant validation.
  - **Lead Details**: Status updater dropdown, delete lead action, and notes section with add note form.
- **Validation & Error Handling**:
  - Strict input validation via `express-validator`.
  - Proper HTTP status codes (`200`, `201`, `400`, `401`, `404`, `500`).
  - Handled edge cases: 404 on missing lead IDs for notes and updates, duplicate emails, invalid enum values.

### Bonus Features Implemented
- 🌟 **Pagination**: Offset and limit pagination with total count metadata on `GET /api/leads`.
- 🌟 **Authentication**: JWT-based auth stored in `httpOnly` cookies with `bcryptjs` password hashing and protected routes.
- 🌟 **Unit Tests (Jest)**: Automated route integration tests with Jest and Supertest (`npm test`).
- 🌟 **Database Seeding**: One-command seed script (`npm run seed`) creating test users, multi-status leads, and sample notes.
- 🌟 **Dockerfile**: Container configuration for running the backend.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js (v5), TypeScript, `better-sqlite3` (SQLite with WAL mode), JWT, bcryptjs, express-validator, Jest, Supertest.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (v4), Redux Toolkit, Axios, React Router.

---

## 📂 Project Structure

```
practical/
├── backend/
│   ├── db/
│   │   ├── schema.sql          # SQLite schema (users, leads, notes)
│   │   └── seed.ts             # Database seeder script
│   ├── src/
│   │   ├── config/             # DB & environment config
│   │   ├── controllers/        # auth and lead controllers
│   │   ├── middlewares/        # auth and error handling
│   │   ├── routes/             # lead and auth routers
│   │   ├── test/               # Jest unit tests
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # JWT helper functions
│   │   └── validator/          # express-validator schemas
│   ├── dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Redux store & AppRouter
│   │   ├── components/         # ProtectedRoute, UI components
│   │   ├── features/           # auth & leads slices, hooks, and API services
│   │   ├── layouts/            # AuthLayout & MainLayout (navbar)
│   │   ├── pages/              # Home, LeadDetails, Login, Register
│   │   └── types/              # Frontend TypeScript definitions
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure a `.env` file exists in the `backend/` directory with the following variables:
   ```env
   PORT=3000
   JWT_SECRET=supersecretjwtkey_for_crm_portal_agree_tech
   DATABASE_PATH=./db/crm.sqlite
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Seed the database** (populates demo user, sample leads, and notes):
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will be available at `http://localhost:3000`.*

6. **Run Unit Tests**:
   ```bash
   npm test
   ```

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The web application will open at `http://localhost:5173`.*

---

## 🔑 Demo Credentials

After running `npm run seed`, you can immediately sign in using:
- **Email**: `admin@crm.com`
- **Password**: `admin123`

*(You can also register a new account on the Register page).*

---

## 📡 API Reference & cURL Examples

All protected endpoints expect the authentication JWT cookie (`Cookie: token=<JWT>`). Log in first to obtain the cookie, or use the `curl -c cookies.txt` flag to persist the session.

### Authentication

#### 1. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

#### 2. Login (Saves cookie to `cookies.txt`)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@crm.com",
    "password": "admin123"
  }'
```

#### 3. Get Current User (`/me`)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

---

### Leads CRUD

#### 4. List Leads (with Search, Status Filter & Pagination)
```bash
# Get first 10 leads
curl -X GET "http://localhost:3000/api/leads" \
  -b cookies.txt

# Search by name or email
curl -X GET "http://localhost:3000/api/leads?search=John" \
  -b cookies.txt

# Filter by status and paginate
curl -X GET "http://localhost:3000/api/leads?status=new&offset=0" \
  -b cookies.txt
```

#### 5. Create a New Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Acme Innovations",
    "email": "contact@acme.org",
    "phone": "+1 555-0199",
    "status": "new"
  }'
```

#### 6. Get a Single Lead by ID
```bash
curl -X GET http://localhost:3000/api/leads/1 \
  -b cookies.txt
```

#### 7. Update Lead Status (PATCH)
```bash
curl -X PATCH http://localhost:3000/api/leads/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "qualified"
  }'
```

#### 8. Delete a Lead
```bash
curl -X DELETE http://localhost:3000/api/leads/1 \
  -b cookies.txt
```

---

### Notes

#### 9. Get Notes for a Specific Lead
```bash
curl -X GET http://localhost:3000/api/leads/2/notes \
  -b cookies.txt
```

#### 10. Add a Note to a Lead
```bash
curl -X POST http://localhost:3000/api/leads/2/notes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "Followed up via telephone. Client requested enterprise pricing tier."
  }'
```

---

## 🧪 Testing

The backend includes automated route testing with Jest and Supertest.

Run tests:
```bash
cd backend
npm test
```

Tests verify:
- Health check route response (`200 OK`).
- Authentication route guards (`401 Unauthorized` without token).
- Validation error handling (`400 Bad Request` on empty payload).
- 404 edge cases on non-existent lead IDs.

---

## 🐳 Docker (Optional)

You can build and run the backend container:

```bash
cd backend
docker build -t leads-backend .
docker run -p 3000:3000 leads-backend
```
