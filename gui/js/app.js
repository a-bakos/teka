import Lang from './lang.js'

const LANG_EN = 'en'
const LANG_HU = 'hu'
const i18n = new Lang(LANG_EN);

(async () => {
    await i18n.init()
    console.log(i18n.t('greeting', { name: 'John' }))

    i18n.setLang(LANG_HU)
    console.log(i18n.t('greeting', { name: 'John' }))
})()

// import { BookManager } from './js/book.js'