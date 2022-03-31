require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = 'clear-fashion';
const MONGODB_DB_COLLECTION = 'products';

let client = null;
let database = null;

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
    //const db = await getDB();
    const collection = await getDB();
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
 module.exports.find = async (query, collection, limit, offset, sort) => {
  try {
    //const db = await getDB();
    //const collection = db.collection(MONGODB_DB_COLLECTION);
    const result = await collection.find(query).sort(sort).skip(offset).limit(limit).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

module.exports.count = async (query, collection) => {
  try {
    //const db = await getDB();
    //const collection = db.collection(MONGODB_DB_COLLECTION);
    const result = await collection.find(query).count();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};

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