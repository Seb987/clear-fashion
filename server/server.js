
const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb+srv://seb:IMQdE9q5owHiV1CF@products.y0vdk.mongodb.net/products?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'products';

async function start() {
    
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)

  const collection = db.collection('products');

  //insert_Products(collection)
  //find_Brand(collection, 'Adresse Paris');
  //find_filter_price(collection, 0 , 50);
  //sorted_by_price(collection)
  //sorted_by_date(collection);
  //products_recently_scraped(collection)
  
  //const products = await collection.find().toArray();
  //console.log(products);
}
start()

async function insert_Products(collection){
  
  //Insert the products in the database
  const products= require('./products.json');
  collection.drop(); //Drop the current collection to refresh the new products 
  collection.insertMany(products);  
  console.log("Produits ajoutés")
}

//Displays only the products of a certain brand
async function find_Brand(collection, brand){
  const products = await collection.find({brand}).toArray();

  console.log(products);
}
//Displays only the products between a specific price range
async function find_filter_price(collection, min, max){
  const products = await collection.find().toArray();
  products.forEach(element => {  
    if(element.price > min & element.price < max)  {
      console.log(element);
    }
  });
}

//Sort the product by price from lowest to highest
async function sorted_by_price(collection){
  const products = await collection.find().toArray();
  const products_sorted = products.sort(function(a, b){return a.price - b.price});
  
  console.log(products_sorted)
}

//Sort the product by date from oldest to newest
async function sorted_by_date(collection){
  const products = await collection.find().toArray();
  const products_sorted = products.sort(function(a, b){return new Date(b.released_Date) - new Date(a.released_Date)});
  
  console.log(products_sorted)
}

//Displays products scraped less than 2 weeks
async function products_recently_scraped(collection){
  const products = await collection.find().toArray();
  products.forEach(element => {
    var diff_In_time = new Date()- new Date(element.released_Date);
    var diff_In_Days = diff_In_time/(1000*3600*24)
    if(diff_In_Days < 14) {
      console.log(element)
    }
  })
}

