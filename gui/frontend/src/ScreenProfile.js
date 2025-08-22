"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

export default class ScreenProfile {
    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <h1>Profile Settings</h1>
                <label for="input-profile-name">Profile Name</label>
                <input name="input-profile-name" class="border" type="text" placeholder="Profile Name" value="Agatha Christie">
                
                <button>Update</button>
            </div>
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
    }
}

