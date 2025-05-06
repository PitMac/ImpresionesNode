export async function cierreviaje(printer, data) {
  const reporte = data.object.reporte;

  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  printer.text(
    "TERMINAL TERRESTRE DE GUAYAQUIL COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR"
  );
  printer.text("*** REPORTE CIERRE DE VIAJE ***");
  printer.text(reporte.viaje.establecimiento.nombre);

  printer.align("lt");

  printer.style("A");
  printer.text(`BUS DISCO: ${reporte.viaje.bus.disco}`);
  printer.text(`RUTA: ${reporte.viaje.ruta.nombre}`);
  printer.text(
    `SALIDA: ${reporte.viaje.horaSalida}   ${reporte.viaje.fechaSalida}`
  );
  printer.text(`VIAJE #: ${reporte.viaje.id}`);
  printer.text(
    `CONDUCTOR: ${reporte.viaje.bus.transportista.persona.numeroidentificacion} - ${reporte.viaje.bus.transportista.persona.nombrecompleto}`
  );

  printer.text(`PLACA: ${reporte.viaje.bus.placa}`);

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

  printer.tableCustom(
    [
      { text: "VIAJE", align: "LEFT", width: 0.25, style: "B" },
      { text: "HORA", align: "LEFT", width: 0.25, style: "B" },
      { text: "CANTIDAD", align: "LEFT", width: 0.25, style: "B" },
      { text: "TOTAL", align: "RIGHT", width: 0.25, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  printer.tableCustom(
    [
      { text: `${reporte.viaje.id}`, align: "LEFT", width: 0.25 },
      { text: `${reporte.viaje.horaSalida}`, align: "LEFT", width: 0.25 },
      { text: `${reporte.detalle.length}`, align: "LEFT", width: 0.25 },
      { text: `$${total.toFixed(2)}`, align: "RIGHT", width: 0.25 },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  printer.drawLine();

  printer.tableCustom(
    [
      { text: "TOTAL BOLETOS", align: "LEFT", width: 0.75, style: "B" },
      { text: `$${total.toFixed(2)}`, align: "RIGHT", width: 0.25, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  printer.drawLine();
  printer.newLine();

  printer.newLine();
  printer.drawLine();

  printer.tableCustom(
    [
      { text: "CANTIDAD", align: "LEFT", width: 0.3, style: "B" },
      { text: "TIPO USUARIO", align: "LEFT", width: 0.4, style: "B" },
      { text: "TOTAL", align: "LEFT", width: 0.3, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  Object.entries(tiposUsuarios).forEach(([tipo, datos]) => {
    printer.tableCustom(
      [
        { text: `${datos.count}`, align: "LEFT", width: 0.3 },
        { text: tipo, align: "LEFT", width: 0.4 },
        { text: `$${datos.total.toFixed(2)}`, align: "LEFT", width: 0.3 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  printer.drawLine();
  printer.tableCustom(
    [
      {
        text: `${reporte.detalle.length}`,
        align: "LEFT",
        width: 0.3,
        style: "B",
      },
      { text: "TOTAL", align: "LEFT", width: 0.4, style: "B" },
      { text: `$${total.toFixed(2)}`, align: "LEFT", width: 0.3, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  printer.drawLine();
  printer.newLine();

  printer.text(`USUARIO: ${data.object.usuario.nombrecompleto}`);
  printer.text(`FECHA IMPRESION: ${data.object.fecha}`);
}
