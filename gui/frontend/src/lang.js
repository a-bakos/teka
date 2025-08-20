"use strict"

import langFile from './lang.json'

export default class Lang {
    static LANG_EN = 'en'
    static DICT_SPLIT = '.'

    constructor(defaultLang = Lang.LANG_EN) {
        this.dictionary = langFile
        this.currentLang = defaultLang
    }

    async init(langCode = this.currentLang) {
        this.currentLang = langCode
    }

    setLang(langCode) {
        this.currentLang = langCode
    }

    // Translation function
    t(key, vars = {}) {
        const parts = key.split(Lang.DICT_SPLIT)
        let value = this.dictionary
        for (let p of parts) {
            value = value?.[p]
            if (!value) return key // fallback
        }
        let text = value[this.currentLang] || key

        // Replace {{placeholders}}
        for (const [k, v] of Object.entries(vars)) {
            text = text.replace(new RegExp(`{{${k}}}`, 'g'), v)
        }

        return text
    }
}
