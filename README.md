# 

This platform is a comprehensive health appointment booking system designed to simplify the process of scheduling medical checkups. Users can easily browse available time slots and book appointments for health checkups with registered doctors. The platform also supports:

Doctor Registration: Medical professionals can sign up, create a profile, and manage their availability for appointments.

Admin Dashboard: A secure admin login allows administrators to monitor and manage all appointment details, including user bookings and doctor registrations.

The system ensures a seamless experience for patients, doctors, and administrators, promoting efficient healthcare management through a user-friendly and secure interface.

## Website
https://dr-home-frontend.onrender.com/
https://dr-home-admin.onrender.com/

## Features

User Appointment Booking
.Patients can browse available time slots and book health checkups with ease.
Doctor Registration & Dashboard
.Doctors can sign up, complete their profiles, and manage their availability.
Admin Panel
.Admins have secure login access to view and manage all appointments, user data, and doctor registrations.
Online Payment Integration
.Integrated with Razorpay to securely handle payments for appointments during the booking process.
Real-Time Appointment Management
.Doctors and admins get updated schedules with booked and available time slots.
Responsive Design
.Optimized for mobile, tablet, and desktop views to ensure usability across devices.
Secure Authentication
.Role-based login for users, doctors, and admins to keep data secure.

## Tech Stack

Frontend
React.js – For building a dynamic, responsive user interface
React Router – For seamless navigation between user, doctor, and admin views
Axios – For making API requests to the backend
React Toastify – For elegant and customizable toast notifications
Razorpay Checkout.js – For integrating Razorpay payment gateway on the client side

Backend
Node.js – Runtime environment for building scalable backend services
Express.js – Web framework for handling REST APIs and routing
Razorpay Node SDK – To securely handle payments on the server side
jsonwebtoken (JWT) – For user, doctor, and admin authentication

Database
MongoDB – NoSQL database to store user, doctor, appointment, and payment data
Mongoose – ODM library to model and query MongoDB easily

Others
Cloudinary (optional) – For doctor profile image uploads and management
dotenv – To manage environment variables securely
bcryptjs – For password hashing and secure authentication


## Project Structure

- **frontend/**: Patient-facing UI
- **admin/**: Admin dashboard and Doctor dashboard
- **backend/**:  REST API, database, authentication, payments

## Getting Started

### Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB Atlas**

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/Dr.Home.git
    cd Dr.Home
    ```

2. **Install dependencies**:

    - Install backend dependencies:
      ```bash
      cd backend
      npm install
      ```

    - Install frontend dependencies:
      ```bash
      cd ../frontend
      npm install
      ```

      - Install admin dependencies:
      ```bash
      cd ../admin
      npm install
      ```

3. **Setup Database**:
    - Create a MongoDB database.
    - Update the `.env` file in the backend with your database credentials.

4. **Razorpay Setup**:
    - Get the Api-key and Secret-key from razorpay dashboard
    - - Update the `.env` file in the backend with your database credentials.

5. **Run the Application**:
    - Start the backend server:
      ```bash
      cd backend
      npm run server
      ```
    - Start the frontend server:
      ```bash
      cd frontend
      npm run dev
      ```
    - Start the admin server:
      ```bash
      cd admin
      npm run dev
      ```

6. **Access the Application**:
    - Open a browser and go to `http://localhost:5173` for the frontend.
    - Open a browser and go to `http://localhost:8000` for the admin.


## Future Scope

   -Doctor Availability Calendar for better scheduling
   -Medical Records Upload for patient history tracking
   -Chat & Video Consultations via WebRTC/Twilio
   -SMS/Email Reminders for upcoming appointments
   -Admin Analytics Dashboard for insights and reports
   -Mobile App for patients and doctors (React Native)
   -Multi-language Support to reach diverse users
   -Insurance & Payment Integration for claim management
   -Ratings & Feedback System for quality assurance 
   -AI-Based Doctor Recommendations based on user needs


## Contributing

Contributions are welcome! Please create a pull request for any enhancements, bug fixes, or new features.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
