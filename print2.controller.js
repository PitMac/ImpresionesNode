const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const fsPromises = fs.promises;

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ext);
  },
});

const upload = multer({ storage });
const app = express();
app.use(cors());

app.post("/print", upload.single("imagen"), async (req, res) => {
  const filePath = req.file.path;
  const { ip, type, printer } = req.query;

  if (!printer || typeof printer !== "string") {
    return res.status(400).send("❌ Parámetro 'printer' requerido");
  }

  if (!type || (type !== "usb" && type !== "ip")) {
    return res.status(400).send("❌ Parámetro 'type' inválido");
  }

  if (type === "ip" && (!ip || typeof ip !== "string" || ip.length <= 8)) {
    return res.status(400).send("❌ IP inválida o muy corta para tipo 'ip'");
  }

  const irfanPath = `"C:\\Program Files\\IrfanView\\i_view64.exe"`;

  try {
    const resolvedPath = path.resolve(filePath);

    if (type === "usb") {
      const printerName = printer.replace(/"/g, "");
      const command = `${irfanPath} "${resolvedPath}" /print="${printerName}"`;

      exec(command, async (err) => {
        if (err) {
          return res
            .status(500)
            .send("❌ Error al imprimir USB con IrfanView: " + err.message);
        }

        await cleanUploadsExceptLast();
        res.send("✅ Imagen enviada a impresora USB con IrfanView");
      });
    } else if (type === "ip") {
      const sharedPrinterPath = `\\\\${ip}\\${printer}`;
      const command = `${irfanPath} "${resolvedPath}" /print /printer="${sharedPrinterPath}"`;

      exec(command, async (err) => {
        if (err) {
          return res
            .status(500)
            .send("❌ Error al imprimir en red con IrfanView: " + err.message);
        }

        await cleanUploadsExceptLast();
        res.send("✅ Imagen enviada a impresora en red con IrfanView");
      });
    }
  } catch (error) {
    res.status(500).send("❌ Error general al imprimir: " + error.message);
  }
});

app.listen(3002, () => {
  console.log("🖨️ API local de impresión corriendo en http://localhost:3002");
});

// ✅ Función para eliminar imágenes viejas (mantener solo la más reciente)
async function cleanUploadsExceptLast() {
  const dir = path.resolve("uploads");

  try {
    const files = await fsPromises.readdir(dir);
    if (files.length <= 1) return;

    const fileStats = await Promise.all(
      files.map(async (file) => {
        const stats = await fsPromises.stat(path.join(dir, file));
        return { file, mtime: stats.mtime };
      })
    );

    fileStats.sort((a, b) => b.mtime - a.mtime); // más reciente primero
    const filesToDelete = fileStats.slice(1); // excepto el más nuevo

    for (const { file } of filesToDelete) {
      await fsPromises.unlink(path.join(dir, file));
    }
  } catch (err) {
    console.error("⚠️ Error limpiando carpeta uploads:", err.message);
  }
}
