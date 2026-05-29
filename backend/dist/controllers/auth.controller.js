"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
class AuthController {
    static async register(req, res) {
        try {
            const data = req.body;
            // Llamamos al servicio
            const nuevoRegistro = await auth_service_js_1.AuthService.registrarUsuario(data);
            res.status(201).json({
                mensaje: 'Usuario registrado con éxito',
                data: nuevoRegistro
            });
        }
        catch (error) {
            // Si el servicio lanza un error (ej. "correo ya registrado"), lo atrapamos aquí
            res.status(400).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
