"use strict"

import ElementNav from "./ElementNav";

export default class ScreenProfile {
    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
    }

    render() {
        return `
            ${this.Nav.render()}
            <div>
                <h1>PROFILE Screen</h1>
            </div>
        `;
    }

    attachEvents() {
    }
}

