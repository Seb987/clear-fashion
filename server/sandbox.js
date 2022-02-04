/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const fs = require('fs');


async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);
    console.log(products);
    console.log('done');
    
    var jsonData =[];
    products.forEach(element =>{
      jsonData.push(JSON.stringify(element));
    })
    try {
        fs.writeFileSync('products.json', JSON.stringify(products));
        console.log("JSON data is saved.");
    } catch (err) {
      console.error(err);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
