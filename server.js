// require express to use it in this file
const { request } = require('express');
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

app.get('/products/:pid', (req, res) => {
  // convert pid to number to send in query to MongoDB
  let pid = Number(req.params.pid);
  console.log(pid);
  products.findOne({pid: pid})
  .then(result => {
    res.send(result)
  })
  .catch(error => console.error(error))
});

// create server browsers can connect to
app.listen(5000, function () {
  console.log('listening on 5000')
});