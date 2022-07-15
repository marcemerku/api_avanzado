require("dotenv").config();
require("./data/config");
const PORT = process.env.PORT;
const express = require('express');
const path= require("path");
const cors = require("cors");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true })); 



server.set('views',path.join(__dirname,'views'));
server.set('view engine', 'ejs');
server.use(express.static(path.join(__dirname,'public/image')));
server.use(cors());
server.use('/css', express.static(path.join(__dirname,'public/css')))
server.use('/js', express.static(path.join(__dirname,'public/js')))

server.use("/login", require("./Login/LRouter"));

server.use("/", require("./forum/FRouter"));

//catch all route (404)
server.use((req, res, next) => {
  let error = new Error();
  error.status = 404;
  error.message = "Resource not found";
  next(error);
});

//Error handler
server.use((error, req, res, next) => {
  if (!error.status) {
    error.status = 500;
    error.message = "Internal Error Server"
  }

  res.status(error.status).json({ status: error.status, message: error.message });
});


server.listen(PORT,(err)=>{
    err
    ? console.log(`Error: ${err}`)
    : console.log(`App corre en http://localhost:${PORT}`);
})