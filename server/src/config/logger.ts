import path from "path";
import pino, { LevelWithSilent, Logger } from "pino";
import { multistream } from "pino-multi-stream";

const logsDir =
  process.env.NODE_ENV === "production"
    ? "/tmp/logs"
    : path.resolve(__dirname, "../logs");

const logLevel: LevelWithSilent =
  (process.env.PINO_LOG_LEVEL as LevelWithSilent) || "info";

const createServiceStream = (serviceName: string) => {
  if (process.env.NODE_ENV === "production") {
    return {
      level: logLevel,
      stream: process.stdout,
    };
  } else {
    return {
      level: logLevel,
      stream: pino.destination(`${logsDir}/${serviceName}.log`),
    };
  }
};

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

const streams = multistream([
  filterStream("general"),
  filterStream("auth"),
  filterStream("users"),
  filterStream("authors"),
  filterStream("categories"),
  filterStream("articles"),
]);

const logger: Logger = pino(
  {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      },
      bindings(bindings) {
        return { service: bindings.service, ...bindings };
      },
    },
  },
  streams,
);

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
