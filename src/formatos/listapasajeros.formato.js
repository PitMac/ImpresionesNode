export async function listapasajeros(printer, data) {
  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  printer.text(
    "TERMINAL TERRESTRE DE GUAYAQUIL COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR"
  );
  printer.text("*** LISTADO DE PASAJEROS POR LOCALIDAD ***");
  printer.text(data.object.viaje.establecimiento.nombre);

  printer.align("lt");

  printer.style("A");
  printer.text(`BUS DISCO: ${data.object.viaje.bus.disco}`);
  printer.text(`RUTA: ${data.object.viaje.ruta.nombre}`);
  printer.text(
    `SALIDA: ${data.object.viaje.horaSalida}   ${data.object.viaje.fechaSalida} `
  );

  printer.font("B");
  printer.drawLine();

  printer.tableCustom(
    [
      { text: "ASI.", align: "LEFT", width: 0.15, style: "B" },
      { text: "IDENT.", align: "LEFT", width: 0.3, style: "B" },
      { text: "PASAJERO", align: "LEFT", width: 0.3, style: "B" },
      { text: "DESTINO", align: "RIGHT", width: 0.25, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );
  printer.font("A");
  printer.drawLine();
  printer.font("B");

  data.object.reporte.forEach((detalle) => {
    printer.tableCustom(
      [
        { text: `${detalle.asiento}`, align: "LEFT", width: 0.15 },
        {
          text: `${detalle.identificacion}`,
          align: "LEFT",
          width: 0.3,
        },
        {
          text: `${detalle.cliente}`,
          align: "LEFT",
          width: 0.3,
        },
        { text: `${detalle.destino}`, align: "RIGHT", width: 0.25 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        { text: ``, align: "LEFT", width: 0.15 },
        {
          text: ``,
          align: "LEFT",
          width: 0.3,
        },
        {
          text: `$${parseFloat(detalle.valor).toFixed(2)}`,
          align: "LEFT",
          width: 0.3,
        },
        { text: ``, align: "RIGHT", width: 0.25 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  printer.font("A");
  printer.drawLine();

  printer.text(`TOTAL PASAJEROS: ${data.object.reporte.length}`);
}
