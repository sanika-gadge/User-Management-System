# User Management System

## Project Description
User Management System is a REST API developed using Node.js, Express.js and MongoDB.
It allows users to be created, viewed, updated, deleted and authenticated securely.

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Postman

## Features
- Create User
- Get All Users
- Get User by ID
- Update User
- Delete User
- User Login
- JWT Authentication
- Protected Profile
- Password Hashing
- Email Validation
- Duplicate Email Handling

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/users | Create User |
| GET | /api/users | Get All Users |
| GET | /api/users/:id | Get User by ID |
| PUT | /api/users/:id | Update User |
| DELETE | /api/users/:id | Delete User |
| POST | /api/users/login | User Login |
| GET | /api/users/profile | Protected Profile |

## Security
- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Passwords are not returned in API responses.
- Environment variables are stored in `.env`.

## How to Run

```bash
npm install
node server.js
