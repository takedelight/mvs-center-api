import express, { json } from "express";
import { PrismaClient } from "./generated/client.js";
import { Sorter } from "./helpers/sorter.js";

const app = express();
app.use(json());

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

  const data = await prisma.statement.findMany({ take: limit });
  res.json(data);
});

app.get("/data/sort", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const sortBy = req.query.sort_by || "createdAt";
    const method = req.query.method;

    const statements = await prisma.statement.findMany({ take: limit });
    const sorter = new Sorter(statements);
    const { sortedArray } = sorter[method](sortBy);

    res.json({ method, sortBy, length: sortedArray.length, sortedArray });
  } catch (error) {
    console.log(error);
    res.json({ status_code: 500, message: "Bad Request" });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const sortBy = req.query.sort_by || "createdAt";
    const methods = req.query.algorithms || [];

    const statements = await prisma.statement.findMany({ take: limit });
    const sorter = new Sorter(statements);

    const stats = methods.map((key) => {
      const { time, comparisons } = sorter[key](sortBy);
      return {key, time, comparisons };
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
