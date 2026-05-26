import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg'; 
import 'dotenv/config';

// 1. Instanciamos el Pool nativo de pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// 2. Le pasamos el Pool al adaptador
const adapter = new PrismaPg(pool);

// 3. Inyectamos el adaptador al cliente de Prisma
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

export default prisma;