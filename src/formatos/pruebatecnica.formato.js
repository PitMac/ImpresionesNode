export async function prueba(printer, data) {
  printer.align("ct");
  printer.size(0, 0);
  printer.style("B");
  printer.text(
    data.contribuyente?.contribuyente.razonsocial?.toUpperCase() ||
      "RAZON SOCIAL"
  );

  printer.text(data.contribuyente?.contribuyente.ruc || "RUC");

  printer.text(
    `Matriz: ${data.contribuyente?.contribuyente.direccion}` || "Matriz"
  );

  printer.text("PRUEBA TECNICA");

  printer.align("lt");

  // Transacción
  printer.style("B");
  printer.text(`Transacción: ${data.data.reporte.id}`);
  printer.text(`Vendedor: ${data.data.vendedor}`);
  printer.text(`Fecha: ${data.data.reporte.fechacreacion}`);
  printer.text(`Turno: ${data.data.reporte.turno.nombre}`);
  printer.text(
    `Estacion: ${data.data.reporte.surtidor.estacion.nombre} / ${data.data.reporte.surtidor.nombre}`
  );
  printer.tableCustom(
    [
      { text: "Codigo", align: "CENTER", width: 0.2, style: "B" },
      { text: "Cantidad", align: "CENTER", width: 0.15, style: "B" },
      { text: "Producto", align: "CENTER", width: 0.4, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  data.data.reporte.detalleEncabezadoTransaccion.forEach((detalle) => {
    printer.tableCustom(
      [
        {
          text: detalle.producto.codigo,
          align: "CENTER",
          width: 0.2,
          style: "B",
        },
        { text: detalle.cantidad, align: "CENTER", width: 0.15, style: "B" },
        {
          text: detalle.producto.nombre,
          align: "CENTER",
          width: 0.4,
          style: "B",
        },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  //printer.drawLine();

  printer.newLine();
  printer.newLine();
  printer.newLine();
  printer.cut();
  printer.close();
}
