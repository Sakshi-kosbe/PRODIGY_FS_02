# Employee Management System (EMS)

![Status](https://img.shields.io/badge/status-active-success)
![Security](https://img.shields.io/badge/security-RLS%20enabled-brightgreen)

A **secure, professional Employee Management System** designed to help organizations manage employee records with **strong authentication, role-based access control, and enterprise-grade database security**.

This project focuses heavily on **data privacy and protection**, ensuring sensitive employee information is accessible **only to authorized administrators**.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure user authentication
* Role-based access control (Admin / User)
* Admin-only protected routes

### 👨‍💼 Employee Management (Admin Only)

* Create employee records
* View employee details
* Update employee information
* Delete employee records
* Search and filter employees

### 🛡️ Security First Design

* Row Level Security (RLS) enforced at database level
* Admin-only SELECT access for sensitive tables
* Forced RLS to prevent policy bypass
* Protection against privilege escalation attacks
* Input validation and sanitization

### 📊 Dashboard

* Total employees overview
* Active vs inactive employees
* Department-wise summary

---

## 🗂️ Tech Stack

**Frontend**

* React
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* PostgreSQL (Supabase compatible)
* Row Level Security (RLS)

**Authentication**

* JWT / Supabase Auth
* Secure password hashing

---

## 🧱 Database Security Model

### 🔒 Employees Table

* Contains sensitive personal data (email, phone number)
* RLS enabled and **forced**
* Only admins can read data
* No permissive or fallback policies

### 🔑 User Roles Table

* Controls admin access
* RLS enabled and forced
* Only existing admins can view or modify roles
* Prevents privilege escalation

---

## 📁 Project Structure

```
employee-management-system/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── database/
│   ├── schema.sql
│   └── policies.sql
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sakshi-kosbe/PRODIGY_FS_02.git
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application

```bash
npm run dev
```

---

## 🔍 Security Highlights

* No public access to employee data
* No authenticated user access without admin role
* Database-level enforcement (not frontend-only)
* Safe against data leaks, phishing, and identity theft
* Designed with compliance and privacy in mind

---

## 📌 Use Cases

* Corporate HR systems
* Internal employee databases
* Secure admin dashboards
* Academic or portfolio projects focused on security

---


## 👩‍💻 Author

**Sakshi Kosbe**
GitHub: https://github.com/Sakshi-kosbe/PRODIGY_FS_02.git
---

⭐ If you found this project useful, consider giving it a star!
