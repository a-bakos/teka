"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";
import ScreenBuilder from "./ScreenBuilder";

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
                <button id="addNew" data-screen="${ScreenBuilder.SCREENS.ITEM}">KONYV ADATLAP</button>      
            </div>
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
        //
    }
}