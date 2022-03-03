/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand.js');
const montlimart = require('./sources/montlimart.js');
const adresseparis= require('./sources/adresseparis.js');
const fs = require('fs');

async function sandbox (eshop) {
  try {
    //console.log(`🕵️‍♀️  browsing ${eshop} source`);
    const products_dedicatedBrand = await dedicatedbrand.scrape(eshop);
    const products_montlimart = await montlimart.scrape(eshop);
    const products_adresseParis = await adresseparis.scrape(eshop);

    //Merge all products into one array
    const temp = products_dedicatedBrand.concat(products_montlimart);
    const products_new = temp.concat(products_adresseParis)

    //console.log(products_new);
    //console.log('done');


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
    }
    //console.log(products_file)

    try {
        fs.writeFileSync('products.json', JSON.stringify(products_file));
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
