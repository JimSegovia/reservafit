<style>
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #333333;
    line-height: 1.6;
    font-size: 13px;
  }
  
  /* Contenedor principal */
  .manual-container {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Estilos de la Cabecera IPD-Style */
  .header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    font-size: 11px;
    font-family: Arial, sans-serif;
  }
  .header-table td {
    border: 1px solid #000000;
    padding: 6px;
    vertical-align: middle;
  }
  .header-logo {
    width: 25%;
    text-align: center;
    font-weight: bold;
    color: #FF7A00;
  }
  .header-title {
    width: 50%;
    text-align: center;
    font-weight: bold;
    font-size: 12px;
  }
  .header-meta {
    width: 25%;
    font-size: 10px;
  }

  /* Estilos del Pie de Página IPD-Style */
  .footer-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 10px;
    font-family: Arial, sans-serif;
    clear: both;
  }
  .footer-table td {
    border: 1px solid #000000;
    padding: 6px;
  }

  /* Salto de Página */
  .page-break {
    page-break-after: always;
    break-after: page;
  }

  /* Portada */
  .cover-container {
    text-align: center;
    padding-top: 40px;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cover-title {
    font-size: 32px;
    font-weight: 800;
    color: #000000;
    margin-top: 40px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .cover-subtitle {
    font-size: 20px;
    font-weight: 600;
    color: #555555;
    margin-top: 10px;
    text-transform: uppercase;
  }
  .cover-slogan {
    font-size: 16px;
    font-style: italic;
    color: #FF7A00;
    margin: 30px 0;
    font-weight: bold;
  }
  .cover-version {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .approval-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 50px;
    text-align: left;
    font-size: 11px;
  }
  .approval-table th, .approval-table td {
    border: 1px solid #000000;
    padding: 8px;
  }
  .approval-table th {
    background-color: #f2f2f2;
  }

  /* Banners de Secciones */
  .section-banner {
    background-color: #FF7A00;
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 20px;
    border-radius: 4px;
    display: inline-block;
    margin-top: 20px;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Cajas de Alerta/Recomendación */
  .callout-box {
    border: 1px solid #FF7A00;
    background-color: #FFFDF9;
    border-left: 5px solid #FF7A00;
    border-radius: 5px;
    padding: 12px 15px;
    margin: 15px 0;
  }
  .callout-title {
    font-weight: bold;
    color: #FF7A00;
    margin-bottom: 5px;
    font-size: 12px;
    display: flex;
    align-items: center;
  }
  .callout-content {
    font-size: 11px;
    color: #555555;
    margin: 0;
  }

  .callout-info {
    border: 1px solid #17A2B8;
    background-color: #F4FCFD;
    border-left: 5px solid #17A2B8;
    border-radius: 5px;
    padding: 12px 15px;
    margin: 15px 0;
  }
  .callout-info-title {
    font-weight: bold;
    color: #17A2B8;
    margin-bottom: 5px;
    font-size: 12px;
  }
  .callout-info-content {
    font-size: 11px;
    color: #555555;
    margin: 0;
  }

  /* Estilos de Imágenes */
  .screenshot-container {
    text-align: center;
    margin: 20px 0;
    border: 1px solid #e0e0e0;
    padding: 10px;
    background-color: #fafafa;
    border-radius: 8px;
    page-break-inside: avoid;
  }
  .screenshot-img {
    max-width: 60%;
    max-height: 380px;
    height: auto;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
  }
  .screenshot-caption {
    font-size: 10px;
    color: #777777;
    margin-top: 8px;
    font-style: italic;
  }

  /* Subsecciones */
  .subsection-title {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    margin-top: 15px;
    margin-bottom: 8px;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 4px;
  }

  /* Listas de pasos */
  .steps-list {
    margin-top: 8px;
    margin-bottom: 15px;
    padding-left: 20px;
  }
  .steps-list li {
    margin-bottom: 6px;
  }

  /* Índice */
  .toc-list {
    list-style: none;
    padding-left: 10px;
  }
  .toc-list li {
    margin-bottom: 8px;
    font-weight: bold;
  }
  .toc-list ul {
    list-style: none;
    padding-left: 20px;
    margin-top: 4px;
  }
  .toc-list ul li {
    font-weight: normal;
    font-size: 12px;
    margin-bottom: 4px;
  }
</style>

<div class="manual-container">

  <!-- ==================== PORTADA ==================== -->
  <div class="cover-container">
    <table class="header-table">
      <tr>
        <td class="header-logo">
          RESERVA FIT<br><span style="font-size: 8px; color: #555;">ÁREA DE TECNOLOGÍA</span>
        </td>
        <td class="header-title">
          MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS
        </td>
        <td class="header-meta">
          <b>N°:</b> 001<br>
          <b>Fecha de Creación:</b> 08-07-2026<br>
          <b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 1 de 14
        </td>
      </tr>
    </table>

    <div style="margin-top: 60px;">
      <div class="cover-title">Manual de Usuario</div>
      <div class="cover-subtitle">Sistema de Control y Reserva de Clases</div>
      <div class="cover-slogan">"Rumbo al Cero Papel — Entrena Sin Límites"</div>
      <div class="cover-version">Versión: 01</div>
    </div>

    <table class="approval-table">
      <tr>
        <th style="width: 40%;">Elaborado por:</th>
        <th style="width: 40%;">Revisado por:</th>
        <th style="width: 20%;">Firma:</th>
      </tr>
      <tr>
        <td>
          <b>Nombre:</b> Equipo de Desarrollo ReservaFit<br>
          <b>Cargo:</b> Analistas Programadores<br>
          <b>Fecha:</b> 08-07-2026
        </td>
        <td>
          <b>Nombre:</b> Coordinador de TI<br>
          <b>Cargo:</b> Líder del Proyecto<br>
          <b>Fecha:</b> 08-07-2026
        </td>
        <td style="height: 60px;"></td>
      </tr>
      <tr>
        <th colspan="2">Aprobado por:</th>
        <th>Firma:</th>
      </tr>
      <tr>
        <td colspan="2">
          <b>Nombre:</b> Gerente de Operaciones ReservaFit<br>
          <b>Cargo:</b> Jefe de la Unidad de Informática y Operaciones<br>
          <b>Fecha:</b> 08-07-2026
        </td>
        <td style="height: 60px;"></td>
      </tr>
    </table>

    <table class="footer-table" style="margin-top: 40px;">
      <tr>
        <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
        <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
        <td style="width: 15%; text-align: right;">1</td>
      </tr>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- ==================== ÍNDICE ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 2 de 14</td>
    </tr>
  </table>

  <div class="section-banner">Contenido / Índice</div>
  
  <ul class="toc-list" style="margin-top: 20px;">
    <li>1. Introducción a ReservaFit</li>
    <li>2. Registro de Usuario
      <ul>
        <li>2.1 Crear una cuenta</li>
        <li>2.2 Verificación de cuenta (OTP)</li>
      </ul>
    </li>
    <li>3. Inicio de Sesión
      <ul>
        <li>3.1 Acceder a tu cuenta</li>
        <li>3.2 Recuperar contraseña</li>
      </ul>
    </li>
    <li>4. Panel de Inicio (Dashboard)
      <ul>
        <li>4.1 Mis Clases Reservadas</li>
        <li>4.2 Clases de Hoy</li>
        <li>4.3 Calendario Semanal</li>
        <li>4.4 MonedasFit</li>
      </ul>
    </li>
    <li>5. Explorar Clases
      <ul>
        <li>5.1 Catálogo de Clases</li>
        <li>5.2 Filtrar Clases</li>
        <li>5.3 Vista de Calendario</li>
        <li>5.4 Horarios Disponibles</li>
        <li>5.5 Detalle de Clase</li>
      </ul>
    </li>
    <li>6. Reservar una Clase
      <ul>
        <li>6.1 Selección de Asientos</li>
        <li>6.2 Temporizador de Reserva</li>
      </ul>
    </li>
    <li>7. Pago
      <ul>
        <li>7.1 Métodos de Pago Disponibles</li>
        <li>7.2 Completar el Pago</li>
        <li>7.3 Pago Exitoso</li>
        <li>7.4 Pago Fallido o Pendiente</li>
      </ul>
    </li>
    <li>8. Gestionar Reservas
      <ul>
        <li>8.1 Cancelar una Reserva</li>
        <li>8.2 Política de Cancelación y Reembolsos</li>
      </ul>
    </li>
    <li>9. Historial de Pagos</li>
    <li>10. Perfil y Configuración
      <ul>
        <li>10.1 Editar Información Personal</li>
        <li>10.2 Código de Referido</li>
        <li>10.3 Cerrar Sesión</li>
      </ul>
    </li>
    <li>11. Centro de Ayuda y Soporte</li>
  </ul>

  <table class="footer-table" style="margin-top: 60px;">
    <tr>
      <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
      <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
      <td style="width: 15%; text-align: right;">2</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 1 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 3 de 14</td>
    </tr>
  </table>

  <div class="section-banner">1. Introducción a ReservaFit</div>
  
  <p>ReservaFit es una plataforma de reserva de clases de fitness que te permite buscar horarios, seleccionar tu asiento en un mapa interactivo y gestionar tus reservas desde un solo lugar. Las disciplinas disponibles incluyen Salsa, Bachata, Zumba, Reggaetón y clases especiales.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-1.png" alt="Pantalla de bienvenida">
    <div class="screenshot-caption">Imagen 01: Pantalla principal de bienvenida (landing page) con el logo de ReservaFit, botones de Iniciar Sesión y Registrarse.</div>
  </div>

  <table class="footer-table" style="margin-top: 40px;">
    <tr>
      <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
      <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
      <td style="width: 15%; text-align: right;">3</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 2 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 4 de 14</td>
    </tr>
  </table>

  <div class="section-banner">2. Registro de Usuario</div>

  <div class="subsection-title">2.1 Crear una cuenta</div>
  <p>Para comenzar a usar ReservaFit, primero debes crear una cuenta. Este proceso consta de dos pasos: registro y verificación.</p>
  
  <ol class="steps-list">
    <li>Desde la pantalla de inicio, presiona el botón <b>"Registrarse"</b>.</li>
    <li>Completa el formulario con tu nombre, apellidos, correo electrónico, teléfono y contraseña.</li>
    <li>Opcionalmente, ingresa un código de referido si cuentas con uno.</li>
    <li>Presiona <b>"Crear cuenta"</b> para enviar el formulario.</li>
  </ol>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-2-1.png" alt="Registro">
    <div class="screenshot-caption">Imagen 02: Formulario de registro completo con los campos de datos personales y de acceso.</div>
  </div>

  <div class="page-break"></div>

  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 5 de 14</td>
    </tr>
  </table>

  <div class="subsection-title">2.2 Verificación de cuenta (OTP)</div>
  <p>Después de registrarte, recibirás un código de verificación de 6 dígitos en tu correo electrónico.</p>

  <ol class="steps-list">
    <li>Revisa tu bandeja de entrada (y la carpeta de spam) para encontrar el correo de verificación.</li>
    <li>Ingresa el código de 6 dígitos en la pantalla de verificación.</li>
    <li>Al validarse correctamente, tu cuenta quedará activada y serás redirigido al panel de inicio.</li>
    <li>Si no recibes el código, puedes presionar <b>"Reenviar código"</b> para solicitar uno nuevo.</li>
  </ol>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-2-2.png" alt="OTP">
    <div class="screenshot-caption">Imagen 03: Pantalla de verificación OTP con 6 campos para dígitos y opción de reenvío.</div>
  </div>

  <div class="callout-box">
    <div class="callout-title">⚠️ IMPORTANTE</div>
    <p class="callout-content">Si no ves el código en tu bandeja de entrada después de 2 minutos, asegúrate de revisar la bandeja de Spam o Correo No Deseado. El código OTP tiene una validez exclusiva de 10 minutos.</p>
  </div>

  <table class="footer-table" style="margin-top: 25px;">
    <tr>
      <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
      <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
      <td style="width: 15%; text-align: right;">5</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 3 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 6 de 14</td>
    </tr>
  </table>

  <div class="section-banner">3. Inicio de Sesión</div>

  <div class="subsection-title">3.1 Acceder a tu cuenta</div>
  <p>Una vez que tu cuenta está activada, puedes iniciar sesión en cualquier momento.</p>

  <ol class="steps-list">
    <li>Desde la pantalla de inicio, presiona <b>"Iniciar Sesión"</b>.</li>
    <li>Ingresa tu correo electrónico y contraseña.</li>
    <li>Presiona <b>"Ingresar"</b>. Serás redirigido a tu panel de control.</li>
  </ol>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-3-1.png" alt="Login">
    <div class="screenshot-caption">Imagen 04: Pantalla de inicio de sesión de usuario.</div>
  </div>

  <div class="subsection-title">3.2 Recuperar contraseña</div>
  <p>Si olvidaste tu contraseña, puedes restablecerla en pocos pasos.</p>

  <ol class="steps-list">
    <li>En la pantalla de login, presiona <b>"¿Olvidaste tu contraseña?"</b>.</li>
    <li>Ingresa tu correo electrónico y presiona <b>"Enviar código"</b>.</li>
    <li>Recibirás un código OTP de 6 dígitos en tu correo.</li>
    <li>Ingresa el código en la pantalla de restablecimiento.</li>
    <li>Define una nueva contraseña y confírmala.</li>
    <li>Presiona <b>"Restablecer contraseña"</b>. Ahora puedes iniciar sesión con la nueva contraseña.</li>
  </ol>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-3-2.png" alt="Recuperar">
    <div class="screenshot-caption">Imagen 05: Pantalla para el cambio y restablecimiento de contraseña segura.</div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 4 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 7 de 14</td>
    </tr>
  </table>

  <div class="section-banner">4. Panel de Inicio (Dashboard)</div>
  <p>Al iniciar sesión, llegarás a tu panel de inicio. Esta es tu vista principal donde puedes ver de un vistazo toda tu actividad en ReservaFit.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-4.png" alt="Dashboard">
    <div class="screenshot-caption">Imagen 06: Vista general del panel de inicio de cliente.</div>
  </div>

  <div class="subsection-title">4.1 Mis Clases Reservadas</div>
  <p>En la sección principal del panel verás todas tus reservas activas. Cada tarjeta de reserva muestra la imagen de la clase, el nombre, día, horario, instructor y los asientos que seleccionaste. Desde aquí puedes cancelar cualquier reserva presionando el botón <b>"Cancelar"</b>.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-4-1.png" alt="Reservas">
    <div class="screenshot-caption">Imagen 07: Sección de clases reservadas del cliente con botones de acción directa.</div>
  </div>

  <div class="page-break"></div>

  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 8 de 14</td>
    </tr>
  </table>

  <div class="subsection-title">4.2 Clases de Hoy</div>
  <p>Esta sección te muestra únicamente las clases que tienes programadas para el día actual, para que sepas exactamente a qué hora y dónde debes estar.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-4-2.png" alt="Clases de hoy">
    <div class="screenshot-caption">Imagen 08: Vista rápida de actividades agendadas para el día de hoy.</div>
  </div>

  <div class="subsection-title">4.3 Calendario Semanal</div>
  <p>El calendario semanal te permite visualizar todas tus clases de la semana en un formato de cuadrícula de días (lunes a sábado) vs. horarios. Cada clase reservada aparece como un bloque de color según la disciplina.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-4-3.png" alt="Calendario">
    <div class="screenshot-caption">Imagen 09: Distribución horaria semanal con marcas de clases reservadas.</div>
  </div>

  <div class="subsection-title">4.4 MonedasFit</div>
  <p>En la parte superior del panel verás tu saldo de MonedasFit. Estas monedas las ganas al cancelar reservas pagadas y puedes usarlas para reservar nuevas clases. Presiona el saldo para ver tu historial completo de transacciones.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-4-4.png" alt="MonedasFit">
    <div class="screenshot-caption">Imagen 10: Control de saldo de MonedasFit e historial detallado.</div>
  </div>

  <table class="footer-table" style="margin-top: 25px;">
    <tr>
      <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
      <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
      <td style="width: 15%; text-align: right;">8</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 5 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 9 de 14</td>
    </tr>
  </table>

  <div class="section-banner">5. Explorar Clases</div>

  <div class="subsection-title">5.1 Catálogo de Clases</div>
  <p>Desde la pestaña <b>"Clases"</b> en la barra inferior (móvil) o el panel de navegación (web) accedes al catálogo completo de disciplinas disponibles: Salsa, Bachata, Zumba, Reggaetón y clases especiales.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-5-1.png" alt="Catalogo">
    <div class="screenshot-caption">Imagen 11: Catálogo con tarjetas e información de las disciplinas impartidas.</div>
  </div>

  <div class="subsection-title">5.2 Filtrar Clases</div>
  <p>Usa los filtros en la parte superior para encontrar exactamente lo que buscas. Puedes filtrar por día de la semana (Lunes a Sábado) o por tipo de disciplina. Los resultados se actualizan inmediatamente.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-5-2.png" alt="Filtros">
    <div class="screenshot-caption">Imagen 12: Barra inteligente de filtros rápidos de búsqueda.</div>
  </div>

  <div class="page-break"></div>

  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 10 de 14</td>
    </tr>
  </table>

  <div class="subsection-title">5.3 Vista de Calendario</div>
  <p>Alterna a la vista <b>"Calendario"</b> para ver la programación semanal completa en una cuadrícula. Usa las flechas para navegar entre semanas. Cada celda muestra las clases disponibles en ese día y horario.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-5-3.png" alt="Vista calendario">
    <div class="screenshot-caption">Imagen 13: Calendario interactivo semanal de clases programadas.</div>
  </div>

  <div class="subsection-title">5.4 Horarios Disponibles</div>
  <p>Al seleccionar una clase del catálogo, verás la lista de próximas sesiones con su estado: <b>"Disponible"</b> (puedes reservar), <b>"Lleno"</b> (sin cupos) o <b>"Cancelada"</b> (no se dictará).</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-5-4.png" alt="Horarios">
    <div class="screenshot-caption">Imagen 14: Próximos horarios y estados de disponibilidad para una clase seleccionada.</div>
  </div>

  <div class="subsection-title">5.5 Detalle de Clase</div>
  <p>Al presionar una sesión disponible, verás todos los detalles: nombre de la clase, imagen, instructor, día y horario, capacidad (ej. 12/30 asientos ocupados) y precio. Desde aquí inicias el proceso de reserva presionando <b>"Inscribirse"</b>.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-5-5.png" alt="Detalle">
    <div class="screenshot-caption">Imagen 15: Ficha con los detalles técnicos de una sesión particular.</div>
  </div>

  <table class="footer-table" style="margin-top: 25px;">
    <tr>
      <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
      <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
      <td style="width: 15%; text-align: right;">10</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 6 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 11 de 14</td>
    </tr>
  </table>

  <div class="section-banner">6. Reservar una Clase</div>

  <div class="subsection-title">6.1 Selección de Asientos</div>
  <p>El mapa interactivo de asientos te permite elegir exactamente dónde quieres ubicarte en la sala. La sala tiene capacidad para 30 personas.</p>

  <ol class="steps-list">
    <li>Después de presionar <b>"Inscribirse"</b>, se abre el mapa de asientos.</li>
    <li>Los asientos disponibles se muestran en color <b>verde</b>.</li>
    <li>Los asientos ya ocupados aparecen en <b>gris</b>.</li>
    <li>Presiona los asientos que deseas reservar (se marcarán en <b>naranja</b>).</li>
    <li>Puedes seleccionar múltiples asientos si reservas para acompañantes.</li>
    <li>El precio total se actualiza automáticamente según la cantidad de asientos.</li>
  </ol>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-6-1.png" alt="Mapa">
    <div class="screenshot-caption">Imagen 16: Mapa de asientos interactivo 6x5 en tiempo real.</div>
  </div>

  <div class="subsection-title">6.2 Temporizador de Reserva</div>
  <p>Al seleccionar tus asientos, estos quedan bloqueados exclusivamente para ti durante <b>10 minutos</b>. Verás un temporizador en pantalla con la cuenta regresiva. Debes completar el pago dentro de este tiempo. Si el temporizador llega a cero, los asientos se liberan automáticamente.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-6-2.png" alt="Temporizador">
    <div class="screenshot-caption">Imagen 17: Temporizador de 10 minutos para retención de asientos.</div>
  </div>

  <div class="callout-box">
    <div class="callout-title">⚠️ ATENCIÓN</div>
    <p class="callout-content">Si se agota el temporizador de 10 minutos, tus asientos volverán a estar disponibles de inmediato en el mapa general y el pago no podrá ser completado.</p>
  </div>

  <table class="footer-table" style="margin-top: 25px;">
    <tr>
      <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
      <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
      <td style="width: 15%; text-align: right;">11</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 7 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 12 de 14</td>
    </tr>
  </table>

  <div class="section-banner">7. Pago</div>

  <div class="subsection-title">7.1 Métodos de Pago Disponibles</div>
  <p>ReservaFit ofrece diferentes métodos de pago según la plataforma que estés utilizando:</p>
  <ul class="steps-list">
    <li><b>Web:</b> Pago mediante Yape o PLIN.</li>
    <li><b>App móvil (iOS):</b> Tarjetas de crédito/débito y Apple Pay a través de Stripe.</li>
    <li><b>App móvil (Android):</b> Tarjetas de crédito/débito y billeteras digitales a través de Mercado Pago.</li>
  </ul>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-7-1.png" alt="Checkout">
    <div class="screenshot-caption">Imagen 18: Selección de pasarela y método de pago en Checkout.</div>
  </div>

  <div class="subsection-title">7.2 Completar el Pago</div>
  <p>Al presionar <b>"Continuar con el pago"</b> desde la selección de asientos, serás redirigido a la pasarela de pagos. Sigue las instrucciones en pantalla para completar la transacción de forma segura.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-7-2.png" alt="Resumen Pago">
    <div class="screenshot-caption">Imagen 19: Resumen final de la compra previa confirmación del pago.</div>
  </div>

  <div class="page-break"></div>

  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 13 de 14</td>
    </tr>
  </table>

  <div class="subsection-title">7.3 Pago Exitoso</div>
  <p>Al completar el pago correctamente, verás una pantalla de confirmación con todos los detalles de tu reserva: nombre de la clase, día, horario, instructor, asientos reservados y comprobante. Presiona <b>"Ir al inicio"</b> para volver al panel.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-7-3.png" alt="Exito">
    <div class="screenshot-caption">Imagen 20: Confirmación visual de compra exitosa.</div>
  </div>

  <div class="subsection-title">7.4 Pago Fallido o Pendiente</div>
  <p>Si el pago es rechazado, verás una pantalla con el motivo del error y la opción de <b>"Intentar de nuevo"</b> o <b>"Ir al inicio"</b>. Si el pago queda en estado pendiente, el sistema verificará automáticamente su estado y te notificará cuando se apruebe.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-7-4.png" alt="Fallido">
    <div class="screenshot-caption">Imagen 21: Pantalla informativa de error en el pago.</div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECCIÓN 8 A 11 ==================== -->
  <table class="header-table">
    <tr>
      <td class="header-logo">RESERVA FIT</td>
      <td class="header-title">MANUAL DE USUARIO v 1.0<br>SISTEMA DE RESERVAS</td>
      <td class="header-meta"><b>N°:</b> 001<br><b>Fecha:</b> 08-07-2026<br><b>Versión:</b> 01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Pág.:</b> 14 de 14</td>
    </tr>
  </table>

  <div class="section-banner">8. Gestionar Reservas</div>

  <div class="subsection-title">8.1 Cancelar una Reserva</div>
  <p>Si necesitas cancelar una reserva, puedes hacerlo fácilmente desde tu panel de inicio:</p>
  <ol class="steps-list">
    <li>Ve a la sección <b>"Mis Clases"</b> en el panel de inicio.</li>
    <li>Busca la clase que deseas cancelar.</li>
    <li>Presiona el botón <b>"Cancelar"</b> en la tarjeta de la reserva.</li>
    <li>Confirma la cancelación en el diálogo que aparece.</li>
    <li>La reserva se cancela inmediatamente y los asientos vuelven a estar disponibles.</li>
  </ol>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-8-1.png" alt="Confirmar Cancelar">
    <div class="screenshot-caption">Imagen 22: Diálogo de confirmación para liberar reserva.</div>
  </div>

  <div class="subsection-title">8.2 Política de Cancelación y Reembolsos</div>
  <p>Las cancelaciones son inmediatas y sin penalización. Si cancelas una reserva pagada, el monto se te reembolsará en MonedasFit automáticamente. Estas monedas podrás usarlas para futuras reservas. Si tu reserva fue gratuita o pagada con MonedasFit, simplemente se liberan los cupos sin reembolso adicional.</p>

  <div class="section-banner">9. Historial de Pagos</div>
  <p>Desde la pestaña <b>"Pagos"</b> en la barra inferior (móvil) o el panel de navegación (web) puedes consultar tu historial completo de transacciones. Cada entrada muestra: nombre de la clase, monto, fecha, método de pago utilizado y estado (aprobado, pendiente, fallido). Presiona cualquier entrada para ver el comprobante detallado.</p>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-9.png" alt="Historial">
    <div class="screenshot-caption">Imagen 23: Historial administrativo de pagos del usuario.</div>
  </div>

  <div class="section-banner">10. Perfil y Configuración</div>
  <p>Para acceder a tu perfil, presiona tu nombre (en web) o el ícono de perfil (en móvil). Desde aquí puedes:</p>
  <ul class="steps-list">
    <li><b>10.1 Editar Información Personal:</b> Modifica tu nombre, apellidos y número de teléfono. El correo electrónico no es editable por seguridad.</li>
    <li><b>10.2 Código de Referido:</b> En tu perfil encontrarás tu código de referido único. Compártelo con amigos para que lo ingresen al registrarse.</li>
    <li><b>10.3 Cerrar Sesión:</b> Para cerrar sesión, usa la opción "Cerrar Sesión" en el menú lateral (web) o en la parte inferior de la pantalla de perfil (móvil).</li>
  </ul>

  <div class="screenshot-container">
    <img class="screenshot-img" src="C:/Users/I5/Documents/GitHub/reservafit/frontend/assets/images/manual/manual-seccion-10-1.png" alt="Perfil">
    <div class="screenshot-caption">Imagen 24: Configuración de información personal.</div>
  </div>

  <div class="section-banner">11. Centro de Ayuda y Soporte</div>
  <p>Si tienes dudas, puedes consultar las Preguntas Frecuentes (FAQ) en la pestaña correspondiente de este centro de ayuda. Para consultas que no encuentres aquí, escríbenos a <b>soporte@reservafit.com</b> o escríbenos a <b>reservafitgym@gmail.com</b> y te atenderemos a la brevedad.</p>

  <table class="footer-table" style="margin-top: 35px;">
    <tr>
      <td style="width: 35%;">ReservaFit v1.0<br>MANUAL_USUARIO_V1.pdf</td>
      <td style="width: 50%; text-align: center;">ReservaFit – Unidad de Informática – Desarrollo de Sistemas</td>
      <td style="width: 15%; text-align: right;">14</td>
    </tr>
  </table>

</div>
