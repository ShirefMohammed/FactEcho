"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
dotenv_1.default.config();
var APIsVersionPaths = ["v1"].map(function (version) {
    return path_1.default.join(__dirname, "../routes/".concat(version, "/*.ts"));
});
var swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FactEcho API Documentation",
            version: "1.0.0",
            description: "API documentation for the FactEcho news application",
        },
        servers: [
            {
                url: "".concat(process.env.SERVER_URL, "/api/v1"),
                description: "Development Server v1",
            },
            {
                url: "".concat(process.env.SERVER_URL, "/api/v2"),
                description: "Development Server v2",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", // Optional, but helps specify it's a JWT token
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        name: { type: "string", description: "Name of the user" },
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email address",
                        },
                        password: { type: "string", description: "Hashed password" },
                        is_verified: {
                            type: "boolean",
                            description: "Verification status",
                        },
                        role: { type: "integer", description: "User role as a number" },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            description: "Creation timestamp",
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                        },
                        provider: { type: "string", description: "OAuth provider name" },
                        provider_user_id: {
                            type: "string",
                            description: "ID of the user in the OAuth provider",
                        },
                    },
                },
                UserOAuth: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        provider: { type: "string", description: "OAuth provider name" },
                        provider_user_id: {
                            type: "string",
                            description: "ID of the user in the OAuth provider",
                        },
                    },
                },
                Author: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        name: { type: "string", description: "Name of the user" },
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email address",
                        },
                        password: { type: "string", description: "Hashed password" },
                        is_verified: {
                            type: "boolean",
                            description: "Verification status",
                        },
                        role: { type: "integer", description: "User role as a number" },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            description: "Creation timestamp",
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                        },
                        provider: { type: "string", description: "OAuth provider name" },
                        provider_user_id: {
                            type: "string",
                            description: "ID of the user in the OAuth provider",
                        },
                        avatar: {
                            type: "string",
                            description: "Path to the user's avatar",
                        },
                        permissions: {
                            type: "object",
                            properties: {
                                create: {
                                    type: "boolean",
                                    description: "Permission to create articles",
                                },
                                update: {
                                    type: "boolean",
                                    description: "Permission to update articles",
                                },
                                delete: {
                                    type: "boolean",
                                    description: "Permission to delete articles",
                                },
                            },
                        },
                    },
                },
                UserVerificationToken: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        verification_token: {
                            type: "string",
                            description: "Verification token",
                        },
                    },
                },
                UserResetPasswordToken: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        reset_password_token: {
                            type: "string",
                            description: "Reset password token",
                        },
                    },
                },
                UserAvatar: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        avatar: { type: "string", description: "Path to the avatar file" },
                    },
                },
                Category: {
                    type: "object",
                    properties: {
                        category_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the category",
                        },
                        title: { type: "string", description: "Category title" },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            description: "Creation timestamp",
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                        },
                        creator_id: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Creator ID or null if deleted",
                        },
                    },
                },
                Article: {
                    type: "object",
                    properties: {
                        article_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the article",
                        },
                        title: { type: "string", description: "Article title" },
                        content: { type: "string", description: "Article content" },
                        image: {
                            type: "string",
                            description: "Path to the article image file",
                        },
                        views: {
                            type: "integer",
                            description: "Number of views",
                            default: 0,
                        },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            description: "Creation timestamp",
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                        },
                        category_id: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Category ID or null if deleted",
                        },
                        creator_id: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Creator ID or null if deleted",
                        },
                    },
                },
                UserSavedArticle: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        article_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the saved article",
                        },
                    },
                },
                AuthorPermissions: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string",
                            format: "uuid",
                            description: "UUID of the user",
                        },
                        create: {
                            type: "boolean",
                            description: "Permission to create articles",
                        },
                        update: {
                            type: "boolean",
                            description: "Permission to update articles",
                        },
                        delete: {
                            type: "boolean",
                            description: "Permission to delete articles",
                        },
                    },
                },
            },
        },
    },
    apis: APIsVersionPaths,
};
var swaggerSpecs = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.default = swaggerSpecs;
