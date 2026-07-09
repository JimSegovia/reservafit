# Manual de Usuario — ReservaFit

## 1. Introducción

**ReservaFit** es una plataforma de reserva de clases de fitness (Salsa, Bachata, Zumba, Reggaetón) que te permite buscar horarios, seleccionar tu asiento en un mapa interactivo y gestionar tus reservas desde un solo lugar.

- **Web**: reservafit.vercel.app
- **App móvil**: iOS y Android (Expo)

---

## 2. Primeros pasos

### 2.1 Crear una cuenta

1. Desde la pantalla de inicio, presiona **"Registrarse"**.
2. Completa el formulario con tu nombre, correo electrónico, teléfono y contraseña.
3. Recibirás un **código de verificación OTP** de 6 dígitos en tu correo.
4. Ingresa el código en la pantalla de verificación para activar tu cuenta.

### 2.2 Iniciar sesión

1. Presiona **"Iniciar sesión"** en la pantalla de inicio.
2. Ingresa tu correo electrónico y contraseña.
3. Serás redirigido a tu panel de control.

### 2.3 Recuperar contraseña

1. En la pantalla de inicio de sesión, presiona **"¿Olvidaste tu contraseña?"**.
2. Ingresa tu correo electrónico.
3. Recibirás un código OTP para restablecer tu contraseña.
4. Ingresa el código y define una nueva contraseña.

---

## 3. Explorar clases

### 3.1 Catálogo de clases

Desde el tab **"Clases"** en la barra inferior (móvil) o en el menú lateral (web), puedes ver todas las disciplinas disponibles:

- **Salsa**
- **Bachata**
- **Zumba**
- **Reggaetón**
- Otras clases especiales

### 3.2 Filtrar por día o disciplina

Usa los filtros en la parte superior para:

- **Filtrar por día**: selecciona un día específico de la semana.
- **Filtrar por disciplina**: elige un tipo de clase en particular.

### 3.3 Calendario de horarios

En la vista **"Calendario"** puedes navegar por las semanas usando las flechas (`<` `>`) para ver la programación completa de todas las clases en una cuadrícula de días vs. horarios.

---

## 4. Reservar una clase

### 4.1 Ver horarios disponibles

1. Selecciona una clase del catálogo.
2. Presiona **"Ver horarios y reservar"**.
3. Se mostrará un listado de las próximas sesiones con fecha, hora e instructor.

### 4.2 Ver detalle de la clase

Presiona una sesión para ver:

- Nombre de la clase
- Instructor asignado
- Horario
- Capacidad disponible (barra de progreso: X de 30 cupos)
- Precio

Presiona **"Inscribirse"** para continuar.

### 4.3 Seleccionar asientos

1. Se abrirá el **mapa interactivo de la sala** con 30 asientos numerados.
2. Los asientos ocupados aparecen en **gris/rojo** y no son seleccionables.
3. Los asientos disponibles están en **verde**.
4. Presiona el/los asientos que deseas ocupar.
5. Una vez seleccionados, los asientos se **bloquean por 10 minutos** mientras completas el pago.
6. Verás un contador regresivo en pantalla. Si el tiempo se agota, los asientos vuelven a estar disponibles.

### 4.4 Completar el pago

- **Web**: Se te mostrará un código **Yape** o **PLIN** para realizar el pago desde tu app bancaria.
- **App móvil (iOS/Android)**: Serás redirigido a la pasarela de pago de **Stripe** o **Mercado Pago** para pagar con tarjeta de crédito, débito o billetera móvil.

Una vez confirmado el pago, verás una pantalla de **éxito** con los detalles de tu reserva.

---

## 5. Métodos de pago

| Plataforma | Métodos aceptados |
|---|---|
| Web | Yape, PLIN |
| App móvil (iOS) | Tarjetas de crédito/débito, Apple Pay (vía Stripe) |
| App móvil (Android) | Tarjetas de crédito/débito, Mercado Pago |

---

## 6. Gestionar reservas

### 6.1 Ver mis reservas

Desde el **panel de inicio** (tab "Inicio") puedes ver todas tus reservas activas:

- **Móvil**: tarjetas verticales con imagen, nombre, horario, asientos y botón para cancelar.
- **Web**: vista de escritorio con tabs internos:
  - **"Mis clases"**: lista completa con día, imagen y estado "Pagado".
  - **"Clases de hoy"**: solo las clases del día actual.
  - **"Calendario"**: vista semanal con eventos coloreados por disciplina.

### 6.2 Cancelar una reserva

1. Desde tu panel de inicio, busca la clase que deseas cancelar.
2. Presiona el botón **"Cancelar"**.
3. Confirma la acción en el diálogo de confirmación.
4. La reserva se cancelará y el **reembolso se procesará automáticamente**.

### 6.3 Política de cancelación

- Las cancelaciones son inmediatas.
- El reembolso se realiza de forma automática al confirmar la cancelación.
- No hay penalización por cancelación.

---

## 7. Perfil y configuración

1. Presiona tu nombre en la esquina superior derecha (web) o en el botón de perfil (móvil).
2. Puedes editar:
   - **Nombre**
   - **Teléfono**
3. Presiona **"Guardar cambios"** para actualizar tus datos.
4. Para **cerrar sesión**, presiona el botón "Cerrar sesión" en el menú lateral (web) o en la pantalla de perfil (móvil).

---

## 8. Historial de pagos

1. Desde el tab **"Pagos"** puedes ver el historial completo de tus transacciones.
2. Cada entrada muestra:
   - Clase reservada
   - Monto pagado
   - Fecha y hora
   - Método de pago
   - Estado (Pagado / Reembolsado)
3. Presiona una entrada para ver el **comprobante de pago** en detalle.

---

## 9. Solución de problemas

### No recibo el código de verificación

- Revisa tu bandeja de **spam/correo no deseado**.
- Espera 2-3 minutos y solicita un nuevo código.
- Si el problema persiste, contacta a soporte.

### El mapa de asientos no carga

- Verifica tu conexión a internet.
- Actualiza la página o reinicia la app.
- Asegúrate de haber seleccionado una sesión con cupos disponibles.

### El pago no se confirma

- **Web**: Asegúrate de haber completado el pago en Yape/PLIN y de haber presionado "Confirmar pago".
- **App móvil**: Verifica que tu tarjeta tenga fondos suficientes y que los datos sean correctos.
- Si el pago fue exitoso pero la reserva no se actualiza, contacta a soporte.

### No aparecen mis reservas

- Verifica que la reserva esté en estado **"Pagado"**.
- Revisa que estés en la pestaña correcta del panel de inicio.
- Cierra sesión y vuelve a iniciar sesión para refrescar los datos.

---

## 10. Contacto y soporte

Si no encuentras una solución a tu problema, escríbenos a:

**soporte@reservafit.com**

Te responderemos a la brevedad.
