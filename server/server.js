require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'clear-fashion';
const MONGODB_DB_COLLECTION = 'products';

let client = null;
let database = null;

async function start() {
    
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME)
  const collection = db.collection(MONGODB_DB_COLLECTION);

  //insert_Products(collection)
  //find_Brand(collection, 'Adresse Paris');
  //find_filter_price(collection, 0 , 50);
  //sorted_by_price(collection)
  //sorted_by_date(collection);
  //products_recently_scraped(collection)
  
}

const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME).collection(MONGODB_DB_COLLECTION);
    

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};


/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
 module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_DB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
 module.exports.find = async (query, collection, limit=0) => {
  try {
    //const db = await getDB();
    //const collection = db.collection(MONGODB_DB_COLLECTION);
    const result = await collection.find(query).sort({price:1}).limit(limit).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

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


/**
 * Close the connection
 */
 module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};