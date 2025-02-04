// import app from "../src/server";
// export default app;
// import app, { initializeApp } from "../src/app";
// import { disconnectDB } from "../src/database";
// (async () => {
//   await initializeApp();
//   const _PORT = process.env.PORT;
//   // Gracefully shut down the server and close database connections
//   process.on("SIGINT", async () => {
//     console.log("Server is shutting down...");
//     await disconnectDB(); // Close database connections
//     process.exit(0); // Exit with success code
//   });
//   process.on("SIGTERM", async () => {
//     console.log("Received termination signal...");
//     await disconnectDB(); // Close database connections
//     process.exit(0); // Exit with success code
//   });
//   // Start the server
//   app.listen(_PORT, () => {
//     console.log(
//       "\x1b[32m%s\x1b[0m",
//       `Server running on ${process.env.SERVER_URL}`,
//     );
//     console.log(
//       "\x1b[36m%s\x1b[0m",
//       `Swagger running on ${process.env.SERVER_URL}/api-docs`,
//     );
//   });
// })();
import { runServer } from "../src/server";

runServer();
