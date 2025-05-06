import escpos from "escpos";
import escposNetwork from "escpos-network";
import escposUSB from "escpos-usb";
import { factura } from "../formatos/factura.formato.js";
import { listapasajeros } from "../formatos/listapasajeros.formato.js";
import { cierreviaje } from "../formatos/cierreviaje.formato.js";
import { cierreencomienda } from "../formatos/cierreencomienda.formato.js";
import { encomienda } from "../formatos/encomienda.formato.js";

escpos.Network = escposNetwork;
escpos.escposUSB = escposUSB;

export function printFactura(req, res) {
  const ip = req.params.ip || "";
  const type = req.params.type || "";

  const data = req.body.data;

  if (!data) {
    return res
      .status(400)
      .json({ message: "No se recibió la data para imprimir." });
  }

  const options = { encoding: "CP850" };

  if (ip.length > 8) {
    if (type === "USB") {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);

      device.open(() => {
        printer
          .text(data.text || "Texto por defecto")
          .cut()
          .close();
      });

      return res.json({ message: "Impresión enviada por USB" });
    } else {
      const device = new escpos.Network(ip);
      const printer = new escpos.Printer(device, options);

      device.open(() => {
        if (data.tipo === null || data.tipo === undefined) {
          factura(printer, data);
        } else if (data.tipo === "LISTAPASAJEROS") {
          listapasajeros(printer, data);
        } else if (data.tipo === "CIERREVIAJE") {
          cierreviaje(printer, data);
        } else if (data.tipo === "CIERRE_ENCOMIENDAS") {
          cierreencomienda(printer, data);
        } else if (data.tipo === "ENCOMIENDA") {
          encomienda(printer, data);
          printer.newLine();
          printer.newLine();
          printer.cut();
          encomienda(printer, data);
        } else if (data.tipo === "prueba") {
          printer.text(`Esto es una prueba`);
          printer.text("De como se imprime");
          printer.text(`Esto es una prueba`);
          printer.text("De como se imprime");

          printer.newLine();
          printer.newLine();
          printer.newLine();
          printer.cut();
          printer.close();
        }

        printer.font("A");
        printer.newLine().newLine().cut().close();
      });

      return res.json({ message: `Impresión enviada a la IP ${ip}` });
    }
  } else {
    return res.status(400).json({ message: "IP inválida o muy corta." });
  }
}
