import express from 'express';
import {ENV} from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import { inngest, functions } from "./lib/inngest.js";
// import { protectRoute } from './middleware/protectRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import sessionRoute from './routes/sessionRoute.js';

const app = express();
const __dirname = path.resolve();
//middlewares
app.use(express.json());
// credentials: true :-> server allows browser(frontend) to include cookie in requests
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); //this adds the Clerk middleware to handle authentication
//add auth field to the request object: req.auth()
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/chats', chatRoutes);
app.use('/api/sessions', sessionRoute);


app.get('/health', (req, res) => {
   res.status(200).json({ message: 'Api is up & running' });
});

//when you pass an array of middleware to express, it automatically flattens and execute them sequentially,
//one by one
// app.get('/video-calls', protectRoute, (req, res) => {
//    res.status(200).json({ message: 'Video Call Api is up & running' });
// });

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
   