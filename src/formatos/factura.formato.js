export async function factura(printer, data) {
  const reporte = data.data.reporte;
  printer.alignCenter();
  printer.setTextSize(0, 0);
  printer.bold(true);
  if (data.data.aditionalDataFormat.reimpresion) {
    printer.println("REIMPRESION");
  }
  printer.println("COMPRA TU PASAJE WWW.CLP.COM.EC");
  printer.drawLine();
  printer.println("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
  printer.println("TERMINAL TERRESTRE DE GUAYAQUIL");
  /*
  printer.println(data.contribuyente?.contribuyente.razonsocial?.toUpperCase());
  printer.println(data.contribuyente?.contribuyente.ruc);
  printer.println(data.contribuyente?.contribuyente.direccion);
  */

  printer.alignLeft();

  if (reporte.tipoDocumento === "FAC") {
    printer.println(
      `FACTURA N°: ${reporte.establecimientoSri}-${reporte.puntoemisionSri}-${reporte.secuencialfactura}`
    );
  } else {
    printer.println("COMPROBANTE DE VENTA");
  }
  console.log("sadad");

  printer.setTextNormal();

  printer.println(`NOMBRE: ${reporte.cliente.persona.nombrecompleto}`);
  printer.println(`RUC/CED: ${reporte.cliente.persona.numeroidentificacion}`);
  printer.println(
    `SALIDA: ${data.data.datosViaje.viaje.horaSalida}   ${data.data.datosViaje.viaje.fechaSalida}`
  );
  printer.println(
    `ORIGEN: ${data.data.datosViaje.viaje.establecimiento.zona.nombre}`
  );
  // printer.println(`VIAJE: ${data.data.datosViaje.viaje.id}`);
  printer.println(`DESTINO: ${data.data.datosViaje.destino.zona.nombre}`);

  printer.table([
    `BUS: ${data.data.datosViaje.viaje.bus.nombre}`,
    data.data.datosViaje.viaje.ruta.anden
      ? `ANDÉN: ${data.data.datosViaje.viaje.ruta.anden}`
      : "",
    data.data.datosViaje.viaje.ruta.piso
      ? `PISO: ${data.data.datosViaje.viaje.ruta.piso}`
      : "",
  ]);

  printer.setTypeFontA();
  printer.drawLine();
  printer.setTypeFontB();

  let total = 0;

  printer.tableCustom([
    { text: "ASIENTO", align: "LEFT", width: 0.25, bold: true },
    { text: "PASAJERO", align: "LEFT", width: 0.5, bold: true },
    { text: "VALOR", align: "RIGHT", width: 0.25, bold: true },
  ]);

  printer.setTypeFontA();
  printer.drawLine();
  printer.setTypeFontB();

  data.data.detalleViaje.forEach((detalle) => {
    total += detalle.valor;

    printer.tableCustom([
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
    ]);

    printer.tableCustom([
      { text: "", align: "LEFT", width: 0.25 },
      {
        text: `CI: ${detalle.cliente.persona.numeroidentificacion}`,
        align: "LEFT",
        width: 0.5,
      },
      { text: "", align: "RIGHT", width: 0.25 },
    ]);

    printer.tableCustom([
      { text: "", align: "LEFT", width: 0.25 },
      {
        text: `DIR: ${detalle.cliente.persona.direccion}`,
        align: "LEFT",
        width: 0.5,
      },
      { text: "", align: "RIGHT", width: 0.25 },
    ]);

    printer.tableCustom([
      { text: "", align: "LEFT", width: 0.25 },
      {
        text: `TELF: ${detalle.cliente.persona.telefonocelular}`,
        align: "LEFT",
        width: 0.5,
      },
      { text: "", align: "RIGHT", width: 0.25 },
    ]);
  });

  printer.setTypeFontA();
  printer.drawLine();
  printer.setTypeFontB();

  printer.println(`ATENDIDO POR: ${data.data.vendedor.persona.nombrecompleto}`);
  printer.alignCenter();
  printer.println(
    `ESTIMADO CLIENTE SUGERIMOS ACERCARSE 30 MINUTOS ANTES DE SU VIAJE A LA BOLETERIA PARA CONFIRMAR SU NUMERO DE BUS`
  );

  printer.alignCenter();
  printer.println("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
  printer.setTypeFontA();
  printer.drawLine();
  printer.setTypeFontB();

  for (const detalle of data.data.detalleViaje) {
    printer.cut();

    printer.alignCenter();
    printer.setTypeFontA();
    printer.drawLine();
    printer.setTypeFontB();
    const datosApi = JSON.parse(detalle.datosApiExterna);
    if (datosApi) {
      printer.println(datosApi.clave_acceso_tasa);
      printer.println(
        `Factura No: ${datosApi.numero_documento_tasa} Fecha: ${
          datosApi.fecha_hora_venta?.split("T")[0]
        }`
      );

      printer.table(["CANT", "DESC", "PRECIO UND", "TOTAL"]);

      printer.table([
        1,
        "TASA TORNIQUETE",
        "  " + datosApi.tasa_valor,
        datosApi.tasa_valor,
      ]);

      printer.printQR(datosApi.tasa, { cellSize: 8 });
      printer.newLine();
    }
  }
}
