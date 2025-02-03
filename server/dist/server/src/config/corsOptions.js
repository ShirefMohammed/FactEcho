"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: function (_origin, callback) {
        callback(null, true);
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    optionsSuccessStatus: 200,
};
