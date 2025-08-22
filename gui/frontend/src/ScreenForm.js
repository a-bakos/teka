"use strict"

import ElementNav from "./ElementNav";

export default class ScreenForm {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="">
                <h1 class="bg-grey-500">FORM SCREEN</h1>            
            </div>        
        `;
    }

    attachEvents(onNavigate) {
        //
    }
}
