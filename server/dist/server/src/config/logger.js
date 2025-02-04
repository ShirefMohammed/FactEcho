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
var logsDir = process.env.NODE_ENV === "production"
    ? "/tmp/logs"
    : path_1.default.resolve(__dirname, "../logs");
var logLevel = process.env.PINO_LOG_LEVEL || "info";
var createServiceStream = function (serviceName) {
    if (process.env.NODE_ENV === "production") {
        return {
            level: logLevel,
            stream: process.stdout,
        };
    }
    else {
        return {
            level: logLevel,
            stream: pino_1.default.destination("".concat(logsDir, "/").concat(serviceName, ".log")),
        };
    }
};
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
var streams = (0, pino_multi_stream_1.multistream)([
    filterStream("general"),
    filterStream("auth"),
    filterStream("users"),
    filterStream("authors"),
    filterStream("categories"),
    filterStream("articles"),
]);
var logger = (0, pino_1.default)({
    level: logLevel,
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    formatters: {
        level: function (label) {
            return { level: label.toUpperCase() };
        },
        bindings: function (bindings) {
            return __assign({ service: bindings.service }, bindings);
        },
    },
}, streams);
var getServiceLogger = function (serviceName) {
    return logger.child({ service: serviceName });
};
exports.getServiceLogger = getServiceLogger;
exports.default = logger;
