const cors = require('cors');
const express = require('express');
const req = require('express/lib/request');
const helmet = require('helmet');
const db = require('./server.js')
const bodyParser = require('body-parser');
const { query } = require('express');
const clientPromise = require('./mongodb-client');
var collection, client;
let data;
const MONGODB_DB_NAME = 'clear-fashion';
const MONGODB_DB_COLLECTION = 'products';

const PORT = 8092;

const app = express();

module.exports = app;

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', async(request, response) => {
  client = await clientPromise;
  collection = client.db(MONGODB_DB_NAME).collection(MONGODB_DB_COLLECTION)
  response.send({'ack': true});
});

app.get('/products/search?', async(request, response) => {
  client = await clientPromise;
  collection = client.db(MONGODB_DB_NAME).collection(MONGODB_DB_COLLECTION)
  let limit = 12
  let query = request.query;
  if('brand' in query){
    query['brand']={$eq:request.query.brand}
  }
  if('price' in query){
    query['price']={$lt:parseInt(request.query.price)}
  }
  if('limit' in query){
    limit=parseInt(request.query.limit)
    delete query['limit']
  }
  const result = await db.find(query, collection, limit)
  response.send({"limit":limit,"total":result.length,"results":result});
});

app.get('/products/:id', async(request, response) => {
  client = await clientPromise;
  collection = client.db(MONGODB_DB_NAME).collection(MONGODB_DB_COLLECTION)
  response.send(await db.find({"_id":request.params.id},collection));
});


app.listen(PORT, async() => {
  /*
  client = await clientPromise;
  collection = client.db(MONGODB_DB_NAME).collection(MONGODB_DB_COLLECTION)
  console.log('Connected to '+MONGODB_DB_NAME);*/
  //data = await db.getDB();
});

console.log(`📡 Running on port ${PORT}`);
module.exports = app;