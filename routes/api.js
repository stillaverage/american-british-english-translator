'use strict';
const Translator = require('../components/translator.js');

const validLocales = ['american-to-british', 'british-to-american']

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;
      if (text === '') {
        res.json({ error: 'No text to translate' })
      } else if (!locale || text === undefined) {
        res.json({ error: 'Required field(s) missing'})
      } else if (validLocales.includes(locale)) {
        res.json(translator.translate(text, locale))
      } else {
        res.json({ error: 'Invalid value for locale field' })
      }
    });
};
