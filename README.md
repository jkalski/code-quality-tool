# Code Quality Dashboard

A web application for analyzing Python code quality using Pylint.

## Features

- Paste Python code into the web interface
- Automated code analysis with Pylint
- View linting results directly in the browser

## Project Structure

- `frontend/`: React application built with Vite
- `backend/`: Flask API server that runs Pylint

## Setup Instructions

### Backend (Flask)

1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install flask flask-cors pylint`
5. Run the server: `python app.py`

### Frontend (React)

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at http://localhost:5173
