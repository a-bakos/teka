"use strict"

import ScreenBuilder from "./ScreenBuilder";

export default class ElementFooter {

    constructor(appContext) {
        this.ctx = appContext
    }

    render() {
        return `
            <footer class="fixed bottom-0 w-full select-none">
                <div class="flex border-t p-1 text-xs">
                    <div class="w-1/3"><p class="block w-full">Logged in as: profile name</p></div>
                    <div class="w-1/3"><p class="block w-full text-center">Téka v0.1.0 (2025)</p></div>
                    <div class="w-1/3"><p class="block w-full text-right">Created by Attila Bakos</p></div>
                </div>
            </footer> 
        `;
    }

    attachEvents() {
    }
}