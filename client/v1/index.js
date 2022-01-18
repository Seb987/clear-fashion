// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable
let cheapest_ts={'name':'Le T-shirt', 'url': 'https://www.loom.fr/products/le-t-shirt'};
console.log("Cheapest T-shirt:",cheapest_ts);





/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */



// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable
const marketplace = require('./data.js');
let nb_products = marketplace.length;
console.log("Number of products: ",nb_products);

// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have
let brands_name=[];
for (let i=0; i< nb_products; i++){
  if(!brands_name.includes(marketplace[i].brand)){
    brands_name.push(marketplace[i].brand);
  }
}

console.log(brands_name);


// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable

function sorted_marketplace_price(marketplace){
  let temp_marketplace =[]
  marketplace.forEach(element => {
    temp_marketplace.push(element.price);
  });
  return temp_marketplace.sort(function(a, b){return a-b});
}
let new_sorted_marketplace_byPrice= sorted_marketplace_price(marketplace);
console.log(new_sorted_marketplace_byPrice);



// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable
function sorted_marketplace_date(marketplace){
  let temp_marketplace =[]
  marketplace.forEach(element => {    
    temp_marketplace.push(element.date);
  });
  return temp_marketplace.sort(function(a, b){return new Date(b)- new Date(a)});
}
let new_sorted_marketplace_byDate= sorted_marketplace_date(marketplace);
console.log(new_sorted_marketplace_byDate);


// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list

function filter_products(marketplace, min, max){
  let temp_marketplace=[];
  marketplace.forEach(element => {  
    if(element.price > min & element.price < max)  {
      temp_marketplace.push(element.price);
    }
  });
  return temp_marketplace;
}
let filtered_marketplace =filter_products(marketplace, 50, 100);
console.log(filtered_marketplace);


// 🎯 TODO: Average Basket
// 1. Determine the average basket of the marketplace
// 2. Log the average

let avg_price=0
marketplace.forEach(element => {
  avg_price += element.price/nb_products;
})
console.log("Average price: ", avg_price);



/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands

let brands={};
brands_name.forEach(names => {
  let temp_arr =[];
  marketplace.forEach(element => {
    if(names == element.brand){
      temp_arr.push(element);
    }
  });
  brands[names]=temp_arr;
})
console.log(brands);

Object.keys(brands).forEach(element => {
  console.log(element,": Number of products = ",brands[element].length)
})



// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort

let sorted_brand_by_price={};
brands_name.forEach(names => {
  sorted_brand_by_price[names]=brands[names].sort(function(a, b){return b.price-a.price});
})
console.log(sorted_brand_by_price);


// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort

let sorted_brand_by_date={};
brands_name.forEach(names => {
  sorted_brand_by_date[names]=brands[names].sort(function(a, b){return new Date(a.date)- new Date(b.date)});
})
console.log(sorted_brand_by_date);

/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products

let p90_brand= {};
brands_name.forEach(names =>{
  let p90 =Math.round(sorted_brand_by_price[names].length*0.9)
  p90_brand[names]=sorted_brand_by_price[names][p90].price;
})

console.log(p90_brand);

/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.

let new_released_Products = false;
COTELE_PARIS.forEach(element => {
  var diff_In_time = new Date()- new Date(element.released);
  var diff_In_Days = diff_In_time/(1000*3600*24)
  if(diff_In_Days < 14) {
    new_released_Products=true;
  }
})
console.log(new_released_Products);

// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€

let reasonable_price = true;
COTELE_PARIS.forEach(element => {
  if(element.price > 100){
    reasonable_price=false;
  }
})
console.log(reasonable_price);


// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product


// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product

// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;

jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties





/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage
