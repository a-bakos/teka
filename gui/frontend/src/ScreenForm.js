"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";
import {formatDate, formatPublishDate, implode} from "./utils";
import {Action, DataAttr, Events, ItemTypeBook, NotificationType} from "./consts";
import AppNotification from "./AppNotification";
import ScreenBuilder from "./ScreenBuilder";

export default class ScreenForm {
    static EMPTY_STRING = "";
    static ID_NAME_INPUT_TITLE = "formInputTitle";
    static ID_NAME_INPUT_AUTHORS = "formInputAuthors";
    static ID_NAME_INPUT_YEAR = "formInputYear";
    static ID_NAME_INPUT_PUBLISHER = "formInputPublisher";
    static ID_NAME_INPUT_ISBN = "formInputIsbn";
    static ID_NAME_INPUT_PAGES = "formInputPages";
    static ID_NAME_INPUT_NOTES = "formInputNotes";
    static ID_NAME_INPUT_ADD_TO_COLLECTION = "formInputCollection"
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
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="${ScreenForm.ID_NAME_INPUT_TITLE}">
                            ${this.ctx.t("newItem.title")}<span class="text-red-700">*</span>
                        </label>
                        <input 
                            required 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
                            id="${ScreenForm.ID_NAME_INPUT_TITLE}" 
                            placeholder="${this.ctx.t("newItem.titlePlaceholder")}" 
                            value="">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="${ScreenForm.ID_NAME_INPUT_AUTHORS}">
                            ${this.ctx.t("newItem.authors")}<span class="text-red-700">*</span>
                        </label>
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
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="${ScreenForm.ID_NAME_INPUT_YEAR}">
                            ${this.ctx.t("newItem.publishYear")}
                        </label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="number" 
                            id="${ScreenForm.ID_NAME_INPUT_YEAR}" 
                            min="1000" 
                            max="9999" 
                            placeholder="1984">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="${ScreenForm.ID_NAME_INPUT_PUBLISHER}">
                            ${this.ctx.t("newItem.publisher")}
                        </label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
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
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="${ScreenForm.ID_NAME_INPUT_ISBN}">
                            ${this.ctx.t("newItem.isbn")}
                        </label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="text" 
                            pattern="[0-9\-]*"
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
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="${ScreenForm.ID_NAME_INPUT_PAGES}">
                            ${this.ctx.t("newItem.pages")}
                        </label>
                        <input 
                            class="border flex-1 p-2 rounded" 
                            type="number" 
                            id="${ScreenForm.ID_NAME_INPUT_PAGES}" 
                            placeholder="921" 
                            value="">
                    </div>
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg">
                        <label 
                            class="w-32 text-left min-w-[90px]" 
                            for="${ScreenForm.ID_NAME_INPUT_NOTES}">
                            ${this.ctx.t("newItem.notes")}
                        </label>
                        <textarea 
                            class="border flex-1 p-2 rounded" 
                            id="${ScreenForm.ID_NAME_INPUT_NOTES}" 
                            cols="30" 
                            rows="2"></textarea>
                    </div>
                    
                    <div class="flex flex-row items-center space-x-2 w-full max-w-lg border flex-1 p-2 rounded">
                        <input 
                            type="checkbox" 
                            id="${ScreenForm.ID_NAME_INPUT_ADD_TO_COLLECTION}" 
                            checked
                            class="h-5 w-5">
                        <label 
                            class="text-left" 
                            for="${ScreenForm.ID_NAME_INPUT_ADD_TO_COLLECTION}">
                            ${this.ctx.t("newItem.addToCollection")}
                        </label>
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
            const book = await this.getBook();
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
        submit.addEventListener(Events.CLICK, async () => {

            // Check empty title or authors
            const title = document.getElementById(ScreenForm.ID_NAME_INPUT_TITLE);
            const authors = document.getElementById(ScreenForm.ID_NAME_INPUT_AUTHORS);

            const inputErrorClass = "border-red-700";
            let missingItems = [];

            if (!title.value) {
                title.classList.add(inputErrorClass);
                missingItems.push("Title");
            } else {
                title.classList.remove(inputErrorClass);
            }
            if (!authors.value) {
                authors.classList.add(inputErrorClass);
                missingItems.push("Author(s)");
            } else {
                authors.classList.remove(inputErrorClass);
            }

            if (missingItems.length > 0) {
                new AppNotification(
                    NotificationType.ERROR,
                    `Missing ${implode(missingItems)}`,
                    true
                );
            }

            const action = this.ctx.getActionRequest();
            switch (action) {
                case Action.EDIT:
                    this.ctx.resetActionRequest();
                    this.ctx.resetCurrentItemId();
                    break;
                case Action.CLONE:
                    this.ctx.resetActionRequest();
                    this.ctx.resetCurrentItemId();
                    break;
                default:
            }

            const bookDetails = this.createBookModel();
            const bookId = await window.go.main.App.AddBook(bookDetails);
            console.log(bookId) // todo deal with exists or new ID

            const addToCollection = document.getElementById(ScreenForm.ID_NAME_INPUT_ADD_TO_COLLECTION).checked;
            if (bookId && addToCollection) {
                const added = await window.go.main.App.AddToCollection(bookId.toString(), this.ctx.getCurrentUserId().toString());
                this.ctx.setCurrentItemId(bookId.toString());

                new AppNotification(
                    NotificationType.SUCCESS,
                    `Book added${added ? " and added to your collection" : ""}!<br>
                            <button 
                                ${ScreenBuilder.AddScreenSwitcher(ScreenBuilder.SCREENS.ITEM)} 
                                ${this.ctx.addAttribute(DataAttr.IID, bookId)}>                                
                                Check item!
                            </button>`,
                    false
                );
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

    createBookDetails(
        title,
        notes = ScreenForm.EMPTY_STRING,
        publishDate = ScreenForm.EMPTY_STRING,
        publisher = ScreenForm.EMPTY_STRING,
        pages = ScreenForm.EMPTY_STRING,
        isbn = ScreenForm.EMPTY_STRING,
        authors = ScreenForm.EMPTY_STRING
    ) {
        let bookDetails = {
            "title": title.trim(),
            "item_type": ItemTypeBook,
            "created_by": parseInt(this.ctx.getCurrentUserId())
        };

        if (notes) {
            bookDetails.description = notes.trim();
        }

        if (publisher) {
            bookDetails.publisher = publisher.trim();
        }

        if (publishDate) {
            bookDetails.published_date = formatPublishDate(publishDate);
        }

        if (pages) {
            bookDetails.page_count = parseInt(pages);
        }

        if (isbn) {
            bookDetails.isbn = isbn.trim();
        }

        if (authors) {
            bookDetails.author_names = authors.trim();
        }

        return bookDetails;
    }

    createBookModel() {
        const title = document.getElementById(ScreenForm.ID_NAME_INPUT_TITLE).value;
        const authors = document.getElementById(ScreenForm.ID_NAME_INPUT_AUTHORS).value;
        const year = document.getElementById(ScreenForm.ID_NAME_INPUT_YEAR).value;
        const publisher = document.getElementById(ScreenForm.ID_NAME_INPUT_PUBLISHER).value;
        const isbn = document.getElementById(ScreenForm.ID_NAME_INPUT_ISBN).value;
        const pages = document.getElementById(ScreenForm.ID_NAME_INPUT_PAGES).value;
        const notes = document.getElementById(ScreenForm.ID_NAME_INPUT_NOTES).value;

        return this.createBookDetails(title, notes, year, publisher, pages, isbn, authors);
    }
}

// todo getAuthors list
// todo getPublishers list