import express from "express";
import cors from "cors";
import { graphRouter } from "./routes/graphRoutes";
import { algorithmRouter } from "./routes/algorithmRoutes";
import { graphInstance } from "./graphInstance";
import { GraphJsonStorage } from "./services/GraphJsonStorage";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api/graph", graphRouter);
app.use("/api/algorithms", algorithmRouter);

app.get("/", (_req, res) => {
  res.send("Social Network Analyzer Backend is running.");
});

async function bootstrap() {
  // Uygulama başlarken daha önce kaydedilmiş grafı yükle
  await GraphJsonStorage.load(graphInstance);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

bootstrap();
