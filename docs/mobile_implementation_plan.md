# 📱 Plan de Implementación Móvil: ReservaFit (React Native & Expo)

Este plan de desarrollo describe la arquitectura, estructura de navegación, paleta de diseño y la guía paso a paso para construir la aplicación móvil de **ReservaFit** utilizando **React Native** y **Expo CLI**. Está diseñado para ser ejecutado de forma secuencial y autónoma mediante la herramienta `/goal` en el IDE.

---

## 🛠️ Stack Tecnológico Recomendado

1. **Framework:** React Native + Expo (SDK 51 o superior).
2. **Navegación:** [Expo Router](https://docs.expo.dev/router/introduction/) (Navegación basada en archivos, ideal para estructurar pestañas de cliente y admin).
3. **Estilos:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS para React Native) o React Native `StyleSheet` estándar.
4. **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) (liviano y rápido) para manejar la sesión del usuario, el carrito/bloqueo de reservas y el historial.
5. **Iconos:** `@expo/vector-icons` (AntDesign, Ionicons, FontAwesome).
6. **Animaciones:** `react-native-reanimated` (para transiciones suaves).

---

## 🎨 Sistema de Diseño (Extraído de los Mockups)

* **Fondo Principal:** `#FAF8F5` (Crema muy suave / Blanco roto cálido).
* **Color Primario (Énfasis):** `#FF7A00` / `#F07000` (Naranja ReservaFit).
* **Verde (Éxito / Disponible):** `#4CAF50` (Fondo suave `#E8F5E9` en etiquetas).
* **Rojo (Lleno / Inactivo):** `#E53935` (Fondo suave `#FFEBEE` en etiquetas).
* **Gris (Ocupado / Inactivo):** `#B0BEC5` (Fondo suave `#ECEFF1`).
* **Azul (Especial / Reageton / Cancelada):** `#29B6F6` (Fondo suave `#E1F5FE`).
* **Temática Especial:** `#E040FB` (Fucsia Neón).
* **Tipografía:** Inter o Outfit (vía Google Fonts en Expo `expo-font`).

---

## 📂 Estructura de Rutas y Archivos (Expo Router)

Estructuraremos la app usando **Expo Router** dentro del directorio `app/`:

```text
app/
├── index.tsx                 # Redirección inicial (Valida si hay token -> /client o /admin)
├── (auth)/                   # Grupo de Autenticación
│   ├── landing.tsx           # V1 - Landing inicial
│   ├── register.tsx          # V2 - Registro de usuario
│   ├── verify.tsx            # V3 - Verificación OTP
│   └── login.tsx             # V4 - Inicio de Sesión
├── (client)/                 # Grupo del Cliente (Tab Navigation)
│   ├── _layout.tsx           # Layout con Bottom Tab Navigation
│   ├── index.tsx             # V5 - Inicio Cliente (Home con clases reservadas)
│   ├── classes/              # Subgrupo de Clases y Reservas
│   │   ├── index.tsx         # V6 - Selector de Tipo de Clase (Categorías / Calendario)
│   │   ├── detail.tsx        # V7 - Detalle de Clase (Ficha de clase)
│   │   ├── schedules.tsx     # V8 - Horarios Disponibles
│   │   ├── calendar.tsx      # V9 - Vista de Calendario Semanal
│   │   ├── position.tsx      # V10 - Selector de Posición (Grilla de 30)
│   │   └── checkout.tsx      # V11 - Pasarela de Pagos (Yape)
│   ├── payments/
│   │   ├── success.tsx       # V12 - Pago Confirmado
│   │   └── history.tsx       # V13 - Historial Pagos (Historial)
├── (admin)/                  # Grupo del Administrador (Tab Navigation)
│   ├── _layout.tsx           # Layout con Bottom Tab Navigation (Admin)
│   ├── index.tsx             # V15 - Dashboard Admin (Resumen general y accesos rápidos)
│   ├── instructors.tsx       # V16 - CRUD de Instructores
│   ├── classes-mgmt.tsx      # V17 - Gestión de Clases
│   ├── manual-booking.tsx    # V14 - Registrar Reserva Manual
│   └── bookings-history.tsx  # V18 - Historial de Reservas y Pagos (Admin)
```

---

## 📋 Especificación Detallada de Vistas

### 🔒 Fase 1: Autenticación y Acceso
* **V1 - Landing:** Pantalla inicial. Botón central naranja "Iniciar Sesión" redirige a `/login`.
* **V2 - Registro de usuario:** Formulario con validaciones básicas de campos vacíos, correos correctos y fortaleza de contraseña. El botón "Registrar" realiza POST al backend y navega a `/verify`.
* **V3 - Verificación de cuenta:** Vista con 6 inputs de texto individuales autocompletables para el OTP. Al completar, llama a la API de verificación y redirige a `/login`.
* **V4 - Inicio de Sesión:** Autentica contra la API. Si el usuario tiene rol `ADMIN`, redirige a `(admin)`, si es `CLIENT`, redirige a `(client)`.

### 👤 Fase 2: Módulo de Cliente (Navegación e Información)
* **V5 - Inicio Cliente:** Muestra listado de reservas activas del cliente consultando la API `/bookings/my-reservations`. Botón superior derecho borra token de almacenamiento local y redirige a `(auth)/landing`.
* **V6 - Selector de tipo de Clase:** Pestaña superior toggleable que cambia entre listado de Categorías y vista de Calendario (`V9`). Clic en "Ver detalles" navega a `/classes/detail?id=ID_CLASE`.
* **V7 - Detalle de clase:** Muestra información de la clase seleccionada. El botón "Inscribirse" bloquea el cupo en el backend por 10 minutos (iniciando temporizador en Zustand) y navega a `/classes/position`.

### 🗓️ Fase 3: Agenda, Selección de Asientos y Pagos
* **V8 - Horarios disponibles:** Muestra los días de la semana y los bloques disponibles. Muestra badges de estado: "Disponible" (verde), "Lleno" (rojo), "Cancelada" (azul).
* **V9 - Vista Calendario:** Horario visual semanal. Permite a los clientes ver rápidamente los bloques de horas de las clases activas.
* **V10 - Selector de posición:** Renderiza una grilla interactiva de 6 columnas por 5 filas (30 botones). Implementa estados reactivos para seleccionar asientos (naranja) bloqueando los que tienen estado "ocupado" (gris). Controla el countdown de 10 minutos en la barra inferior.
* **V11 - Pasarela de pagos (Yape):** Simula integración con Yape. Valida número de celular (9 dígitos). El botón "Pagar con Yape" envía confirmación al backend.
* **V12 - Pago confirmado:** Vista de éxito con ticket detallado. Desbloquea temporizadores y redirige a la pantalla `/client` (Home).
* **V13 - Historial Pagos:** Consulta pagos anteriores del cliente con badges de estado "Pagado" (verde) o "Reembolsado" (naranja).

### 👑 Fase 4: Módulo Administrativo
* **V15 - Dashboard admin:** Panel de control principal con KPIs reactivos obtenidos de endpoints del backend:
  * Clases hoy
  * Reservas hoy
  * Instructores activos
  * Ingresos del día
* **V16 - Admin_ Instructores (CRUD):** Buscador reactivo por texto y lista de instructores con modal para Crear, Editar y Eliminar instructores.
* **V17 - Admin_ Clases:** Listado y buscador de clases del sistema para activarlas o desactivarlas.
* **V18 - Admin_ Historial Reservas y pagos:** Registro total de reservas con buscador y filtros por estado de pago (Pagado / Reembolsado) para controlar el aforo y la facturación.
* **V14 - Registrar reserva (Manual) Mobile:** Formulario de registro rápido donde el administrador ingresa datos del cliente y selecciona la clase/horario en dropdowns dinámicos para reservar y marcar pago en efectivo o tarjeta directamente.

---

## 🚦 Pasos para Ejecutar con `/goal`

Cuando estés listo para construir la app, inicia una sesión de `/goal` en el chat con la siguiente instrucción:

> `/goal Usa el plan de implementación detallado en docs/mobile_implementation_plan.md para inicializar un proyecto Expo vacío en el directorio actual, configurar Expo Router, NativeWind para los estilos, Zustand para el estado, y construir paso a paso las pantallas V1 a V18. Para cada vista, debes leer obligatoriamente su imagen correspondiente en docs/Vistas mobile, analizarla visualmente a fondo y copiar el diseño, textos y disposición de elementos de forma idéntica.`

> [!IMPORTANT]
> **Regla de Oro:** El agente debe examinar visualmente cada archivo PNG en `docs/Vistas mobile` antes de codificar la pantalla correspondiente, asegurando que la interfaz resultante coincida pixel por pixel en colores, iconos, textos y diagramación.
