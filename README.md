# 🧠 Facial Recognition Attendance System

This is a fullstack facial recognition-based attendance management system designed for educational institutions. It includes:

- A React-based frontend (`client/`)
- A Node.js + Express.js backend (`server/`)

The system uses structured XML timetable integration, role-based dashboards, and external facial recognition APIs. You can self-host this system on your own machine.

---

## 🛠️ Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (v13 or later)
- A terminal (Command Prompt / Bash / zsh)

---

## 📁 Folder Structure

```
project-root/
├── client/             # React-based web UI
│   ├── src/
│   └── dist/           # Will be generated after build
├── server/             # Express backend
│   ├── index.js
│   └── .env            # Environment config for DB and PORT
└── README.md
```

---

## ⚙️ Configuration

### 1. Set Communication URLs

Update the communication between frontend and backend:

- In `client/src/api.ts`, change the base URL:
  ```ts
  const BASE_URL = "http://<YOUR_IP_OR_DOMAIN>:5000";
  ```

- In `server/index.js`, configure CORS to allow frontend communication:
  ```js
  app.use(
    cors({
      origin: "http://<YOUR_IP_OR_DOMAIN>:5173",
      credentials: true,
    })
  );
  ```

---

### 2. Configure Environment Variables

In `server/.env`, fill the following:

```env
DB_USER=your_db_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

This connects your backend to a local PostgreSQL server.

---

## 🐘 Setting Up Local PostgreSQL

### Step 1: Install PostgreSQL

Use your platform's installer or package manager if not already installed.

### Step 2: Create a Database and Import Schema

#### A. Open Terminal and Login to `psql`:

```bash
psql -U postgres
```

> Replace `postgres` with your PostgreSQL username if different.

#### B. Create a New Database:

```sql
CREATE DATABASE new_db_name;
\q
```

#### C. Import the `.sql` File into the New DB:

```bash
psql -U postgres -d new_db_name -f path/to/your_schema.sql
```

Replace:
- `new_db_name` → your target database name
- `path/to/your_schema.sql` → path to your `.sql` file

#### Example:

```bash
psql -U postgres -d facial_attendance_db -f ./backup/schema.sql
```

#### Troubleshooting:

- Make sure PostgreSQL service is running
- Ensure correct user permissions
- You may need to add `-h localhost` if needed

---

## 🚀 Hosting the Frontend (Client)

Navigate to the `client` directory and build the React app:

```bash
cd client
npm install
npm run build
```

This generates static files inside the `dist/` folder.

### Serve Options

#### Option 1: Using `serve` (Recommended for Dev)

```bash
npm install -g serve
serve -s dist -l 5173
```

> To expose it on LAN:

```bash
serve -s dist -l 0.0.0.0:5173
```

#### Option 2: Using Python HTTP Server

```bash
cd dist
python3 -m http.server 5173
```

#### Option 3: Using Express.js (For Production)

Copy the contents of `dist/` into a `public/` folder in a small Express app and serve using:

```js
app.use(express.static("public"));
```

---

## 🧠 Running the Backend (Server)

In a new terminal:

```bash
cd server
npm install
node index.js
```

> To specify the port manually:

```bash
PORT=5000 node index.js
```

Or ensure the `.env` contains:

```env
PORT=5000
```

Backend will now be live at: `http://localhost:5000`

---

## 🧪 Testing

Once both frontend and backend are running:

- Open `http://localhost:5173` or `http://<your_ip>:5173`
- You should see the login page and be able to interact with the app.

---

## 🌐 Exposing to the Internet (Optional)

Use any of the following tools to expose your localhost temporarily:

### A. Ngrok

```bash
ngrok http 5173
```

### B. LocalTunnel

```bash
npx localtunnel --port 5173
```

### C. Fast Reverse Proxy (frp)

For advanced users: [https://github.com/fatedier/frp](https://github.com/fatedier/frp)

Or configure **port forwarding** + **dynamic DNS** using tools like [No-IP](https://www.noip.com/).

---

## 📋 Notes

- Ensure ports `5173` (frontend) and `5000` (backend) are open in your firewall.
- You can run both parts on the same or different machines—just update URLs accordingly.
- Only users with registered face data can log in and mark attendance.
