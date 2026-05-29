"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
// 1. Instanciamos el Pool nativo de pg
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// 2. Le pasamos el Pool al adaptador
const adapter = new adapter_pg_1.PrismaPg(pool);
// 3. Inyectamos el adaptador al cliente de Prisma
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['error', 'warn'],
});
exports.default = prisma;
