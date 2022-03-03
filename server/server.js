// require express to use it in this file
const express = require('express');
// initialize express app
const app = express();
// require in products router
const productsRouter = require('./routes/products.router.js');

// to accept incoming data as JSON
app.use(express.json());

app.use('/products', productsRouter);

// create server browsers can connect to
app.listen(5000, function () {
  console.log('listening on 5000')
});