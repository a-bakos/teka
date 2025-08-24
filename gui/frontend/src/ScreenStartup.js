"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import {IconStartupUser} from "./icons.js";
import ScreenBuilder from "./ScreenBuilder";

export default class ScreenStartup {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {

        return `  
            ${this.Nav.render()}
            <section class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 class="text-3xl font-bold mb-8">Select a Profile</h1>
            
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <!-- Existing profiles -->
                    <div data-screen="${ScreenBuilder.SCREENS.BROWSE}" class="flex flex-col items-center cursor-pointer hover:scale-105 transform transition">
                        <span class="w-24 h-24 rounded-full mb-2 object-cover">${IconStartupUser}</span>
                        <p class="text-lg font-medium">Alice</p> 
                    </div>
                
                <div data-screen="${ScreenBuilder.SCREENS.BROWSE}" class="flex flex-col items-center cursor-pointer hover:scale-105 transform transition">
                    <span class="w-24 h-24 rounded-full mb-2 object-cover">${IconStartupUser}</span>
                    <p class="text-lg font-medium">Bob</p>
                </div>
                
                <!-- New profile button -->
                <div data-screen="${ScreenBuilder.SCREENS.BROWSE}" class="flex flex-col items-center cursor-pointer hover:scale-105 transform transition">
                    <div class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-2 text-3xl font-bold text-gray-600">+</div>
                        <p class="text-lg font-medium">New Profile</p>
                    </div>
                </div>
            </section>  
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
        //
    }
}