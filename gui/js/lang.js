"use strict"

export default class Lang {
    static LANG_FILE = '../lang.json'
    static LANG_EN = 'en'
    static DICT_SPLIT = '.'

    constructor(defaultLang = Lang.LANG_EN) {
        this.dictionary = {}
        this.currentLang = defaultLang
    }

    async init(langCode = this.currentLang) {
        const res = await fetch(Lang.LANG_FILE)
        this.dictionary = await res.json()
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
