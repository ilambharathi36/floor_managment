# Floor Management App

A full-stack floor asset management dashboard built with Django and React.

## Features

- Office floor overview
- Asset list with quick selection
- Asset detail panel
- Filter/chip controls
- Responsive dashboard layout
- Django JSON API backend
- SQLite-backed asset persistence
- Django admin workflow and authenticated session endpoints

## Project structure

- `backend/` - Django project and API
- `frontend/` - React + Vite app

## Run the app

### 1. Backend

```powershell
cd backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open:

- Frontend: http://localhost:5173/
- API: http://127.0.0.1:8000/api/assets/

## Production build

```powershell
cd frontend
npm run build
```

## Admin and login

The project now includes a real Django admin login and persistent asset storage.

Admin credentials:

- Username: admin
- Password: Admin@123

Use the built-in admin panel here:

- http://127.0.0.1:8000/admin/

The API also includes session-based authentication endpoints:

- POST /api/login/
- POST /api/logout/
- GET /api/session/

## Notes

Data is now stored in SQLite via Django models, and the asset actions update the database instead of a temporary in-memory array.
