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

// products GET route with id parameter
router.get('/:id', (req, res) => {
  // convert id parameter to number data type to send in query to MongoDB
  let idParam = Number(req.params.id);
  // send request to GET data from external API
  request.get(`https://redsky-uat.perf.target.com/redsky_aggregations/v1/redsky/case_study_v1?key=3yUxt7WltYG7MFKPp7uyELi1K40ad2ys&tcin=${idParam}`, (error, response, body) => {
    try {
      // parse JSON to be able to access objects from incoming data
      body = JSON.parse(body);
      // isolate product's title and store in variable
      let productTitle = body.data.product.item.product_description.title
      // access MongoDB and find item with matching pid
      products.findOne({ pid: idParam })
        .then(result => {
          // reformatting of result object
          delete result._id;
          result.id = result.pid;
          delete result.pid;
          // add product title from external API request as key value pair in result object from DB
          result.name = productTitle;
          // rename current_price key to get price and move to end
          result.price = result.current_price;
          delete result.current_price
          // send the final result object
          res.send(result);
        })
        .catch((error) => {
          console.error('error in MongoDB request', error);
          // send status code 500 "Internal Server Error"
          res.sendStatus(500);
        });
    } catch (error) {
      console.error('error in redsky external API request', error)
      // send status code 500 "Internal Server Error"
      res.sendStatus(500)
    }
  })
});

module.exports = router;