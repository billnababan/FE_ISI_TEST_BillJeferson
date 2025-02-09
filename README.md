This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# TodoAppNextjs

A simple Todo application built using Next.js. This application allows users to manage their tasks, including adding, updating, and deleting todos.

## Table of Contents
#### Project Setup

#### Technologies Used

#### Features

#### Installation Guide

#### Running the Development Server

#### API Endpoints

#### Testing

Project Setup
1. Clone the Repository
To get started, clone the repository to your local machine:

#### git clone https://github.com/billnababan/TodoAppNextjs.git
cd TodoAppNextjs
Technologies Used


### Install dependencies:
#### npm install
Start the development server:

#### npm run dev
Open your browser and navigate to http://localhost:3000.

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

