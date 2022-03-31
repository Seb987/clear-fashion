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

  return $('.card-wrapper')
    .map((i, element) => {
      const link = "https://www.akhoparis.com"+$(element)
        .find('.card__inner a')
        .attr('href')
      if (link == undefined){
        return
      }  
      const _id=uuidv5(link, uuidv5.URL)
      const name = $(element)
      .find('.card-information .card-information__text')
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

      const photo =$(element)
      .find('.media img')
      .attr('srcset'); 
      return {_id, link,"brand":"Akho",name, price, "scrape_date":date, photo};
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