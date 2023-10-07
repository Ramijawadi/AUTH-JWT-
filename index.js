const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();


//connect DB


mongoose
  .connect(process.env.MONGO_URI, {

  })
  .then(() => console.log("Db connected successfully"))
  .catch((err) => console.log(err));


app.use(express.json());


app.use('/auth', require('./Routes/User'))
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(` connected at port ${PORT}`));

