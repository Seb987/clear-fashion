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
  /*let query ={};
  if(request.query.brand == undefined){
    query={price:{$lt:request.query.price}}
  }
  else if(request.query.price == undefined){
    query={brand:request.query.brand}
  }
  else {
    query=}
  }*/
  //,{limit:request.query.limit}
  console.log(request.query.brand)
  console.log(request.query.price)
  console.log(request.query.limit)
  const result = await db.find({brand:request.query.brand, price:{$lt:request.query.price}});
  response.send({"limit":request.query.limit,"total":result.length,"results":result});
});

/*

app.get('/products/search?limit=:limit/?brand=:brand/?price=:price', async(request, response) => {
  console.log("search")
  response.send(await db.find({'brand': {$eq:request.params.brand},'price':{$lt:request.params.price}}).limit(request.params.limit));
});*/



app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
