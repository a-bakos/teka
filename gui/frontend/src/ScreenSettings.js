"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import iconGitHubLogo from './assets/icons/github-logo-bold.svg';

export default class ScreenSettings {
    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2 max-w-md mx-auto space-y-6">
                <h1 class="text-xl font-bold mb-4">${this.ctx.t("settings.title")}</h1>
            
                <!-- Export/Import Database -->
                <div class="flex items-center space-x-2">
                    <button id="export-db" class="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 flex-1">${this.ctx.t("settings.export")}</button>
                    <button id="import-db" class="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 flex-1">${this.ctx.t("settings.import")}</button>
                </div>

                <!-- App Credits -->
                <div class="mt-8 text-center text-sm text-gray-500 space-y-1">
                    <div>Téka v0.1.0 2025</div>
                    <div>${this.ctx.t("settings.credits")}</div>
                    <div>
                        <img class="inline w-4" src="${iconGitHubLogo}"  alt="GitHub logo"/>
                        <a 
                            href="https://github.com/a-bakos/teka" 
                            title="https://github.com/a-bakos/teka" 
                            class="underline hover:text-blue-600" 
                            target="_blank" 
                            rel="noopener">
                            GitHub
                        </a>
                    </div>
                    <div>
                        Icons by
                        <a 
                            href="https://phosphoricons.com/" 
                            title="https://phosphoricons.com/" 
                            class="underline hover:text-blue-600" 
                            target="_blank" 
                            rel="noopener">
                            Phosphor Icons
                        </a>                    
                    </div>
                </div>
            </div>   
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
    }
}