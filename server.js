require("dotenv").config();
const express = require("express");
const helloRouter = require("./router/hello.router");
const PORT = 8001;

const app = express();

app.get("/", async (req, res) => {
  res.redirect("/api/hello")
});

app.use("/api", helloRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});