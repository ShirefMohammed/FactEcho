import dotenv from "dotenv";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const APIsVersionPaths = ["v1"].map((version) =>
  path.join(__dirname, `../routes/${version}/*.ts`),
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FactEcho API Documentation",
      version: "1.0.0",
      description: "API documentation for the FactEcho news application",
    },
    servers: [
      {
        url: `${process.env.SERVER_URL}/api/v1`,
        description: "Development Server v1",
      },
      {
        url: `${process.env.SERVER_URL}/api/v2`,
        description: "Development Server v2",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, but helps specify it's a JWT token
        },
      },
    },
  },
  apis: APIsVersionPaths,
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;
