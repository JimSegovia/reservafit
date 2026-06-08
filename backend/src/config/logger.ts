export const logger = {
  info: (message: string) => {
    // Ideal para: "Servidor corriendo en el puerto 3000" o "Preferencia de pago creada"
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  
  warn: (message: string) => {
    // Ideal para: "Intento de inicio de sesión fallido" o "Reserva a punto de expirar"
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  },
  
  error: (message: string, error?: any) => {
    // Ideal para: Fallos en el catch de los controladores
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(error); // Imprime el detalle técnico (stack trace)
    }
  }
};