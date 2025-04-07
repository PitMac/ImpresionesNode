export async function factura(printer, data) {
  printer.text(data.text || "Texto por defecto");

  printer.tableCustom(
    [
      { text: "Cant", align: "LEFT", width: 0.15, style: "B" },
      { text: "Producto", align: "LEFT", width: 0.4, style: "B" },
      { text: "Precio", align: "RIGHT", width: 0.2, style: "B" },
      { text: "V.Total", align: "RIGHT", width: 0.25, style: "B" },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  data.items.forEach((item) => {
    printer.tableCustom(
      [
        { text: item.cant, align: "LEFT", width: 0.15 },
        { text: item.producto, align: "LEFT", width: 0.4 },
        { text: item.precio, align: "RIGHT", width: 0.2 },
        { text: item.total, align: "RIGHT", width: 0.25 },
      ],
      { encoding: "cp857", size: [1, 1] }
    );
  });

  const totalGeneral = data.items
    .reduce((sum, item) => sum + parseFloat(item.total), 0)
    .toFixed(2);
  printer.tableCustom(
    [
      { text: "Total", align: "RIGHT", width: 0.7, style: "B" },
      {
        text: `$${totalGeneral}`,
        align: "RIGHT",
        width: 0.3,
        style: "B",
      },
    ],
    { encoding: "cp857", size: [1, 1] }
  );

  printer.newLine().newLine().cut().close();
}
