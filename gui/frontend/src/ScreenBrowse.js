"use strict"

import ScreenBuilder from "./ScreenBuilder";
import ElementNav from "./ElementNav";

export default class ScreenBrowse {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class=""> 
                <h1 class="bg-red-500">Books browser</h1>
                <button id="addNew" data-screen="${ScreenBuilder.SCREENS.ITEM}">${this.ctx.t("nav.new")}</button>            
            </div>        
        `;
    }

    attachEvents() {
        // only custom events, no nav stuff
        document.getElementById("addNew").addEventListener("click", () => {
            console.log("ADDING NEW book...");
        });
    }
}