const cors = require('cors');
const express = require('express');
const req = require('express/lib/request');
const helmet = require('helmet');
const db = require('./server.js')
const bodyParser = require('body-parser');
const { query } = require('express');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});
/*
app.get('/products/:id', async(request, response) => {
  console.log("id")
  response.send(await db.find({"_id":request.params.id}));
});*/
app.get('/products/search?', async(request, response) => {
  
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
  //{limit:request.query.limit}
  //const result = await db.find({'brand': {$eq:request.query.brand},'price':{$lt:parseInt(request.query.price)}});
  const result = await db.find(query, limit)
  response.send({"limit":limit,"total":result.length,"results":result});
});

/*

app.get('/products/search?limit=:limit/?brand=:brand/?price=:price', async(request, response) => {
  console.log("search")
  response.send(await db.find({'brand': {$eq:request.params.brand},'price':{$lt:request.params.price}}).limit(request.params.limit));
});*/



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
