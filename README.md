# 🚀 DevCollab – Developer Teaming & Open Task Marketplace

[![CS3301 Full Stack Development](https://img.shields.io/badge/Course-CS3301%20Full%20Stack-blue)](https://github.com/)
[![Stack-MERN](https://img.shields.io/badge/Stack-MERN-success)](https://reactjs.org/)
[![Deployment-Vercel%20%2B%20Render](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-orange)](https://render.com/)

**DevCollab** is a modern full-stack MERN application that connects student developers, open-source creators, and designers to form agile teams, post projects, apply to vacant roles, and track project tasks in a single collaborative workspace.

---

## 👥 Project Team (RV University • CS3301)
| Name | USN | Core Responsibility |
| :--- | :--- | :--- |
| **Abhimanyu Kotari (Lead)** | [Your USN] | React UI Architecture, Client Routing & Component State |
| **Team Member 2** | [Member 2 USN] | Express.js REST APIs, Middleware & Controller Logic |
| **Team Member 3** | [Member 3 USN] | MongoDB Database, Mongoose Schemas & JWT/Bcrypt Auth |

---

## 🛠️ Complete Tech Stack (Modules 1 – 5)

* **Frontend:** React 18, Vite, React Router v6, Axios, Context API, CSS3 (Flexbox & Grid)
* **Backend:** Node.js, Express.js REST API, Morgan Logger, Helmet Security, CORS, Dotenv
* **Database:** MongoDB Atlas, Mongoose ODM
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt.js (10 salt rounds)
* **Testing:** Jest, Supertest, Cypress
* **Deployment:** Vercel (Frontend SPA), Render (Backend Web Service), MongoDB Atlas (Database)

---

## 📁 Repository Directory Structure

```
DevCollab/
├── client/                           # React + Vite Frontend (Module 2 & 5)
│   ├── public/
│   ├── src/
│   │   ├── components/               # Navbar, Hero, ProjectExplorer, ApplyModal, Features, Footer
│   │   ├── App.jsx                   # Main Landing Page entrypoint
│   │   ├── index.css                 # Custom glassmorphism & responsive CSS
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                           # Express + Node.js Backend (Module 3 & 4)
│   ├── .env.example                  # Environment variables template
│   ├── server.js                     # Express app setup and middleware pipeline
│   └── package.json
│
├── docs/                             # Phase 1 Documentation & Diagrams
│   ├── DevCollab_FullStack_Phase1_Presentation.pptx
│   ├── system_architecture.png
│   ├── database_schema.png
│   ├── user_flow.png
│   └── ui_wireframes.png
└── README.md
```

---

## 🔑 REST API Endpoints Overview

| HTTP Method | Endpoint | Access Level | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new developer account | `201 Created` |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT | `200 OK` |
| `GET` | `/api/projects` | Public | Retrieve list of all open projects | `200 OK` |
| `GET` | `/api/projects/:id` | Public | Retrieve single project details | `200 OK` |
| `POST` | `/api/projects` | Protected | Create a new project post | `201 Created` |
| `PUT` | `/api/projects/:id` | Protected (Owner) | Update project info/roles | `200 OK` |
| `DELETE`| `/api/projects/:id` | Protected (Owner) | Delete a project post | `200 OK` |
| `POST` | `/api/applications` | Protected | Apply to an open project role | `201 Created` |
| `PUT` | `/api/applications/:id`| Protected (Owner) | Accept or reject an application | `200 OK` |

---

## ⚙️ Quick Start (Running the Landing Page)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/abhimanyu-kotari/-DevCollab-Modern-Developer-Teaming-Open-Source-Task-Marketplace.git
   cd -DevCollab-Modern-Developer-Teaming-Open-Source-Task-Marketplace/client
   ```

2. **Install & Run Frontend:**
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` to see the live Landing Page!

---

## 📌 Project Milestones
- [x] **Phase I (CIE-1):** Ideation, Requirements, System Architecture, Mongoose Schemas, UI Wireframes & Landing Page Scaffold.
- [ ] **Phase II (Module 2 Deliverables):** React UI Scaffolding, Navigation, Routing, State Management.
- [ ] **Phase III (Module 3 Deliverables):** Express REST APIs with CRUD, Postman Collection.
- [ ] **Phase IV (Module 4 Deliverables):** MongoDB Atlas Integration, Bcrypt Hashing, JWT Protected Routes.
- [ ] **Phase V (Module 5 Deliverables):** Full Stack Integration, Jest/Supertest Suite, Vercel/Render Cloud Deployment.
