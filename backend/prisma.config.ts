import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
    // @ts-ignore - Evita el falso error rojo de TypeScript en Prisma 7
    directUrl: env('DIRECT_URL'),
  },
});