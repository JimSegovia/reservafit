"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_controller_js_1 = require("../controllers/payments.controller.js");
const router = (0, express_1.Router)();
router.post('/create-payment-intent', payments_controller_js_1.PaymentsController.createPaymentIntent);
exports.default = router;
