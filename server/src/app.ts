import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Response } from "express";
import helmet from "helmet";
import path from "node:path";
import passport from "passport";
import swaggerUi from "swagger-ui-express";

import { initializeCache } from "./cache";
import { corsOptions } from "./config/corsOptions";
import "./config/passportConfig";
import swaggerSpecs from "./config/swaggerConfig";
import { connectDB } from "./database";
import { handleCors } from "./middleware/handleCors";
import { handleErrors } from "./middleware/handleErrors";
import { rateLimiter, speedLimiter } from "./middleware/limiter";
import articlesRouterV1 from "./routes/v1/articlesRouter";
import authRouterV1 from "./routes/v1/authRouter";
import authorsRouterV1 from "./routes/v1/authorsRouter";
import categoriesRouterV1 from "./routes/v1/categoriesRouter";
import usersRouterV1 from "./routes/v1/usersRouter";
import { handleNotFoundRoutes } from "./utils/handleNotFoundRoutes";

dotenv.config();

const app: Express = express();

export const initializeApp = async () => {
  // Connect to database
  await connectDB();

  // Initialize cache
  await initializeCache();

  // Security middleware
  app.use(helmet()); // Sets various HTTP headers to secure the app (e.g., XSS protection, no sniff, etc.)
  app.use(compression()); // Compresses response bodies to reduce size and improve performance

  // Rate limiting
  app.use(rateLimiter); // Limits the number of requests from a single IP to prevent abuse

  // Slow down repeated requests
  app.use(speedLimiter); // Slows down repeated requests from a single IP to mitigate DoS attacks

  // CORS
  app.use(handleCors, cors(corsOptions)); // Handles Cross-Origin Resource Sharing (CORS) to allow only trusted origins

  // Built-in middleware to handle urlencoded form data
  app.use(express.urlencoded({ extended: false, limit: "100kb" })); // Parses URL-encoded data with a 100kb limit

  // Built-in middleware for JSON
  app.use(express.json({ limit: "100kb" })); // Parses JSON data with a 100kb limit

  // Middleware for cookies
  app.use(cookieParser()); // Parses cookies attached to the client request

  // Initialize passport to handle OAuth
  app.use(passport.initialize());

  // Routes - HealthZ
  app.get("/", (_, res: Response) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
  });

  // V1 API Routes
  app.use("/api/v1/auth", authRouterV1);
  app.use("/api/v1/users", usersRouterV1);
  app.use("/api/v1/authors", authorsRouterV1);
  app.use("/api/v1/categories", categoriesRouterV1);
  app.use("/api/v1/articles", articlesRouterV1);

  // Swagger setup
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "testing"
  ) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  }

  // Handle not found routes
  app.all("*", handleNotFoundRoutes);

  // Handle error middleware
  app.use(handleErrors);
};

export default app;
