# File Management System with Express, Prisma, and Passport.js

## Overview

This project is a file management system built with Node.js using the Express framework, Prisma ORM, and Passport.js for authentication. The system allows users to create folders, upload files, view file details, and download them. The project also includes session-based authentication with sessions persisted in a PostgreSQL database using Prisma and the Prisma session store library. Files are uploaded and stored in Cloudinary, a cloud-based media management service. Additionally, the application allows users to share folders with a time-bound shareable link.

## Features

### Authentication

- **Session-Based Authentication**: User authentication is handled using Passport.js. Sessions are persisted in a PostgreSQL database using the Prisma session store.

### Folder and File Management

- **CRUD Folders**: Users can create, read, update, and delete folders.
- **File Upload**: Users can upload files to specific folders. The files are stored in Cloudinary, and the file URLs are saved in the database.
- **File Details**: Users can view specific details about a file, such as its name, size, and upload time.
- **File Download**: Users can download files directly from the application.

### File Upload and Storage

- **Multer Integration**: Multer middleware is used for handling file uploads. Uploaded files are temporarily stored in the request before being uploaded to Cloudinary.
- **Cloudinary Storage**: Files are stored in Cloudinary, and the file URLs are saved in the PostgreSQL database.

### Shareable Folders (Extra Credit)

- **Folder Sharing**: Users can generate shareable links to folders, allowing unauthenticated users to access the folder and its contents for a specified duration (e.g., 1 day, 10 days).
- **Time-Limited Access**: The shared link will expire after the specified duration.

## Project Setup

### Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v14 or later)
- PostgreSQL
- Cloudinary account

### Installation

1. Clone the repository:

    git clone https://github.com/SamuelFerfort/file-uploader.git
    cd file-uploader

2. Install dependencies:

    npm install

3. Set up environment variables:

   Create a .env file in the root of your project and add the following variables:

    DATABASE_URL="postgresql://username:password@localhost:5432/databasename"
    SESSION_SECRET="your_session_secret"
    CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"

4. Initialize the database:

   Run the Prisma migrations to set up your PostgreSQL database:

    npx prisma migrate dev

5. Run the application:

    npm start

   The application will be available at http://localhost:3000.
