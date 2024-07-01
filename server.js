require("dotenv").config();
const express = require("express");
const helloRouter = require("./router/hello.router");
const PORT = process.env.PORT || 8001;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true }));

app.get("/", async (req, res) => {
  res.send("Use the complete query url");
});

app.use("/api", helloRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});