export async function encomienda(printer, data) {
  const reporte = data.object;

  reporte.encomiendas.forEach((detalle, index) => {
    printer.font("B");
    printer.align("ct");
    printer.size(0, 0);
    printer.style("B");

    printer.text("COOPERATIVA DE TRANSPORTE LIBERTAD PENINSULAR");
    printer.text("TERMINAL TERRESTRE DE GUAYAQUIL");
    printer.text("CLAVE DE ACCESO");

    printer.style("A");

    if (reporte.tipoEnvio === "NOR" || reporte.tipoEnvio === "COR") {
      printer.text(`${reporte.factura.codigoacceso}`);
    } else if (reporte.tipoEnvio === "PCE") {
      printer.text(`PENDIENTE`);
    }
    printer.text(`RUC: ${reporte.contribuyente.ruc}`);
    printer.text(`DIRECC: ${reporte.contribuyente.direccion}`);
    printer.text(
      `ENCOMIENDA #: ${detalle.id} --- VIAJE #: ${reporte.viaje.viaje_id}`
    );
    printer.align("lt");
    printer.newLine();
    printer.style("B");

    printer.font("A");
    if (reporte.tipoEnvio === "NOR" || reporte.tipoEnvio === "COR") {
      printer.text(`GUIA O TRACKING: ${detalle.numeroguia}`);
    } else if (reporte.tipoEnvio === "PCE") {
      printer.text(`GUIA O TRACKING: PENDIENTE`);
    }
    printer.font("B");
    printer.style("A");
    printer.newLine();

    if (reporte.tipoEnvio === "NOR" || reporte.tipoEnvio === "COR") {
      printer.text(
        `FACTURA: ${reporte.factura.establecimiento_sri}-${reporte.factura.puntoemision_sri}-${reporte.factura.secuencialfactura}`
      );
    } else if (reporte.tipoEnvio === "PCE") {
      printer.text(`FACTURA: PENDIENTE`);
    }
    printer.text(`ORIGEN: ${reporte.origen}`);
    printer.text(`DESTINO: ${detalle.destino.zona.nombre}`);
    printer.text(`NOMBRE: ${reporte.factura.cliente.persona.nombrecompleto}`);
    printer.text(
      `CI/RUC: ${reporte.factura.cliente.persona.numeroidentificacion}`
    );
    printer.text(`DIRECCION: ${reporte.factura.cliente.persona.direccion}`);
    printer.text(
      `TELEFONO: ${reporte.factura.cliente.persona.telefonocelular}`
    );
    printer.text(
      `DESTINATARIO: ${detalle.clienteRecibe.persona.nombrecompleto}`
    );
    printer.text(
      `CI/RUC: ${detalle.clienteRecibe.persona.numeroidentificacion}`
    );
    printer.text(`DIRECCION: ${detalle.clienteRecibe.persona.direccion}`);
    printer.text(`TELEFONO: ${detalle.clienteRecibe.persona.telefonocelular}`);
    printer.text(
      `BUS: ${reporte.viaje.bus_nombre}  DISCO-PLACA: ${reporte.viaje.bus}`
    );

    printer.font("A");
    printer.drawLine();
    printer.font("B");

    printer.tableCustom(
      [
        { text: "Cant.", align: "LEFT", width: 0.2, style: "B" },
        { text: "Peso", align: "LEFT", width: 0.2, style: "B" },
        { text: "Descripcion", align: "LEFT", width: 0.5, style: "B" },
        { text: "Valor", align: "LEFT", width: 0.1, style: "B" },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.font("A");
    printer.drawLine();
    printer.font("B");

    printer.tableCustom(
      [
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
        { text: `${detalle.comentario}`, align: "LEFT", width: 0.5 },
        {
          text: `${parseFloat(detalle.valor).toFixed(2)}`,
          align: "LEFT",
          width: 0.1,
        },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.font("A");
    printer.drawLine();
    printer.font("B");

    const valor = parseFloat(detalle.valor);
    const porcentajeImpuesto = parseFloat(detalle.porcentajeImpuesto);
    const valorImpuesto = (valor * porcentajeImpuesto) / 100;
    const totalConImpuesto = valor + valorImpuesto;

    printer.tableCustom(
      [
        { text: `SUBTOTAL`, align: "RIGHT", width: 0.8, style: "B" },

        {
          text: `${parseFloat(detalle.valor).toFixed(2)}`,
          align: "RIGHT",
          width: 0.2,
        },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        {
          text: `IVA ${porcentajeImpuesto}`,
          align: "RIGHT",
          width: 0.8,
          style: "B",
        },

        {
          text: `${valorImpuesto.toFixed(2)}`,
          align: "RIGHT",
          width: 0.2,
        },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        { text: `SEGURO`, align: "RIGHT", width: 0.8, style: "B" },

        {
          text: `0%`,
          align: "RIGHT",
          width: 0.2,
        },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        { text: `TOTAL:`, align: "RIGHT", width: 0.8, style: "B" },

        {
          text: `${totalConImpuesto.toFixed(2)}`,
          align: "RIGHT",
          width: 0.2,
        },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.text(`EMITIDO POR: ${reporte.usuario.username}`);
    printer.text(`FECHA EMISIÓN: ${reporte.fechaEmision}`);

    printer.align("ct");
    /*printer.text("Descarga tu comprobante autorizado en");
      printer.style("B");
      printer.text("http://clp.nts-technology.com");
      */
    printer.style("B");
    printer.newLine();
    printer.text("CONDICIONES GENERALES");
    printer.align("lt");
    printer.style("A");
    printer.text(
      "* EL OPERADOR POSTAL Indemnizará en caso de daño, pérdida, robo, hurto, expoliación o avería y el retraso no justificado, aplicando lo dispuesto en el Reglamento de Quejas Reclamos e indemnizaciones para Servicios Postales en Régimen de libre competencia, expedido por la Agencia de Regulación de Control Postal."
    );
    printer.text(
      "* EL OPERADOR POSTAL declara en este instrumento que los datos de los clientes se encuentran protegidos por la ley, salvo pedido expreso de autoridad competente o judicial."
    );
    printer.text(
      "* El remitente podrá recuperar los envios postales no entregados al destinatario y el Operador Postal tiene la obligación de entregar los mismos, siempre y cuando la Agencia de Regulación y Control Postal no los haya declarado como envios postales rezagados."
    );
    printer.text(
      "* El usuario podrá y tiene la facultad de presentar reclamos y quejas ante el Operador Postal, dentro de los plazos establecidos en el Reglamento de Quejas Reclamos e indemnizaciones para Servicios Postales en Regimen de Libre Competencia, expedido por la Agencia de Regulación de Control Postal."
    );
    printer.newLine();
    printer.newLine();
    printer.tableCustom(
      [
        { text: "-----------------------", align: "CENTER", width: 0.5 },
        { text: "-----------------------", align: "CENTER", width: 0.5 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    printer.tableCustom(
      [
        { text: "OPERADOR POSTAL", align: "CENTER", width: 0.5 },
        { text: "USUARIO", align: "CENTER", width: 0.5 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );

    if (index < reporte.encomiendas.length - 1) {
      printer.newLine();
      printer.newLine();
      printer.cut();
    }
  });
}
