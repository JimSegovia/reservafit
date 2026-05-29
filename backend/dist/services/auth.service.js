"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const usuario_repository_js_1 = require("../repositories/usuario.repository.js");
const bcrypt_util_js_1 = require("../utils/bcrypt.util.js");
class AuthService {
    static async registrarUsuario(data) {
        // 1. Verificamos que el correo no exista
        const cuentaExistente = await usuario_repository_js_1.UsuarioRepository.buscarPorCorreo(data.correo_electronico);
        if (cuentaExistente) {
            throw new Error('El correo electrónico ya está registrado');
        }
        // 2. Encriptamos la contraseña
        const contrasenaHasheada = await (0, bcrypt_util_js_1.hashPassword)(data.contrasena);
        // 3. Mandamos a guardar a la base de datos
        const resultado = await usuario_repository_js_1.UsuarioRepository.crearUsuarioConCuenta(data, contrasenaHasheada);
        return resultado;
    }
}
exports.AuthService = AuthService;
