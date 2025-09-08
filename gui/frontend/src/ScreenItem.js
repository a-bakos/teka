"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";
import ScreenBuilder from "./ScreenBuilder";

import coverExample from './assets/images/pooh.jpg';
import {formatDate, splitAuthors} from "./utils";
import {Action, Bool, Events, NotificationType} from "./consts";
import AppNotification from "./AppNotification";
import Modal from "./Modal";

export default class ScreenItem {
    static ID_NAME_COL_BOOK_COVER = "colBookCover";
    static ID_NAME_COL_BOOK_DETAILS = "colBookDetails";
    static ID_NAME_COL_BOOK_META = "colBookMeta";
    static ID_NAME_RELATED_BOOKS = "relatedBooks";

    static ID_NAME_BOOK_TITLE = "bookTitle";
    static ID_NAME_BOOK_AUTHOR = "bookAuthor";
    static ID_NAME_BOOK_PUBLISHER = "bookPublisher";
    static ID_NAME_BOOK_PUBLISH_DATE = "bookPublishDate";
    static ID_NAME_BOOK_ISBN = "bookIsbn";
    static ID_NAME_BOOK_PAGES = "bookPages";

    static ID_NAME_COVER_UPLOAD = "coverUpload"
    static ID_NAME_FAV_HOLDER = "favBtnHolder";
    static ID_NAME_FAV_BTN = "addToFavs";

    static ID_NAME_PROFILE_NOTES = "itemNotes";
    static ID_NAME_BOOK_ID = "metaBookId";
    static ID_NAME_ADDED_AT = "metaAddedAt";
    static ID_NAME_ADDED_BY = "metaAddedBy";
    static ID_NAME_LAST_UPDATED = "metaLastUpdated";
    static ID_NAME_UPDATED_BY = "metaUpdatedBy";

    static ID_NAME_BTN_EDIT = "bookEdit";
    static ID_NAME_BTN_DELETE = "bookDelete";
    static ID_NAME_BTN_DUPLICATE = "bookDuplicate";

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
                    <div id="${ScreenItem.ID_NAME_COL_BOOK_COVER}" class="w-1/4 border bg-gray-50 p-2">
                        <img src="${coverExample}" alt="" class="rounded shadow mb-2">
                        <div>
                            <button 
                                id="${ScreenItem.ID_NAME_COVER_UPLOAD}" 
                                class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">
                                ${this.ctx.t("itemDetails.upload")}
                            </button>
                        </div>
                    </div>
                                            
                   <!-- Middle column: Main details -->
                    <div id="${ScreenItem.ID_NAME_COL_BOOK_DETAILS}" class="w-2/4 border">
                        <div class="max-w-xl mx-auto bg-white p-2">
                            <div class="flex items-center justify-between">
                                <div class="w-3/5">
                                    <h2 id="${ScreenItem.ID_NAME_BOOK_TITLE}" class="text-2xl font-bold text-gray-800"></h2>
                                </div>
                                <div class="w-2/5" id="${ScreenItem.ID_NAME_FAV_HOLDER}"></div>
                            </div>
                            <div class="text-gray-700">
                                <div><strong>${this.ctx.t("itemDetails.authors")}:</strong> <span id="${ScreenItem.ID_NAME_BOOK_AUTHOR}"></span></div>
                                <div><strong>${this.ctx.t("itemDetails.publisher")}:</strong> <span id="${ScreenItem.ID_NAME_BOOK_PUBLISHER}"></span></div>
                                <div><strong>${this.ctx.t("itemDetails.publishDate")}:</strong> <span id="${ScreenItem.ID_NAME_BOOK_PUBLISH_DATE}"></span></div>
                                <div><strong>${this.ctx.t("itemDetails.isbn")}:</strong> <span id="${ScreenItem.ID_NAME_BOOK_ISBN}"></span></div>
                                <!--<div><strong>Language:</strong> <span id="${ScreenItem.ID_NAME_}"></span></div>-->
                                <div><strong>${this.ctx.t("itemDetails.pages")}:</strong> <span id="${ScreenItem.ID_NAME_BOOK_PAGES}"></span></div>
                                <div>
                                    <span class="font-semibold">${this.ctx.t("itemDetails.notes")}:</span>
                                    <p id="${ScreenItem.ID_NAME_PROFILE_NOTES}" class="text-gray-600"></p>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <!-- Right column: Meta -->
                    <div id="${ScreenItem.ID_NAME_COL_BOOK_META}" class="w-1/4 bg-gray-50 p-2">
                        <div class="">
                            <div class="">
                                <div><strong>${this.ctx.t("itemDetails.id")}:</strong> <span id="${ScreenItem.ID_NAME_BOOK_ID}"></span></div>
                                <div><strong>${this.ctx.t("itemDetails.addedAt")}:</strong> <span id="${ScreenItem.ID_NAME_ADDED_AT}"></span></div>
                                <div><strong>${this.ctx.t("itemDetails.addedBy")}:</strong> <span id="${ScreenItem.ID_NAME_ADDED_BY}"></span></div>
                                <div><strong>${this.ctx.t("itemDetails.lastUpdated")}:</strong> <span id="${ScreenItem.ID_NAME_LAST_UPDATED}"></span></div>
                                <div><strong>${this.ctx.t("itemDetails.updatedBy")}:</strong> <span id="${ScreenItem.ID_NAME_UPDATED_BY}"></span></div>
                            </div>
                            <div class="">
                                <div>
                                    <button
                                        id="${ScreenItem.ID_NAME_BTN_EDIT}" 
                                        data-screen="${ScreenBuilder.SCREENS.FORM}"
                                        class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">
                                        ${this.ctx.t("globals.edit")}
                                    </button>
                                </div>
                                <div>
                                    <button 
                                        id="${ScreenItem.ID_NAME_BTN_DELETE}" 
                                        class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">
                                        ${this.ctx.t("globals.remove")}
                                    </button>
                                </div>
                                <div>
                                    <button 
                                        id="${ScreenItem.ID_NAME_BTN_DUPLICATE}"
                                        data-screen="${ScreenBuilder.SCREENS.FORM}"
                                        class="bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2">
                                        ${this.ctx.t("globals.duplicate")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>                                           
                </div>

                <section class="w-full mt-4">
                    <h2 class="text-xl font-semibold mb-2">${this.ctx.t("itemDetails.moreFromAuthor")}</h2>

                    <div id="${ScreenItem.ID_NAME_RELATED_BOOKS}" class="flex overflow-x-auto gap-4 py-2">
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
    }

    async afterRender() {
        try {
            if (this.ctx.currentItem) {
                const bookId = this.ctx.currentItem;
                const book = await window.go.main.App.GetBook(bookId);

                const profileId = this.ctx.currentUserId;
                const pif = await window.go.main.App.GetProfileItemFlags(profileId, bookId);

                console.log(book)
                console.log(pif)
                this.distributeBookDetails(book, pif)
            } else {
                console.log('cant find item id')
            }
        } catch (err) {
            //
        }
    }

    distributeBookDetails(bookDetails, profileItemFlags) {
        document.getElementById(ScreenItem.ID_NAME_BOOK_TITLE).innerText = bookDetails.title;
        document.getElementById(ScreenItem.ID_NAME_BOOK_AUTHOR).innerText = splitAuthors(bookDetails.author_names);
        document.getElementById(ScreenItem.ID_NAME_BOOK_PUBLISHER).innerText = bookDetails.publisher;
        document.getElementById(ScreenItem.ID_NAME_BOOK_PUBLISH_DATE).innerText = formatDate(bookDetails.published_date).toString();
        document.getElementById(ScreenItem.ID_NAME_BOOK_ISBN).innerText = bookDetails.isbn;
        document.getElementById(ScreenItem.ID_NAME_BOOK_PAGES).innerText = bookDetails.page_count;

        const favBtn = document.createElement("button");
        favBtn.id = ScreenItem.ID_NAME_FAV_BTN;
        favBtn.className = "bg-blue-500 hover:bg-blue-600 text-white rounded text-lg px-5 py-2 mb-2 shadow";
        favBtn.innerText = this.ctx.t("itemDetails.favAdd");
        favBtn.dataset.iid = bookDetails.item_id;
        favBtn.dataset.isFav = Bool.FALSE;
        if (profileItemFlags.is_favorite) {
            favBtn.innerText = this.ctx.t("itemDetails.favRemove");
            favBtn.dataset.isFav = Bool.TRUE;
        }
        document.getElementById(ScreenItem.ID_NAME_FAV_HOLDER).appendChild(favBtn);

        document.getElementById(ScreenItem.ID_NAME_PROFILE_NOTES).innerHTML = profileItemFlags.notes ? profileItemFlags.notes : "<em>No notes added.</em>";

        // Buttons
        let buttons = new Array();
        const btnEdit = document.getElementById(ScreenItem.ID_NAME_BTN_EDIT);
        btnEdit.dataset.iid = bookDetails.item_id;
        const btnDelete = document.getElementById(ScreenItem.ID_NAME_BTN_DELETE);
        btnDelete.dataset.iid = bookDetails.item_id;
        const btnDuplicate = document.getElementById(ScreenItem.ID_NAME_BTN_DUPLICATE);
        btnDuplicate.dataset.iid = bookDetails.item_id;
        buttons.push(btnEdit, btnDelete, btnDuplicate);
        for (const btn of buttons) {
            btn.addEventListener(Events.CLICK, async () => {
                this.ctx.setCurrentItemId(btn.dataset.iid);

                // Edit
                if (btn.id === ScreenItem.ID_NAME_BTN_EDIT) {
                    this.ctx.setActionRequest(Action.EDIT);
                }

                // Duplicate
                if (btn.id === ScreenItem.ID_NAME_BTN_DUPLICATE) {
                    this.ctx.setActionRequest(Action.CLONE);
                }

                // Delete
                if (btn.id === ScreenItem.ID_NAME_BTN_DELETE) {
                    try {
                        const modal = new Modal(this.ctx.t("browse.deleteConfirmation", {title: bookDetails.title}));
                        const confirmed = await modal.waitForChoice();

                        if (!confirmed) {
                            return;
                        }

                        const isDeleted = await window.go.main.App.DeleteBook(btnDelete.dataset.iid);
                        if (isDeleted) {
                            new AppNotification(NotificationType.SUCCESS, this.ctx.t("browse.deleteSuccess", {title: bookDetails.title}));
                            // reset current item id
                            setTimeout(() => {
                                // todo go back to browse screen
                            }, 2000);
                        } else {
                            new AppNotification(NotificationType.ERROR, this.ctx.t("browse.deleteError"));
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        }

        document.getElementById(ScreenItem.ID_NAME_BOOK_ID).innerText = bookDetails.item_id;
        document.getElementById(ScreenItem.ID_NAME_ADDED_AT).innerText = "";
        document.getElementById(ScreenItem.ID_NAME_ADDED_BY).innerText = "";
        document.getElementById(ScreenItem.ID_NAME_LAST_UPDATED).innerText = "";
        document.getElementById(ScreenItem.ID_NAME_UPDATED_BY).innerText = "";
    }
}