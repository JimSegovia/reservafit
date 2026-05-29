"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const prisma_js_1 = __importDefault(require("./config/prisma.js"));
require("dotenv/config");
const PORT = process.env.PORT || 300;
async function bootstrap() {
    try {
        // Validamos la conexión lanzando una consulta rápida antes de levantar el puerto
        await prisma_js_1.default.$queryRaw `SELECT 1`;
        console.log('✅ Conexión nativa a la base de datos en Railway establecida de forma segura.');
        // Inicializamos la escucha del servidor HTTP
        app_js_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor de ReservaFit corriendo de manera exitosa en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Error crítico al inicializar los servicios del backend:', error);
        process.exit(1); // Detiene la ejecución si no hay base de datos disponible
    }
}
bootstrap();
