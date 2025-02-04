"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
var httpStatusText_1 = require("../utils/httpStatusText");
var verifyRole = function () {
    var allowedRoles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedRoles[_i] = arguments[_i];
    }
    return function (_req, res, next) {
        var _a, _b;
        if (!allowedRoles.includes((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.userInfo) === null || _b === void 0 ? void 0 : _b.role)) {
            return res.status(403).json({
                statusText: httpStatusText_1.httpStatusText.FAIL,
                message: "You don't have access to this resource.",
            });
        }
        next();
    };
};
exports.verifyRole = verifyRole;
