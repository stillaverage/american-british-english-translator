const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  reverseDictionary(data) {
    return Object.fromEntries(
      Object
        .entries(data)
        .map(([key, value]) => [value, key])
    )
  }

  getDictionary(locale) {
    if (locale === 'american-to-british') {
      return {
        dictionary: {
        ...americanOnly,
        ...americanToBritishSpelling,
        },
        titles: americanToBritishTitles
      }
    } else {
      return {
        dictionary: {
        ...britishOnly,
        ...this.reverseDictionary(americanToBritishSpelling),
        },
        titles: this.reverseDictionary(americanToBritishTitles)
      }
    }
  }

  getTimeRegex(locale) {
    if (locale === 'american-to-british') {
      return {
        timeRegex: /([1-9]|1[012]):[0-5][0-9]/g,
        timeSplit: ':',
        timeJoin: '.'
      }
    } else {
      return {
        timeRegex: /([1-9]|1[012]).[0-5][0-9]/g,
        timeSplit: '.',
        timeJoin: ':'
      }
    }
  }

  translate(text, locale) {
    let { dictionary, titles } = this.getDictionary(locale)
    
    let translation = text;
    let dictMatches = {};
    Object.entries(dictionary).forEach(([key, value]) => {
      if (translation.toLowerCase().includes(key)) {
        dictMatches[key] = value
      }
    })

    Object.entries(dictMatches).forEach(([key, value]) => {
      translation = translation.replace(new RegExp('\\b' + key + '\\b', 'ig'), '<span class="highlight">' + value + '</span>')
    })

    Object.entries(titles).forEach(([key, value]) => {
      translation = translation.replace(new RegExp('\\b' + (key.endsWith('.') ? key.slice(0, key.length - 1) + '\\.' : '\\b' + key + '\\b'), 'ig'), '<span class="highlight">' + (value.charAt(0).toUpperCase() + value.slice(1)) + '</span>')
    })



    const { timeRegex, timeSplit, timeJoin } = this.getTimeRegex(locale)
    if (translation.match(timeRegex)) {
      translation.match(timeRegex).forEach(match => {
        translation = translation.replace(match, '<span class="highlight">' + match.split(timeSplit).join(timeJoin) + '</span>')
      })
    }
    
    if (translation === text) {
      translation = 'Everything looks good to me!'
    }

    return { text, translation }
  }
}

module.exports = Translator;