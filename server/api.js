const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./server.js')

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/:id', async(request, response) => {
  response.send(await db.find({"_id":request.params.id}));
});

app.get('/products/search', (request, response) => {
  response.send({'blaack': false});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
