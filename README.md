Events Platform

This repository contains both the frontend and backend components of the Events Platform project, which allows users to browse, manage, and sign up for events with role-based functionality.

⸻

Table of Contents
	•	Project Summary
	•	User Roles
	•	Live URLs
	•	Test Credentials
	•	Frontend Setup
	•	Backend Setup
	•	API Overview
	•	Tech Stack
	•	Seeding and Database Notes

⸻

Project Summary

The Events Platform is a full-stack web application that allows users to:
	•	Browse upcoming events
	•	Sign up and cancel attendance
	•	Manage personal settings and password
	•	Download calendar invites for events

Roles:
	•	Customer: View events, sign up/cancel, manage calendar, update profile/password.
	•	Admin: Everything a customer can do plus create and manage their own events.
	•	Owner: Everything an admin can do plus assign admin roles to other users.

⸻

Live URLs
	•	Frontend: https://fabulous-salamander-321bab.netlify.app
	•	Backend: https://events-platform-backend.onrender.com

⸻

Test Credentials

Owner
	•	Email: ownereventsplatform@gmail.com
	•	Password: Password123!

Admin
	•	Email: eventsplatformuser1@gmail.com
	•	Password: Password123!

Customer
	•	Register manually through the frontend via the Register screen.

⸻

Frontend Setup

1. Clone and Install

git clone https://github.com/iretunde/events-platform-frontend.git
cd events-platform-frontend
npm install

2. Configure Backend API

By default, the deployed frontend points to the deployed backend. If running locally:
	•	Replace https://events-platform-backend.onrender.com with http://localhost:5000
	•	Use Find and Replace across all source files to change API base URLs

3. Run Locally

npm start



⸻

Backend Setup

1. Clone and Install

git clone https://github.com/iretunde/events-platform-backend.git
cd events-platform-backend
npm install

2. Environment Setup

Create two files:

.env

DATABASE_URL=postgres://<username>:<password>@localhost:5432/events_platform
MJ_APIKEY_PUBLIC=<mailjet_public>
MJ_APIKEY_PRIVATE=<mailjet_private>
SENDER_EMAIL=<your_verified_sender_email>
JWT_SECRET=dev_secret

.env.production

DATABASE_URL=postgresql://events_platofrm_db_user:<PASSWORD>@<RENDER_HOST>/<DB_NAME>
MJ_APIKEY_PUBLIC=<mailjet_public>
MJ_APIKEY_PRIVATE=<mailjet_private>
SENDER_EMAIL=<your_verified_sender_email>
JWT_SECRET=production_secret123

3. Local Dev Database

createdb events_platform
npm run seed:dev

Dev seeding drops and recreates all tables and data programmatically

4. Production Setup

ONLY for remote DBs like Supabase or Render

npm run setup:prod  # Runs schema.sql to create tables
npm run seed:prod    # Seeds only if data is missing

Uses schema.sql file and safe checks to prevent overwrites

5. Run Locally

npm run dev


⸻

API Overview

All API routes are prefixed with /api

Users
	•	POST /api/users/register
	•	POST /api/users/login
	•	PATCH /api/users/reset-password/:token
	•	GET /api/users/me
	•	PATCH /api/users/update-password
	•	PATCH /api/users/update-role/:user_id (owner only)

Events
	•	GET /api/events
	•	POST /api/events (admin/owner)
	•	PATCH /api/events/:event_id
	•	DELETE /api/events/:event_id

Signups
	•	GET /api/signups/my-events
	•	POST /api/signups/:event_id
	•	DELETE /api/signups/:event_id
	•	PATCH /api/signups/add-to-calendar/:event_id

⸻

Tech Stack
	•	Frontend: React, React Router, HTML/CSS
	•	Backend: Node.js, Express.js, PostgreSQL, JWT, bcrypt, Mailjet
	•	Deployment: Netlify (Frontend), Render (Backend), Supabase (initial DB), PostgreSQL

⸻

Seeding and Database Notes

Development (npm run seed:dev)
	•	Drops all existing tables
	•	Uses in-code data files
	•	Does NOT use schema.sql

Production (npm run setup:prod + npm run seed:prod)
	•	Uses schema.sql to create tables
	•	Seed logic checks if data exists to avoid duplicates
	•	Safe for hosted databases like Supabase or Render

⸻

Final Notes
	•	Ensure Mailjet sender email is verified
	•	Forgot password flow sends a secure reset link
	•	Token-based password reset routes validate link expiry
	•	ResetPassword.jsx route expects /reset-password/:token

⸻

MIT License. Educational use.