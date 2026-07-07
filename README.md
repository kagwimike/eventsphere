# EventSphere

EventSphere is a full-stack event management platform for creating, discovering, and managing events with a polished experience for both organizers and attendees.

## Overview

- React frontend with a modern, responsive UI
- Django REST Framework backend with JWT authentication
- Event creation, editing, deletion, registration, waitlisting, comments, and notifications
- Clean separation between frontend routes, API integration, and business logic

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Django, Django REST Framework, JWT
- Database: SQLite by default (can be switched to PostgreSQL/MySQL)

## Project Structure

- backend/: Django project and API
- frontend/: React application

## Features

- Secure user registration and login
- Protected routes for authenticated users
- Event CRUD operations
- Capacity-aware registration with waitlist handling
- Category-based filtering
- Commenting on events
- Notification center with unread badges
- Clean, reusable UI components and styling

## Backend Setup

From the repository root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows use .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

If you are using your own virtual environment, activate it before installing dependencies.

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Notes

The frontend expects the backend API at:

- http://127.0.0.1:8000/api

If needed, you can override this with:

```bash
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

## Notes for Your Local Environment

- The app was refactored for better readability, maintainability, and correctness.
- The registration flow now handles capacity and waitlisting more predictably.
- The UI has been cleaned up for a more consistent experience across auth screens, the home page, and event listings.

## Next Steps

- Add real-time notifications with WebSockets
- Add image uploads for events
- Add search and advanced filtering
- Add richer admin and analytics views

