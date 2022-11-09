require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());

mongoose.connect(process.env.MOGODB_URI,{useNewUrlParser:true , useUnifiedTopology:true});
mongoose.connection.on("connected",()=>{
    console.log("Successfully Connected");
});
mongoose.connection.on("err",(err)=>{
    console.log(err);
});

require("./models/user");
require("./models/form");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/contact-form"));

const PORT = process.env.PORT || 5000;
app.listen(PORT,function(){
  console.log("Server running at port " + PORT);
});
