# Workout Tracker Pro - Documentation

This document provides an overview of the Workout Tracker Pro application, including its features, setup instructions, and technical details.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)

## Introduction
Workout Tracker Pro is a comprehensive fitness application designed to help users log and track their gym workouts. It provides features for recording exercises, sets, reps, and weight, along with personal records tracking and progress visualization. The application is built with Next.js, offering a modern and responsive user experience.

## Features
- **User Authentication**: Secure login and registration system with username and password.
- **Personalized Workout Logging**: Log workouts with details such as date, day, exercise name, sets, reps, weight, and optional notes.
- **Personal Records (PRs)**: Automatically tracks and displays your personal bests for each exercise.
- **Progress Visualization**: Interactive line charts to visualize weight progression over time for specific exercises.
- **Workout History**: A detailed table view of all recorded workouts with options to delete entries.
- **Data Persistence**: Workout data is stored locally in a SQLite database, associated with the authenticated user.
- **Responsive Design**: Optimized for use on various devices, from mobile phones to desktop computers.

## Getting Started
Follow these instructions to set up and run the Workout Tracker Pro application locally on your machine.

### Prerequisites
- Node.js (version 18.x or higher)
- npm (Node Package Manager)
- Git

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/AhmedZena/workout-tracker.git
   cd workout-tracker
   ```

2. **Navigate to the Next.js project directory:**
   ```bash
   cd workout-tracker-nextjs
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application
To start the development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Authentication
Workout Tracker Pro includes a robust authentication system:
- **Registration**: New users can create an account by navigating to the `/register` page.
- **Login**: Existing users can log in via the `/login` page.
- **Protected Routes**: The main workout tracking dashboard is protected, requiring users to be authenticated.
- **Session Management**: User sessions are managed using NextAuth.js.

## Project Structure
```
workout-tracker-nextjs/
├── public/                     # Static assets (images, icons)
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth.js API route for authentication
│   │   │   └── register/           # API route for user registration
│   │   ├── login/                  # Login page
│   │   ├── register/               # Registration page
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout for the application
│   │   ├── page.tsx                # Main workout tracking dashboard
│   │   └── providers.tsx           # NextAuth Session Provider
│   ├── components/                 # Reusable UI components
│   │   └── ui/                     # Shadcn/ui components (Button, Input, Card, Select, etc.)
│   └── lib/                        # Utility functions and database connection
│       ├── db.ts                   # SQLite database setup and connection
│       └── utils.ts                # General utility functions
├── .gitignore                  # Specifies intentionally untracked files to ignore
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── database.sqlite             # SQLite database file (generated on first run)
```

## Technologies Used
- **Next.js**: React framework for building full-stack web applications.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **NextAuth.js**: Authentication library for Next.js applications.
- **SQLite**: Lightweight, file-based relational database.
- **bcryptjs**: Library for hashing passwords.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn/ui**: Reusable UI components built with Tailwind CSS and Radix UI.
- **Recharts**: Composable charting library built with React and D3.
- **Lucide React**: Open-source icon library.

## Deployment
The application is configured for easy deployment to platforms like Vercel. The SQLite database will be created automatically when the application runs for the first time. For production environments, consider using a more robust database solution and environment variables for sensitive information.

