export async function factura(printer, data) {
  const reporte = data.data.reporte;

  if (
    reporte.tipoDocumento === "FAC" ||
    reporte.detallePagoTransaccion[0].tipopago.nombre === "AUTOCONSUMO"
  ) {
    printer.align("ct");
    printer.size(0, 0);
    printer.style("B");
    printer.text(
      data.contribuyente?.contribuyente.razonsocial?.toUpperCase() ||
        "RAZON SOCIAL"
    );

    printer.text(data.contribuyente?.contribuyente.ruc || "RUC");

    if (data.contribuyente.contribuyente.numeroresolucion + 0 > 0) {
      printer.text(
        `Contribuyente especial N° ${data.contribuyente.contribuyente.numeroresolucion}`
      );
    }

    if (reporte.establecimiento.numeroestablecimiento != "001") {
      printer.text(reporte.establecimiento.nombre);
      printer.text(`SUC: ${data.reporte.establecimiento.direccion}`);
    }

    printer.align("lt");
    if (reporte.tipoDocumento === "FAC") {
      printer.text(
        `FACTURA: ${reporte.establecimientoSri}-${reporte.puntoemisionSri}-${reporte.secuencialfactura}`
      );
      printer.text(reporte.codigoacceso);
    } else {
      printer.text("COMPROBANTE DE VENTA");
    }

    printer.style("A");
    printer.table([
      `TRANS #: ${reporte.id}`,
      `TURNO #: ${reporte.detalleEncabezadoTransaccion[0].encabezadotransaccion.turno.id}`,
      `SURT #: ${reporte.detalleEncabezadoTransaccion[0].encabezadotransaccion.surtidor.estacion.id}`,
    ]);

    printer.text(`VEND: ${data.data.vendedor.nombre}`);
    printer.text(`FECHA: ${reporte.fechaemision} ${data.data.hora}`);
    printer.table([
      `CODIGO: ${reporte.cliente.codigo}`,
      `PLACA: ${reporte.placa}`,
    ]);
    printer.text(`NOMBRE: ${reporte.cliente.persona.nombrecompleto}`);
    printer.text(`RUC/CED: ${reporte.cliente.persona.numeroidentificacion}`);
    printer.text(`DIRECCION: ${reporte.cliente.persona.direccion}`);

    printer.newLine();
    printer.drawLine();
    printer.tableCustom(
      [
        { text: "Cant", align: "LEFT", width: 0.15, style: "B" },
        { text: "Producto", align: "LEFT", width: 0.4, style: "B" },
        { text: "Precio", align: "RIGHT", width: 0.2, style: "B" },
        { text: "V.Total", align: "RIGHT", width: 0.25, style: "B" },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
    printer.drawLine();

    let subtotal = 0;
    let descuento = 0;
    let iva = 0;
    let preciosinSubsidio = 0;
    let totalSinSubsidio = 0;
    let ahorroSubsidio = 0;

    reporte.detalleEncabezadoTransaccion.forEach((detalle) => {
      const cantidad = parseFloat(detalle.cantidad);
      const costo = parseFloat(detalle.costo);
      const porcentajeDescuento = parseFloat(detalle.porcentajeDescuento || 0);
      const impuesto = parseFloat(detalle.impuesto || 0);

      const precioTotal = cantidad * costo;
      const descuentoValor = precioTotal * (porcentajeDescuento / 100);
      const precioConDescuento = precioTotal - descuentoValor;
      const ivaValor = precioConDescuento * (impuesto / 100);

      subtotal += precioTotal;
      descuento += descuentoValor;
      iva += ivaValor;

      const producto =
        (detalle.producto.abreviatura &&
        detalle.producto.abreviatura.trim() !== ""
          ? detalle.producto.abreviatura
          : detalle.producto.nombre) || "SIN NOMBRE";

      const nombreProducto = (impuesto > 0 ? "* " : "") + producto;

      printer.tableCustom(
        [
          { text: cantidad.toFixed(2), align: "LEFT", width: 0.15 },
          { text: nombreProducto, align: "LEFT", width: 0.4 },
          { text: costo.toFixed(2), align: "RIGHT", width: 0.2 },
          { text: precioTotal.toFixed(2), align: "RIGHT", width: 0.25 },
        ],
        { encoding: "cp857", size: [1, 1] }
      );
    });

    reporte.detalleEncabezadoTransaccion.forEach((detalle) => {
      const cantidad = parseFloat(detalle.cantidad);
      const impuesto = parseFloat(detalle.impuesto || 0);
      const precioSinSubsidio = detalle.producto.preciosinSubsidio || 0;

      preciosinSubsidio = precioSinSubsidio * (1 + impuesto / 100);
      totalSinSubsidio += cantidad * preciosinSubsidio;
    });

    const total = subtotal - descuento + iva;
    ahorroSubsidio = totalSinSubsidio > total ? totalSinSubsidio - total : 0;

    printer.drawLine();
    printer.newLine();

    printer.align("rt");

    printer.text(`SUBTOTAL: ${subtotal.toFixed(2)}`);
    printer.text(`DESCUENTO: ${descuento.toFixed(2)}`);
    printer.text(`IVA: ${iva.toFixed(2)}`);
    printer.style("B");
    printer.text(`TOTAL: ${total.toFixed(2)}`);
    printer.style("A");
    printer.table([
      `SIN SUB: ${totalSinSubsidio.toFixed(2)}`,
      `AHOR SUB: ${ahorroSubsidio.toFixed(2)}`,
    ]);

    printer.align("lt");

    if (reporte.tipoventa === "CR") {
      printer.text("FORMA PAGO: CRÉDITO");
    }

    if (
      reporte.detallePagoTransaccion?.[0]?.tipopago?.nombre === "AUTOCONSUMO"
    ) {
      printer.text("FORMA PAGO: AUTOCONSUMO");
    }

    if (reporte.tipoDocumento === "FAC") {
      printer.text("FORMA DE PAGO");

      if (reporte.detallePagoTransaccion?.length) {
        reporte.detallePagoTransaccion.forEach((pago) => {
          printer.text(
            pago.tipopago?.ctFormapagosri?.descripcion || "DESCONOCIDO"
          );
        });
      } else {
        printer.text("OTROS CON UTILIZACION DEL SISTEMA FINANCIERO");
      }
    }

    if (
      reporte.tipoventa === "CR" ||
      reporte.detallePagoTransaccion?.[0]?.tipopago?.nombre === "AUTOCONSUMO"
    ) {
      printer.newLine();
      printer.text("_____________________________");
      printer.newLine();
      printer.text("Recibe conforme");
    }
  }
  printer.newLine();
  printer.newLine();

  if (
    reporte.tipoventa === "CR" ||
    reporte.detallePagoTransaccion[0]?.tipopago.nombre === "AUTOCONSUMO"
  ) {
    printer.cut();
    if (reporte.tipoDocumento === "FAC") {
      printer.align("ct");
      printer.size(0, 0);
      printer.style("B");
      printer.text(
        data.contribuyente?.contribuyente.razonsocial?.toUpperCase() ||
          "RAZON SOCIAL"
      );

      printer.text(data.contribuyente?.contribuyente.ruc || "RUC");

      if (data.contribuyente.contribuyente.numeroresolucion + 0 > 0) {
        printer.text(
          `Contribuyente especial N° ${data.contribuyente.contribuyente.numeroresolucion}`
        );
      }

      if (reporte.establecimiento.numeroestablecimiento != "001") {
        printer.text(reporte.establecimiento.nombre);
        printer.text(`SUC: ${data.reporte.establecimiento.direccion}`);
      }

      printer.align("lt");
      if (reporte.tipoDocumento === "FAC") {
        printer.text(
          `FACTURA: ${reporte.establecimientoSri}-${reporte.puntoemisionSri}-${reporte.secuencialfactura}`
        );
        printer.text(reporte.codigoacceso);
      } else {
        printer.text("COMPROBANTE DE VENTA");
      }

      printer.style("A");

      printer.table([
        `TRANS #: ${reporte.id}`,
        `TURNO #: ${reporte.detalleEncabezadoTransaccion[0].encabezadotransaccion.turno.id}`,
        `SURT #: ${reporte.detalleEncabezadoTransaccion[0].encabezadotransaccion.surtidor.estacion.id}`,
      ]);

      printer.text(`VEND: ${data.data.vendedor.nombre}`);
      printer.text(`FECHA: ${reporte.fechaemision} ${data.data.hora}`);
      printer.table([
        `CODIGO: ${reporte.cliente.codigo}`,
        `PLACA: ${reporte.placa}`,
      ]);

      printer.text(`PLACA: ${reporte.placa}`);
      printer.text(`NOMBRE: ${reporte.cliente.persona.nombrecompleto}`);
      printer.text(`RUC/CED: ${reporte.cliente.persona.numeroidentificacion}`);
      printer.text(`DIRECCION: ${reporte.cliente.persona.direccion}`);

      printer.newLine();
      printer.drawLine();
      printer.tableCustom(
        [
          { text: "Cant", align: "LEFT", width: 0.15, style: "B" },
          { text: "Producto", align: "LEFT", width: 0.4, style: "B" },
          { text: "Precio", align: "RIGHT", width: 0.2, style: "B" },
          { text: "V.Total", align: "RIGHT", width: 0.25, style: "B" },
        ],
        { encoding: "cp857", size: [1, 1] }
      );
      printer.drawLine();

      let subtotal = 0;
      let descuento = 0;
      let iva = 0;
      let preciosinSubsidio = 0;
      let totalSinSubsidio = 0;
      let ahorroSubsidio = 0;

      reporte.detalleEncabezadoTransaccion.forEach((detalle) => {
        const cantidad = parseFloat(detalle.cantidad);
        const costo = parseFloat(detalle.costo);
        const porcentajeDescuento = parseFloat(
          detalle.porcentajeDescuento || 0
        );
        const impuesto = parseFloat(detalle.impuesto || 0);

        const precioTotal = cantidad * costo;
        const descuentoValor = precioTotal * (porcentajeDescuento / 100);
        const precioConDescuento = precioTotal - descuentoValor;
        const ivaValor = precioConDescuento * (impuesto / 100);

        subtotal += precioTotal;
        descuento += descuentoValor;
        iva += ivaValor;

        const producto =
          (detalle.producto.abreviatura &&
          detalle.producto.abreviatura.trim() !== ""
            ? detalle.producto.abreviatura
            : detalle.producto.nombre) || "SIN NOMBRE";

        const nombreProducto = (impuesto > 0 ? "* " : "") + producto;

        printer.tableCustom(
          [
            { text: cantidad.toFixed(2), align: "LEFT", width: 0.15 },
            { text: nombreProducto, align: "LEFT", width: 0.4 },
            { text: costo.toFixed(2), align: "RIGHT", width: 0.2 },
            { text: precioTotal.toFixed(2), align: "RIGHT", width: 0.25 },
          ],
          { encoding: "cp857", size: [1, 1] }
        );
      });

      reporte.detalleEncabezadoTransaccion.forEach((detalle) => {
        const cantidad = parseFloat(detalle.cantidad);
        const impuesto = parseFloat(detalle.impuesto || 0);
        const precioSinSubsidio = detalle.producto.preciosinSubsidio || 0;

        preciosinSubsidio = precioSinSubsidio * (1 + impuesto / 100);
        totalSinSubsidio += cantidad * preciosinSubsidio;
      });

      const total = subtotal - descuento + iva;
      ahorroSubsidio = totalSinSubsidio > total ? totalSinSubsidio - total : 0;

      printer.drawLine();
      printer.newLine();

      printer.align("rt");

      printer.text(`SUBTOTAL: ${subtotal.toFixed(2)}`);
      printer.text(`DESCUENTO: ${descuento.toFixed(2)}`);
      printer.text(`IVA: ${iva.toFixed(2)}`);
      printer.style("B");
      printer.text(`TOTAL: ${total.toFixed(2)}`);
      printer.style("A");
      printer.table([
        `SIN SUB: ${totalSinSubsidio.toFixed(2)}`,
        `AHOR SUB: ${ahorroSubsidio.toFixed(2)}`,
      ]);
      printer.align("lt");

      if (reporte.tipoventa === "CR") {
        printer.text("FORMA PAGO: CRÉDITO");
      }

      if (
        reporte.detallePagoTransaccion?.[0]?.tipopago?.nombre === "AUTOCONSUMO"
      ) {
        printer.text("FORMA PAGO: AUTOCONSUMO");
      }

      if (reporte.tipoDocumento === "FAC") {
        printer.text("FORMA DE PAGO");

        if (reporte.detallePagoTransaccion?.length) {
          reporte.detallePagoTransaccion.forEach((pago) => {
            printer.text(
              pago.tipopago?.ctFormapagosri?.descripcion || "DESCONOCIDO"
            );
          });
        } else {
          printer.text("OTROS CON UTILIZACION DEL SISTEMA FINANCIERO");
        }
      }

      printer.newLine();
      printer.text("_____________________________");
      printer.text("Recibe conforme");
    }
  }

  printer.newLine().newLine().cut().close();
}
