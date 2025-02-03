"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCors = void 0;
var allowedOrigins_1 = require("../config/allowedOrigins");
var httpStatusText_1 = require("../utils/httpStatusText");
var handleCors = function (req, res, next) {
    var _a, _b;
    var allowedOrigins = (0, allowedOrigins_1.getAllowedOrigins)();
    if (allowedOrigins.includes(req.headers.origin) ||
        ((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) === "testing" ||
        ((_b = process.env.NODE_ENV) === null || _b === void 0 ? void 0 : _b.trim()) === "development" ||
        req.url === "/" ||
        req.url.startsWith("/api/v1/auth/verify-account") ||
        req.url.startsWith("/api/v1/auth/reset-password")) {
        next();
    }
    else {
        res.status(403).json({
            statusText: httpStatusText_1.httpStatusText.FAIL,
            message: "Not allowed by CORS",
        });
    }
};
exports.handleCors = handleCors;
