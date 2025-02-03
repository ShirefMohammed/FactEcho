"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
var logger_1 = require("../config/logger");
var httpStatusText_1 = require("../utils/httpStatusText");
// Logger for general service
var generalLogger = (0, logger_1.getServiceLogger)("general");
var handleErrors = function (error, _req, res, _next) {
    console.error("Error from server: ".concat(error));
    generalLogger.error({ data: { error: error } }, "Internal server error");
    res.status(500).json({
        statusText: httpStatusText_1.httpStatusText.ERROR,
        message: "Internal server error",
    });
};
exports.handleErrors = handleErrors;
