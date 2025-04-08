import escpos from "escpos";
import escposNetwork from "escpos-network";
import escposUSB from "escpos-usb";
import { factura } from "../formatos/factura.formato.js";
import { deposito } from "../formatos/deposito.formato.js";
import { cierre } from "../formatos/cierre.formato.js";
import { prueba } from "../formatos/pruebatecnica.formato.js";
import { ordenventa } from "../formatos/ordenventa.formato.js";

escpos.Network = escposNetwork;
escpos.escposUSB = escposUSB;

export function printFactura(req, res) {
  const ip = req.params.ip || "";
  const type = req.params.type || "";

  const data = req.body;

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
        if (data.tipo === null) {
          factura(printer, data);
        } else if (data.tipo === "DEPOSITO") {
          deposito(printer, data);
        } else if (data.tipo === "CIERRECAJA") {
          cierre(printer, data);
        } else if (data.tipo === "PRUEBATECNICA") {
          prueba(printer, data);
        } else if (data.tipo === "ORDEN-VENTA") {
          ordenventa(printer, data);
        }
      });

      return res.json({ message: `Impresión enviada a la IP ${ip}` });
    }
  } else {
    return res.status(400).json({ message: "IP inválida o muy corta." });
  }
}
