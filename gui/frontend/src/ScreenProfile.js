"use strict"

export default class ScreenProfile {
    constructor(appContext) {
        this.ctx = appContext
    }

    render() {
        return `
            <div class="">
                <h1 class="bg-green-500">PROFILE PAGE</h1>            
            </div>        
        `;
    }
}