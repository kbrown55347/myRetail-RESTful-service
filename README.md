# myRetail RESTful service




## Installation

### Install [MongoDB](https://www.mongodb.com/)

1. If you don't have MongoDB installed, I found [this resource](https://zellwk.com/blog/local-mongodb/) helpful for the installation process.

2. Once installed, enter the following command in your terminal. Keep this window running to work with your local MongoDB.
```
mongod
```

3. Open up a new terminal and enter the following command to open up the Mongo Shell.
```
mongo
```

4. Through the Mongo Shell, create a new database by entering the following command.
```
use myRetail
```

5. To add a collection to the database and an item to the collection, enter the following command.
```
db.products.insertOne({"pid": 13860428, "name": "The Big Lebowski (Blu-ray) (Widescreen)", "current_price": {"value": 13.49, "currency_code": "USD"}})
```
