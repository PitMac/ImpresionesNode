export async function factura(printer, data) {
  const reporte = data.data.reporte;

  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  printer.text("COMPRA TU PASAJE WWW.CLP.COM.EC");
  printer.drawLine();
  printer.text("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
  printer.text("TERMINAL TERRESTRE DE GUAYAQUIL");
  /*printer.text(data.contribuyente?.contribuyente.razonsocial?.toUpperCase());
  printer.text(data.contribuyente?.contribuyente.ruc);
  printer.text(data.contribuyente?.contribuyente.direccion);
*/
  printer.align("lt");
  if (reporte.tipoDocumento === "FAC") {
    printer.text(
      `FACTURA N°: ${reporte.establecimientoSri}-${reporte.puntoemisionSri}-${reporte.secuencialfactura}`
    );
  } else {
    printer.text("COMPROBANTE DE VENTA");
  }

  printer.style("A");

  printer.text(`NOMBRE: ${reporte.cliente.persona.nombrecompleto}`);
  printer.text(`RUC/CED: ${reporte.cliente.persona.numeroidentificacion}`);
  printer.text(
    `SALIDA: ${data.data.datosViaje.viaje.horaSalida}   ${data.data.datosViaje.viaje.fechaSalida}`
  );
  printer.text(`ORIGEN: ${data.contribuyente.contribuyente.ciudad.nombre}`);
  // printer.text(`VIAJE: ${data.data.datosViaje.viaje.id}`);
  printer.text(`DESTINO: ${data.data.datosViaje.destino.zona.nombre}`);
  printer.table([
    `BUS: ${data.data.datosViaje.viaje.bus.nombre}`,
    data.data.datosViaje.viaje.ruta.anden
      ? `ANDÉN: ${data.data.datosViaje.viaje.ruta.anden}`
      : "",
    data.data.datosViaje.viaje.ruta.piso
      ? `PISO: ${data.data.datosViaje.viaje.ruta.piso}`
      : "",
  ]);

  printer.font("A");
  printer.drawLine();
  printer.font("B");

  let total = 0;

  printer.tableCustom(
    [
      { text: "ASIENTO", align: "LEFT", width: 0.25, style: "B" },
      { text: "PASAJERO", align: "LEFT", width: 0.5, style: "B" },
      { text: "VALOR", align: "RIGHT", width: 0.25, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  printer.font("A");
  printer.drawLine();
  printer.font("B");

  data.data.detalleViaje.forEach((detalle) => {
    total += detalle.valor;

    printer.tableCustom(
      [
        { text: `${detalle.numero}`, align: "LEFT", width: 0.25 },
        {
          text: `${detalle.cliente.persona.nombrecompleto}`,
          align: "LEFT",
          width: 0.5,
        },
        {
          text: `${parseFloat(detalle.valor).toFixed(2)}`,
          align: "RIGHT",
          width: 0.25,
        },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        { text: "", align: "LEFT", width: 0.25 },
        {
          text: `CI: ${detalle.cliente.persona.numeroidentificacion}`,
          align: "LEFT",
          width: 0.5,
        },
        { text: "", align: "RIGHT", width: 0.25 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        { text: "", align: "LEFT", width: 0.25 },
        {
          text: `DIR: ${detalle.cliente.persona.direccion}`,
          align: "LEFT",
          width: 0.5,
        },
        { text: "", align: "RIGHT", width: 0.25 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        { text: "", align: "LEFT", width: 0.25 },
        {
          text: `TELF: ${detalle.cliente.persona.telefonocelular}`,
          align: "LEFT",
          width: 0.5,
        },
        { text: "", align: "RIGHT", width: 0.25 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  printer.font("A");
  printer.drawLine();
  printer.font("B");

  printer.text(`ATENDIDO POR: ${data.data.vendedor.persona.nombrecompleto}`);
  printer.align("ct");
  printer.text(
    `ESTIMADO CLIENTE SUGERIMOS ACERCARSE 30 MINUTOS ANTES DE SU VIAJE A LA BOLETERIA PARA CONFIRMAR SU NUMERO DE BUS`
  );
}
