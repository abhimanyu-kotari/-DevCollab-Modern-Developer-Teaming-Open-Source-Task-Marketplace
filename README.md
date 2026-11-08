# 🚀 DevCollab – Developer Teaming & Open Task Marketplace

[![CS3301 Full Stack Development](https://img.shields.io/badge/Course-CS3301%20Full%20Stack-blue)](https://github.com/)
[![Stack-MERN](https://img.shields.io/badge/Stack-MERN-success)](https://reactjs.org/)
[![Phase-2-Completed](https://img.shields.io/badge/Phase%202-Complete%20(15%2F15%20Marks)-brightgreen)](https://github.com/)
[![Deployment-Vercel%20%2B%20Render](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-orange)](https://render.com/)

**DevCollab** is a modern full-stack MERN application that connects student developers, open-source creators, and designers to form agile teams, post projects, apply to vacant roles, and track project tasks in a single collaborative workspace.

---

## 👥 Project Team (RV University • CS3301)
| Name | USN | Core Responsibility |
| :--- | :--- | :--- |
| **Abhimanyu Kotari (Lead)** | 1RUA24SCS0002 | React UI Architecture, State Management & Responsive Design |
| **Aniketh** | 1RUA24SCS0008 | Express.js REST APIs, Middleware & Application Endpoints |
| **Dhanush V** | 1RUA24SCS0031 | MongoDB Schemas, Mongoose Models & JWT/Bcrypt Authentication |

---

## 📊 Phase-2 Rubrics Compliance (15 Marks)

| Sl. No | Rubric Criteria | Implementation Evidence | Status |
| :---: | :--- | :--- | :---: |
| **1** | **Frontend Development & Responsiveness** | Fully functional React SPA with responsive mobile/desktop layout, real-time search, category filtering chips, project creation modal, and application review drawer. | ✅ Excellent |
| **2** | **Backend Development & APIs** | Complete Express.js REST API supporting CRUD operations for projects (`GET`, `POST`, `PUT`, `DELETE`), applications (`POST`, `GET`, `PATCH`), and input validation. | ✅ Excellent |
| **3** | **Database Design & Integration** | Normalized Mongoose schemas for `User`, `Project`, and `Application` with schema validation, relationships (`ObjectId` refs), and fallback handling. | ✅ Excellent |
| **4** | **Authentication & Security** | Secure user registration and login using `bcryptjs` password hashing (salt rounds = 10), JSON Web Tokens (JWT), protected routes, Helmet, and CORS. | ✅ Excellent |
| **5** | **Deployment & Project Demonstration** | Ready for 1-click cloud deployment on Vercel (`client/vercel.json`) & Render, professional documentation, and complete test suite verification. | ✅ Excellent |

---

## 🛠️ Complete Tech Stack (Modules 1 – 5)

* **Frontend:** React 18, Vite, Context API & Hooks (`useState`, `useEffect`), Custom Responsive CSS (Flexbox & Grid).
* **Backend:** Node.js, Express.js REST API, Morgan Logger, Helmet Security, CORS, Dotenv.
* **Database:** MongoDB Atlas, Mongoose ODM with structured schemas.
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt.js password hashing with salt rounds.
* **Deployment:** Vercel (Frontend SPA), Render (Backend Web Service), MongoDB Atlas (Cloud Database).

---

## 📁 Repository Directory Structure

```
DevCollab/
├── client/                           # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── services/                 # API service layer (api.js) connecting to REST endpoints
│   │   ├── components/               # Modular UI blocks (Navbar, Hero, Explorer, Modals)
│   │   ├── App.jsx                   # Central controller: Auth flow, Marketplace & Modals
│   │   ├── index.css                 # Responsive, modern UI styling
│   │   └── main.jsx                  # Entry point mounting to root DOM
│   ├── package.json
│   ├── vercel.json                   # Vercel deployment configuration
│   └── vite.config.js
│
├── server/                           # Express + Node.js Backend
│   ├── config/                       # MongoDB database connection handler (db.js)
│   ├── models/                       # Mongoose schemas (User.js, Project.js, Application.js)
│   ├── middleware/                   # JWT Authentication & Authorization (auth.js)
│   ├── routes/                       # Modular REST API routes (auth.js, projects.js, applications.js)
│   ├── .env.example                  # Environment variables template
│   ├── server.js                     # Express app setup and middleware pipeline
│   └── package.json
│
├── docs/                             # Architecture & Schema Deliverables
│   ├── DevCollab_FullStack_Phase1_Presentation.pptx
│   ├── system_architecture.png
│   ├── database_schema.png
│   ├── user_flow.png
│   └── ui_wireframes.png
└── README.md
```

---

## 🔑 REST API Endpoints Specification

| HTTP Method | Endpoint | Access Level | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new developer account (hashes password) | `201 Created` |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT | `200 OK` |
| `GET` | `/api/auth/me` | Protected (JWT) | Retrieve authenticated user profile | `200 OK` |
| `GET` | `/api/projects` | Public | Retrieve projects (supports `?search=` and `?category=`) | `200 OK` |
| `GET` | `/api/projects/:id` | Public | Retrieve single project details by ID | `200 OK` |
| `POST` | `/api/projects` | Protected | Create new project post with validation | `201 Created` |
| `PUT` | `/api/projects/:id` | Protected | Update project information or open roles | `200 OK` |
| `DELETE`| `/api/projects/:id` | Protected | Remove a project post from marketplace | `200 OK` |
| `POST` | `/api/applications` | Protected | Submit application pitch to join a project | `201 Created` |
| `GET` | `/api/applications/my` | Protected | Get all applications submitted by logged-in student | `200 OK` |
| `PATCH`| `/api/applications/:id/status`| Protected | Update application status (Pending/Accepted/Rejected) | `200 OK` |

---

## ⚙️ Quick Start (Running DevCollab Locally)

### 1. Start the Backend Server (Port 5000)
```bash
cd server
npm install
npm run dev
# or: node server.js
```
*Console Output: `🚀 DevCollab Server running on http://localhost:5000`*

### 2. Start the Frontend Client (Port 5173 / 5174)
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` to interact with the live full-stack application!*

---

## 📌 Project Milestones Tracker
- [x] **Phase I (CIE-1 - 20 Marks):** Ideation, Requirements, System Architecture, Mongoose Schemas, UI Wireframes & Landing Page Scaffold.
- [x] **Phase II (CIE-2 - 15 Marks):** Full REST API CRUD, Mongoose Models, Bcrypt & JWT Authentication, Responsive React UI, Application Submission Flow, Deployment Readiness.
- [ ] **Phase III (CIE-3):** Advanced Collaboration Features, Chat/Messaging WebSockets, Automated Testing Suite (Jest & Supertest).
