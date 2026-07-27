"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationRouter = void 0;
const express_1 = require("express");
const donation_controller_1 = require("../controllers/donation.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.donationRouter = (0, express_1.Router)();
exports.donationRouter.post('/initiate', auth_middleware_1.optionalAuth, donation_controller_1.donationController.initiate);
exports.donationRouter.post('/verify', auth_middleware_1.optionalAuth, donation_controller_1.donationController.verify);
exports.donationRouter.get('/tx/:txId', donation_controller_1.donationController.getByTxId);
exports.donationRouter.get('/my', auth_middleware_1.authenticate, donation_controller_1.donationController.getMyDonations);
//# sourceMappingURL=donations.routes.js.map