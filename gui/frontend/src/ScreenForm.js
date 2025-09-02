"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";
import ScreenBuilder from "./ScreenBuilder";
import {formatDate} from "./utils";
import {Action, Events} from "./consts";

export default class ScreenForm {
    static EMPTY_STRING = "";
    static ID_NAME_INPUT_TITLE = "formInputTitle";
    static ID_NAME_INPUT_AUTHORS = "formInputAuthors";
    static ID_NAME_INPUT_YEAR = "formInputYear";
    static ID_NAME_INPUT_PUBLISHER = "formInputPublisher";
    static ID_NAME_INPUT_ISBN = "formInputIsbn";
    static ID_NAME_INPUT_PAGES = "formInputPages";
    static ID_NAME_INPUT_NOTES = "formInputNotes";
    static ID_NAME_MAIN_SUBMIT_BUTTON = "formSubmit";

    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);
    }

    render() {
        let pageTitle;
        let addOrUpdateBtn;
        if (
            this.ctx.isActionRequestEdit() &&
            !this.ctx.isActionRequestClone()
        ) {
            // Edit item
            pageTitle = this.ctx.t("newItem.screenTitleEdit");
            addOrUpdateBtn = this.ctx.t("newItem.updateItemBtn");
        } else {
            // New item
            pageTitle = this.ctx.t("newItem.screenTitleNew");
            addOrUpdateBtn = this.ctx.t("newItem.addNewBtn");
        }
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <h1 class="text-xl text-center">${pageTitle}</h1>

                <div class="flex flex-col items-center pt-2 p-4 space-y-4">
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="">${this.ctx.t("newItem.title")}<span class="text-red-700">*</span></label>
                        <input 
                            required 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
                            name="" 
                            id="${ScreenForm.ID_NAME_INPUT_TITLE}" 
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
                            id="${ScreenForm.ID_NAME_INPUT_AUTHORS}" 
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
                    <p class="text-xs text-right">${this.ctx.t("newItem.multiAuthorHelper")}</p>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="publish-year">${this.ctx.t("newItem.publishYear")}</label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="number" 
                            name="publish-year" 
                            id="${ScreenForm.ID_NAME_INPUT_YEAR}" 
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
                            id="${ScreenForm.ID_NAME_INPUT_PUBLISHER}" 
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
                            pattern="[0-9\-]*"
                            name="" 
                            id="${ScreenForm.ID_NAME_INPUT_ISBN}"
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
                            id="${ScreenForm.ID_NAME_INPUT_PAGES}" 
                            placeholder="921" 
                            value="">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="">${this.ctx.t("newItem.notes")}</label>
                        <textarea 
                            class="border flex-1 p-2 rounded" 
                            name="" 
                            id="${ScreenForm.ID_NAME_INPUT_NOTES}" 
                            cols="30" 
                            rows="2"></textarea>
                    </div>
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label class="w-32 text-left min-w-[90px]" for="image-upload">${this.ctx.t("newItem.image")}</label>
                        <input class="border flex-1 p-2 rounded" type="file" name="image" id="image-upload" accept="image/*">
                    </div>
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <button 
                            id="${ScreenForm.ID_NAME_MAIN_SUBMIT_BUTTON}"
                            class="bg-gray-200 w-full py-2 text-xl rounded">
                            ${addOrUpdateBtn}
                        </button>
                    </div>
                </div>
            </div>
            ${this.Footer.render()}        
        `;
    }

    async afterRender() {
        if (this.ctx.getCurrentItemId()) {
            const book = await this.getBook()
            if (book) {
                document.getElementById(ScreenForm.ID_NAME_INPUT_TITLE).value = book.title;
                document.getElementById(ScreenForm.ID_NAME_INPUT_AUTHORS).value = book.author_names;
                document.getElementById(ScreenForm.ID_NAME_INPUT_YEAR).value = formatDate(book.published_date);
                document.getElementById(ScreenForm.ID_NAME_INPUT_PUBLISHER).value = book.publisher;
                document.getElementById(ScreenForm.ID_NAME_INPUT_ISBN).value = book.isbn;
                document.getElementById(ScreenForm.ID_NAME_INPUT_PAGES).value = book.page_count;

                const flags = await this.getItemFlags();
                console.log(flags)
                if (flags) {
                    document.getElementById(ScreenForm.ID_NAME_INPUT_NOTES).innerText = flags.notes;
                }
            }
        }

        const submit = document.getElementById(ScreenForm.ID_NAME_MAIN_SUBMIT_BUTTON);
        submit.addEventListener(Events.CLICK, () => {
            console.log("deal with submission")

            console.log()
            const action = this.ctx.getActionRequest();
            switch (action) {
                case Action.EDIT:
                    console.log("edit")
                    // clean up upon successful resp?
                    this.ctx.resetActionRequest();
                    this.ctx.resetCurrentItemId();
                    break;
                case Action.CLONE:
                    console.log("clone")
                    // clean up upon successful resp?
                    this.ctx.resetActionRequest();
                    this.ctx.resetCurrentItemId();
                    break;
                default:
            }
        });
    }

    attachEvents() {
    }

    async getBook() {
        const bookId = this.ctx.getCurrentItemId();
        return await window.go.main.App.GetBook(bookId);
    }

    async getItemFlags() {
        const profileId = this.ctx.getCurrentUserId();
        const bookId = this.ctx.getCurrentItemId();
        return await window.go.main.App.GetProfileItemFlags(profileId, bookId);
    }
}
