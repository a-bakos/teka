"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

export default class ScreenForm {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <h1 class="text-xl text-center">Add new</h1>
                
                <form class="flex flex-col items-center pt-2 p-4 space-y-4">
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">Title</label>
                        <input required class="border flex-1 p-2 rounded" type="text" name="" id="" placeholder="Title" value="Micimacko">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="author">Author(s)</label>
                        <input required class="border flex-1 p-2 rounded" type="text" name="author" id="author" placeholder="Author" list="author-list" value="A A Milne">
                        <datalist id="author-list">
                            <option value="A A Milne">
                            <option value="J K Rowling">
                            <option value="George Orwell">
                            <option value="Jane Austen">
                        </datalist>
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="publish-year">Publish year</label>
                        <input class="border flex-1 p-2 rounded" type="number" name="publish-year" id="publish-year" min="1000" max="9999" placeholder="YYYY">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="publisher">Publisher</label>
                        <input class="border flex-1 p-2 rounded" type="text" name="publisher" id="publisher" placeholder="Publisher" list="publisher-list" value="100 Acre">
                        <datalist id="publisher-list">
                            <option value="100 Acre">
                            <option value="Penguin Books">
                            <option value="HarperCollins">
                            <option value="Oxford University Press">
                        </datalist>
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">ISBN</label>
                        <input class="border flex-1 p-2 rounded" type="text" pattern="[0-9\-]+" name="" id="" placeholder="1-2-3" value="1-2-3">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">Language</label>
                        <select class="border flex-1 p-2 rounded" name="" id="">
                            <option value="hu">HU MAGYAR</option>
                            <option value="EN">EN ENGLISH</option>
                        </select>
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">Pages</label>
                        <input class="border flex-1 p-2 rounded" type="number" name="" id="" placeholder="150" value="150">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">Notes</label>
                        <textarea class="border flex-1 p-2 rounded" name="" id="" cols="30" rows="2"></textarea>
                    </div>
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="image-upload">Image</label>
                        <input class="border flex-1 p-2 rounded" type="file" name="image" id="image-upload" accept="image/*">
                    </div>
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <button type="submit" class="bg-gray-200 w-full py-2 text-xl rounded">Add new</button>
                    </div>
                </form>
            </div>
            ${this.Footer.render()}        
        `;
    }

    attachEvents(onNavigate) {
        //
    }
}
