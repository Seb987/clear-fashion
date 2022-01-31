// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

//Bool for toggle button to know if the button is clicked or not
let releasedIsOn=false;
let reasonablePriceIsOn = false;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const btnRecent = document.querySelector('#recent_products');
const btnPrice = document.querySelector('#reasonable_price');
const selectSort = document.querySelector('#sort-select');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanPriceValueP50 = document.querySelector('#valueP50');
const spanPriceValueP90 = document.querySelector('#valueP90');
const spanPriceValueP95 = document.querySelector('#valueP95');
const spanLastReleased = document.querySelector('#lastReleasedDate');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 * 
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};


/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};
/**
 * Fetch only the products corresponding to the brand we need
 */
const fetchProductsByBrand = async (page = 1, size = 12, brand) => {
  try {
    let string="";
    if(brand !="all"){
      string=`&brand=${brand}`;
    }
    const response = await fetch(`https://clear-fashion-api.vercel.app?page=${page}&size=${size}`+string);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    if(releasedIsOn){
      let filteredProducts=[]
      body.data.result.forEach(element =>{
        if(isNew(element.released)){
          filteredProducts.push(element)
        }
      })
      body.data.result=filteredProducts
    }
    if(reasonablePriceIsOn){
      let filteredProducts=[]
      body.data.result.forEach(element =>{
        if(isReasonablePrice(element.price)){
          filteredProducts.push(element)
        }
      })
      body.data.result=filteredProducts
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * check whether or not a date is considered as recent (less than two weeks)
 * @param {date} released 
 * @returns {boolean}
 */
const isNew = (released) => {
  var diff_In_time = new Date()- new Date(released);
  var diff_In_Days = diff_In_time/(1000*3600*24)
  if(diff_In_Days < 14) {
    return true;
  }
  return false;
}

/**
 *  checks whteter or not a price is reasonable (less than 50euros)
 * @param {number} price 
 * @returns {boolean}
 */
const isReasonablePrice = (price) => {
  return price < 50;
}

/**
 * fetch all the data in the API and returns the number of new products it can count
 * @returns {number}
 */
const countNewProducts = async() => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=1&size=139`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    let nbNewProducts=0;
    const results= body.data.result;
    for(let i =0; i<results.length; i++){//Check for each product if the released date is less than 2 weeks
      if(isNew(results[i].released)){
        nbNewProducts++;
      }
    }
    return nbNewProducts;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
}

/**
 *  fetch all the data in the API, sort the array by price to find the corresponding percentile value
 * @param {number} percentile 
 * @returns {number}
 */
const priceValue = async(percentile) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=1&size=139`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    const sortedArr=sortedByPrice(body.data.result);//Sort the array by price  in order descending
    const percentile_index= parseInt(sortedArr.length*percentile/100); //Calculate the percentile index depending on the array length
    const priceVal = sortedArr[percentile_index]; 
    return priceVal;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
}

/**
 *  fetch all the data in the API, sort the array by date to find the last released date
 * @param {number} percentile 
 * @returns {number}
 */
 const lastReleased = async() => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=1&size=139`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    const sortedArr=sortedByDate(body.data.result); //Sort the array by date from most recent to oldest
    const lastReleased = sortedArr[0]; //returns the first element of the array since it's sorted from recent to oldest
    return lastReleased;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
}

/**
 * sort an array by price from highest to lowest
 * @param {object} arr 
 * @returns  {object}
 */
const sortedByPrice =(arr) => {
  let temp_arr =[]
  for(let i =0; i< arr.length; i++){
    temp_arr.push(arr[i].price);
  }
  return temp_arr.sort(function(a, b){return b-a});
}

/**
 * sort an array by date from from most recent to most ancient
 * @param {object} arr 
 * @returns  {object}
 */
 const sortedByDate =(arr) => {
  let temp_arr =[]
  for(let i =0; i< arr.length; i++){
    temp_arr.push(arr[i].released);
  }
  return temp_arr.sort(function(a, b){return new Date(b)-new Date(a)});
}

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = async(pagination) => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;

  spanNbNewProducts.innerHTML= await countNewProducts();
  spanPriceValueP50.innerHTML = await priceValue(50);
  spanPriceValueP90.innerHTML = await priceValue(90);
  spanPriceValueP95.innerHTML = await priceValue(95);
  spanLastReleased.innerHTML = await lastReleased();
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */

selectShow.addEventListener('change', async(event) => {
  const products = await fetchProductsByBrand(1, parseInt(event.target.value), selectBrand.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the page to browse to 
 */
selectPage.addEventListener('change', async(event) => {
  const products = await fetchProductsByBrand(parseInt(event.target.value), selectShow.value, selectBrand.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Filter by brand
 */
selectBrand.addEventListener('change', async(event) => {
  const products = await fetchProductsByBrand(1, selectShow.value, event.target.value.toLowerCase());

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
/*
selectSort.addEventListener('change', async(event)=> {
  const products = await fetchProductsByBrand(1, selectShow.value, selectBrand.value);
  let sorted_brand_by_price={};
  const sort = event.target.value;
  switch(sort){
    case "price-asc":
      sorted_brand_by_price=products.results.sort(function(a, b){return a.price-b.price});
      break;
    case "price-desc":
      sorted_brand_by_price=products.results.sort(function(a, b){return b.price-a.price});
      break;
    case "date-asc":
      sorted_brand_by_price=products.results.sort(function(a, b){return new Date(a.date)- new Date(b.date)});
      break;
    case "date-desc":
      sorted_brand_by_price=products.results.sort(function(a, b){return new Date(b.date)- new Date(a.date)});
      break;
    default:
      break;
  }
  setCurrentProducts(sorted_brand_by_price, products.currentPagination);
  render(currentProducts, currentPagination);
})

const sortDictByPrice = (dict) => {

}*/

/**
 * Call the fetch function if the toggle button is on and change it's color depending on it's state
 */
const toggleReleased  = async() =>  {
  if(releasedIsOn){
    btnRecent.style.background='';
    releasedIsOn=false;
  }else {
    btnRecent.style.background='lightgreen'
    releasedIsOn=true;
  }
  const products = await fetchProductsByBrand(selectPage.value, selectShow.value, selectBrand.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
} 
const togglePrice  = async() =>  {
  if(reasonablePriceIsOn){
    btnPrice.style.background='';
    reasonablePriceIsOn=false;
  }else {
    btnPrice.style.background='lightgreen'
    reasonablePriceIsOn=true;
  }
  const products = await fetchProductsByBrand(selectPage.value, selectShow.value, selectBrand.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
} 

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
