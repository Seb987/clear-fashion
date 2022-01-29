// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

//Bool for toggle button
let releasedIsOn=false;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const btnRecent = document.querySelector('#recent_products');

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

const fetchProductsByBrand = async (page = 1, size = 12, brand) => {
  try {
    if(releasedIsOn){
        return fetchAllProducts(page, size, brand);
    }
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

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const fetchAllProducts = async(page = 1, size = 12, brand) => {
  try {
    let string="";
    if(brand !="all"){
      string=`&brand=${brand}`;
    }
    const response = await fetch(`https://clear-fashion-api.vercel.app?page=1&size=139`+string);
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    const filteredData={};
    filteredData['result']=[]
    const results=body.data.result;
    for(let i=0;i< results.length;i++){
        if(isNew(results[i].released)){
            filteredData['result'].push(results[i]);
        }
    }
    
    filteredData['meta']={};
    filteredData.meta['count']=filteredData['result'].length;
    filteredData.meta['currentPage']= selectPage.value;
    filteredData.meta['pageSize']=selectShow.value;
    filteredData.meta['pageCount']=parseInt(Math.ceil(filteredData.meta.count/filteredData.meta.pageSize));
    return filteredData;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
}

const isNew = (released) => {
    var diff_In_time = new Date()- new Date(released);
    var diff_In_Days = diff_In_time/(1000*3600*24)
    if(diff_In_Days < 14) {
      return true;
    }
  return false;
}

const toggleReleased  = () =>  {
  if(releasedIsOn){
    btnRecent.style.background='';
    releasedIsOn=false;
  }else {
    btnRecent.style.background='lightgreen'
    releasedIsOn=true;
  }
  fetchProductsByBrand(1, selectShow.value, selectBrand.value)
  .then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination))
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
        <a href="${product.link}">${product.name}</a>
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
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
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

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
