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

````

---

## ⚙️ Configuration

### 1. Set Communication URLs

Update the communication between frontend and backend:

- In `client/src/api.ts`, change the base URL:
  ```ts
  const BASE_URL = "http://<YOUR_IP_OR_DOMAIN>:5000";
````

* In `server/index.js`, configure CORS to allow frontend communication:

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

1. **Install PostgreSQL** (if not already installed):
   Use your platform's installer or package manager.

2. **Create database and user**:

---

### ✅ **Steps to Create a New Database from `.sql` File**

#### **1. Open a Terminal / Command Prompt**

#### **2. Login to `psql` as the PostgreSQL superuser:**

```bash
psql -U postgres
```

> If your PostgreSQL user is different, replace `postgres` with your username.

---

#### **3. Create a New Empty Database**

Inside the `psql` shell:

```sql
CREATE DATABASE new_db_name;
\q
```

---

#### **4. Import Your `.sql` File into the New DB**

From your terminal (outside of `psql`):

```bash
psql -U postgres -d new_db_name -f path/to/your_schema.sql
```

Replace:

* `new_db_name` → your target database name
* `path/to/your_schema.sql` → path to the `.sql` file

---

### 🔄 Example:

```bash
psql -U postgres -d facial_attendance_db -f ./backup/schema.sql
```

---

### ⚠️ If You See `permission denied` or `could not connect`:

* Make sure PostgreSQL is running
* Ensure the user has permission
* You may need to specify `-h localhost` if connecting to local server

---


3. **Update `.env`** accordingly:

   ```env
   DB_USER=myuser
   DB_HOST=localhost
   DB_NAME=attendance_db
   DB_PASSWORD=mypassword
   DB_PORT=5432
   PORT=5000
   ```

---

## 🚀 Hosting the Frontend (Client)

Navigate to the `client` directory and build:

```bash
cd client
npm install
npm run build
```

This generates the static files inside `dist/`.

### Serve Options

#### Option 1: Using `serve` (recommended for dev)

```bash
npm install -g serve
serve -s dist -l 5173
```

> To expose on LAN:

```bash
serve -s dist -l 0.0.0.0:5173
```

#### Option 2: Using Python HTTP Server

```bash
cd dist
python3 -m http.server 5173
```

#### Option 3: Using Express.js (for production)

You can copy the `dist/` folder into a `public/` folder inside a small Express app and serve from there.

---

## 🧠 Running the Backend (Server)

In a new terminal:

```bash
cd server
npm install
node index.js
```

> To run on a different port:

```bash
PORT=5000 node index.js
```

Or make sure the `.env` contains:

```env
PORT=5000
```

Backend will now be live at: `http://localhost:5000`

---

## 🧪 Testing

Once both frontend and backend are running:

* Open `http://localhost:5173` or `http://<your_ip>:5173`
* You should see the login screen and interact with the app.

---

## 🌐 Exposing to the Internet (Optional)

You can use the following tools to expose your localhost:

* **[ngrok](https://ngrok.com/)**:

  ```bash
  ngrok http 5173
  ```

* **[localtunnel](https://theboroer.github.io/localtunnel-www/)**:

  ```bash
  npx localtunnel --port 5173
  ```

* **[frp](https://github.com/fatedier/frp)**: Fast Reverse Proxy (more advanced)

Or configure port forwarding + dynamic DNS (e.g., No-IP) on your router.

---

## 📋 Notes

* Ensure ports `5173` (frontend) and `5000` (backend) are allowed through your firewall.
* Both servers must remain running for the system to work.
* Only logged-in users with registered face data will be able to interact properly.

---