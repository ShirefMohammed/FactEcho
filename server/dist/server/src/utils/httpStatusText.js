"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStatusText = void 0;
var httpStatusText;
(function (httpStatusText) {
    httpStatusText["SUCCESS"] = "success";
    httpStatusText["FAIL"] = "fail";
    httpStatusText["ERROR"] = "error";
    httpStatusText["AccessTokenExpiredError"] = "accessTokenExpiredError";
    httpStatusText["RefreshTokenExpiredError"] = "refreshTokenExpiredError";
})(httpStatusText || (exports.httpStatusText = httpStatusText = {}));
