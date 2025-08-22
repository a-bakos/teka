"use strict"

import ElementNav from "./ElementNav";

export default class ScreenSettings {
    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="">
                <h1 class="bg-yellow-500">SETTINGS PAGE</h1>            
            </div>        
        `;
    }

    attachEvents() {
    }
}