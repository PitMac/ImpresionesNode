export async function encomienda(printer, data) {
  const reporte = data.object;

  for (const [index, detalle] of reporte.encomiendas.entries()) {
    printer.setTypeFontB();
    printer.alignCenter();
    printer.setTextSize(0, 0);
    printer.bold(true);

    printer.println("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
    printer.println("TERMINAL TERRESTRE DE GUAYAQUIL");
    printer.println("CLAVE DE ACCESO");

    printer.bold(false);

    if (reporte.tipoEnvio === "NOR" || reporte.tipoEnvio === "COR") {
      printer.println(`${reporte.factura.codigoacceso}`);
    } else {
      printer.println("PENDIENTE");
    }

    printer.println(`RUC: ${reporte.contribuyente.ruc}`);
    printer.println(`DIRECC: ${reporte.contribuyente.direccion}`);
    printer.println(
      `ENCOMIENDA #: ${detalle.id} --- VIAJE #: ${reporte.viaje.viaje_id}`
    );

    printer.alignLeft();
    printer.newLine();
    printer.setTypeFontA();

    if (reporte.tipoEnvio === "NOR" || reporte.tipoEnvio === "COR") {
      printer.println(`GUIA O TRACKING: ${detalle.numeroguia}`);
    } else {
      printer.println(`GUIA O TRACKING: PENDIENTE`);
    }

    if (reporte.tipoEnvio === "NOR" || reporte.tipoEnvio === "COR") {
      printer.println(
        `FACTURA: ${reporte.factura.establecimiento_sri}-${reporte.factura.puntoemision_sri}-${reporte.factura.secuencialfactura}`
      );
    } else {
      printer.println(`FACTURA: PENDIENTE`);
    }

    printer.println(`ORIGEN: ${reporte.origen}`);
    printer.println(`DESTINO: ${detalle.destino.zona.nombre}`);
    printer.println(
      `NOMBRE: ${reporte.factura.cliente.persona.nombrecompleto}`
    );
    printer.println(
      `CI/RUC: ${reporte.factura.cliente.persona.numeroidentificacion}`
    );
    printer.println(`DIRECCION: ${reporte.factura.cliente.persona.direccion}`);
    printer.println(
      `TELEFONO: ${reporte.factura.cliente.persona.telefonocelular}`
    );
    printer.println(
      `DESTINATARIO: ${detalle.clienteRecibe.persona.nombrecompleto}`
    );
    printer.println(
      `CI/RUC: ${detalle.clienteRecibe.persona.numeroidentificacion}`
    );
    printer.println(`DIRECCION: ${detalle.clienteRecibe.persona.direccion}`);
    printer.println(
      `TELEFONO: ${detalle.clienteRecibe.persona.telefonocelular}`
    );
    printer.println(
      `BUS: ${reporte.viaje.bus_nombre}  DISCO-PLACA: ${reporte.viaje.bus}`
    );

    printer.setTypeFontA();
    printer.drawLine();
    printer.setTypeFontB();

    printer.tableCustom([
      { text: "Cant.", align: "LEFT", width: 0.2, style: "B" },
      { text: "Peso", align: "LEFT", width: 0.2, style: "B" },
      { text: "Descripcion", align: "LEFT", width: 0.5, style: "B" },
      { text: "Valor", align: "LEFT", width: 0.1, style: "B" },
    ]);

    printer.setTypeFontA();
    printer.drawLine();
    printer.setTypeFontB();

    printer.tableCustom([
      {
        text: `${parseFloat(detalle.cantidad).toFixed(2)}`,
        align: "LEFT",
        width: 0.2,
      },
      {
        text: `${parseFloat(detalle.peso).toFixed(2)}`,
        align: "LEFT",
        width: 0.2,
      },
      { text: detalle.comentario || "", align: "LEFT", width: 0.5 },
      {
        text: `${parseFloat(detalle.valor).toFixed(2)}`,
        align: "LEFT",
        width: 0.1,
      },
    ]);

    printer.setTypeFontA();
    printer.drawLine();
    printer.setTypeFontB();

    const valor = parseFloat(detalle.valor);
    const porcentajeImpuesto = parseFloat(detalle.porcentajeImpuesto);
    const valorImpuesto = (valor * porcentajeImpuesto) / 100;
    const totalConImpuesto = valor + valorImpuesto;

    printer.tableCustom([
      { text: "SUBTOTAL", align: "RIGHT", width: 0.8, style: "B" },
      { text: `${valor.toFixed(2)}`, align: "RIGHT", width: 0.2 },
    ]);

    printer.tableCustom([
      {
        text: `IVA ${porcentajeImpuesto}%`,
        align: "RIGHT",
        width: 0.8,
        style: "B",
      },
      { text: `${valorImpuesto.toFixed(2)}`, align: "RIGHT", width: 0.2 },
    ]);

    printer.tableCustom([
      { text: "SEGURO", align: "RIGHT", width: 0.8, style: "B" },
      { text: "0%", align: "RIGHT", width: 0.2 },
    ]);

    printer.tableCustom([
      { text: "TOTAL:", align: "RIGHT", width: 0.8, style: "B" },
      { text: `${totalConImpuesto.toFixed(2)}`, align: "RIGHT", width: 0.2 },
    ]);

    printer.println(`EMITIDO POR: ${reporte.usuario.username}`);
    printer.println(`FECHA EMISIÓN: ${reporte.fechaEmision}`);

    printer.alignCenter();
    printer.setTypeFontB();
    printer.newLine();
    printer.println("CONDICIONES GENERALES");
    printer.alignLeft();

    printer.println(
      "* EL OPERADOR POSTAL Indemnizará en caso de daño, pérdida, robo, hurto, expoliación o avería..."
    );
    printer.println(
      "* EL OPERADOR POSTAL declara que los datos de los clientes están protegidos por la ley..."
    );
    printer.println(
      "* El remitente podrá recuperar los envíos no entregados..."
    );
    printer.println(
      "* El usuario puede presentar reclamos y quejas ante el Operador Postal..."
    );

    printer.newLine();
    printer.newLine();

    printer.tableCustom([
      { text: "-----------------------", align: "CENTER", width: 0.5 },
      { text: "-----------------------", align: "CENTER", width: 0.5 },
    ]);

    printer.tableCustom([
      { text: "OPERADOR POSTAL", align: "CENTER", width: 0.5 },
      { text: "USUARIO", align: "CENTER", width: 0.5 },
    ]);

    if (index < reporte.encomiendas.length - 1) {
      printer.newLine();
      printer.newLine();
      printer.cut();
    }
  }
}
