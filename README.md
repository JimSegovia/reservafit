# ReservaFit — Plataforma de Gestión y Reserva de Clases

ReservaFit es una aplicación completa para la gestión y reserva de clases deportivas y recreativas. Cuenta con un backend robusto con Node.js, Express y Prisma (PostgreSQL), y un frontend moderno desarrollado con React Native (Expo) y NativeWind.

---

## 🚀 Desarrollo Local

Para levantar el proyecto en tu entorno de desarrollo, sigue los siguientes pasos:

### 1. Requisitos Previos
- **Node.js** (v18 o superior recomendado)
- **Docker** y **Docker Compose**
- **Expo Go** (opcional, si deseas probar en dispositivos móviles físicos)

### 2. Base de Datos Local con Docker
Levanta una instancia local de PostgreSQL utilizando el archivo `docker-compose.yml` provisto en la raíz:
```bash
docker compose up -d
```
Esto creará y ejecutará un contenedor de PostgreSQL en el puerto `5432` con las credenciales:
* **Usuario:** `postgres`
* **Contraseña:** `postgres`
* **Base de Datos:** `reservafit`

### 3. Configuración del Backend
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea tu archivo de entorno a partir de la plantilla `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
   *(Esto generará automáticamente el cliente de Prisma)*
4. Aplica las migraciones a tu base de datos local de Docker:
   ```bash
   npx prisma db push
   ```
5. Inicia el servidor backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   El backend estará escuchando en `http://localhost:3000`.

### 🔑 Código de Verificación OTP Maestro (`000000`)
Durante el desarrollo local o pruebas de control de calidad, **puedes utilizar el código de verificación permanente `000000`** para activar cualquier cuenta de usuario registrada al instante. Esto te permite registrarte y validar cuentas sin esperar el correo del servicio de Resend.

---

### 4. Configuración del Frontend
1. Navega a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias de Expo y React Native:
   ```bash
   npm install
   ```
3. Inicia la aplicación en el navegador o emulador:
   - Para iniciar en la Web:
     ```bash
     npm run web
     ```
   - Para iniciar con Expo Start (código QR para móviles):
     ```bash
     npm run start
     ```

---

## ☁️ Flujo de Trabajo en Git y Despliegue (Vercel & Railway)

El proyecto utiliza una rama principal única: **`main`**.

Cuando ejecutas un comando de Git Push:
```bash
git add .
git commit -m "feat: descripción de tus cambios"
git push origin main
```

Esto activa de forma automatizada los flujos de Integración y Despliegue Continuo (CI/CD):

### 🚂 Railway (Backend)
- **Rama enlazada:** `main`
- **Puerto configurado:** `10000`
- **¿Qué pasa al hacer push?**
  1. Railway detecta el cambio en la rama `main` y descarga la actualización.
  2. Ejecuta `npm install` (instalando dependencias y autogenerando Prisma client).
  3. Ejecuta `npm run build` para compilar TypeScript.
  4. Levanta el servidor productivo corriendo `npm run start` en el puerto `10000`.
  5. Se conecta de manera segura a la base de datos PostgreSQL alojada en **Supabase** a través de la variable `DATABASE_URL`.

### 📐 Vercel (Frontend Web)
- **Rama enlazada:** `main`
- **¿Qué pasa al hacer push?**
  1. Vercel detecta la actualización en `main`.
  2. Genera la compilación optimizada para la Web (`expo export -p web` / `npm run build`).
  3. Despliega la nueva versión estática y la expone en la URL pública.
  4. Se comunica con el backend desplegado en Railway para consumir los endpoints de la API.
