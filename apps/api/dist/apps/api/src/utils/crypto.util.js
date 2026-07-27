"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.hashString = exports.verifyHmacSignature = exports.generateHmacSignature = exports.generateRandomToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomToken = (bytes = 32) => {
    return crypto_1.default.randomBytes(bytes).toString('hex');
};
exports.generateRandomToken = generateRandomToken;
const generateHmacSignature = (data, secret) => {
    return crypto_1.default.createHmac('sha256', secret).update(data).digest('hex');
};
exports.generateHmacSignature = generateHmacSignature;
const verifyHmacSignature = (data, signature, secret) => {
    const expected = (0, exports.generateHmacSignature)(data, secret);
    return crypto_1.default.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};
exports.verifyHmacSignature = verifyHmacSignature;
const hashString = (input) => {
    return crypto_1.default.createHash('sha256').update(input).digest('hex');
};
exports.hashString = hashString;
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=crypto.util.js.map