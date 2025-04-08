export async function ordenventa(printer, data) {
  const reporte = data.data.reporte;

  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  printer.text(
    data.contribuyente?.contribuyente.razonsocial?.toUpperCase() ||
      "RAZON SOCIAL"
  );

  printer.text(data.contribuyente?.contribuyente.ruc || "RUC");
  printer.text(`MATRIZ: ${data.contribuyente?.contribuyente.direccion}`);
  printer.text(`ORDEN DE VENTA No. ${reporte.id}`);

  printer.align("lt");
  printer.style("A");
  printer.text(`Cliente: ${reporte.cliente.persona.nombrecompleto}`);
  printer.text(
    `Vendedor: ${data.data.vendedor.aliasVendedor ?? reporte.vendedor}`
  );
  printer.text(`RUC: ${reporte.cliente.persona.numeroidentificacion}`);
  printer.table([`TRANS #: ${reporte.id}`, `FECHA: ${reporte.fechaemision}`]);
  printer.text(`Placa: ${reporte.placa}`);

  printer.drawLine();
  printer.tableCustom(
    [
      { text: "Cant", align: "LEFT", width: 0.15, style: "B" },
      { text: "Producto", align: "LEFT", width: 0.45, style: "B" },
      { text: "Precio", align: "RIGHT", width: 0.2, style: "B" },
      { text: "Total", align: "RIGHT", width: 0.2, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );
  printer.drawLine();

  let subtotal = 0;
  let descuento = 0;
  let iva = 0;

  reporte.detalleProformaAcumulativo.forEach((detalle) => {
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
      detalle.nombreproducto || detalle.producto?.nombre || "SIN NOMBRE";
    const nombreProducto = (impuesto > 0 ? "* " : "") + producto;

    printer.tableCustom(
      [
        { text: cantidad.toFixed(2), align: "LEFT", width: 0.15 },
        { text: nombreProducto, align: "LEFT", width: 0.45 },
        { text: costo.toFixed(2), align: "RIGHT", width: 0.2 },
        { text: precioTotal.toFixed(2), align: "RIGHT", width: 0.2 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  printer.drawLine();

  printer.newLine();

  printer.align("rt");

  printer.text(`SUBTOTAL: ${subtotal.toFixed(2)}`);
  printer.text(`DESCUENTO: ${descuento.toFixed(2)}`);
  printer.text(`IVA: ${iva.toFixed(2)}`);
  printer.style("B");
  printer.text(`TOTAL: ${(subtotal - descuento + iva).toFixed(2)}`);
  printer.style("A");
  printer.align("lt");

  printer.newLine();
  printer.text("_____________________________");
  printer.text("Recibe conforme");
  printer.newLine();
  printer.newLine();

  printer.cut();

  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  printer.text(
    data.contribuyente?.contribuyente.razonsocial?.toUpperCase() ||
      "RAZON SOCIAL"
  );

  printer.text(data.contribuyente?.contribuyente.ruc || "RUC");
  printer.text(`MATRIZ: ${data.contribuyente?.contribuyente.direccion}`);
  printer.text(`ORDEN DE VENTA No. ${reporte.id}`);

  printer.align("lt");
  printer.style("A");
  printer.text(`Cliente: ${reporte.cliente.persona.nombrecompleto}`);
  printer.text(
    `Vendedor: ${data.data.vendedor.aliasVendedor ?? reporte.vendedor}`
  );
  printer.text(`RUC: ${reporte.cliente.persona.numeroidentificacion}`);
  printer.table([`TRANS #: ${reporte.id}`, `FECHA: ${reporte.fechaemision}`]);
  printer.text(`Placa: ${reporte.placa}`);

  printer.drawLine();
  printer.tableCustom(
    [
      { text: "Cant", align: "LEFT", width: 0.15, style: "B" },
      { text: "Producto", align: "LEFT", width: 0.45, style: "B" },
      { text: "Precio", align: "RIGHT", width: 0.2, style: "B" },
      { text: "Total", align: "RIGHT", width: 0.2, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );
  printer.drawLine();

  subtotal = 0;
  descuento = 0;
  iva = 0;

  reporte.detalleProformaAcumulativo.forEach((detalle) => {
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
      detalle.nombreproducto || detalle.producto?.nombre || "SIN NOMBRE";
    const nombreProducto = (impuesto > 0 ? "* " : "") + producto;

    printer.tableCustom(
      [
        { text: cantidad.toFixed(2), align: "LEFT", width: 0.15 },
        { text: nombreProducto, align: "LEFT", width: 0.45 },
        { text: costo.toFixed(2), align: "RIGHT", width: 0.2 },
        { text: precioTotal.toFixed(2), align: "RIGHT", width: 0.2 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  printer.drawLine();

  printer.newLine();

  printer.align("rt");

  printer.text(`SUBTOTAL: ${subtotal.toFixed(2)}`);
  printer.text(`DESCUENTO: ${descuento.toFixed(2)}`);
  printer.text(`IVA: ${iva.toFixed(2)}`);
  printer.style("B");
  printer.text(`TOTAL: ${(subtotal - descuento + iva).toFixed(2)}`);
  printer.style("A");
  printer.align("lt");

  printer.newLine();
  printer.text("_____________________________");
  printer.text("Recibe conforme");

  printer.newLine().newLine().cut().close();
}
