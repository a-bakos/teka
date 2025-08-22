"use strict"

import ScreenBuilder from "./ScreenBuilder";

export default class ElementFooter {

    constructor(appContext) {
        this.ctx = appContext
    }

    render() {
        return `
            <footer class="fixed bottom-0 w-full bg-red-600 select-none">
                <div class="flex text-center">
                    <p class="block w-full">Téka v0.1.0 by Attila Bakos | 2025</p>
                </div>
            </footer> 
        `;
    }

    attachEvents() {
    }
}