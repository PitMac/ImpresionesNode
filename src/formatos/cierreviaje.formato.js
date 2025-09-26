export async function cierreviaje(printer, data) {
  const reporte = data.object.reporte;

  printer.alignCenter();
  printer.setTextNormal();
  printer.bold(true);
  printer.println(
    "TERMINAL TERRESTRE DE GUAYAQUIL\nCOOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR"
  );
  printer.println("*** REPORTE CIERRE DE VIAJE ***");
  printer.bold(false);
  printer.println(reporte.viaje.establecimiento.nombre);

  printer.alignLeft();

  printer.setTextNormal();
  printer.println(`BUS DISCO: ${reporte.viaje.bus.disco}`);
  printer.println(`RUTA: ${reporte.viaje.ruta.nombre}`);
  printer.println(
    `SALIDA: ${reporte.viaje.horaSalida}   ${reporte.viaje.fechaSalida}`
  );
  printer.println(`VIAJE #: ${reporte.viaje.id}`);
  printer.println(
    `CONDUCTOR: ${reporte.viaje.bus.transportista.persona.numeroidentificacion} - ${reporte.viaje.bus.transportista.persona.nombrecompleto}`
  );
  printer.println(`PLACA: ${reporte.viaje.bus.placa}`);

  printer.newLine();
  printer.drawLine();

  let tiposUsuarios = {};
  let total = 0;

  reporte.detalle.forEach((item) => {
    const tipo = item.ctTipousuario.descripcion;
    if (!tiposUsuarios[tipo]) {
      tiposUsuarios[tipo] = { count: 0, total: 0 };
    }
    tiposUsuarios[tipo].count += 1;
    tiposUsuarios[tipo].total += item.valor;
    total += item.valor;
  });

  // Tabla de resumen
  printer.tableCustom([
    { text: "VIAJE", align: "LEFT", width: 0.25, bold: true },
    { text: "HORA", align: "LEFT", width: 0.25, bold: true },
    { text: "CANTIDAD", align: "LEFT", width: 0.25, bold: true },
    { text: "TOTAL", align: "RIGHT", width: 0.25, bold: true },
  ]);

  printer.tableCustom([
    { text: `${reporte.viaje.id}`, align: "LEFT", width: 0.25 },
    { text: `${reporte.viaje.horaSalida}`, align: "LEFT", width: 0.25 },
    { text: `${reporte.detalle.length}`, align: "LEFT", width: 0.25 },
    { text: `$${total.toFixed(2)}`, align: "RIGHT", width: 0.25 },
  ]);

  printer.drawLine();
  printer.tableCustom([
    { text: "TOTAL BOLETOS", align: "LEFT", width: 0.75, bold: true },
    { text: `$${total.toFixed(2)}`, align: "RIGHT", width: 0.25, bold: true },
  ]);

  printer.drawLine();
  printer.newLine();
  printer.drawLine();

  // Encabezado por tipo de usuario
  printer.tableCustom([
    { text: "CANTIDAD", align: "LEFT", width: 0.3, bold: true },
    { text: "TIPO USUARIO", align: "LEFT", width: 0.4, bold: true },
    { text: "TOTAL", align: "LEFT", width: 0.3, bold: true },
  ]);

  Object.entries(tiposUsuarios).forEach(([tipo, datos]) => {
    printer.tableCustom([
      { text: `${datos.count}`, align: "LEFT", width: 0.3 },
      { text: tipo, align: "LEFT", width: 0.4 },
      { text: `$${datos.total.toFixed(2)}`, align: "LEFT", width: 0.3 },
    ]);
  });

  printer.drawLine();
  printer.tableCustom([
    {
      text: `${reporte.detalle.length}`,
      align: "LEFT",
      width: 0.3,
      bold: true,
    },
    { text: "TOTAL", align: "LEFT", width: 0.4, bold: true },
    { text: `$${total.toFixed(2)}`, align: "LEFT", width: 0.3, bold: true },
  ]);

  printer.drawLine();
  printer.newLine();

  printer.println(`USUARIO: ${data.object.usuario.nombrecompleto}`);
  printer.println(`FECHA IMPRESION: ${data.object.fecha}`);
}
