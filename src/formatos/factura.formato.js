export async function factura(printer, data) {
  printer.text(data.text || "Texto por defecto");

  printer.newLine().newLine().cut().close();
}
