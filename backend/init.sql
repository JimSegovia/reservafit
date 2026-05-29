-- ============================================================
-- Script de inicialización para PostgreSQL — ReservaFit
-- ============================================================
-- Crea la base de datos (ejecutar fuera de transacción)
-- CREATE DATABASE reservafit;

-- Conectar a la base de datos creada, luego ejecutar lo siguiente:

-- Enums
CREATE TYPE "Rol" AS ENUM ('Cliente', 'Administrador');
CREATE TYPE "EstadoClase" AS ENUM ('Disponible', 'Lleno', 'Cancelada');
CREATE TYPE "EstadoReserva" AS ENUM ('Pendiente_pago', 'Confirmada', 'Cancelada_Timeout', 'Cancelada_Por_Gimnasio');
CREATE TYPE "MetodoPago" AS ENUM ('Yape', 'Efectivo');
CREATE TYPE "EstadoPago" AS ENUM ('Pendiente', 'Exitoso', 'Fallido');
CREATE TYPE "EstadoReembolso" AS ENUM ('Pendiente_Automatizado', 'Pendiente_Manual', 'Completado', 'Fallido');

-- Tablas
CREATE TABLE "Usuarios" (
    "id_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "celular" VARCHAR(20),
    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

CREATE TABLE "Instructores" (
    "id_instructor" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foto_url" VARCHAR(200),
    CONSTRAINT "Instructores_pkey" PRIMARY KEY ("id_instructor")
);

CREATE TABLE "Clases" (
    "id_clase" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(500) NOT NULL,
    "dia" VARCHAR(100) NOT NULL,
    "tematica" VARCHAR(50),
    "imagen_url" VARCHAR(300),
    CONSTRAINT "Clases_pkey" PRIMARY KEY ("id_clase")
);

CREATE TABLE "Cuentas" (
    "id_cuenta" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "correo_electronico" VARCHAR(150) NOT NULL,
    "contraseña" VARCHAR(150) NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'Cliente',
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_verificacion" BOOLEAN DEFAULT false,
    "codigo_otp" VARCHAR(6),
    "expiracion_otp" TIMESTAMP(6),
    CONSTRAINT "Cuentas_pkey" PRIMARY KEY ("id_cuenta")
);

CREATE TABLE "Detalles_Clase" (
    "id_detalle_clase" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_clase" UUID NOT NULL,
    "id_instructor" UUID NOT NULL,
    "fecha_hora_inicio" TIMESTAMP(6) NOT NULL,
    "fecha_hora_fin" TIMESTAMP(6) NOT NULL,
    "estado" "EstadoClase" NOT NULL DEFAULT 'Disponible',
    "cupos" INTEGER NOT NULL DEFAULT 30,
    CONSTRAINT "Detalles_Clase_pkey" PRIMARY KEY ("id_detalle_clase")
);

CREATE TABLE "Reservas" (
    "id_reserva" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_detalle_clase" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "cantidad_cupos" INTEGER NOT NULL DEFAULT 1,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'Pendiente_pago',
    "fecha_reserva" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion_pago" TIMESTAMP(6),
    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("id_reserva")
);

CREATE TABLE "Detalles_reserva" (
    "id_detalle_reserva" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_reserva" UUID NOT NULL,
    "id_detalle_clase" UUID NOT NULL,
    "numero_cupo" INTEGER NOT NULL,
    CONSTRAINT "Detalles_reserva_pkey" PRIMARY KEY ("id_detalle_reserva")
);

CREATE TABLE "Pagos" (
    "id_pago" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_reserva" UUID NOT NULL,
    "id_stripe_sesion" VARCHAR(255),
    "id_intento_pago_stripe" VARCHAR(255),
    "metodo_pago" "MetodoPago" NOT NULL,
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'Pendiente',
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'PEN',
    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("id_pago")
);

CREATE TABLE "Reembolsos" (
    "id_reembolso" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_pago" UUID NOT NULL,
    "id_stripe_reembolso" VARCHAR(255),
    "monto_reembolsado" DECIMAL(10,2) NOT NULL,
    "motivo" VARCHAR(255) NOT NULL,
    "estado" "EstadoReembolso" NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_procesado" TIMESTAMP(6),
    CONSTRAINT "Reembolsos_pkey" PRIMARY KEY ("id_reembolso")
);

CREATE TABLE "WebHooks_Procesados" (
    "id_evento" VARCHAR(255) NOT NULL,
    "id_pago" UUID,
    "tipo_evento" VARCHAR(100) NOT NULL,
    "fecha_procesado" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebHooks_Procesados_pkey" PRIMARY KEY ("id_evento")
);

-- Índices únicos
CREATE UNIQUE INDEX "Cuentas_correo_electronico_key" ON "Cuentas"("correo_electronico");
CREATE UNIQUE INDEX "Detalles_Clase_fecha_hora_inicio_key" ON "Detalles_Clase"("fecha_hora_inicio");
CREATE UNIQUE INDEX "Detalles_reserva_id_detalle_clase_numero_cupo_key" ON "Detalles_reserva"("id_detalle_clase", "numero_cupo");
CREATE UNIQUE INDEX "Pagos_id_stripe_sesion_key" ON "Pagos"("id_stripe_sesion");
CREATE UNIQUE INDEX "Pagos_id_intento_pago_stripe_key" ON "Pagos"("id_intento_pago_stripe");
CREATE UNIQUE INDEX "Reembolsos_id_stripe_reembolso_key" ON "Reembolsos"("id_stripe_reembolso");

-- Foreign Keys
ALTER TABLE "Cuentas" ADD CONSTRAINT "Cuentas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Detalles_Clase" ADD CONSTRAINT "Detalles_Clase_id_clase_fkey" FOREIGN KEY ("id_clase") REFERENCES "Clases"("id_clase") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Detalles_Clase" ADD CONSTRAINT "Detalles_Clase_id_instructor_fkey" FOREIGN KEY ("id_instructor") REFERENCES "Instructores"("id_instructor") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_id_detalle_clase_fkey" FOREIGN KEY ("id_detalle_clase") REFERENCES "Detalles_Clase"("id_detalle_clase") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Detalles_reserva" ADD CONSTRAINT "Detalles_reserva_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "Reservas"("id_reserva") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Detalles_reserva" ADD CONSTRAINT "Detalles_reserva_id_detalle_clase_fkey" FOREIGN KEY ("id_detalle_clase") REFERENCES "Detalles_Clase"("id_detalle_clase") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "Reservas"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reembolsos" ADD CONSTRAINT "Reembolsos_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pagos"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WebHooks_Procesados" ADD CONSTRAINT "WebHooks_Procesados_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pagos"("id_pago") ON DELETE SET NULL ON UPDATE CASCADE;
