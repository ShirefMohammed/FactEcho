import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Slow down repeated requests
export const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 30, // Allow 30 requests per windowMs before slowing down
  delayMs: (used, req) => {
    // Calculate delay dynamically based on the number of requests
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500; // Delay each subsequent request by 500ms
  },
});
