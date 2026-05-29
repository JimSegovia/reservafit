"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
class UsuarioRepository {
    // 1. Verificar si el correo ya está registrado en Cuentas
    static async buscarPorCorreo(correo) {
        return prisma_js_1.default.cuenta.findUnique({
            where: { correo_electronico: correo }
        });
    }
    // 2. Crear Usuario y Cuenta en una sola transacción
    static async crearUsuarioConCuenta(data, contrasenaHasheada) {
        // Usamos una transacción para que, si falla la cuenta, el usuario tampoco se cree
        return prisma_js_1.default.$transaction(async (tx) => {
            const nuevoUsuario = await tx.usuario.create({
                data: {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    celular: data.celular,
                }
            });
            const nuevaCuenta = await tx.cuenta.create({
                data: {
                    id_usuario: nuevoUsuario.id_usuario,
                    correo_electronico: data.correo_electronico,
                    contrasena: contrasenaHasheada, // ¡Guardamos el hash, no el texto plano!
                    rol: data.rol || 'Cliente'
                }
            });
            // Retornamos los datos combinados, pero OMITIMOS la contraseña por seguridad
            const { contrasena, ...cuentaSinPassword } = nuevaCuenta;
            return { usuario: nuevoUsuario, cuenta: cuentaSinPassword };
        });
    }
}
exports.UsuarioRepository = UsuarioRepository;
