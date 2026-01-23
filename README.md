# Event Connection

Event Connection is a web application designed to centralize campus events for students at Concordia University, Nebraska. This project addresses the lack of a student focused platform for discovering events, RSVPs, and receiving notifications which helps students engage more fully in campus life.

## Backstory

Students at Concordia University currently find out about events through posters, weekly emails, the university website, or 25Live. These methods are often fragmented, outdated, or difficult to navigate on mobile devices. Many students miss events they would have liked to attend, which can affect student satisfaction and retention.

To solve this, Event-Connection was developed as a full-stack web application that:

1. Allows students to view and filter events in an organized interface.

2. Enables students to submit events for approval by the Student Life Office (SLO).

3. Tracks RSVPs to help event organizers understand attendance.

4. Sends notifications for RSVPed events to ensure students don’t miss them.

5. The system improves event discovery, centralizes student engagement, and provides actionable data to campus administrators.

## Features

- Event Viewing: Students can browse events by date (today, this week, this month, or custom), or search by keyword.

- Event Submission: Students submit events for approval. SLO can approve or deny submissions with feedback.

- RSVP Functionality: Students can RSVP to events; SLO and organizers can view attendee lists.

- Notifications: Daily email notifications for events students have RSVPed to.

- Admin Portal: Manage submissions, RSVPs, and event data with detailed statistics.

- Event Details: Includes event name, description, date, time, location, contact info, images, and admin notes.

- Internal Access: Only logged-in students can access the platform.

## Tech Stack

### Backend:

- Django

- Django REST Framework

- SQLite Database

- Allauth, dj-rest-auth, SimpleJWT for authentication

### Frontend:

- React (Web Application)

- React Router for navigation

- Mantine for UI components

### Future Expansion:

- React Native Mobile App (not in MVP)

- Microsoft Single Sign-On integration

- Event categories, clubs, and follow functionality

## How to Preview
1. Clone the Repository
```
git clone https://github.com/AaronCumming/Event-Connection.git
cd Event-Connection
```

2. Run Backend
```
cd backend
uv sync
uv run manage.py migrate
uv run manage.py runserver
```

The backend will start at http://127.0.0.1:8000/.

3. Run Frontend
```
cd frontend
npm install
npm start
```

The frontend will start at http://localhost:3000/ and connect to the backend API automatically.
