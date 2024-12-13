import path from "path";
import pino, { LevelWithSilent, Logger } from "pino";
import { multistream } from "pino-multi-stream";

/**
 * Defines the directory where log files will be stored.
 */
const logsDir = path.resolve(__dirname, "../logs");

/**
 * Get the log level from environment variables, default to "info".
 */
const logLevel: LevelWithSilent =
  (process.env.PINO_LOG_LEVEL as LevelWithSilent) || "info";

/**
 * Creates a write stream for each service-specific log file.
 *
 * @param serviceName - Name of the service (e.g., "auth", "users").
 */
const createServiceStream = (serviceName: string) => {
  return {
    level: logLevel,
    stream: pino.destination(`${logsDir}/${serviceName}.log`),
  };
};

/**
 * Custom stream that filters logs by service name.
 * It ensures only logs matching the `service` are written.
 */
const filterStream = (serviceName: string) => {
  const stream = createServiceStream(serviceName).stream;
  return {
    level: logLevel,
    stream: {
      write: (log: string) => {
        const parsedLog = JSON.parse(log);
        if (parsedLog.service === serviceName) {
          stream.write(log);
        }
      },
    },
  };
};

/**
 * Multistream configuration to route logs to the correct service files.
 */
const streams = multistream([
  filterStream("general"),
  filterStream("auth"),
  filterStream("users"),
  filterStream("authors"),
  filterStream("categories"),
  filterStream("articles"),
]);

/**
 * Main logger instance configuration.
 */
const logger: Logger = pino(
  {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label.toUpperCase() }; // Format log levels to uppercase
      },
      bindings(bindings) {
        // Include service and any additional data passed to the log
        return { service: bindings.service, ...bindings };
      },
    },
  },
  streams,
);

/**
 * Creates a child logger scoped to a specific service.
 * Passes service context for filtering and ensures data is logged.
 */
export const getServiceLogger = (
  serviceName:
    | "general"
    | "auth"
    | "users"
    | "authors"
    | "categories"
    | "articles",
): Logger => {
  return logger.child({ service: serviceName });
};

export default logger;
