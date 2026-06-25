import { PrismaClient, Rol, EstadoClase } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // 1. Crear Instructores
  const instructor1 = await prisma.instructor.create({
    data: {
      nombre: 'Carlos',
      apellidos: 'Ramírez',
      foto_url: 'https://ui-avatars.com/api/?name=Carlos+Ramirez&background=0D8ABC&color=fff',
    },
  });

  const instructor2 = await prisma.instructor.create({
    data: {
      nombre: 'María',
      apellidos: 'López',
      foto_url: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=E91E63&color=fff',
    },
  });

  console.log('✅ Instructores creados:', instructor1.nombre, instructor2.nombre);

  // 2. Crear Clases
  const claseYoga = await prisma.clase.create({
    data: {
      nombre: 'Yoga',
      descripcion: 'Clase de yoga para relajación y flexibilidad. Ideal para todos los niveles.',
      imagen_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    },
  });

  const clasePilates = await prisma.clase.create({
    data: {
      nombre: 'Pilates',
      descripcion: 'Sistema de ejercicios de baja impacto que fortalece el core y mejora la postura.',
      imagen_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    },
  });

  const claseSpinning = await prisma.clase.create({
    data: {
      nombre: 'Spinning',
      descripcion: 'Clase de ciclismo indoor de alta intensidad. Quema calorías y mejora tu resistencia.',
      imagen_url: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400',
    },
  });

  const claseCrossfit = await prisma.clase.create({
    data: {
      nombre: 'CrossFit',
      descripcion: 'Entrenamiento funcional de alta intensidad combinando gimnasia, levantamiento olímpico y cardio.',
      imagen_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    },
  });

  console.log('✅ Clases creadas:', claseYoga.nombre, clasePilates.nombre, claseSpinning.nombre, claseCrossfit.nombre);

  // 3. Crear Detalles de Clase (horarios)
  const ahora = new Date();
  const detalles = [
    // Yoga - Lunes y Miércoles
    {
      id_clase: claseYoga.id_clase,
      id_instructor: instructor1.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 8, 0), // Mañana 8:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 9, 0),
      estado: EstadoClase.Disponible,
      cupos: 20,
      tematica: 'Yoga Flow',
      Dia: 'Lunes',
    },
    {
      id_clase: claseYoga.id_clase,
      id_instructor: instructor1.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 3, 8, 0), // Miércoles 8:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 3, 9, 0),
      estado: EstadoClase.Disponible,
      cupos: 20,
      tematica: 'Yoga Restaurativo',
      Dia: 'Miércoles',
    },
    // Pilates - Martes y Jueves
    {
      id_clase: clasePilates.id_clase,
      id_instructor: instructor2.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 2, 10, 0), // Martes 10:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 2, 11, 0),
      estado: EstadoClase.Disponible,
      cupos: 15,
      tematica: 'Pilates Mat',
      Dia: 'Martes',
    },
    {
      id_clase: clasePilates.id_clase,
      id_instructor: instructor2.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 4, 10, 0), // Jueves 10:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 4, 11, 0),
      estado: EstadoClase.Disponible,
      cupos: 15,
      tematica: 'Pilates Reform',
      Dia: 'Jueves',
    },
    // Spinning - Lunes a Viernes
    {
      id_clase: claseSpinning.id_clase,
      id_instructor: instructor1.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 18, 0), // Lunes 18:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 19, 0),
      estado: EstadoClase.Disponible,
      cupos: 25,
      tematica: 'Spinning Cardio',
      Dia: 'Lunes',
    },
    {
      id_clase: claseSpinning.id_clase,
      id_instructor: instructor2.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 3, 18, 0), // Miércoles 18:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 3, 19, 0),
      estado: EstadoClase.Disponible,
      cupos: 25,
      tematica: 'Spinning HIIT',
      Dia: 'Miércoles',
    },
    // CrossFit - Martes y Jueves
    {
      id_clase: claseCrossfit.id_clase,
      id_instructor: instructor1.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 2, 17, 0), // Martes 17:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 2, 18, 0),
      estado: EstadoClase.Disponible,
      cupos: 12,
      tematica: 'WOD Fundamentals',
      Dia: 'Martes',
    },
    {
      id_clase: claseCrossfit.id_clase,
      id_instructor: instructor2.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 4, 17, 0), // Jueves 17:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 4, 18, 0),
      estado: EstadoClase.Disponible,
      cupos: 12,
      tematica: 'CrossFit Metcon',
      Dia: 'Jueves',
    },
    // Clase extra - Sábado
    {
      id_clase: claseYoga.id_clase,
      id_instructor: instructor2.id_instructor,
      fecha_hora_inicio: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 6, 9, 0), // Sábado 9:00
      fecha_hora_fin: new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 6, 10, 30),
      estado: EstadoClase.Disponible,
      cupos: 30,
      tematica: 'Yoga Weekend',
      Dia: 'Sábado',
    },
  ];

  for (const detalle of detalles) {
    await prisma.detalleClase.create({ data: detalle });
  }

  console.log('✅ Detalles de clase creados:', detalles.length, 'horarios');

  // 4. Crear Usuarios de Prueba
  const passwordHash = await hash('123456', 10);

  // Admin
  const adminUsuario = await prisma.usuario.create({
    data: {
      nombres: 'Admin',
      apellidos: 'ReservaFit',
      celular: '999888777',
    },
  });

  await prisma.cuenta.create({
    data: {
      id_usuario: adminUsuario.id_usuario,
      correo_electronico: 'admin@reservafit.com',
      contrasena: passwordHash,
      rol: Rol.Administrador,
      estado_verificacion: true,
    },
  });

  // Cliente
  const clienteUsuario = await prisma.usuario.create({
    data: {
      nombres: 'Juan',
      apellidos: 'Pérez',
      celular: '988777666',
    },
  });

  await prisma.cuenta.create({
    data: {
      id_usuario: clienteUsuario.id_usuario,
      correo_electronico: 'cliente@reservafit.com',
      contrasena: passwordHash,
      rol: Rol.Cliente,
      estado_verificacion: true,
    },
  });

  // Cliente sin verificar
  const clienteSinVerificar = await prisma.usuario.create({
    data: {
      nombres: 'María',
      apellidos: 'García',
      celular: '977666555',
    },
  });

  await prisma.cuenta.create({
    data: {
      id_usuario: clienteSinVerificar.id_usuario,
      correo_electronico: 'sinverificar@reservafit.com',
      contrasena: passwordHash,
      rol: Rol.Cliente,
      estado_verificacion: false,
      codigo_otp: '123456',
      expiracion_otp: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  console.log('✅ Usuarios creados:');
  console.log('   - Admin: admin@reservafit.com / 123456');
  console.log('   - Cliente: cliente@reservafit.com / 123456');
  console.log('   - Sin verificar: sinverificar@reservafit.com / 123456 (OTP: 123456)');

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });