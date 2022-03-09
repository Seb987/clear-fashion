const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      return {name, price};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async (url='https://www.dedicatedbrand.com/en/loadfilter?category=men%2Fall-men') => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.json();
      const filterId =[];
      const filteredProducts =[];
      const filter = [];

      //We want to keep the ID of all the products that is the shown in the all-men
      body.filter.categories['men/all-men'].forEach(element => {
        filterId.push(element)
      });

      //We keep only the products that have their ID in the array we have previously created
      body.products.forEach(element => {
          if(filterId.includes(element.id)){
            filteredProducts.push(element)
          }
      })

      //We decide to only display the name and the price of the product
      filteredProducts.forEach(element => {
        temp={};
        const link="https://www.dedicatedbrand.com/en/men/all-men/"+element.uri;
        temp['_id']=uuidv5(link, uuidv5.URL)
        temp['link']=link
        temp['brand']='Dedicated Brand'
        temp['name']=element.name;
        temp['price']=parseInt(element.price.price);
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        temp['scrape_date']=date;
        temp['photo']=element.image[0]
        filter.push(temp)

      })
      return filter;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
