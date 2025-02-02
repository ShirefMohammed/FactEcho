"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceLogger = void 0;
var path_1 = __importDefault(require("path"));
var pino_1 = __importDefault(require("pino"));
var pino_multi_stream_1 = require("pino-multi-stream");
/**
 * Defines the directory where log files will be stored.
 */
var logsDir = path_1.default.resolve(__dirname, "../logs");
/**
 * Get the log level from environment variables, default to "info".
 */
var logLevel = process.env.PINO_LOG_LEVEL || "info";
/**
 * Creates a write stream for each service-specific log file.
 *
 * @param serviceName - Name of the service (e.g., "auth", "users").
 */
var createServiceStream = function (serviceName) {
    return {
        level: logLevel,
        stream: pino_1.default.destination("".concat(logsDir, "/").concat(serviceName, ".log")),
    };
};
/**
 * Custom stream that filters logs by service name.
 * It ensures only logs matching the `service` are written.
 */
var filterStream = function (serviceName) {
    var stream = createServiceStream(serviceName).stream;
    return {
        level: logLevel,
        stream: {
            write: function (log) {
                var parsedLog = JSON.parse(log);
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
var streams = (0, pino_multi_stream_1.multistream)([
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
var logger = (0, pino_1.default)({
    level: logLevel,
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    formatters: {
        level: function (label) {
            return { level: label.toUpperCase() }; // Format log levels to uppercase
        },
        bindings: function (bindings) {
            // Include service and any additional data passed to the log
            return __assign({ service: bindings.service }, bindings);
        },
    },
}, streams);
/**
 * Creates a child logger scoped to a specific service.
 * Passes service context for filtering and ensures data is logged.
 */
var getServiceLogger = function (serviceName) {
    return logger.child({ service: serviceName });
};
exports.getServiceLogger = getServiceLogger;
exports.default = logger;
