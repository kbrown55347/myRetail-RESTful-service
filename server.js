// require express to use it in this file
const express = require('express');
// initialize express app
const app = express();
// require in mongoDB
const mongo = require("mongodb").MongoClient;
// running project and MongoDB locally
const url = "mongodb://localhost:27017";
// connect to db

let db, products;

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("myRetail");
    products = db.collection("products");
  }
);

// to accept incoming data as JSON
app.use(express.json());

// GET products route
app.get("/products", (req, res) => {
  products.find().toArray((err, items) => {
    if(err) {
      console.error(err)
      res.sendStatus(500)
      return
    }
    res.send({products:items})
  })
});


// create server browsers can connect to
app.listen(5000, function() {
  console.log('listening on 5000')
});