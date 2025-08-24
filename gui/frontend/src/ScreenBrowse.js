"use strict"

import ScreenBuilder from "./ScreenBuilder";
import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import coverExample from './assets/images/pooh.jpg';

export default class ScreenBrowse {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <h1 class="bg-red-500">Books browser</h1>
                
                ${this.tempFilters()}
                
                ${this.tempDashlets()}
                
                ${this.tempBooksList()}

                        
            </div>
            ${this.Footer.render()}        
        `;
    }

    attachEvents() {
        // only custom events, no nav stuff
        document.getElementById("addNew").addEventListener("click", () => {
            console.log("ADDING NEW book...");
        });
    }

    tempDashlets() {
        return `
            <div class="flex flex-wrap gap-4 p-4">
              <!-- Favorite Books Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">Favorites</h3>
                <p class="text-gray-500">You have <span id="favCount">5</span> favorite books.</p>
                <div class="mt-2 flex gap-1 flex-wrap" id="favPreview">
                  <!-- Small covers or icons can go here -->
                </div>
              </div>
            
              <!-- Reading Now Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">Reading Now</h3>
                <p class="text-gray-500">Currently reading <span id="readingCount">2</span> books.</p>
                <div class="mt-2 flex gap-1 flex-wrap" id="readingPreview">
                  <!-- Small covers -->
                </div>
              </div>
            
              <!-- Read Books Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">Read Books</h3>
                <p class="text-gray-500">You finished <span id="readCount">12</span> books.</p>
                <div class="mt-2 flex gap-1 flex-wrap" id="readPreview">
                  <!-- Small covers -->
                </div>
              </div>
            </div>
        `;
    }

    tempFilters() {
        return `
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-100 border-b rounded">
              <!-- Filter by title/author -->
              <div class="flex items-center gap-2">
                <input 
                  type="text" 
                  id="filterInput" 
                  placeholder="Filter by Title or Author..." 
                  class="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
                <button 
                  id="filterBtn" 
                  class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Filter
                </button>
              </div>
            
              <!-- Sort buttons -->
              <div class="flex items-center gap-2">
                <button 
                  id="sortAZ" 
                  class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  A-Z
                </button>
                <button 
                  id="sortZA" 
                  class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Z-A
                </button>
              </div>
            </div>
        `;
    }

    tempBooksList() {
        let html = "";

        for (let i = 0; i <= 4; i++) {
            html += `
                <div class="flex items-center gap-4 p-2 border-b hover:bg-gray-50">
                  <!-- Col 1: Small cover -->
                  <div class="w-16 h-24 flex-shrink-0">
                    <img data-screen="${ScreenBuilder.SCREENS.ITEM}" src="${coverExample}" alt="Book Cover" class="cursor-pointer w-full h-full object-cover rounded">
                  </div>
                
                  <!-- Col 2: Title + Author -->
                  <div class="flex-1">
                    <h3 data-screen="${ScreenBuilder.SCREENS.ITEM}" class="cursor-pointer text-lg font-semibold text-gray-900">Book Title</h3>
                    <p class="text-sm text-gray-500">Author Name</p>
                  </div>
                
                  <!-- Col 3: Actions -->
                  <div class="flex items-center gap-2 text-sm">
                    <button data-screen="${ScreenBuilder.SCREENS.ITEM}" class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">View</button>
                    <button class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                    <button class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Clone</button>
                    <button class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </div>
                
                  <!-- Col 4: Status indicators -->
                  <div class="flex flex-col items-end text-xs text-gray-700">
                    <span>Notes: Yes</span>
                    <span>Fav: ⭐</span>
                  </div>
                </div>`;
        }

        return html;
    }
}