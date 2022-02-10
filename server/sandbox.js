/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart.js');
const adresseparis= require('./sources/adresseparis');
const fs = require('fs');


async function sandbox (eshop) {
  try {
    //console.log(`🕵️‍♀️  browsing ${eshop} source`);
    const products_dedicatedBrand = await dedicatedbrand.scrape(eshop);
    const products_montlimart = await montlimart.scrape(eshop);
    const products_adresseParis = await adresseparis.scrape(eshop);

    //Merge all products into one array
    const temp = products_dedicatedBrand.concat(products_montlimart);
    const products = temp.concat(products_adresseParis)

    console.log(products_montlimart);
    //console.log('done');
  /*
    try {
        fs.writeFileSync('products.json', JSON.stringify(products));
        console.log("JSON data is saved.");
    } catch (err) {
      console.error(err);
    }*/
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
