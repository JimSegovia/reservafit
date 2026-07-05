import prisma from '../config/prisma.js';

export class MonedasRepository {
  static async obtenerSaldo(id_usuario: string) {
    let monedas = await prisma.monedasCliente.findUnique({
      where: { id_usuario },
    });
    if (!monedas) {
      monedas = await prisma.monedasCliente.create({
        data: { id_usuario, saldo_monedas: 0 },
      });
    }
    return monedas;
  }

  static async sumarMonedas(id_usuario: string, cantidad: number) {
    await this.obtenerSaldo(id_usuario);
    return prisma.monedasCliente.update({
      where: { id_usuario },
      data: { saldo_monedas: { increment: cantidad } },
    });
  }

  static async restarMonedas(id_usuario: string, cantidad: number) {
    const saldo = await this.obtenerSaldo(id_usuario);
    if (saldo.saldo_monedas < cantidad) {
      throw new Error('Saldo insuficiente de monedas');
    }
    return prisma.monedasCliente.update({
      where: { id_usuario },
      data: { saldo_monedas: { increment: -cantidad } },
    });
  }

  static async registrarHistorial(
    id_usuario: string,
    cantidad: number,
    tipo: string,
    id_reserva?: string
  ) {
    return prisma.historialMonedas.create({
      data: { id_usuario, cantidad, tipo, id_reserva },
    });
  }

  static async obtenerHistorial(id_usuario: string) {
    return prisma.historialMonedas.findMany({
      where: { id_usuario },
      orderBy: { fecha: 'desc' },
      take: 50,
    });
  }

  static async contarComprasExitosas(id_usuario: string) {
    return prisma.historialMonedas.count({
      where: {
        id_usuario,
        tipo: 'ganada_compra_bono',
      },
    });
  }
}
