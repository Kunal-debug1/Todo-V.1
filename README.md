# Todo V1

A simple full-stack todo list with task creation, editing, completion, deletion, search, status filters, due dates, and priority sorting.

## Stack

React · Vite · Flask · MySQL

## Run locally

### 1. Configure MySQL

Create a database named `todo_db` (or choose another name) and set these environment variables before starting the API:

```text
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=<your-mysql-user>
MYSQL_PASSWORD=<your-mysql-password>
MYSQL_DATABASE=todo_db
```

The application expects a `todos` table with `id`, `text`, `completed`, `due_date`, and `priority` columns. Do not commit database credentials.

### 2. Start the Flask API

```bash
cd backend
python -m venv .venv
```

Activate the environment, then install the dependencies and start Flask:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

The API runs at `http://127.0.0.1:5000`.

### 3. Start the React app

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend currently calls the API at `http://127.0.0.1:5000`.

## API routes

- `GET /api/todos` — list todos
- `POST /api/todos` — create a todo
- `PUT /api/todos/<id>` — update a todo
- `DELETE /api/todos/<id>` — delete a todo

## Repository layout

- `backend/` — Flask API and MySQL connection
- `frontend/` — React and Vite interface
