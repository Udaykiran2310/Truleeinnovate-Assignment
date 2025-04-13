# Candidate Management System

A full-stack web application for managing candidate data with features for displaying, searching, filtering, and managing candidate information.

## Features

- Table view of candidates with pagination
- Add new candidates
- Search functionality
- Filter by gender, experience, and skills
- Responsive design

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- UI Components: Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/candidate_db
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## API Endpoints

- GET /api/candidates - Get all candidates
- POST /api/candidates - Add a new candidate
- GET /api/candidates/search - Search candidates
- GET /api/candidates/filter - Filter candidates

## Project Structure

```
candidate-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
``` 