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
    //const products_akho = await akho.scrape(eshop);
    //const products_splice = await splice.scrape(eshop);
    //const products_loom = await loom.scrape(eshop);
/*
    //Merge all products into one array
    let temp = products_dedicatedBrand.concat(products_montlimart);
    temp = temp.concat(products_adresseParis)
    temp = temp.concat(products_akho)
    const products_new = temp.concat(products_splice)*/

    //console.log(products_montlimart);
    //console.log('done');

    //const loomOnly = await db.find({'brand': {$eq:'Montlimart'},'price':{$lt:100}});
    const result = await db.find()
    console.log(result);
   /* const result = await db.insert(products_dedicatedBrand);
    const result2 = await db.insert(products_montlimart);
    const result3 = await db.insert(products_adresseParis);

    */
    db.close();

/*
    const products_file= require('./products.json');
    
    for(let i=0; i<products_new.length;i++){
      let product_not_new = false;
      for(let j=0; j < products_file.length; j++){
        if(products_file[j].name == products_new[i].name){
          product_not_new=true;
        }
      }
      if(!product_not_new){
        products_file.push(products_new[i]);
      }
    }/*
    try {
        fs.writeFileSync('products.json', JSON.stringify(products_file));
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
