// require express to use it in this file
const express = require('express');
// initialize express app
const app = express();
// require in mongoDB
const mongo = require("mongodb").MongoClient;
// running project and MongoDB locally
const url = "mongodb://localhost:27017";
// require in request
const request = require("request");

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

// GET products and pricing from MongoDB
app.get('/products/:pid', (req, res) => {
  // convert pid to number to send in query to MongoDB
  let pid = Number(req.params.pid);
  console.log(pid);
  products.findOne({ pid: pid })
    .then(result => {
      res.send(result)
    })
    .catch(error => console.error(error))

  // request for data from external API
  request.get(`https://redsky-uat.perf.target.com/redsky_aggregations/v1/redsky/case_study_v1?key=3yUxt7WltYG7MFKPp7uyELi1K40ad2ys&tcin=${req.params.pid}`, (error, response, body) => {
    let title = JSON.parse(body);
    let productTitle = title.data.product.item.product_description.title
    console.log(productTitle);
  });



});



// create server browsers can connect to
app.listen(5000, function () {
  console.log('listening on 5000')
});