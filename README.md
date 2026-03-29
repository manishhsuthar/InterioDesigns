# InterioDesigns

InterioDesigns is a full-stack web project with:
- `frontend/`: React + Vite + TypeScript UI
- `backend/`: Django API

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- (Optional) PostgreSQL if you want to use `DATABASE_URL` instead of SQLite

## Project Structure

- `frontend/` - client app
- `backend/` - Django server and API

## Backend Setup (Django)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Backend Environment Variables

Create or update `backend/.env`:

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=true
# Optional: use PostgreSQL/Supabase instead of SQLite
# DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

Notes:
- If `DATABASE_URL` is not set, backend uses `backend/db.sqlite3` by default.
- `SUPABASE_URL` / `SUPABASE_DB_URL` are also supported as DB URL fallbacks.

### Run Backend

```bash
cd backend
source .venv/bin/activate
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup (React + Vite)

```bash
cd frontend
npm install
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Run Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://127.0.0.1:5173` (default Vite port).

## Development Workflow

1. Start backend (`python manage.py runserver`) in one terminal.
2. Start frontend (`npm run dev`) in another terminal.
3. Open the frontend URL and use the app.

## Useful Commands

### Backend

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

### Frontend

```bash
npm run lint
npm run test
npm run build
npm run preview
```
