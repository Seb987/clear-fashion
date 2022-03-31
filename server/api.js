const cors = require('cors');
const express = require('express');
const req = require('express/lib/request');
const helmet = require('helmet');
const db = require('./server.js')
const bodyParser = require('body-parser');
const { query } = require('express');
const clientPromise = require('./mongodb-client');
var collection, client;
const MONGODB_DB_NAME = 'clear-fashion';
const MONGODB_DB_COLLECTION = 'products';
const { calculateLimitAndOffset, paginate } = require('paginate-info');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', async(request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', async(request, response) => {
  client = await clientPromise;
  collection = client.db(MONGODB_DB_NAME).collection(MONGODB_DB_COLLECTION)
  
  let query = request.query;
  let size = 12;
  let page = 1;
  let sort = {};

  if('sort' in query){
    switch(query.sort){
      case 'price-asc':
        sort={price:1}
        break;
      case 'price-desc':
        sort={price:-1}
        break;
      case 'date-asc':
        sort={scrape_date:-1}
        break;
      case 'date-desc':
        sort={scrape_date:1}
        break;
      default:
        break;
    }
    delete query['sort']
  }

  if('size' in query){
    size=parseInt(query.size)
    delete query['size']
  }
  if('page' in query){
    page=parseInt(query.page)
    delete query['page']
  }
  if('brand' in query){
    query['brand']={$eq:query.brand}
  }
  if('price' in query){
    query['price']={$lt:parseInt(query.price)}
  }

  const { limit, offset } = calculateLimitAndOffset(page, size);
  const count = await db.count(query, collection);

  const result = await db.find(query, collection, limit, offset, sort)
  response.send({"success":true,"data":{"result":result,"meta": paginate(page, count, result, limit)}});
});

app.get('/products/:id', async(request, response) => {
  client = await clientPromise;
  collection = client.db(MONGODB_DB_NAME).collection(MONGODB_DB_COLLECTION)
  response.send(await db.find({"_id":request.params.id},collection));
});


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
module.exports = app;