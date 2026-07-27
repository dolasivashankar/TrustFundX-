"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', auth_controller_1.authController.register);
exports.authRouter.post('/login', auth_controller_1.authController.login);
exports.authRouter.post('/logout', auth_middleware_1.authenticate, auth_controller_1.authController.logout);
exports.authRouter.post('/forgot-password', auth_controller_1.authController.forgotPassword);
exports.authRouter.post('/reset-password', auth_controller_1.authController.resetPassword);
exports.authRouter.get('/verify-email', auth_controller_1.authController.verifyEmail);
exports.authRouter.post('/refresh-token', auth_controller_1.authController.refreshToken);
exports.authRouter.get('/me', auth_middleware_1.authenticate, auth_controller_1.authController.getMe);
exports.authRouter.put('/me', auth_middleware_1.authenticate, auth_controller_1.authController.updateProfile);
exports.authRouter.post('/connect-wallet', auth_middleware_1.authenticate, auth_controller_1.authController.connectWallet);
//# sourceMappingURL=auth.routes.js.map