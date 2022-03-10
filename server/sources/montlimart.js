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

  return $('.category-products .item')
    .map((i, element) => {
      const link = $(element)
        .find('.product-name a')
        .attr('href')
      if (link == undefined){
        return
      }  
      const _id=uuidv5(link, uuidv5.URL)
      const name = $(element)
        .find('.product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );
      var today = new Date();
      var scrape_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const photo =$(element)
      .find('.product-image img')
      .attr('src');  
      return {_id, link,"brand":"Montlimart",name, price, scrape_date, photo};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
 module.exports.scrape = async (url='https://www.montlimart.com/toute-la-collection.html?limit=all') => {
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const body = await response.text();
  
        return parse(body);
      }
  
      console.error(response);
  
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };