// require in express to use in this file
const express = require('express');
// require in mongoDB
const mongo = require("mongodb").MongoClient;
// running project and MongoDB locally
const url = "mongodb://localhost:27017";
// require in request
const request = require("request");
// define router
const router = express.Router();

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

// products GET route with pid parameter
router.get('/:pid', (req, res) => {
  // convert pid parameter to number data type to send in query to MongoDB
  let pidParam = Number(req.params.pid);
  // send request to GET data from external API
  request.get(`https://redsky-uat.perf.target.com/redsky_aggregations/v1/redsky/case_study_v1?key=3yUxt7WltYG7MFKPp7uyELi1K40ad2ys&tcin=${pidParam}`, (error, response, body) => {
    if (error) {
      console.error('error in redsky external API request', error);
      return
    };
    // parse JSON to be able to access objects from incoming data
    body = JSON.parse(body);
    // isolate product's title and store in variable
    let productTitle = body.data.product.item.product_description.title
    // access MongoDB and find item with matching pid
    products.findOne({ pid: pidParam })
      .then(result => {
        // add product title from external API request as key value pair in result object from DB
        result.name = productTitle;
        console.log(result);
        res.send(result);
      })
      .catch(error => console.error(error));
  });
});

module.exports = router;