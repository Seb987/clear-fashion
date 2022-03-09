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

  return $('.product-container')
    .map((i, element) => {
      const link = $(element)
      .find('.product-name')
      .attr('href');
      if (link == undefined){
        return
      }
      const name = $(element)
        .find('.product-name')
        .attr('title');
      const price = parseInt(
        $(element)
          .find('.product-price')
          .text()
      );
      var today = new Date();
      var scrape_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const image =$(element)
      .find('.replace-2x')
      .attr('data-original');  
      const _id=uuidv5(link, uuidv5.URL)
      return {_id, link,"brand":"Adresse Paris",name, price, scrape_date, image};
    })
    .get();
};


/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
 module.exports.scrape = async (url='https://adresse.paris/630-toute-la-collection?id_category=630&n=133') => {
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        const body = await response.text();
        let returnArray=[]
        for (let i =1; i <= 2; i++){
            const temp_url = url+'&p='+i.toString()
            try{
                const temp_response = await fetch (temp_url)
                if(temp_response.ok){
                    const temp_body = await temp_response.text()
                    returnArray = returnArray.concat(parse(temp_body))
                }
            } catch (error) {
                console.error(error);
                return null;
              }
        }
        return returnArray;
      }
  
      console.error(response);
  
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };