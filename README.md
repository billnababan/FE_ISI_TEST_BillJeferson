This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# TodoAppNextjs

A simple Todo application built using Next.js. This application allows users to manage their tasks, including adding, updating, and deleting todos.

## Table of Contents
Project Setup

Technologies Used

Features

Installation Guide

Running the Development Server

API Endpoints

Testing

Contributing

License

Project Setup
1. Clone the Repository
To get started, clone the repository to your local machine:

bash
Copy
### git clone https://github.com/billnababan/TodoAppNextjs.git
cd TodoAppNextjs
Technologies Used
### Frontend: Next.js (TypeScript), TailwindCSS

### Backend: Next.js API Routes

### Database: PostgreSQL

Authentication: JWT (JSON Web Tokens)

Features
Role-Based Access Control:

Lead: Can create, update, and delete tasks. Can assign tasks to team members.

Team: Can update task status and descriptions.

Task Management:

Create, read, update, and delete tasks.

Assign tasks to team members.

Track task status: Not Started, On Progress, Done, Reject.

Logging:

Every task creation, update, and deletion is logged for auditing purposes.

Responsive Design:

Built with TailwindCSS for a responsive and user-friendly interface.

### Installation Guide
1. Prerequisites
Node.js (v18 or higher) and npm installed.

2. Set Up Environment Variables
Create a .env file in the root directory with the following variables:

env
Copy
### Database Configuration
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/your_db_name

### JWT Configuration
JWT_SECRET=your_jwt_secret_key

Start a PostgreSQL database.

Start the Next.js application.

Running the Development Server
If you prefer to run the application locally without Docker:

Install dependencies:

bash
Copy
### npm install
Start the development server:

bash
Copy
### npm run dev
Open your browser and navigate to http://localhost:3000.

### API Endpoints
1. Authentication
Register User: POST /api/auth/register

Login: POST /api/auth/login

2. Task Management
Create Task: POST /api/tasks (Lead Only)
Get All Tasks: GET /api/tasks
Update Task: PUT /api/tasks/:id (Lead Only)
Delete Task: DELETE /api/tasks/:id (Lead Only)

3. Team-Specific Endpoints
Get Team Tasks: GET /api/status (Team Only)
Update Task Status: PUT /api/status/:id (Team Only)

### 1. Create User
Endpoint: POST /api/auth/register

Description: Register a new user with a role (lead or team).

Request Body (JSON)
json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "lead"
}
Response (Success)
json

{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "lead",
  "created_at": "2023-10-10T12:00:00.000Z"
}
Steps in Postman
Set the request method to POST.

Enter the URL: http://localhost:3000/api/auth/register.

Go to the Body tab, select raw, and choose JSON format.

Paste the request body JSON.

Click Send.

### 2. Login
Endpoint: POST /api/auth/login

Description: Authenticate a user and receive a JWT token.

Request Body (JSON)
json
Copy
{
  "email": "john.doe@example.com",
  "password": "password123"
}
Response (Success)
json

{
  "id": 1,
  "email": "john.doe@example.com",
  "role": "lead",
  "uuid": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Steps in Postman
Set the request method to POST.

Enter the URL: http://localhost:3000/api/auth/login.

Go to the Body tab, select raw, and choose JSON format.

Paste the request body JSON.

Click Send.

Save the token from the response for future requests.

### 3. Get All Users (Team Members)
Endpoint: GET /api/users?role=team

Description: Fetch all users with the role team.

Response (Success)
json

[
  {
    "id": 2,
    "email": "team.member@example.com"
  }
]
Steps in Postman
Set the request method to GET.

Enter the URL: http://localhost:3000/api/users?role=team.

Go to the Headers tab and add:

Key: Authorization

Value: Bearer <token> (replace <token> with the token received from login).

Click Send.

### 4. Create Task (Lead Only)
Endpoint: POST /api/tasks

Description: Create a new task (only accessible by users with the lead role).

Request Body (JSON)
json

{
  "title": "New Task",
  "description": "This is a new task.",
  "assigned_to": "team.member@example.com"
}
Response (Success)
json

{
  "id": 1,
  "title": "New Task",
  "description": "This is a new task.",
  "status": "Not Started",
  "assigned_to": 2,
  "created_by": 1,
  "created_at": "2023-10-10T12:00:00.000Z"
}
Steps in Postman
Set the request method to POST.

Enter the URL: http://localhost:3000/api/tasks.

Go to the Headers tab and add:

Key: Authorization

Value: Bearer <token> (replace <token> with the token received from login).

Go to the Body tab, select raw, and choose JSON format.

Paste the request body JSON.

Click Send.

### 5. Get All Tasks
Endpoint: GET /api/tasks

Description: Fetch all tasks.

Response (Success)
json

[
  {
    "id": 1,
    "title": "New Task",
    "description": "This is a new task.",
    "status": "Not Started",
    "assigned_to": 2,
    "created_by": 1,
    "created_at": "2023-10-10T12:00:00.000Z"
  }
]
Steps in Postman
Set the request method to GET.

Enter the URL: http://localhost:3000/api/tasks.

Go to the Headers tab and add:

Key: Authorization

Value: Bearer <token> (replace <token> with the token received from login).

Click Send.

### 6. Update Task (Lead Only)
Endpoint: PUT /api/tasks/:id

Description: Update a task (only accessible by users with the lead role).

Request Body (JSON)
json

{
  "title": "Updated Task",
  "description": "This task has been updated.",
  "assigned_to": "team.member@example.com"
}
Response (Success)
json
Copy
{
  "id": 1,
  "title": "Updated Task",
  "description": "This task has been updated.",
  "status": "Not Started",
  "assigned_to": 2,
  "created_by": 1,
  "created_at": "2023-10-10T12:00:00.000Z"
}
Steps in Postman
Set the request method to PUT.

Enter the URL: http://localhost:3000/api/tasks/1 (replace 1 with the task ID).

Go to the Headers tab and add:

Key: Authorization

Value: Bearer <token> (replace <token> with the token received from login).

Go to the Body tab, select raw, and choose JSON format.

Paste the request body JSON.

Click Send.

### 7. Delete Task (Lead Only)
Endpoint: DELETE /api/tasks/:id

Description: Delete a task (only accessible by users with the lead role).

Response (Success)
json

{
  "message": "Task deleted successfully"
}
Steps in Postman
Set the request method to DELETE.

Enter the URL: http://localhost:3000/api/tasks/1 (replace 1 with the task ID).

Go to the Headers tab and add:

Key: Authorization

Value: Bearer <token> (replace <token> with the token received from login).

Click Send.

### 8. Get Team Tasks (Team Only)
Endpoint: GET /api/status

Description: Fetch tasks assigned to the logged-in team member.

Response (Success)
json

[
  {
    "id": 1,
    "title": "New Task",
    "description": "This is a new task.",
    "status": "Not Started",
    "assigned_to": 2,
    "created_by": 1,
    "created_at": "2023-10-10T12:00:00.000Z"
  }
]
Steps in Postman
Set the request method to GET.

Enter the URL: http://localhost:3000/api/status.

Go to the Headers tab and add:

Key: Authorization

Value: Bearer <token> (replace <token> with the token received from login).

Click Send.

### 9. Update Task Status (Team Only)
Endpoint: PUT /api/status/:id

Description: Update the status and description of a task (only accessible by the assigned team member).

Request Body (JSON)
json
Copy
{
  "status": "In Progress",
  "description": "Working on this task."
}
Response (Success)
json
Copy
{
  "id": 1,
  "title": "New Task",
  "description": "Working on this task.",
  "status": "In Progress",
  "assigned_to": 2,
  "created_by": 1,
  "created_at": "2023-10-10T12:00:00.000Z"
}
