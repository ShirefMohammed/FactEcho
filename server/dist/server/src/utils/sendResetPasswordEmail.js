"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
var transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
var sendResetPasswordEmail = function (destEmail, resetPasswordToken) { return __awaiter(void 0, void 0, void 0, function () {
    var resetPasswordLink, mailOptions, info, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resetPasswordLink = "".concat(process.env.SERVER_URL, "/api/v1/auth/reset-password?resetPasswordToken=").concat(resetPasswordToken);
                mailOptions = {
                    from: process.env.EMAIL_SERVICE_USER,
                    to: destEmail,
                    subject: "FactEcho Account Reset Password",
                    html: "\n      <html>\n\n      <head>\n        <style>\n          body {\n            font-family: Arial, sans-serif;\n            direction: rtl;\n            text-align: right;\n            background-color: #f4f4f4;\n            margin: 0;\n            padding: 0;\n          }\n\n          .container {\n            max-width: 600px;\n            margin: auto;\n            padding: 20px;\n            border: 1px solid #ccc;\n            border-radius: 8px;\n            background-color: #ffffff;\n          }\n\n          .button {\n            display: inline-block;\n            padding: 12px 24px;\n            background-color: #007bff;\n            color: #fff !important;\n            text-decoration: none;\n            border-radius: 5px;\n            font-weight: bold;\n          }\n\n          .button:hover {\n            background-color: #0056b3;\n          }\n\n          p {\n            font-size: 16px;\n            line-height: 1.6;\n          }\n\n          .note {\n            font-size: 14px;\n            color: #555;\n          }\n        </style>\n      </head>\n\n      <body>\n        <div class=\"container\">\n          <p>\u0645\u0631\u062D\u0628\u064B\u0627\u060C</p>\n          <p>\u064A\u0631\u062C\u0649 \u0627\u062A\u0628\u0627\u0639 \u0627\u0644\u0631\u0627\u0628\u0637 \u0644\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643:</p>\n          <a href=\"".concat(resetPasswordLink, "\" class=\"button\">\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631</a>\n          <p class=\"note\">\u0645\u0644\u0627\u062D\u0638\u0629: \u0633\u064A\u0646\u062A\u0647\u064A \u0635\u0644\u0627\u062D\u064A\u0629 \u0647\u0630\u0627 \u0627\u0644\u0631\u0627\u0628\u0637 \u0628\u0639\u062F 15 \u062F\u0642\u064A\u0642\u0629.</p>\n          <p>\u0625\u0630\u0627 \u0644\u0645 \u062A\u0637\u0644\u0628 \u0630\u0644\u0643\u060C \u064A\u0631\u062C\u0649 \u062A\u062C\u0627\u0647\u0644 \u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A.</p>\n          <p>\u0634\u0643\u0631\u064B\u0627\u060C</p>\n          <p>FactEcho</p>\n        </div>\n      </body>\n\n      </html>\n    "),
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                info = _a.sent();
                console.log("Reset Password Email sent: " + info.response);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error sending reset password email:", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendResetPasswordEmail = sendResetPasswordEmail;
