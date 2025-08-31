"use strict"

import ScreenBuilder from "./ScreenBuilder";
import {IconNavBooks, IconNavBook, IconNavUser, IconNavGear} from "./icons.js";
import {Events} from "./consts";

export default class ElementNav {
    static CLASS_MAIN_MENU = "main-menu";

    constructor(appContext) {
        this.ctx = appContext;

        // TODO work this out
        if (this.ctx.currentScreen !== "item") {
            this.ctx.resetCurrentItemId();
        }
    }

    render() {
        console.log(this.ctx);
        return `
            <nav class="w-full border-b select-none fixed bg-white">
                <div class="flex">
                    <button class="${ElementNav.CLASS_MAIN_MENU} flex justify-center items-center gap-2 w-1/4 py-3 border-r hover:bg-gray-200" data-screen="${ScreenBuilder.SCREENS.BROWSE}">${this.navIcon(IconNavBooks)} ${this.ctx.t("nav.browse")}</button>     
                    <button class="${ElementNav.CLASS_MAIN_MENU} flex justify-center items-center gap-2 w-1/4 py-3 border-r hover:bg-gray-200" data-screen="${ScreenBuilder.SCREENS.FORM}">${this.navIcon(IconNavBook)} ${this.ctx.t("nav.new")}</button>
                    <button class="${ElementNav.CLASS_MAIN_MENU} flex justify-center items-center gap-2 w-1/4 py-3 border-r hover:bg-gray-200" data-screen="${ScreenBuilder.SCREENS.PROFILE}">${this.navIcon(IconNavUser)} ${this.ctx.t("nav.profile")}</button>
                    <button class="${ElementNav.CLASS_MAIN_MENU} flex justify-center items-center gap-2 w-1/4 py-3 hover:bg-blue-700" data-screen="${ScreenBuilder.SCREENS.SETTINGS}">${this.navIcon(IconNavGear)} ${this.ctx.t("nav.settings")}</button>
                </div>
            </nav> 
        `;
    }

    attachEvents(onNavigate) {
        // If there’s only one <nav> on the page, this is fine:
        const NAV_BUTTONS = "nav button." + ElementNav.CLASS_MAIN_MENU;
        document.querySelectorAll(NAV_BUTTONS).forEach(btn => {
            btn.addEventListener(Events.CLICK, () => onNavigate(btn.dataset.screen));
        });
    }

    navIcon(icon) {
        return `<span class="inline-block w-7 text-red-500">${icon}</span>`;
    }
}