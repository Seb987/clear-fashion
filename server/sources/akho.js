const fetch = require('node-fetch');
const cheerio = require('cheerio');
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.card-information')
    .map((i, element) => {
        const name = $(element)
        .find('.card-information__text')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price-item')
          .text()
      );
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

      return {"brand":"Akho",name, price, "scrape_date":date};
    })
    .get();
};


/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
 module.exports.scrape = async (url='https://www.akhoparis.com/collections/all') => {
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