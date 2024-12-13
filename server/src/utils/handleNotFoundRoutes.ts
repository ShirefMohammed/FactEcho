import { Request, Response } from "express";
import path from "path";

/**
 * Handles requests to undefined or non-existent routes.
 *
 * This middleware checks the request's `Accept` header to determine whether
 * to respond with an HTML page, a JSON response, or plain text when a route
 * is not found. It sends a 404 error along with the appropriate response.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 *
 * @returns {void} This function does not return a value, but it sends a response.
 */
export const handleNotFoundRoutes = (req: Request, res: Response): void => {
  res.status(404);

  // Check if the client accepts HTML, JSON, or plain text
  if (req.accepts("html")) {
    // Serve the 404 HTML page
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    // Return a JSON response with a 404 message
    res.json({ message: "404 Not Found" });
  } else {
    // Return a plain text response for other formats
    res.type("txt").send("404 Not Found");
  }
};
