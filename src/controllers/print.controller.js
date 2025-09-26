import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";
import { factura } from "../formatos/factura.formato.js";
import { listapasajeros } from "../formatos/listapasajeros.formato.js";
import { cierreviaje } from "../formatos/cierreviaje.formato.js";
import { cierreencomienda } from "../formatos/cierreencomienda.formato.js";
import { encomienda } from "../formatos/encomienda.formato.js";

export async function printFactura(req, res) {
  const ip = req.params.ip || "";
  const type = req.params.type || "";
  const data = req.body.data;

  if (!data) {
    return res
      .status(400)
      .json({ message: "No se recibió la data para imprimir." });
  }

  try {
    let printer;

    if (ip.length > 8) {
      if (type === "USB") {
        printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: "\\\\localhost\\TPrinter",
        });
      } else {
        printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: `tcp://${ip}:9100`,
          timeout: 5000,
        });
      }
    } else {
      return res.status(400).json({ message: "IP inválida o muy corta." });
    }

    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      return res
        .status(500)
        .json({ message: "No se pudo conectar a la impresora." });
    }

    printer.setCharacterSet("PC852_LATIN2");
    printer.setTextSize(2, 2);

    if (!data.tipo) {
      await factura(printer, data);
    } else if (data.tipo === "LISTAPASAJEROS") {
      await listapasajeros(printer, data);
    } else if (data.tipo === "CIERREVIAJE") {
      await cierreviaje(printer, data);
    } else if (data.tipo === "CIERRE_ENCOMIENDAS") {
      await cierreencomienda(printer, data);
    } else if (data.tipo === "ENCOMIENDA") {
      await encomienda(printer, data);
      printer.newLine();
      printer.newLine();
      printer.cut();
      await encomienda(printer, data);
    } else if (data.tipo === "prueba") {
      printer.println("Esto es una prueba");
      printer.println("De como se imprime");
      printer.println("Esto es una prueba");
      printer.println("De como se imprime");
      printer.newLine();
      printer.newLine();
      printer.newLine();
      printer.cut();
    }
    printer.cut();
    await printer.execute();

    return res.json({ message: `Impresión enviada a la IP ${ip}` });
  } catch (error) {
    console.error("Error imprimiendo:", error);
    return res
      .status(500)
      .json({ message: "Error en impresión", error: error.message });
  }
}
