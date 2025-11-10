import express, { json } from "express";
import { PrismaClient } from "./generated/client.js";
import { Sorter } from "./helpers/sorter.js";

const app = express();
app.use(json());

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

const algs = [
  "heapSort",
  "bubbleSort",
  "quickSort",
  "mergeSort",
  "insertionSort",
  "selectionSort",
];

const prisma = new PrismaClient();

app.get("/data", async (req, res) => {
  const limit = Number(req.query.limit) || 100;
  const sortBy = req.query.sort_by || "createdAt";
  const method = req.query.method;
  const statements = await prisma.statement.findMany({ take: limit });
  const sorter = new Sorter(statements);

  if (method) {
    const { sortedArray, time, comparisions } = sorter[method](sortBy);

    return res.json({
      method,
      sortBy,
      time,
      comparisions,
      length: sortedArray.length,
      statements: sortedArray,
    });
  }

  return res.json({ statements, length: statements.length });
});

app.get("/stats", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const sortBy = req.query.sort_by || "createdAt";
    const methods = []
      .concat(req.query.algorithm || [])
      .map((s) => s.replace(/&/g, ""));

    const statements = await prisma.statement.findMany({ take: limit });
    const sorter = new Sorter(statements);
    const stats = methods.map((key) => {
      if (typeof sorter[key] === "function") {
        const { time, comparisions } = sorter[key](sortBy);

        return { method: key, time, comparisions };
      } else {
        return res.json({ method: key, error: "Method not found" });
      }
    });

    res.json(stats);
  } catch (error) {
    console.log(error);
    res.json({ status_code: 500, message: "Bad Request" });
  }
});

app.listen(3000, () => {
  console.log("API started on http://localhost:3000");
});
