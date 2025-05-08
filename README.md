# Education Management System - Grades Module

This project implements a grades management module for an education management system, including a frontend interface and backend API.

## Features

- View student grades list
- Filter grades by course, assessment type, and student name
- Add individual student grades
- Batch add multiple student grades
- Grade sorting functionality

## Technology Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Python Flask
- Database: MySQL

## Project Structure

```
├── app.py                 # Backend Flask application
├── init_db.py             # Database initialization script
├── test_api.py            # API testing script
└── src/
    └── pages/
        └── teacher/
            └── GradesPage.tsx  # Grades management frontend page
```

## Database Design

The project uses the following database tables:

1. **courses** - Stores course information
   - id: Course ID
   - name: Course name
   - schedule: Course schedule
   - time: Class time
   - location: Class location

2. **students** - Stores student information
   - id: Student ID
   - name: Student name
   - age: Student age
   - parent: Parent name
   - contact: Contact information
   - course_id: Associated course ID

3. **grades** - Stores grade information
   - id: Grade ID
   - date: Assessment date
   - course: Course name
   - course_id: Course ID
   - type: Assessment type (quiz, exam, assignment, homework)
   - title: Assessment title
   - student: Student name
   - student_id: Student ID
   - score: Score achieved
   - max_score: Maximum possible score
   - feedback: Feedback comments
   - created_at: Creation timestamp

## Installation and Setup Guide

This guide will help you set up the Education Management System - Grades Module on your computer.

### Prerequisites

- Python 3.8+
- MySQL 5.7+
- Node.js 14+
- npm 6+

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd education-management-system
```

### Step 2: Set Up the Backend

1. Install Python dependencies:

```bash
pip install flask flask-cors pymysql
```

2. Configure the database connection:

Edit the `db_config` variable in `app.py` to set the correct database connection information:

```python
db_config = {
    'host': 'localhost',
    'user': 'root',
    'port': 3306,  # Change to your MySQL port
    'password': '',  # Set your MySQL password
    'database': 'project'
}
```

3. Create the MySQL database:

```bash
mysql -u root -p
```

In the MySQL shell:

```sql
CREATE DATABASE project;
EXIT;
```

4. Initialize the database:

```bash
python init_db.py
```

5. Start the backend server:

```bash
python app.py
```

The server will run on http://localhost:9999.

### Step 3: Set Up the Frontend

1. Install frontend dependencies:

```bash
npm install
```

2. Configure the API endpoint:

If your backend is running on a different host or port, update the API endpoint URLs in the frontend code. The main API calls are in `src/pages/teacher/GradesPage.tsx`.

Look for lines like:
```typescript
const coursesResponse = await axios.get('http://localhost:9999/courses');
```

And update the URL if necessary.

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173.

### Step 4: Verify the Setup

1. Open your browser and navigate to http://localhost:5173
2. Log in to the system (use test credentials if provided)
3. Navigate to the Grades page to verify functionality

### Step 5: Testing the API

You can test the API endpoints using the provided test script:

```bash
python test_api.py
```

This will run a series of tests against the API endpoints to verify they are working correctly.

## API Endpoints

### Get Courses List

```
GET /courses
```

### Get Grades List

```
GET /grades
```

### Add Individual Grade

```
POST /grades
```

Request body example:

```json
{
  "date": "2025-01-20",
  "course": "Phonics Foundation",
  "courseId": "phonics",
  "type": "exam",
  "title": "Midterm Exam",
  "student": "Sophie Lee",
  "studentId": 3,
  "score": 92,
  "maxScore": 100,
  "feedback": "Excellent performance on consonant blends"
}
```

### Batch Add Grades

```
POST /grades/batch
```

Request body example:

```json
[
  {
    "date": "2025-01-25",
    "course": "Young Readers",
    "courseId": "readers",
    "type": "quiz",
    "title": "Vocabulary Quiz",
    "student": "Jason Lam",
    "studentId": 4,
    "score": 88,
    "maxScore": 100,
    "feedback": "Good vocabulary knowledge"
  },
  {
    "date": "2025-01-25",
    "course": "Young Readers",
    "courseId": "readers",
    "type": "quiz",
    "title": "Vocabulary Quiz",
    "student": "Alice Chen",
    "studentId": 5,
    "score": 94,
    "maxScore": 100,
    "feedback": "Excellent vocabulary range"
  }
]
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify that MySQL is running on your system
2. Check that the port number in `db_config` matches your MySQL configuration
3. Ensure the username and password are correct
4. Make sure the 'project' database exists

### API Connection Issues

If the frontend cannot connect to the backend:

1. Verify that the backend server is running
2. Check that the API URLs in the frontend code match the backend server address
3. Ensure there are no firewall or network issues blocking the connection
4. Check browser console for CORS-related errors

### Frontend Build Issues

If you encounter issues building or running the frontend:

1. Make sure you have the correct versions of Node.js and npm installed
2. Try deleting the `node_modules` folder and running `npm install` again
3. Check for any TypeScript errors in the console

## Production Deployment

For production deployment:

1. Build the frontend:

```bash
npm run build
```

2. Serve the built files using a production web server like Nginx or Apache

3. Configure the backend to run as a service using a tool like Supervisor, PM2, or systemd

4. Set up a production-grade database server with proper security configurations

5. Update the database connection settings in the backend code

6. Consider using environment variables for sensitive configuration

## License

MIT