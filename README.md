# Campus FixIt �️

A comprehensive mobile issue reporting system for university campuses. Students can report facility issues (electrical, water, etc.), and admins can track and resolve them.

### Demo - https://drive.google.com/file/d/1m12Gkqypf8eO3lMxAUsW7K9OUXtTUZ3X/view?usp=sharing

## ✨ Features

### 📱 Student App
- **Issue Reporting**: Capture photos and submit detailed reports.
- **My Issues Dashboard**: Track the status of your reported issues.
- **Filtering**: Easily filter issues by **Category** (Electrical, Water, etc.) and **Status** (Open, Resolved).
- **Notifications**: Receive email updates when an admin changes your issue status.

### 🖥️ Admin Dashboard
- **Issue Management**: View all reported issues in one place.
- **Status Updates**: Mark issues as 'In Progress' or 'Resolved' and add remarks.
- **Automatic Emails**: Updates trigger automatic emails to the student.

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (running locally or cloud)
- Expo CLI

### 1. Backend Setup

The backend handles the API, database connection, and email services.

```bash
cd backend
npm install
```

**Configuration (.env):**
Create a `.env` file in the `backend` folder:

**Start the Server:**
```bash
npm run dev
```

### 2. Frontend Setup (Mobile App)

```bash
# In the root directory
npm install
```

**Start the App:**
```bash
npx expo start
```
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

---

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, Expo Router, TypeScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Services**: Nodemailer (Emails), Multer (Image Uploads)
- **Auth**: JWT (JSON Web Tokens)
