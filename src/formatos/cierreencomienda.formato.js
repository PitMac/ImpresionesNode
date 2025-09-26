export async function cierreencomienda(printer, data) {
  const reporte = data.object;

  printer.alignCenter();
  printer.setTextNormal(); // Equivalente a size(0, 0)
  printer.setTypeFontB(); // Fuente más compacta

  if (reporte.vistapreliminar) {
    printer.bold(true);
    printer.println("**** VISTA PRELIMINAR *****");
    printer.bold(false);
    printer.drawLine();
  }

  printer.println("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
  printer.println("TERMINAL TERRESTRE DE GUAYAQUIL");

  printer.setTypeFontA();
  printer.alignLeft();
  printer.println(
    `SALIDA: ${reporte.viaje.fecha_salida}   ${reporte.viaje.hora_salida}`
  );
  printer.println(`RUTA: ${reporte.viaje.ruta}`);
  printer.println(`PROPIETARIO: ${reporte.viaje.propietario}`);

  printer.table([
    `BUS: ${reporte.viaje.bus}`,
    `PLACA: ${reporte.viaje.placa_bus}`,
  ]);

  printer.setTypeFontA(); // Equivalente a font("A")
  printer.drawLine();
  printer.setTypeFontB(); // Equivalente a font("B")

  // Encabezados de la tabla
  printer.tableCustom([
    { text: "# Guia", align: "LEFT", width: 0.15, bold: true },
    { text: "Contenido", align: "LEFT", width: 0.25, bold: true },
    { text: "Destinatario", align: "LEFT", width: 0.25, bold: true },
    { text: "Destino", align: "LEFT", width: 0.15, bold: true },
    { text: "Cant.", align: "RIGHT", width: 0.1, bold: true },
    { text: "Total", align: "RIGHT", width: 0.15, bold: true },
  ]);

  // Filas de detalles
  for (const detalle of reporte.encomiendas) {
    const numeroGuia = detalle.numeroguia || "-";
    const comentario = detalle.comentario || "-";
    const remitente = detalle.remitente_nombre || "-";
    const destino = detalle.destino || "-";

    printer.tableCustom([
      { text: numeroGuia, align: "LEFT", width: 0.14 },
      { text: comentario, align: "LEFT", width: 0.26 },
      { text: remitente, align: "LEFT", width: 0.24 },
      { text: destino, align: "LEFT", width: 0.16 },
      {
        text: parseFloat(detalle.cantidad).toFixed(2),
        align: "RIGHT",
        width: 0.14,
      },
      {
        text: parseFloat(detalle.total).toFixed(2),
        align: "RIGHT",
        width: 0.16,
      },
    ]);
  }

  printer.setTypeFontA();
  printer.drawLine();
  printer.setTypeFontB();

  printer.println(`EMITIDO POR: ${reporte.usuario.username}`);
  printer.println(`FECHA EMISION: ${reporte.fechaEmision}`);
}
