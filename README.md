# REST API Service Using Express and MySQL

This service provides a REST API for managing user authentication and file operations. It uses JWT for authentication and supports multiple devices under a single user account.

## Features

- **User Authentication**: Secure login and signup processes using JWT for session management.
- **File Management**: Upload, download, delete, and update files with properties stored in MySQL.
- **Security**: CORS enabled for cross-origin requests, and secure token handling with refresh tokens.
- **Scalability**: Containerized with Docker for easy deployment and scaling.

## API Endpoints

- `POST /signin` - Authenticate user and return a bearer token.
- `POST /signin/new_token` - Refresh the bearer token using a refresh token.
- `POST /signup` - Register a new user and return token pair (bearer and refresh).
- `GET /info` - Retrieve user id of the current session.
- `GET /logout` - Logout from the system and invalidate the current tokens.
- `POST /file/upload` - Upload a new file and store its details in the database.
- `GET /file/list` - List files with pagination.
- `DELETE /file/delete/:id` - Delete a specific file from the database and storage.
- `GET /file/:id` - Retrieve details of a specific file.
- `GET /file/download/:id` - Download a specific file.
- `PUT /file/update/:id` - Update an existing file in the database and storage.
