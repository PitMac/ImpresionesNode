export async function cierreencomienda(printer, data) {
  const reporte = data.object;

  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  if (reporte.vistapreliminar) {
    printer.text("**** VISTA PRELIMINAR *****");
    printer.drawLine();
  }
  printer.text("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
  printer.text("TERMINAL TERRESTRE DE GUAYAQUIL");

  printer.style("A");
  printer.align("lt");
  printer.text(
    `SALIDA: ${reporte.viaje.fecha_salida}   ${reporte.viaje.hora_salida}`
  );
  printer.text(`RUTA: ${reporte.viaje.ruta}`);
  printer.text(`PROPIETARIO: ${reporte.viaje.propietario}`);
  printer.table([
    `BUS: ${reporte.viaje.bus}`,
    `PLACA: ${reporte.viaje.placa_bus}`,
  ]);

  printer.font("A");
  printer.drawLine();
  printer.font("B");

  printer.tableCustom(
    [
      { text: "# Guia", align: "LEFT", width: 0.15, style: "B" },
      { text: "Contenido", align: "LEFT", width: 0.25, style: "B" },
      { text: "Destinatario", align: "LEFT", width: 0.25, style: "B" },
      { text: "Destino", align: "LEFT", width: 0.15, style: "B" },
      { text: "Cant.", align: "RIGHT", width: 0.1, style: "B" },
      { text: "Total", align: "RIGHT", width: 0.15, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  reporte.encomiendas.forEach((detalle) => {
    const numeroGuia = detalle.numeroguia ? `${detalle.numeroguia}` : "-";
    const comentario = detalle.comentario ? `${detalle.comentario}` : "-";
    const remitente = detalle.remitente_nombre
      ? `${detalle.remitente_nombre}`
      : "-";
    const destino = detalle.destino ? `${detalle.destino}` : "-";

    printer.tableCustom(
      [
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
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  printer.font("A");
  printer.drawLine();
  printer.font("B");

  printer.text(`EMITIDO POR: ${reporte.usuario.username}`);
  printer.text(`FECHA EMISION: ${reporte.fechaEmision}`);
}
