require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helloRouter = require("./router/hello.router");
const PORT = process.env.PORT || 8001;

const app = express();

app.use(cors({
  origin: `http://localhost/PORT/`
}));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.json({
    Error: "Enter the correct query url: Query param",
  });
});

app.use("/api", helloRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});