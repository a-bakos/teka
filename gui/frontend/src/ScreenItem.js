"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";
import ScreenBuilder from "./ScreenBuilder";

import coverExample from './assets/images/pooh.jpg';

export default class ScreenItem {
    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <!-- 3-column layout -->
                <div class="flex w-full mx-auto bg-white rounded shadow">
                                
                    <!-- Left column: Image -->
                    <div class="w-1/4 border bg-gray-50 p-2">
                        <img src="${coverExample}" alt="Sample" class="rounded shadow mb-2">
                        <button id="cover-magnify">Zoom</button>
                        <div><button class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">Upload</button></div>
                    </div>
                                            
                   <!-- Middle column: Main details -->
                    <div class="w-2/4 border">
                        <div class="max-w-xl mx-auto bg-white p-2">
                            <div class="flex items-center justify-between">
                                <div class="w-3/5">
                                    <h2 class="text-2xl font-bold text-gray-800">Book Title</h2>
                                </div>
                                <div class="w-2/5">
                                    <button class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2 shadow">
                                        Add to Favourites
                                    </button>
                                </div>
                            </div>
                            <div class="text-gray-700">
                                <div><span class="font-semibold">Author:</span> John Doe</div>
                                <div><span class="font-semibold">Publisher:</span> Example Publisher</div>
                                <div><span class="font-semibold">Publish Date:</span> 2023-01-01</div>
                                <div><span class="font-semibold">ISBN:</span> 123-4567890123</div>
                                <div><span class="font-semibold">Language:</span> English</div>
                                <div><span class="font-semibold">Pages:</span> 350</div>
                                <div>
                                    <span class="font-semibold">Notes:</span>
                                    <p class="text-gray-600">This is a sample note about the book. Add any additional information here.</p>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <!-- Right column: Meta -->
                    <div class="w-1/4 bg-gray-50 p-2">
                        <div class="">
                            <div class="">
                                <div><span class="font-semibold">Book ID:</span> 12345</div>
                                <div><span class="font-semibold">Added at:</span> 2024-06-01 10:30</div>
                                <div><span class="font-semibold">Added by:</span> admin</div>
                                <div><span class="font-semibold">Last updated:</span> 2024-06-10 14:20</div>
                                <div><span class="font-semibold">Updated by:</span> editor</div>
                            </div>
                            <div class="">
                                <div><button data-screen="${ScreenBuilder.SCREENS.FORM}" class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">Edit</button></div>
                                <div><button id="book-delete" class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">Remove</button></div>
                                <div><button data-screen="${ScreenBuilder.SCREENS.FORM}" class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">Duplicate</button></div>
                            </div>
                        </div>
                    </div>                                
                                  
                </div>          
                <section class="w-full mt-4">
                    <h2 class="text-xl font-semibold mb-2">More books from this author</h2>
                        <div class="flex overflow-x-auto gap-4 py-2">
                        <!-- Each book card -->
                        <div class="min-w-[120px] flex-shrink-0 bg-white shadow rounded p-2 cursor-pointer hover:bg-gray-50">
                            <img src="${coverExample}" alt="Book Cover" class="w-full h-32 object-cover rounded mb-1">
                            <p class="text-sm font-medium truncate">Book Title 1</p>
                        </div>
    
                        <div class="min-w-[120px] flex-shrink-0 bg-white shadow rounded p-2 cursor-pointer hover:bg-gray-50">
                            <img src="${coverExample}" alt="Book Cover" class="w-full h-32 object-cover rounded mb-1">
                            <p class="text-sm font-medium truncate">Book Title 2</p>
                        </div>
                    
                        <!-- Repeat for additional books -->
                    </div>
                </section>
            </div>
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
        const zoom = document.getElementById("cover-magnify");
        zoom.addEventListener("click", () => {
            // create modal
            console.log("zoom clicked")
        });
    }
}