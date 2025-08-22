"use strict"

import ElementNav from "./ElementNav";

export default class ScreenItem {
    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="">
                <h1 class="bg-yellow-500">THE ITEM PAGE</h1>  
                
                <!-- 3-column layout -->
                <div class="flex w-full mx-auto bg-white rounded shadow">
                                
                    <!-- Left column: Image -->
                    <div class="w-1/4 border bg-gray-50">
                        <img src="https://via.placeholder.com/150" alt="Sample" class="rounded shadow">
                        <div><button class="bg-blue-500 hover:bg-blue-600 text-white">Upload</button></div>
                    </div>
                                            
                   <!-- Middle column: Main details -->
                    <div class="w-2/4 border">
                        <div class="max-w-xl mx-auto bg-white">
                            <div class="flex items-center justify-between">
                                <h2 class="text-2xl font-bold text-gray-800">Book Title</h2>
                                <button class="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow rounded">
                                    Add to Favourites
                                </button>
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
                    <div class="w-1/4 border bg-gray-50">
                        <div class="">
                            <div class="">
                                <div><span class="font-semibold">Book ID:</span> 12345</div>
                                <div><span class="font-semibold">Added at:</span> 2024-06-01 10:30</div>
                                <div><span class="font-semibold">Added by:</span> admin</div>
                                <div><span class="font-semibold">Last updated:</span> 2024-06-10 14:20</div>
                                <div><span class="font-semibold">Updated by:</span> editor</div>
                            </div>
                            <div class="">
                                <div><button class="bg-blue-500 hover:bg-blue-600 text-white">Edit</button></div>
                                <div><button class="bg-red-500 hover:bg-red-600 text-white">Remove</button></div>
                                <div><button class="bg-green-500 hover:bg-green-600 text-white">Duplicate</button></div>
                            </div>
                        </div>
                    </div>                                
                                  
                    <section class="bg-red-200 w-full">
                        More books from this author
                    </section>  
                </div>          
            </div>        
        `;
    }

    attachEvents() {
        //
    }
}