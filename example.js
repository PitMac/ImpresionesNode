import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine,
} from "node-thermal-printer";

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
  interface: "tcp://192.168.100.184", // Printer interface
  characterSet: CharacterSet.PC852_LATIN2, // Printer character set
  removeSpecialCharacters: false, // Removes special characters - default: false
  lineCharacter: "=", // Set character for lines - default: "-"
  breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
  options: {
    // Additional options
    timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
  },
});

printer.alignCenter();
printer.println("Hello world");
printer.printQR("QR Code", {
  cellSize: 8, // 1 - 8
  correction: "M", // L(7%), M(15%), Q(25%), H(30%)
  model: 1, // 1 - Model 1
  // 2 - Model 2 (standard)
  // 3 - Micro QR
});
printer.printQR("QR Code", {
  cellSize: 8, // 1 - 8
  correction: "M", // L(7%), M(15%), Q(25%), H(30%)
  model: 1, // 1 - Model 1
  // 2 - Model 2 (standard)
  // 3 - Micro QR
});
printer.printQR("QR Code", {
  cellSize: 8, // 1 - 8
  correction: "M", // L(7%), M(15%), Q(25%), H(30%)
  model: 1, // 1 - Model 1
  // 2 - Model 2 (standard)
  // 3 - Micro QR
});
printer.cut();

try {
  let execute = printer.execute();
  console.log("Print done!");
} catch (error) {
  console.error("Print failed:", error);
}
