const express = require("express");
const app = express();
const router = require("./routes/router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./db/conn");

const port = 8009;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

app.listen(port, async (req, res) => {
  console.log(`server started on port ${port}`);
});
