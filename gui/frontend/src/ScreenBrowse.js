"use strict"

export default class ScreenBrowse {
    constructor(appContext) {
        this.ctx = appContext
    }

    render() {
        return `
            <div class="">
                <h1 class="bg-red-500">Books browser</h1>            
            </div>        
        `;
    }
}