"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

export default class ScreenStartup {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {

        return `  
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <h1 class="bg-blue-500">HELLO STARTUP</h1>      
            </div>
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
        //
    }
}