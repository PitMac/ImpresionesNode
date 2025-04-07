import express from "express";
import cors from "cors";
import printRoutes from "./src/routes/print.routes.js";
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use(printRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
