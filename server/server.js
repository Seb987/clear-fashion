
const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb+srv://seb:IMQdE9q5owHiV1CF@products.y0vdk.mongodb.net/Products?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'products';

async function start() {
    
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');

    //console.log(collection);
    /*Insert the products in the database
    const products= require('./products.json');
    const result = collection.insertMany(products);
    console.log(result);
    
*/
  find_Brand(collection, 'Adresse Paris');
  
}
start()

async function find_Brand(collection, brand){
  const products = await collection.find({brand}).toArray();;

  console.log(products);
}


