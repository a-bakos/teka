"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

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
                <h1 class="text-xl font-bold mb-4">App Settings</h1>
            
                <!-- Export/Import Database -->
                <div class="flex items-center space-x-2">
                    <button id="export-db" class="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 flex-1">Export Database</button>
                    <button id="import-db" class="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 flex-1">Import Database</button>
                </div>
            
                <!-- Profile Management (reuse previous section if needed) -->
                <!-- ... (Profile management code from previous answer) ... -->
            
                <!-- App Credits -->
                <div class="mt-8 text-center text-sm text-gray-500 space-y-1">
                    <div>Téka v0.1.0 2025</div>
                    <div>Created by Attila Bakos</div>
                    <div>
                        <a href="https://github.com/a-bakos/teka" class="underline hover:text-blue-600" target="_blank" rel="noopener">GitHub</a>
                    </div>
                </div>
            </div>   
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
    }
}