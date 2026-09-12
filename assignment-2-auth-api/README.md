# User Authentication REST API

A RESTful User Authentication API built using Node.js, Express.js, MongoDB, bcryptjs, and JWT.

## Features

- User registration
- Password hashing using bcryptjs
- User login
- JWT token generation
- Protected profile route
- MongoDB database integration
- Environment variables using dotenv

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- dotenv
- CORS
- Postman

## API Endpoints

### Register User

**POST**
`/api/auth/register`

Example:

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "Test@12345"
}