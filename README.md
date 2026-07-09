# SimpleFeed

SimpleFeed is a premium, Instagram-inspired web application for sharing images and videos with the world. It features a modern dark-themed frontend built with React and Vite, and a robust FastAPI backend.

## Features

- **Authentication**: Secure user registration and login using JWT.
- **Feed**: View a chronological feed of posts from all users.
- **Media Upload**: Upload images and videos directly from the browser, stored securely via ImageKit.io.
- **Modern UI**: A responsive, glassmorphism-inspired dark theme with smooth animations.
- **Post Management**: Users can delete their own posts.

## Project Structure

The repository is divided into two main parts:

```
simpleFeed/
├── backend/            # FastAPI backend application
│   ├── app/            # Main application code (routes, db models, auth, imagekit)
│   ├── .env            # Environment variables for ImageKit
│   ├── main.py         # Application entry point
│   ├── pyproject.toml  # Project dependencies and configuration (managed by uv)
│   └── test.db         # SQLite database
└── frontend/           # React frontend application
    ├── src/            # Source code (components, API client, CSS)
    ├── index.html      # HTML entry point
    ├── package.json    # NPM dependencies and scripts
    └── vite.config.js  # Vite configuration (includes API proxy)
```

## Prerequisites

Before you begin, ensure you have the following installed:
- [Python 3.14+](https://www.python.org/downloads/)
- [uv](https://github.com/astral-sh/uv) (for backend dependency management)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Environment Setup

You will need an [ImageKit.io](https://imagekit.io/) account for media uploads.

1. Navigate to the `backend` directory.
2. Ensure you have a `.env` file with your ImageKit credentials:
   ```env
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_URL=your_url_endpoint (e.g., https://ik.imagekit.io/your_id)
   ```

## Running the Application

You will need two terminal windows open to run the frontend and backend simultaneously.

### 1. Start the Backend

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
uv run main.py
```

The backend server will start at `http://0.0.0.0:8000` (or `http://localhost:8000`). It uses `uvicorn` with auto-reload enabled, so it will automatically restart if you make code changes. 

You can view the interactive API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Start the Frontend

Open a second terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install   # Install dependencies (only needed the first time)
npm run dev
```

The Vite development server will start at `http://localhost:5173`. 
Open this URL in your browser to interact with the application.

*Note: The frontend is configured to proxy API requests (`/auth`, `/feed`, `/upload`, etc.) to `http://localhost:8000` automatically to avoid CORS issues during development.*
