const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
const { ObjectId } = require('mongodb');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('.product-grid__item')
    .map((i, element) => {
      const link = `https://www.loom.fr${$(element)
        .find('.product-title a')
        .attr('href')}`;
        var today = new Date();
        var scrape_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      return {
        link,
        'brand': 'loom',
        'price': parseInt(
          $(element)
            .find('.money')
            .text()
        ),
        'name': $(element)
          .find('.product-title')
          .text()
          .trim()
          .replace(/\s/g, ' '),
        'photo': $(element)
          .find('noscript img.product_card__image')
          .attr('src'),
        scrape_date,
        '_id': uuidv5(link, uuidv5.URL)
      };
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async (url='https://www.loom.fr/collections/hauts-homme') => {
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
