/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand.js');
const montlimart = require('./sources/montlimart.js');
const adresseparis = require('./sources/adresseparis.js');
const akho = require('./sources/akho.js');
const splice = require('./sources/splice.js');
const loom = require('./sites/loom.js');
const db = require('./server.js')
const fs = require('fs');

async function sandbox (eshop) {
  try {
    //console.log(`🕵️‍♀️  browsing ${eshop} source`);
    //const products_dedicatedBrand = await dedicatedbrand.scrape(eshop);
    //const products_montlimart = await montlimart.scrape(eshop);
    //const products_adresseParis = await adresseparis.scrape(eshop);
    const products_akho = await akho.scrape(eshop);
    //const products_splice = await splice.scrape(eshop);
    //const products_loom = await loom.scrape(eshop);

    console.log(products_akho);
    console.log('done');

   /* const result = await db.find()
    console.log(result);
    const result = await db.insert(products_dedicatedBrand);
    const result2 = await db.insert(products_montlimart);
    const result3 = await db.insert(products_adresseParis);
    
    db.close();*/

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
