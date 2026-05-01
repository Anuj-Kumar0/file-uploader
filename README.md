# File Uploader API

This project allows users to securely upload and manage files. It includes features for both file uploading and file management, with authentication and role-based access.

## Project Structure

- **Backend (API)**: Built with Node.js, Express, and Supabase for storage and authentication.
- **Frontend**: A simple interface for users to upload files and manage them.
  
## Features

- **File Upload**: Users can upload files to the server.
- **File Management**: Users can view, delete, and download their uploaded files.
- **Authentication**: JWT-based authentication to manage file access.
- **Role-based Access**: Only authenticated users can upload, delete, or manage files.

## Tech Stack

- **Backend**: Node.js, Express, Supabase, JWT
- **Frontend**: Vanilla JavaScript, Fetch API
- **Database**: Supabase (for authentication and file storage)

- Install Backend Dependencies

-Navigate to the backend folder and install the necessary dependencies:

-cd backend
-npm install
-Set Up Environment Variables

-Create a .env file in the root of the project and add the following configuration values:
-SUPABASE_URL=https://vtapbufgudwjfygdlsvx.supabase.co
-SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
-SESSION_SECRET=fileuploader123

-Make sure to replace your-supabase-url and your-supabase-api-key with the credentials from your Supabase project.

-Run Migrations

-Set up the database and run migrations:

-npx prisma migrate dev
-Start the Backend API

-To start the backend API:

-npm start
-Install Frontend Dependencies

-Navigate to the frontend folder and install the necessary dependencies:

-cd frontend
-npm install
-Start the Frontend

-To start the frontend, run:

-npm start
-API Endpoints
-Authentication
-POST /api/auth/login
-Authenticate a user and receive a JWT for future requests.

-Request Body:

{
  "email": "user@example.com",
  "password": "password123"
}

-Response:

{
  "token": "your-jwt-token"
}
-File Upload
-POST /upload
-Upload a file to Supabase storage.
-Headers:
-Authorization: Bearer <JWT>
-Request Body: multipart/form-data with the file to upload.

-Response:

{
  "fileUrl": "https://supabase.storage-url.com/your-file"
}
-File Management
-GET /files
-List all uploaded files for the authenticated user.
-Headers:
-Authorization: Bearer <JWT>

-Response:

[
  {
    "id": 1,
    "fileUrl": "https://supabase.storage-url.com/your-file",
    "uploadedAt": "2023-05-01T12:00:00Z"
  }
]
-DELETE /files/:id
-Delete a specific uploaded file.
-Headers:
-Authorization: Bearer <JWT>

-Response:

{
  "message": "File deleted successfully"
}
##Authentication
-Login returns a JWT, which is used to authenticate admin requests.
-Send JWT in the Authorization: Bearer <token> header for all protected routes.

##Deployment
-Backend: Deployed on Railway
-Frontend: Deployed on Vercel
-Live Link: https://file-uploader-production-18c4.up.railway.app/
