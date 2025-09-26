export async function listapasajeros(printer, data) {
  printer.alignCenter();
  printer.setTypeFontB();
  printer.setTextNormal();
  printer.bold(true);
  printer.println("TERMINAL TERRESTRE DE GUAYAQUIL");
  printer.println("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
  printer.println("*** LISTADO DE PASAJEROS POR LOCALIDAD ***");
  printer.println(data.object.viaje.establecimiento.nombre);
  printer.newLine();

  printer.alignLeft();
  printer.setTypeFontB();
  printer.bold(false);
  printer.println(`BUS DISCO: ${data.object.viaje.bus.disco}`);
  printer.println(`RUTA: ${data.object.viaje.ruta.nombre}`);
  printer.println(
    `SALIDA: ${data.object.viaje.horaSalida}   ${data.object.viaje.fechaSalida}`
  );
  printer.drawLine();

  printer.tableCustom([
    { text: "ASI.", align: "LEFT", width: 0.15, bold: true },
    { text: "IDENT.", align: "LEFT", width: 0.3, bold: true },
    { text: "PASAJERO", align: "LEFT", width: 0.3, bold: true },
    { text: "DESTINO", align: "RIGHT", width: 0.25, bold: true },
  ]);

  printer.drawLine();

  for (const detalle of data.object.reporte) {
    printer.tableCustom([
      { text: `${detalle.asiento}`, align: "LEFT", width: 0.15 },
      { text: `${detalle.identificacion}`, align: "LEFT", width: 0.3 },
      { text: `${detalle.cliente}`, align: "LEFT", width: 0.3 },
      { text: `${detalle.destino}`, align: "RIGHT", width: 0.25 },
    ]);

    printer.tableCustom([
      { text: "", align: "LEFT", width: 0.15 },
      { text: "", align: "LEFT", width: 0.3 },
      {
        text: `$${parseFloat(detalle.valor).toFixed(2)}`,
        align: "LEFT",
        width: 0.3,
      },
      { text: "", align: "RIGHT", width: 0.25 },
    ]);
  }
  printer.setTypeFontA();

  printer.drawLine();
  printer.println(`TOTAL PASAJEROS: ${data.object.reporte.length}`);
  printer.newLine();
}
