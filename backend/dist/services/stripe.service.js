"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
exports.toAmountInCents = toAmountInCents;
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('Falta STRIPE_SECRET_KEY en variables de entorno');
}
exports.stripe = new stripe_1.default(stripeSecretKey);
function toAmountInCents(amount) {
    return Math.round(amount * 100);
}
