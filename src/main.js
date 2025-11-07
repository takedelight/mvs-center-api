import express, { json } from "express";
import { PrismaClient } from "./generated/client.js";
import { Sorter } from "./helpers/sorter.js";

const app = express();
app.use(json());

const prisma = new PrismaClient();

app.get("/data", async (req, res) => {
  const method = req.query.method || "heapSort";
  const limit = Number(req.query.limit) || 100;
  const sortedBy = req.query.sort_by || "createdAt";
  const data = await prisma.statement.findMany({
    take: limit,
  });
  const sorter = new Sorter(data);

  if (method === "all") {
    const algorithms = [
      "heapSort",
      "bubbleSort",
      "quickSort",
      "mergeSort",
      "insertionSort",
      "selectionSort",
    ];

    const chartData = algorithms.map((name) => {
      const { time, comparisons } = sorter[name](sortedBy);
      return { name, time, comparisons };
    });

    const { data: sortedData } = sorter.heapSort(sortedBy);

    return res.json({ sortedData, chartData });
  }

  const result = sorter[method](sortedBy);
  res.json(result);
});

app.listen(3000, () => {
  console.log("started on http://localhost:3000");
});
