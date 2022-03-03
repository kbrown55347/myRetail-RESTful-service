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
  // convert pid parameter to number data type to send in query to MongoDB
  let pidParam = Number(req.params.pid);
  // request for data from external API
  request.get(`https://redsky-uat.perf.target.com/redsky_aggregations/v1/redsky/case_study_v1?key=3yUxt7WltYG7MFKPp7uyELi1K40ad2ys&tcin=${pidParam}`, (error, response, body) => {
    if (error) {
      console.error('error in redsky API request', error);
      return
    };
    // parse JSON to be able to access objects from incoming data
    let title = JSON.parse(body);
    // isolate product's title
    let productTitle = title.data.product.item.product_description.title
    // console.log(productTitle);

    products.findOne({ pid: pidParam })
      .then(result => {
        // add product title as key value pair in result object
        result.name = productTitle;
        console.log(result);
        res.send(result);
      })
      .catch(error => console.error(error));
  });

});



// create server browsers can connect to
app.listen(5000, function () {
  console.log('listening on 5000')
});