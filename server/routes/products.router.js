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

// creates connection to MongoDB and returns reference to db
mongo.connect(
  url,
  {
    /* useNewUrlParser: true flag allows user to fall back to old parser if bug is found in new parser, 
    basically to avoid 'current URL string parser is deprecated' warning */
    useNewUrlParser: true,
    // Set useUnifiedTopology to true to opt in to using the MongoDB driver's new connection management engine
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
  // send request to GET data from external API w/ matching product id
  request.get(`https://redsky-uat.perf.target.com/redsky_aggregations/v1/redsky/case_study_v1?key=3yUxt7WltYG7MFKPp7uyELi1K40ad2ys&tcin=${idParam}`, (error, response, body) => {
    try {
      // parse JSON to be able to access objects from incoming data
      body = JSON.parse(body);
      // isolate product's title and tcin and store them in variables
      let productTitle = body.data.product.item.product_description.title;
      let productId = Number(body.data.product.tcin);
      // access MongoDB and find item with matching product id
      products.findOne({ pid: idParam })
        .then(result => {
          // reformatting of result object
          delete result._id;
          delete result.pid;
          // add product title and tcin (product id) from external API request to result object
          result.id = productId;
          result.name = productTitle;
          // rename key current_price to move to end in result object
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