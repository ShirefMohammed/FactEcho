import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Response } from "express";
import path from "node:path";
import passport from "passport";
import swaggerUi from "swagger-ui-express";

import { corsOptions } from "./config/corsOptions";
import "./config/passportConfig";
import swaggerSpecs from "./config/swaggerConfig";
import { connectDB } from "./database";
import { pool } from "./database/postgreSQL/connectToPostgreSQL";
import { handleCors } from "./middleware/handleCors";
import { handleErrors } from "./middleware/handleErrors";
import articlesRouterV1 from "./routes/v1/articlesRouter";
import authRouterV1 from "./routes/v1/authRouter";
import authorsRouterV1 from "./routes/v1/authorsRouter";
import categoriesRouterV1 from "./routes/v1/categoriesRouter";
import usersRouterV1 from "./routes/v1/usersRouter";
import { handleNotFoundRoutes } from "./utils/handleNotFoundRoutes";

dotenv.config();

(async function () {
  // Create server
  const app: Express = express();
  const _PORT = process.env.PORT;

  // Connect to database
  await connectDB();

  // Cross Origin Resource Sharing
  app.use(handleCors, cors(corsOptions));

  // Built-in middleware to handle urlencoded form data
  app.use(express.urlencoded({ extended: false }));

  // Built-in middleware for json
  app.use(express.json());

  // Middleware for cookies
  app.use(cookieParser());

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

  // Gracefully shut down the server and close database connections
  process.on("SIGINT", async () => {
    console.log("Server is shutting down...");
    await pool.end(); // Close database connections
    process.exit(0); // Exit with success code
  });

  process.on("SIGTERM", async () => {
    console.log("Received termination signal...");
    await pool.end(); // Close database connections
    process.exit(0); // Exit with success code
  });

  // Listen for requests
  app.listen(_PORT, () => {
    // Apply green color for "Server running"
    console.log(
      "\x1b[32m%s\x1b[0m",
      `Server running on ${process.env.SERVER_URL}`,
    );

    // Apply cyan color for "Swagger running"
    console.log(
      "\x1b[36m%s\x1b[0m",
      `Swagger running on ${process.env.SERVER_URL}/api-docs`,
    );
  });
})();
