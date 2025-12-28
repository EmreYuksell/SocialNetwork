import { Router } from "express";
import { graphInstance } from "../graphInstance";

import { BfsAlgorithm } from "../algorithms/BfsAlgorithm";
import { DijkstraAlgorithm } from "../algorithms/DijkstraAlgorithm";
import { DfsAlgorithm } from "../algorithms/DfsAlgorithm";
import { DegreeCentralityAlgorithm } from "../algorithms/DegreeCentralityAlgorithm";
import { ConnectedComponentsAlgorithm } from "../algorithms/ConnectedComponentsAlgorithm";
import { WelshPowellColoringAlgorithm } from "../algorithms/WelshPowellColoringAlgorithm";


export const algorithmRouter = Router();

// DEBUG: Her istekte kaç node var görelim
algorithmRouter.use((_req, _res, next) => {
  console.log(
    "[ALG ROUTES] Node IDs:",
    graphInstance.getAllNodes().map((n) => n.id)
  );
  next();
});

// /api/algorithms/bfs?startNodeId=1
algorithmRouter.get("/bfs", (req, res) => {
  try {
    const startNodeId = req.query.startNodeId as string | undefined;
    const bfs = new BfsAlgorithm();
    const result = bfs.run(graphInstance, { startNodeId });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// /api/algorithms/dijkstra?startNodeId=1&targetNodeId=2
algorithmRouter.get("/dijkstra", (req, res) => {
  try {
    const startNodeId = req.query.startNodeId as string | undefined;
    const targetNodeId = req.query.targetNodeId as string | undefined;

    const dijkstra = new DijkstraAlgorithm();
    const result = dijkstra.run(graphInstance, { startNodeId, targetNodeId });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// /api/algorithms/dfs?startNodeId=1
algorithmRouter.get("/dfs", (req, res) => {
  try {
    const startNodeId = req.query.startNodeId as string | undefined;
    const dfs = new DfsAlgorithm();
    const result = dfs.run(graphInstance, { startNodeId });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// /api/algorithms/degree-centrality
algorithmRouter.get("/degree-centrality", (_req, res) => {
  try {
    const alg = new DegreeCentralityAlgorithm();
    const result = alg.run(graphInstance, {});
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


// /api/algorithms/connected-components
algorithmRouter.get("/connected-components", (_req, res) => {
  try {
    const alg = new ConnectedComponentsAlgorithm();
    const result = alg.run(graphInstance, {});
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// /api/algorithms/welsh-powell
algorithmRouter.get("/welsh-powell", (_req, res) => {
  try {
    const alg = new WelshPowellColoringAlgorithm();
    const result = alg.run(graphInstance, {});
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
