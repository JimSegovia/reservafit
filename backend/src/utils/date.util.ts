export class DateUtil {
  
  static agregarMinutos(fechaInicial: Date, minutos: number): Date {
    return new Date(fechaInicial.getTime() + minutos * 60000);
  }

  static yaExpiro(fechaAComprobar: Date): boolean {
    const ahora = new Date();
    return fechaAComprobar < ahora;
  }

  static diferenciaEnHoras(fechaPasada: Date, fechaFutura: Date): number {
    const diferenciaMs = fechaFutura.getTime() - fechaPasada.getTime();
    return diferenciaMs / (1000 * 60 * 60);
  }

  static formatearLegible(fecha: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(fecha);
  }
}