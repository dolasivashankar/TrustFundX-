"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationVerifySchema = exports.DonationInitiateSchema = exports.CampaignCreateSchema = exports.LoginSchema = exports.RegisterSchema = exports.DisasterType = exports.CampaignStatus = exports.UserRole = void 0;
const zod_1 = require("zod");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "DRAFT";
    CampaignStatus["PENDING"] = "PENDING";
    CampaignStatus["ACTIVE"] = "ACTIVE";
    CampaignStatus["PAUSED"] = "PAUSED";
    CampaignStatus["COMPLETED"] = "COMPLETED";
    CampaignStatus["ARCHIVED"] = "ARCHIVED";
    CampaignStatus["CLOSED"] = "CLOSED";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
var DisasterType;
(function (DisasterType) {
    DisasterType["FLOOD"] = "FLOOD";
    DisasterType["EARTHQUAKE"] = "EARTHQUAKE";
    DisasterType["CYCLONE"] = "CYCLONE";
    DisasterType["WILDFIRE"] = "WILDFIRE";
    DisasterType["TSUNAMI"] = "TSUNAMI";
    DisasterType["LANDSLIDE"] = "LANDSLIDE";
    DisasterType["PANDEMIC"] = "PANDEMIC";
    DisasterType["DROUGHT"] = "DROUGHT";
    DisasterType["VOLCANO"] = "VOLCANO";
    DisasterType["HURRICANE"] = "HURRICANE";
    DisasterType["TORNADO"] = "TORNADO";
    DisasterType["OTHER"] = "OTHER";
})(DisasterType || (exports.DisasterType = DisasterType = {}));
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    username: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.CampaignCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Campaign name must be at least 3 characters'),
    description: zod_1.z.string().min(20, 'Description must be at least 20 characters'),
    shortDescription: zod_1.z.string().optional(),
    disasterType: zod_1.z.nativeEnum(DisasterType),
    country: zod_1.z.string().min(2, 'Country is required'),
    state: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    bannerImage: zod_1.z.string().url('Invalid image URL').optional(),
    goalAmount: zod_1.z.number().positive('Goal amount must be positive'),
    beneficiaryWallet: zod_1.z.string().min(58, 'Valid Algorand wallet address required'),
    expiryDate: zod_1.z.string().or(zod_1.z.date()),
    aiCategory: zod_1.z.string().optional(),
    priority: zod_1.z.number().int().min(0).max(10).optional(),
});
exports.DonationInitiateSchema = zod_1.z.object({
    campaignId: zod_1.z.string().min(1, 'Campaign ID required'),
    amount: zod_1.z.number().positive('Amount must be greater than 0'),
    donorWallet: zod_1.z.string().min(58, 'Valid Algorand wallet address required'),
    message: zod_1.z.string().max(500).optional(),
    isAnonymous: zod_1.z.boolean().optional(),
});
exports.DonationVerifySchema = zod_1.z.object({
    donationId: zod_1.z.string().min(1, 'Donation ID required'),
    algorandTxId: zod_1.z.string().min(50, 'Valid Algorand Transaction ID required'),
});
