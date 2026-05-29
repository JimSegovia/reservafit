"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const payments_controller_js_1 = require("./controllers/payments.controller.js");
const app = (0, express_1.default)();
// Middlewares globales indispensables
app.use((0, cors_1.default)());
app.post('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }), payments_controller_js_1.PaymentsController.handleWebhook);
app.use(express_1.default.json()); // Permite capturar los req.body en formato JSON
// Punto de montaje central para toda la API RESTful
app.use('/api', index_js_1.default);
// Capturador global para rutas inexistentes (404)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});
exports.default = app;
