export function parseDateTime(str: string): Date {
  if (!str) return new Date();
  
  // Si el string ya es un objeto Date (por si acaso)
  if (str instanceof Date) return str;

  // Limpiar el string de posibles espacios extras
  const cleanStr = str.trim();

  // Para formatos "YYYY-MM-DD HH:mm:ss" o "YYYY-MM-DDTHH:mm:ss"
  // El problema de new Date("YYYY-MM-DD HH:mm:ss") es que en algunos engines
  // se asume UTC si no hay zona horaria.
  // La solución más segura es parsear manualmente y usar el constructor de componentes.
  
  // Regex para capturar Año, Mes, Día, Hora, Minuto, Segundo
  const match = cleanStr.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  
  if (match) {
    const [, y, m, d, hh, mm, ss] = match.map(Number);
    // new Date(year, monthIndex, day, hours, minutes, seconds) 
    // SIEMPRE interpreta los argumentos como hora LOCAL del sistema.
    return new Date(y, m - 1, d, hh, mm, ss);
  }

  // Fallback para otros formatos (como solo fecha)
  const dateMatch = cleanStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch) {
    const [, y, m, d] = dateMatch.map(Number);
    return new Date(y, m - 1, d);
  }

  // Si nada funciona, fallback al constructor nativo pero con precaución
  const d = new Date(cleanStr);
  return isNaN(d.getTime()) ? new Date() : d;
}
