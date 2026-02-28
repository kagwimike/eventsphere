🚀 EventHub — Full Stack Event Management System
📌 Overview

A full-stack event management platform for creating, managing, and attending events

Built with a modern React frontend and Django REST backend

Designed with scalability, clean architecture, and real-world use cases in mind

🧠 Core Features
👤 Authentication & Authorization

Secure user registration and login

Token-based authentication

Protected routes (only authenticated users access certain pages)

Persistent login using context API

📅 Event Management

Create, edit, and delete events

Event fields include:

Title

Description

Location

Start & End time

Capacity

Category

Real-time form validation

Edit mode with pre-filled data

🏷️ Category System

Events grouped into categories

Dynamic category dropdown from backend

Category badge preview in UI

Enforced backend integrity (no null categories)

🎟️ Registration System

Users can register for events

Smart capacity handling:

✅ Confirmed registrations

⏳ Automatic waitlisting when full

Tracks:

Registered users

Waitlist count

📩 Email Notifications

Automatic email on registration:

Confirmation email

Waitlist notification

Uses Django email service

Graceful failure handling

🔔 Notification System

Real-time notification UI in navbar

Features include:

Unread notification badge

Dropdown notification panel

Mark single notification as read

Mark all notifications as read

Backend sync with is_read state

Auto-refresh (polling for updates)

💬 Comments System

Users can comment on events

Displays:

Comment content

Author

Timestamp

📊 Event Insights

Displays:

Confirmed attendees count

Waitlist count

Computed dynamically from backend

🏗️ Architecture
🔹 Frontend (React)

React Router for navigation

Context API for authentication state

Axios for API communication

Component-based architecture

Protected route system

🔹 Backend (Django REST Framework)

RESTful API design

Modular serializers:

EventSerializer

RegistrationSerializer

CommentSerializer

CategorySerializer

NotificationSerializer

Business logic handled in serializers

Database integrity enforced (foreign keys, constraints)

⚙️ Key Technical Highlights

Clean separation of concerns (Frontend vs Backend)

Reusable API service layer

Error handling (client + server)

Data validation on both ends

Optimistic UI updates for notifications

Scalable structure for future features

🚨 Challenges Solved

Prevented null category errors (IntegrityError fix)

Designed waitlist system based on capacity

Synced frontend notifications with backend state

Handled async API errors professionally

Built protected routing system

🔮 Future Improvements

Real-time notifications using WebSockets

Payment integration (e.g., M-Pesa / Daraja API)

Admin dashboard

Event analytics dashboard

Search & filtering system

Image uploads for events

🛠️ Tech Stack

Frontend: React, React Router, Axios

Backend: Django, Django REST Framework

Database: SQLite / PostgreSQL

Auth: Token-based authentication

Email: Django Email Service

📦 Installation (Basic)
Backend

Clone repo

Create virtual environment

Install dependencies

Run migrations

Start server

Frontend

Install dependencies

Run development server

👨‍💻 Author

Software Engineer 
