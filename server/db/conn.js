const mongoose = require("mongoose");

const db = "mongodb://localhost:27017/authUsers";

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDb Database."))
  .catch((err) =>
    console.log("Error while connecting to MongoDB Database", err)
  );
