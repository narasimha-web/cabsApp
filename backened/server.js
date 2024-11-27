const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const mongoose = require("mongoose");
const routers = require("./routes/api/uberroutes");
const path = require("path");
const uploadRouter = require("./routes/api/Uploads");
//cars use

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use(cors());
app.use("/static", express.static(path.join(__dirname + "/uploadedFiles/")));
app.use("/api", routers);
app.use("/", uploadRouter);
// mongodb Conection
mongoose.connect("mongodb://localhost:27017/ubarData");

mongoose.Promise = global.Promise;
mongoose.set("debug", true);
const db = mongoose.connection;

db.once("open", function callback() {
  console.log("Database Connected Successfully!!");
});

db.on("error", function (err) {
  console.log({ err: err });
});

server.listen(8000, () => {
  console.log("Server Starting...");
});
