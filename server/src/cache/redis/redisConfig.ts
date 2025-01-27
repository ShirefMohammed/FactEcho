import dotenv from "dotenv";
import { RedisClientType, createClient } from "redis";

dotenv.config();

/**
 * Redis client instance.
 * This will be initialized when `createRedisClient` is called.
 */
export let redisClient: RedisClientType;

/**
 * Creates and configures a Redis client.
 * - Connects to the Redis server using environment variables for configuration.
 * - Sets up error handling for the Redis client.
 *
 * @example
 * createRedisClient();
 *
 * @throws {Error} If the Redis client fails to connect or encounters an error.
 */
export const createRedisClient = async (): Promise<void> => {
  try {
    // Check if REDIS_URL is set
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL environment variable is not set.");
    }

    // Create the Redis client
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    // Handle connection errors
    redisClient.on("error", (error: Error) => {
      throw error;
    });

    // Log successful connection
    redisClient.on("connect", () => {
      console.log("Redis client connected successfully.");
    });

    // Connect to the Redis server
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to create Redis client:", error);
    process.exit(1); // Exit with general error code
  }
};
