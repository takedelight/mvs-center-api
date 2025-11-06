import express, { json } from "express";
import { generateStatements } from "./helpers/generateStatements.js";

const http = express();
http.use(json());

http.get("/data", async (req, res) => {
  const data = await generateStatements();

  console.log(data);
  res.json({
    // total: data.length,
    data: data,
  });
});

http.listen(3000, () => {
  console.log("Server started on port 3000");
});
