# 🚀 Collaborative Task Manager

A production-ready, full-stack Task Management application featuring real-time collaboration, secure authentication, and a responsive modern UI. Built to streamline team workflows with instant updates using WebSockets.

## 🔗 Live Demo
* **Application:** https://task-manager-app-ejts.onrender.com

---

## ✨ Key Features
* **⚡ Real-Time Collaboration:** Task updates are reflected instantly across all connected clients using Socket.io.
* **🔐 Secure Authentication:** Complete JWT-based auth system with secure cookie storage and Bcrypt.
* **📝 Smart Task Management:** Create, assign, and organize tasks with Priorities, Due Dates, and Status tags.
* **👥 Team Assignment:** Dynamically assign tasks to other registered users.
* **📱 Fully Responsive:** Mobile-first design featuring adaptive layouts.
* **🛡️ Data Validation:** Robust validation using Zod.
* **👤 User Profile:** Manage profile updates and account deletion.

---

## 🛠️ Tech Stack
* **Frontend:** React (Vite), TypeScript, Tailwind CSS, React Query.
* **Backend:** Node.js, Express.js, TypeScript.
* **Database:** PostgreSQL (Neon Serverless), Prisma ORM.
* **Real-time:** Socket.io.

---

## 💻 Local Setup

1. **Clone the Repository**
   git clone https://github.com/GamerBhushan/task-manager-app-fullstack.git

2. **Backend Setup**
   cd server
   npm install
   npx prisma generate
   npm run dev

3. **Frontend Setup**
   cd client
   npm install
   npm run dev

---

## 👤 Author
**Bhushan Kumavat**
* [GitHub](https://github.com/GamerBhushan)
* [LinkedIn](https://www.linkedin.com/in/bhushankumavat/)