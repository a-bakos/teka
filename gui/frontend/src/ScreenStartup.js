"use strict"

import ElementNav from "./ElementNav";

export default class ScreenStartup {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
    }

    render() {
        return `
            <div class="">
                <h1 class="bg-blue-500">HELLO STARTUP</h1>      
                ${this.Nav.render()}
            </div>        
        `;
    }
}