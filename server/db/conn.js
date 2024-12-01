const mongoose = require("mongoose");

const db = process.env.DATABASE;

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDb Database."))
  .catch((err) =>
    console.log("Error while connecting to MongoDB Database", err)
  );
