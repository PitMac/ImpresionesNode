export async function cierre(printer, dat) {
  let data = dat.object;

  printer.align("ct");
  printer.style("B");

  printer.text(
    data.contribuyente?.nombrecomercial?.toUpperCase() || "RAZON SOCIAL"
  );
  printer.text("CIERRE DE CAJA DESPACHADORES");
  printer.align("lt");

  printer.style("A");
  printer.drawLine();
  const formatHora = (hora) =>
    new Date(`${currentDate}T${hora}`).toLocaleTimeString("es-EC", {
      hour12: false,
    });
  const currentDate = new Date().toISOString().slice(0, 10);

  printer.text(`Empleado: ${data.vendedor.nombre}`);
  printer.text(`Turno: ${data.turno.nombre}`);
  printer.table([
    `Desde: ${formatHora(data.turno.hora_inicio)}`,
    `Hasta: ${formatHora(data.turno.hora_fin)}`,
  ]);
  printer.text(`Fecha Cierre: ${currentDate}`);
  printer.drawLine();

  let totalLecturas = 0;

  data.surtidores.forEach((detalle) => {
    const lecturainicial = detalle.lecturainicial || "0";
    const lecturafinal = detalle.lecturafinal || "0";
    const galones = parseFloat(detalle.galones || 0).toFixed(4);
    const total = parseFloat(detalle.total || 0).toFixed(2);
    const pvp = detalle.pvp || "0";

    totalLecturas += parseFloat(detalle.total || 0);

    printer.text(`* ${detalle.surtidor} *`);
    printer.table([`I:${lecturainicial}`, `F:${lecturafinal}`, `G:${galones}`]);
    printer.table([`PVP:${pvp}`, `$USD:${total}`]);
    printer.newLine();
  });

  printer.drawLine();

  printer.text(`Total Dinero Lecturas: ${totalLecturas.toFixed(2)}`);

  let totalFacturas = 0;
  let totalTarjetas = 0;

  data.pagos.forEach((detalle) => {
    if (detalle.abreviatura !== "TAR") {
      totalFacturas += parseFloat(detalle.valorpago);
    } else {
      totalTarjetas += parseFloat(detalle.valorpago);
    }
  });

  const arrFacturas = data.pagos.filter((x) => x.abreviatura !== "TAR");
  const arrTCredito = data.pagos.filter((x) => x.abreviatura === "TAR");

  printer.text(
    `Total Facturas: (${arrFacturas.length}) ${totalFacturas.toFixed(2)}`
  );
  printer.text(
    `Total Creditos: (${data.ordenventas[0].documentos}) ${parseFloat(
      data.ordenventas[0].total
    ).toFixed(2)}`
  );
  printer.text(
    `Total T/Credito: (${arrTCredito.length}) ${totalTarjetas.toFixed(2)}`
  );
  printer.text(
    `Total Factura Credito: (${data.creditos[0].documentos}) ${parseFloat(
      data.creditos[0].total
    ).toFixed(2)}`
  );

  // Sumar todos los pagos
  let totalPagos =
    totalFacturas +
    parseFloat(data.ordenventas[0].total) +
    totalTarjetas +
    parseFloat(data.creditos[0].total);
  printer.text(`Total Pagos: ${totalPagos.toFixed(2)}`);

  printer.drawLine();

  printer.text(`RESUMEN TOTAL PRODUCTOS (VENTAS)`);

  printer.drawLine();

  data.productos.forEach((detalle) => {
    const galones = parseFloat(detalle.galones || 0).toFixed(2);

    printer.table([`${detalle.nombre}`, `GLS:${galones}`]);
  });

  printer.drawLine();

  printer.text(`RESUMEN TOTAL PRODUCTOS (LECTURAS)`);

  printer.drawLine();

  data.productosLecturas.forEach((detalle) => {
    const galones = parseFloat(detalle.galones || 0).toFixed(2);

    printer.table([`${detalle.nombre}`, `GLS:${galones}`]);
  });

  printer.drawLine();

  printer.table(["TOTAL EFECTIVO", `${totalFacturas.toFixed(2)}`]);
  printer.table(["TOTAL EFECTIVO", `${data.egresos}`]);
  printer.table(["DIFERENCIA", `${(totalFacturas - data.egresos).toFixed(2)}`]);

  printer.drawLine();

  printer.table(["TOTAL TURNO EMPLEADO", `${totalLecturas.toFixed(2)}`]);

  printer.newLine().newLine().cut().close();
}
