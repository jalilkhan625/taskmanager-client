# ✅ Task Manager App with JWT Auth & Social Features

A full-stack **Task Manager** built with **React**, **Node.js**, and **MongoDB**. It includes **JWT authentication**, **user registration/login**, and **follow/unfollow functionality** between users.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based register/login
- Protected routes for tasks and profiles

### 📋 Task Management
- Add, edit, delete tasks
- (Planned) Reordering tasks by drag-and-drop

### 👥 User System
- Follow / unfollow users
- View public user profiles
- User search functionality

---

## 🛠️ Tech Stack

| Frontend   | Backend        | Database       |
|------------|----------------|----------------|
| React (CRA) | Node.js + Express | MongoDB Atlas |
| Axios      | JWT + Bcrypt.js | Mongoose       |
| CSS        | dotenv          | Multer (for uploads) |

---

## 📁 Folder Structure (Simplified)

\`\`\`
task-manager/
├── backend/
│   ├── models/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── follows.js
│   │   ├── profiles.js
│   │   └── tasks.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Profile.js
│   │   ├── Navbar.js
│   │   └── UserSearch.js
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md
\`\`\`

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/jalilkhan625/taskmanager-client.git
cd taskmanager-client
\`\`\`

### 2. Install Frontend Dependencies

\`\`\`bash
npm install
\`\`\`

---

### 3. Run Backend

Navigate to the backend folder:

\`\`\`bash
cd backend
npm install
\`\`\`

#### Create \`.env\` inside \`/backend/\`:

\`\`\`env
PORT=5000
MONGO_URI=mongodb+srv://<your-cluster>
JWT_SECRET=your_jwt_secret_key
\`\`\`

#### Start backend server:

\`\`\`bash
npm run dev
\`\`\`

> Make sure MongoDB is running or Atlas is connected.

---

### 4. Run Frontend

Back in the root or \`/\`:

\`\`\`bash
npm start
\`\`\`

> Runs on \`http://localhost:3000\`

---

## 🔐 JWT Auth Flow

- \`POST /api/auth/register\`: Register user
- \`POST /api/auth/login\`: Login and get JWT
- Frontend stores JWT in \`localStorage\` or \`context\`
- Protected routes use middleware on backend

---

## 📡 API Routes (Backend)

- \`POST /api/auth/register\`
- \`POST /api/auth/login\`
- \`GET /api/users/:id\`
- \`POST /api/users/:id/follow\`
- \`POST /api/users/:id/unfollow\`
- \`GET /api/profiles/:username\`
- \`GET /api/tasks\`
- \`POST /api/tasks\`
- \`PUT /api/tasks/:id\`
- \`DELETE /api/tasks/:id\`

---

## 🧪 Testing

- Basic tests using \`App.test.js\` and \`setupTests.js\`
- Use Postman or ThunderClient for backend route testing

---

## ✨ Planned Improvements

- [ ] Task due dates and reminders
- [ ] Notifications for follows
- [ ] Task sharing with followed users
- [ ] Task filtering (priority, date)
- [ ] Upload profile pictures

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Jalil Khan**  
🔗 [GitHub](https://github.com/jalilkhan625)
