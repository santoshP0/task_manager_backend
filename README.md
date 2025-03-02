# Task Manager API - Backend

This is the backend for the Task Manager app, built using **Node.js** and **Express** with MongoDB.

## Features
- User authentication with JWT
- CRUD operations for tasks

---

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/santoshP0/task_manager_backend.git
cd task-manager-backend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Start the Server
```sh
node index.js
```
This will start the server on **http://localhost:5000**.

---

## Exposing API for Mobile App
> **Note:** Mobile devices can't access `localhost`. You need to use **ngrok** to expose the API securely.

### Install ngrok (if not installed):
```sh
npm install -g ngrok
```

### Start ngrok:
```sh
ngrok http 5000
```

This will generate a public HTTPS URL like:
```sh
Forwarding https://random-subdomain.ngrok.io -> http://localhost:5000
```

### Update Your React Native App
Replace the `API_BASE_URL` in `config.ts` of your mobile app with the **ngrok HTTPS URL**:
```ts
export const API_BASE_URL = "https://random-subdomain.ngrok.io";
```

Now, your app can communicate with the backend securely. 🎉

---

## API Endpoints
### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT

### Task Management
- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

---
