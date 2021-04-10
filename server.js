const express = require('express');
const app = express();
const Dotenv = require('dotenv');
const PORT = process.env.PORT || 4000;

// load env vars
Dotenv.config({
  path : './config/config.env'
});

app.get('/' , (req,res,next) => {
  res.send('Welcome to Devcamper.io');
});


app.listen(PORT , () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));