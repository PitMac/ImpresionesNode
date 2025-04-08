export async function deposito(printer, data) {
  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  printer.text(
    data.contribuyente?.contribuyente.razonsocial?.toUpperCase() ||
      "RAZON SOCIAL"
  );

  printer.style("A");
  printer.text("EGRESO EFECTIVO");
  //printer.drawLine();

  printer.align("lt");

  // Transacción
  printer.style("B");
  printer.text(`Transacción: ${data.data.reporte.id}`);
  printer.text(`Vendedor: ${data.data.vendedor}`);
  printer.text(`Caja: ${data.data.reporte.caja.nombre}`);
  printer.text(`Fecha: ${data.data.reporte.fechacreacion}`);
  printer.text(`Valor: $${parseFloat(data.data.reporte.valor).toFixed(2)}`);
  printer.text(`Concepto: ${data.data.reporte.comentario}`);

  printer.newLine();
  printer.newLine();
  printer.newLine();
  printer.cut();
  printer.close();
}
