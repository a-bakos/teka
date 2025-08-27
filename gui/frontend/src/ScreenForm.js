"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

export default class ScreenForm {
    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <h1 class="text-xl text-center">${this.ctx.t("newItem.screenTitle")}</h1>
                
                <form class="flex flex-col items-center pt-2 p-4 space-y-4">
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">${this.ctx.t("newItem.title")}<span class="text-red-700">*</span></label>
                        <input 
                            required 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
                            name="" 
                            id="" 
                            placeholder="${this.ctx.t("newItem.titlePlaceholder")}" 
                            value="">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="author">${this.ctx.t("newItem.authors")}<span class="text-red-700">*</span></label>
                        <input 
                            required 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
                            name="author"
                            id="author" 
                            placeholder="${this.ctx.t("newItem.authorPlaceholder")}" 
                            list="author-list"
                            value="">
                        <datalist id="author-list">
                            <option value="A A Milne">
                            <option value="J K Rowling">
                            <option value="George Orwell">
                            <option value="Jane Austen">
                        </datalist>
                    </div>
                    <p class="text-xs text-right">tobb szerzo esetesn hasznald a plusz jelet</p>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="publish-year">${this.ctx.t("newItem.publishYear")}</label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="number" 
                            name="publish-year" 
                            id="publish-year" 
                            min="1000" 
                            max="9999" 
                            placeholder="1984">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="publisher">${this.ctx.t("newItem.publisher")}</label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
                            name="publisher" 
                            id="publisher" 
                            placeholder="${this.ctx.t("newItem.publisherPlaceholder")}" 
                            list="publisher-list" 
                            value="">
                        <datalist id="publisher-list">
                            <option value="100 Acre">
                            <option value="Penguin Books">
                            <option value="HarperCollins">
                            <option value="Oxford University Press">
                        </datalist>
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">${this.ctx.t("newItem.isbn")}</label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
                            pattern="[0-9\-]+" 
                            name="" 
                            id="" 
                            placeholder="${this.ctx.t("newItem.isbnPlaceholder")}" 
                            value="">
                    </div>
                    
                    <!-- 
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">${this.ctx.t("newItem.language")}</label>
                        <select class="border flex-1 p-2 rounded" name="" id="">
                            <option value="hu">${this.ctx.t("newItem.hun")}</option>
                            <option value="en">${this.ctx.t("newItem.eng")}</option>
                        </select>
                    </div>-->
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">${this.ctx.t("newItem.pages")}</label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="number" 
                            name="" 
                            id="" 
                            placeholder="921" 
                            value="">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">${this.ctx.t("newItem.notes")}</label>
                        <textarea class="border flex-1 p-2 rounded" name="" id="" cols="30" rows="2"></textarea>
                    </div>
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="image-upload">${this.ctx.t("newItem.image")}</label>
                        <input class="border flex-1 p-2 rounded" type="file" name="image" id="image-upload" accept="image/*">
                    </div>
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <button type="submit" class="bg-gray-200 w-full py-2 text-xl rounded">${this.ctx.t("newItem.addNew")}</button>
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
