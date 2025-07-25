# 🏬 Store Rating System - FullStack  Challenge

## 📌 Project Overview
This is a full-stack web application that allows users to rate stores. It supports role-based access for three user types:
- **Admin**: Manage users and stores, view dashboard stats.
- **Store Owner**: View ratings and average store rating.
- **Normal User**: Rate stores, view/edit their ratings.



## 🧰 Tech Stack
- **Frontend**: React.js + Material UI (MUI)
- **Backend**: Express.js
- **Database**: PostgreSQL

---

## ⚙️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/siddhanttripathi22/Store-Rating-System.git
cd store-rating-app

cd backend
cp .env.example .env
# Fill in your DB credentials
npm install
npm run dev


cd frontend
npm install
npm start


🗄️ Default Test Accounts

Role	Email	Password
Admin admin@system.com	Admin@123
Store Owner	owner@test.com	Owner@123
Normal User	user@test.com	User@123

You can modify these in the seed data or via the Admin dashboard.


✅ Features

🔐 Authentication
JWT-based login for all roles

Password validations (8–16 chars, 1 uppercase, 1 special char)

👥 Admin
View dashboard stats (users, stores, ratings)

Create/manage users and stores

Filter and sort user/store tables

🛒 Normal User
Search for stores

Submit & update ratings (1 to 5)

View their own ratings

🏪 Store Owner
View users who rated their store

See average rating

🚀 Demo
 https://drive.google.com/file/d/1rAYi-1moS6Seb_SVnzsNWdLuU8FTAB-w/view?usp=sharing