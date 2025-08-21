"use strict"

import ScreenBuilder from "./ScreenBuilder";

export default class ElementNav {
    constructor(appContext) {
        this.ctx = appContext
    }

    render() {
        return `
            <nav>
                <button data-screen="${ScreenBuilder.SCREENS.BROWSE}">${this.ctx.t("nav.browse")}</button>     
                <button data-screen="${ScreenBuilder.SCREENS.PROFILE}">${this.ctx.t("nav.new")}</button>
                <button data-screen="${ScreenBuilder.SCREENS.PROFILE}">${this.ctx.t("nav.profile")}</button>
                <button data-screen="${ScreenBuilder.SCREENS.PROFILE}">${this.ctx.t("nav.settings")}</button>
            </nav> 
        `;
    }
}