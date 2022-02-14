
const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb+srv://seb:IMQdE9q5owHiV1CF@products.y0vdk.mongodb.net/products?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'products';

async function start() {
    
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');

    console.log(collection.products);
}
start()



/*
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://seb:IMQdE9q5owHiV1CF@<cluster-url>?retryWrites=true&writeConcern=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("test").collection("products");
  const brand = 'montlimart';
  const products = collection.find({brand}).toArray();
  console.log(products);
  // perform actions on the collection object
  client.close();
});*/


