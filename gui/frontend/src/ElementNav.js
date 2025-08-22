"use strict"

import ScreenBuilder from "./ScreenBuilder";

export default class ElementNav {
    static CLASS_MAIN_MENU = "main-menu"

    constructor(appContext) {
        this.ctx = appContext
    }

    render() {
        return `
            <nav class="w-full border-b select-none fixed">
                <div class="flex">
                    <button class="${ElementNav.CLASS_MAIN_MENU} w-1/4 py-4 border-r hover:bg-gray-200" data-screen="${ScreenBuilder.SCREENS.BROWSE}">${this.ctx.t("nav.browse")}</button>     
                    <button class="${ElementNav.CLASS_MAIN_MENU} w-1/4 py-4 border-r hover:bg-gray-200" data-screen="${ScreenBuilder.SCREENS.FORM}">${this.ctx.t("nav.new")}</button>
                    <button class="${ElementNav.CLASS_MAIN_MENU} w-1/4 py-4 border-r hover:bg-gray-200" data-screen="${ScreenBuilder.SCREENS.PROFILE}">${this.ctx.t("nav.profile")}</button>
                    <button class="${ElementNav.CLASS_MAIN_MENU} w-1/4 py-4 hover:bg-blue-700" data-screen="${ScreenBuilder.SCREENS.SETTINGS}">${this.ctx.t("nav.settings")}</button>
                </div>
            </nav> 
        `;
    }

    attachEvents(onNavigate) {
        // If there’s only one <nav> on the page, this is fine:
        const NAV_BUTTONS = "nav button." + ElementNav.CLASS_MAIN_MENU
        document.querySelectorAll(NAV_BUTTONS).forEach(btn => {
            btn.addEventListener("click", () => onNavigate(btn.dataset.screen));
        });
    }
}