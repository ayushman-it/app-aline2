# ALine Social App – Project Status

## Project Overview

**ALine** is a social media mobile application built using React Native for the mobile client and Node.js + Express.js for the backend API.

The application allows users to:

- Create accounts
- Login with OTP verification
- Create posts
- Follow other users
- View feeds
- Receive notifications
- Search users and profiles

The project is structured with **separate client and backend services** to ensure scalability and maintainability.

---

# Project Architecture

## Mobile Client

Built using **React Native with TypeScript**.

### Client Structure

```
src
 ├── api
 │   └── api.js
 │
 ├── navigation
 │   └── BottomTabs.js
 │
 └── screens
     ├── CreatePostScreen.tsx
     ├── FeedScreen.tsx
     ├── FollowersFollowingScreen.tsx
     ├── HomeScreen.tsx
     ├── LoginScreen.tsx
     ├── NotificationScreen.tsx
     ├── OtpVerifyScreen.tsx
     ├── ProfilePreviewScreen.tsx
     ├── ProfileScreen.tsx
     ├── ProfileView.tsx
     ├── SearchScreen.tsx
     └── SignupScreen.tsx
```

### Implemented Client Features

| Feature | Status |
|-------|-------|
User Authentication UI | Completed |
OTP Verification Screen | Completed |
Home Feed UI | Completed |
Search Users Screen | Completed |
Profile Screen | Completed |
Followers / Following UI | Completed |
Create Post Screen | Completed |
Notifications Screen | Completed |
Bottom Tab Navigation | Completed |
API Integration | In Progress |

---

# Backend API

Backend built with:

- Node.js
- Express.js
- MongoDB
- Mongoose

### Backend Structure

```
aline2-backend
 ├── config
 ├── controllers
 │   ├── authController.js
 │   ├── commentController.js
 │   ├── followController.js
 │   ├── likeController.js
 │   ├── notificationController.js
 │   └── postController.js
 │
 ├── middleware
 │
 ├── models
 │   ├── User.js
 │   ├── Profile.js
 │   ├── Post.js
 │   ├── Comment.js
 │   ├── Like.js
 │   ├── Follow.js
 │   └── Notification.js
 │
 ├── routes
 │   ├── authRoutes.js
 │   ├── commentRoutes.js
 │   ├── followRoutes.js
 │   ├── likeRoutes.js
 │   ├── notificationRoutes.js
 │   ├── postRoutes.js
 │   └── userRoutes.js
 │
 ├── utils
 │   └── createNotification.js
 │
 └── server.js
```

---

# Implemented Backend Features

| Feature | Status |
|------|------|
User Authentication API | Completed |
JWT Authentication | Completed |
Post API | Completed |
Comments API | Completed |
Like System | Completed |
Follow System | Completed |
Notifications System | Completed |
Real-time Notifications | In Progress |
Email / OTP Verification | In Progress |

---

# Tech Stack

## Mobile
- React Native
- TypeScript
- React Navigation
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

---

# Current Development Status

| Module | Status |
|------|------|
UI Development | Completed |
Backend APIs | Completed |
API Integration | In Progress |
Testing | Pending |
Deployment | Pending |

Overall Project Completion: **~75%**

---

# Next Development Steps

1. Complete API integration between mobile app and backend
2. Implement real-time notifications using Socket.IO
3. Optimize feed loading and caching
4. Perform end-to-end testing
5. Prepare production build and deployment

---

# Running the Project

## Client

```
npm install
npm start
npm run android
```

## Backend

```
npm install
npm start
```

---

# Notes

- UI and backend logic are mostly completed.
- Remaining work includes API integration, real-time features, and testing.
- The system is designed to scale and support additional features in the future.