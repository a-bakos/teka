"use strict"

import ScreenBuilder from "./ScreenBuilder";
import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import coverExample from './assets/images/pooh.jpg';
import {Action, Events, NotificationType} from "./consts";
import AppNotification from "./AppNotification";
import Modal from "./Modal";
import {splitAuthors} from "./utils";

export default class ScreenBrowse {
    static EMPTY_STRING = "";
    static ID_NAME_ALL_BOOKS_CONTAINER = "allBooksContainer";
    static ID_NAME_FILTER_INPUT = "filterInput";
    static CLASS_NAME_DELETE_BOOK = "deleteBook";
    static SELECTOR_CLASS_DELETE_BOOK = "." + ScreenBrowse.CLASS_NAME_DELETE_BOOK;
    static CLASS_NAME_EDIT_BOOK = "editBook";
    static SELECTOR_CLASS_EDIT_BOOK = "." + ScreenBrowse.CLASS_NAME_EDIT_BOOK;
    static CLASS_NAME_DUPLICATE_BOOK = "duplicateBook";
    static SELECTOR_CLASS_DUPLICATE_BOOK = "." + ScreenBrowse.CLASS_NAME_DUPLICATE_BOOK;

    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <section id="${ScreenBrowse.ID_NAME_ALL_BOOKS_CONTAINER}"></section>
            </div>
            ${this.Footer.render()}        
        `;
    }

    async afterRender() {
        const container = document.getElementById(ScreenBrowse.ID_NAME_ALL_BOOKS_CONTAINER);
        container.innerHTML = ScreenBrowse.EMPTY_STRING;
        container.appendChild(ScreenBuilder.createPreloader());

        const books = await this.getBooks();
        if (books) {
            setTimeout(() => {
                container.appendChild(books);
                container.querySelector(ScreenBuilder.SELECTOR_CLASS_PRELOADER).remove();
                document.getElementById(ScreenBrowse.ID_NAME_FILTER_INPUT).focus();

                const allBooks = document.querySelectorAll(".itemBook div");
                for (const book of allBooks) {
                    book.addEventListener(Events.CLICK, () => {
                        this.ctx.setCurrentItemId(book.dataset.iid);
                    });
                }
            }, ScreenBuilder.ARTIFICIAL_DELAY)

            setTimeout(() => {
                /**
                 * Edit button events
                 */
                const editButtons = document.querySelectorAll(ScreenBrowse.SELECTOR_CLASS_EDIT_BOOK);
                for (let btn of editButtons) {
                    btn.addEventListener(Events.CLICK, () => {
                        this.ctx.setActionRequest(Action.EDIT);
                    });
                }

                /**
                 * Duplicate button events
                 */
                const duplicateButtons = document.querySelectorAll(ScreenBrowse.SELECTOR_CLASS_DUPLICATE_BOOK);
                for (let btn of duplicateButtons) {
                    btn.addEventListener(Events.CLICK, () => {
                        this.ctx.setActionRequest(Action.CLONE);
                    });
                }

                /**
                 * Delete button events w/ confirmation modals
                 */
                const deleteButtons = document.querySelectorAll(ScreenBrowse.SELECTOR_CLASS_DELETE_BOOK);
                for (let btn of deleteButtons) {
                    btn.addEventListener(Events.CLICK, async () => {
                        try {
                            const id = btn.dataset.iid;
                            const bookTitle = document.querySelector(`h3[data-iid="${id}"]`).innerText.trim();
                            const modal = new Modal(`Are you sure you want to delete the following item?<br>${bookTitle}`);
                            const confirmed = await modal.waitForChoice();

                            if (!confirmed) {
                                return;
                            }

                            try {
                                const _isDeleted = await window.go.main.App.DeleteBook(id);
                                new AppNotification(NotificationType.SUCCESS, `Book deleted: ${bookTitle}`);
                                // remove item from DOM
                                const parent = btn.closest("li");
                                parent.remove();
                            } catch (err) {
                                new AppNotification(NotificationType.ERROR, `Book deletion failed`);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    });
                }
            }, ScreenBuilder.ARTIFICIAL_DELAY + 10);
        }
    }

    getSectionDash() {
        const dash = document.createElement("section");
        dash.innerHTML = `
            ${this.tempDashlets()}
            ${this.tempFilters()}
        `;
        return dash;
    }

    async getBooks() {
        const books = await window.go.main.App.GetBooks();

        if (!books || books.length === 0) {
            const el = document.createElement("div");
            el.className = "w-full px-3 py-2 rounded border text-xl text-center";
            el.innerHTML = `
                <p>${this.ctx.t("browse.noBooks")}</p>
                <button 
                    class="mt-3 rounded border" 
                    data-screen="${ScreenBuilder.SCREENS.FORM}">
                    ${this.ctx.t("browse.addBooks")}
                </button>`;
            return el;
        }

        const ul = document.createElement("ul");
        ul.className = "mb-12";

        for (const book of books) {
            const li = document.createElement("li");
            li.className = "itemBook";
            li.innerHTML = `
                <div
                    data-iid="${book.item_id}" 
                    class="flex items-center gap-4 p-2 border-b hover:bg-gray-50">

                  <!-- Col 1: Small cover -->
                  <div class="w-16 h-24 flex-shrink-0">
                    <img 
                        data-screen="${ScreenBuilder.SCREENS.ITEM}" 
                        src="${coverExample}" 
                        alt="" 
                        class="cursor-pointer w-full h-full object-cover rounded">
                  </div>
                
                  <!-- Col 2: Title + Author -->
                  <div class="flex-1">
                    <h3 
                        data-iid="${book.item_id}"
                        data-screen="${ScreenBuilder.SCREENS.ITEM}"
                        class="cursor-pointer text-lg font-semibold text-gray-900">
                        ${book.title}
                    </h3>
                    <p class="text-sm text-gray-500">${splitAuthors(book.author_names)}</p>
                    <p class="text-sm text-gray-500">${this.addMetadata(book)}</p>
                  </div>
                
                  <!-- Col 3: Actions -->
                  <div class="flex items-center gap-2 text-sm select-none">
                    <button 
                        data-iid="${book.item_id}"
                        data-screen="${ScreenBuilder.SCREENS.ITEM}" 
                        class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        ${this.ctx.t("globals.view")}
                    </button>
                    <button
                        data-iid="${book.item_id}"
                        data-screen="${ScreenBuilder.SCREENS.FORM}"
                        class="${ScreenBrowse.CLASS_NAME_EDIT_BOOK} px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ${this.ctx.t("globals.edit")}
                    </button>
                    <button 
                        data-iid="${book.item_id}"
                        data-screen="${ScreenBuilder.SCREENS.FORM}"
                        class="${ScreenBrowse.CLASS_NAME_DUPLICATE_BOOK} px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                        ${this.ctx.t("globals.duplicate")}
                    </button>
                    <button
                        data-iid="${book.item_id}" 
                        class="${ScreenBrowse.CLASS_NAME_DELETE_BOOK} px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        ${this.ctx.t("globals.remove")}
                    </button>
                  </div>
                
                  <!-- Col 4: Status indicators -->
                  <div class="flex flex-col items-end text-xs text-gray-700">
                    <span>Notes: Yes</span>
                    <span>Fav: ⭐</span>
                  </div>
                </div>
            `;

            ul.appendChild(li);
        }

        const container = document.createElement("div");
        container.appendChild(this.getSectionDash());
        container.appendChild(ul);
        return container;
    }

    attachEvents() {
    }

    addMetadata(book) {
        let html = ScreenBrowse.EMPTY_STRING;

        if (undefined !== book.published_date) {
            html += `<span class="" title="${this.ctx.t("itemDetails.publishDate")}">${book.published_date}</span>`;
        }
        if (undefined !== book.publisher) {
            html += `<span class="" title="${this.ctx.t("itemDetails.publisher")}">${book.publisher}</span>`;
        }
        if (undefined !== book.page_count) {
            html += `<span class="" title="${this.ctx.t("itemDetails.pages")}">${book.page_count}</span>`;
        }
        if (undefined !== book.isbn) {
            html += `<span class="" title="${this.ctx.t("itemDetails.isbn")}">${book.isbn}</span>`;
        }

        return html;
    }

    tempDashlets() {
        return `
            <div class="flex flex-wrap gap-4 p-4">
              <!-- Favorite Books Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">${this.ctx.t("browse.myLibraryTitle")}</h3>
                <p class="text-gray-500">You have <span id="favCount">2598</span> books in your library.</p>
                <div class="mt-2 flex gap-1 flex-wrap" id="favPreview">
                  <!-- Small covers or icons can go here -->
                </div>
              </div>

              <!-- Favorite Books Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">${this.ctx.t("browse.favsTitle")}</h3>
                <p class="text-gray-500">You have <span id="favCount">5</span> favorite books.</p>
                <div class="mt-2 flex gap-1 flex-wrap" id="favPreview">
                  <!-- Small covers or icons can go here -->
                </div>
              </div>
            
              <!-- Reading Now Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">${this.ctx.t("browse.statusReadingTitle")}</h3>
                <p class="text-gray-500">Currently reading <span id="readingCount">2</span> books.</p>
                <div class="mt-2 flex gap-1 flex-wrap" id="readingPreview">
                  <!-- Small covers -->
                </div>
              </div>
            
              <!-- Read Books Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">${this.ctx.t("browse.statusReadTitle")}</h3>
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
                  id="${ScreenBrowse.ID_NAME_FILTER_INPUT}" 
                  placeholder="${this.ctx.t("browse.filterInputPlaceholder")}" 
                  class="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
                <button 
                  id="filterBtn" 
                  class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  ${this.ctx.t("browse.filterBtn")}
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

}