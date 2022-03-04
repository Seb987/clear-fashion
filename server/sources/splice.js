const fetch = require('node-fetch');
const cheerio = require('cheerio');
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.products .product-meta')
    .map((i, element) => {
        const name = $(element)
        .find('.product-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

      return {"brand":"Splice",name, price, "scrape_date":date};
    })
    .get();
};


/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
 module.exports.scrape = async (url='https://www.splice.paris/12-homme') => {
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        const body = await response.text();
        let returnArray=[]
        for (let i =1; i <= 2; i++){
            const temp_url = url+'?page='+i.toString()
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