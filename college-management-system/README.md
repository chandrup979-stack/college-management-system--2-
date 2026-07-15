# Smart College Management System

Full-stack MERN project (MongoDB, Express, React, Node.js).

## Folder Structure

```
college-management-system/
├── backend/          # Node.js + Express + MongoDB (Mongoose)
│   ├── config/        # DB connection
│   ├── models/         # All 12 Mongoose schemas
│   ├── controllers/    # Business logic (auth done, more to add per module)
│   ├── routes/          # API routes (auth done, more to add per module)
│   ├── middleware/    # JWT auth + role-based access control
│   └── server.js       # Entry point
└── frontend/         # React + Vite + Tailwind CSS
    └── src/
        ├── pages/       # Login, Dashboard (add more per module)
        ├── components/  # ProtectedRoute, and reusable UI pieces
        ├── context/     # AuthContext (global login state)
        └── services/    # Axios API instance
```

## How to Run

### 1. Backend

```
cd backend
npm install
copy .env.example .env      (Windows)   OR   cp .env.example .env   (Mac/Linux)
```

Edit `.env` if needed — the default `MONGO_URI` (`mongodb://localhost:27017/college_management`) will work with your local MongoDB Compass connection.

```
npm run dev
```

Server runs at: `http://localhost:5000`

### 2. Frontend

Open a **second terminal**:

```
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

## What's Already Working

- All 12 database models (User, Student, Faculty, Department, Course, Subject, Timetable, Attendance, Marks, Assignment, LeaveRequest, Announcement)
- Full authentication: register, login, JWT tokens, password hashing (bcrypt), role-based route protection
- Frontend login page + protected dashboard + AuthContext for global session state

## Next Steps (per your build plan)

1. Test authentication end-to-end (register a user via Postman/Thunder Client, then log in from the frontend)
2. Build modules one by one, e.g. User Management → Attendance → Marks → Assignments → Leave → Timetable → Notice Board → Dashboard charts
   - For each module: add a Mongoose-based route + controller in `backend/`, then a matching page in `frontend/src/pages/`
