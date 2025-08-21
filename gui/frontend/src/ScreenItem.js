"use strict"

export default class ScreenItem {
    constructor(appContext) {
        this.ctx = appContext
    }

    render() {
        return `
            <div class="">
                <h1 class="bg-yellow-500">THE ITEM PAGE</h1>            
            </div>        
        `;
    }
}