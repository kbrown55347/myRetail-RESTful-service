// require express to use it in this file
const express = require('express');
// set up express app
const app = express();

// create server browsers can connect to
app.listen(5000, function() {
  console.log('listening on 5000')
})