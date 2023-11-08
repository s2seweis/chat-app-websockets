# Chat Application with React Frontend, MongoDB Database, and Express Server using Websockets

This repository contains a real-time chat application built with React for the frontend, an Express server for the backend, and MongoDB as the database. The communication between the client and server is established through Websockets, enabling seamless and instant messaging between users.

## Redesign and lifting the state for the Frontend:
- Example for how to redesign it: https://github.com/aliakbarzohour/RealTime-Chat-App
- Move socket.io into the express server if possible 

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Eslint](#eslint)
- [Important](#important)
- [Commands](#commands)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) database server running locally or a remote MongoDB connection URI

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/s2seweis/chat-app-websockets.git
   ```
   ```
   cd chat-app
   ```

2. Install dependencies for both frontend and backend:

   ```
   cd frontend
   ```
   ```
   npm install
   ```
   ```
   cd ../backend
   ```
   ```
   npm install
   ```

3. Create a `.config.env` file in the `backend` directory with the following content:

   ```plaintext
   MONGODB_URI=your_mongodb_connection_uri
   SECRET=
   ```

   Replace `your_mongodb_connection_uri` with the connection URI for your MongoDB database.

4. Start the MongoDB server and the Express backend:

   ```
   cd backend
   ```
   ```
   npm start
   ```

5. Start the React frontend:

   ```
   cd frontend
   ```
   ```
   npm start
   ```

Now, you can access the chat application in your web browser at `http://localhost:3000`. Users can create accounts, join chat rooms, and exchange real-time messages using Websockets.

## Project Structure

- `frontend`: Contains the React frontend code.
- `backend`: Contains the Express server and Websockets implementation.

## Features

- User authentication: Users can create accounts, log in, and log out.
- Real-time messaging: Messages are delivered instantly using Websockets.
- Chat rooms: Users can join different chat rooms and interact with other users in specific rooms.
- Responsive design: The application is responsive and works well on both desktop and mobile devices.

## Technologies Used

- **Frontend**: React, React Router, Websockets (Socket.io), CSS (Sass)
- **Backend**: Express.js, Websockets (Socket.io), MongoDB (Mongoose)
- **Other Tools**: Axios (HTTP requests), JWT (JSON Web Tokens) for authentication

# Eslint
***ESLint (find and fix Problems)***
1. 
```
npm install eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-import --save-dev
```
2. 
```
npx eslint --init
```

## Comment
If you want using npm run dev for concurrently you have to adjust the dot.en configuration in the /backend/server.js file

## Contributing

Contributions are welcome! Feel free to open issues or pull requests to improve the application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Happy chatting! 🚀