import express from 'express';
import {ENV} from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

const app = express();
const __dirname = path.resolve();

//middlewares
app.use(express.json());
// credentials: true :-> server allows browser(frontend) to include cookie in requests
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));


app.use("/api/inngest", serve({ client: inngest, functions }));

console.log('Environment Variables:', ENV.PORT)

app.get('/health', (req, res) => {
   res.status(200).json({ message: 'Api is up & running' });
});

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
   