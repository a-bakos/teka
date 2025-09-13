"use strict"

import ScreenBuilder from "./ScreenBuilder";
import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import coverExample from './assets/images/pooh.jpg';
import {Action, DataAttr, Events, NotificationType} from "./consts";
import AppNotification from "./AppNotification";
import Modal from "./Modal";
import {formatDate, splitAuthors} from "./utils";
import {IconNavBook} from "./icons";

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
    static CLASS_NAME_ITEM = "itemBook";
    static SELECTOR_CLASS_ITEM = "." + ScreenBrowse.CLASS_NAME_ITEM;

    static ID_NAME_STATS_TOTAL = "booksTotal";
    static ID_NAME_STATS_FAVS = "favCount";
    static ID_NAME_STATS_READING = "readingCount";
    static ID_NAME_STATS_READ = "readCount";

    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);

        if (this.ctx.getPreviousScreen() === ScreenBuilder.SCREENS.STARTUP) {
            setTimeout(() => {
                new AppNotification(
                    NotificationType.SUCCESS,
                    `${this.ctx.t("profile.hello", {name: this.ctx.getCurrentUserName()})}`,
                    true
                );
            }, 1000)
        }

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

                const allBooks = document.querySelectorAll(`${ScreenBrowse.SELECTOR_CLASS_ITEM} div`);
                for (const book of allBooks) {
                    book.addEventListener(Events.CLICK, () => {
                        this.ctx.setCurrentItemId(book.dataset.iid);
                    });
                }
            }, ScreenBuilder.ARTIFICIAL_DELAY)

            setTimeout(async () => {
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
                            const bookTitle = document.querySelector(`h3[${DataAttr.IID}="${id}"]`).innerText.trim();
                            const modal = new Modal(this.ctx.t("browse.deleteConfirmation", {title: bookTitle}));
                            const confirmed = await modal.waitForChoice();

                            if (!confirmed) {
                                return;
                            }

                            try {
                                const _isDeleted = await window.go.main.App.DeleteBook(id);
                                new AppNotification(NotificationType.SUCCESS, this.ctx.t("browse.deleteSuccess", {title: bookTitle}));
                                // remove item from DOM
                                const parent = btn.closest("li");
                                parent.remove();
                                // todo need to update books list + widgets
                            } catch (err) {
                                new AppNotification(NotificationType.ERROR, this.ctx.t("browse.deleteError"));
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    });
                }
            }, ScreenBuilder.ARTIFICIAL_DELAY + 10);

        }
    }

    async getSectionDash() {
        const dash = document.createElement("section");
        dash.innerHTML = `
            ${await this.sectionDashlets()} 
            ${this.tempFilters()}
        `;
        return dash;
    }

    async getStats() {
        return await window.go.main.App.GetMyStats(this.ctx.getCurrentUserId());
    }

    async getLibraryStats() {
        return await window.go.main.App.GetLibraryStats();
    }

    async getBooks() {
        const books = await window.go.main.App.GetBooksByProfileId(this.ctx.getCurrentUserId());

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
            li.className = ScreenBrowse.CLASS_NAME_ITEM;
            li.innerHTML = `
                <div
                    ${DataAttr.IID}="${book.item_id}" 
                    class="flex items-center gap-4 p-2 border-b hover:bg-gray-50">

                  <!-- Col 1: Small cover -->
                  <div class="w-16 h-24 flex-shrink-0">
                    <span 
                        ${ScreenBuilder.AddScreenSwitcher(ScreenBuilder.SCREENS.ITEM)} 
                        class="justify-center items-center flex cursor-pointer w-7 bg-gray-200 w-full h-full rounded">
                        ${IconNavBook}
                    </span>

                    ` + ""//<img
                //   ${ScreenBuilder.AddScreenSwitcher(ScreenBuilder.SCREENS.ITEM)}
                //   src="${coverExample}"
                //   alt=""
                //   class="cursor-pointer w-full h-full object-cover rounded">
                + `
                  </div>
                
                  <!-- Col 2: Title + Author -->
                  <div class="flex-1">
                    <h3 
                        ${DataAttr.IID}="${book.item_id}"
                        ${ScreenBuilder.AddScreenSwitcher(ScreenBuilder.SCREENS.ITEM)}"
                        class="cursor-pointer text-lg font-semibold text-gray-900">
                        ${book.title} [ID: ${book.item_id}]
                    </h3>
                    <p class="text-sm text-gray-500">${splitAuthors(book.author_names)}</p>
                    <p class="text-sm text-gray-500">${this.addMetadata(book)}</p>
                  </div>
                
                  <!-- Col 3: Actions -->
                  <div class="flex items-center gap-2 text-sm select-none">
                    <button 
                        ${DataAttr.IID}="${book.item_id}"
                        ${ScreenBuilder.AddScreenSwitcher(ScreenBuilder.SCREENS.ITEM)} 
                        class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        ${this.ctx.t("globals.view")}
                    </button>
                    <button
                        ${DataAttr.IID}="${book.item_id}"
                        ${ScreenBuilder.AddScreenSwitcher(ScreenBuilder.SCREENS.FORM)}
                        class="${ScreenBrowse.CLASS_NAME_EDIT_BOOK} px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ${this.ctx.t("globals.edit")}
                    </button>
                    <button
                        ${DataAttr.IID}="${book.item_id}"
                        ${ScreenBuilder.AddScreenSwitcher(ScreenBuilder.SCREENS.FORM)}
                        class="${ScreenBrowse.CLASS_NAME_DUPLICATE_BOOK} px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                        ${this.ctx.t("globals.duplicate")}
                    </button>
                    <button
                        ${DataAttr.IID}="${book.item_id}" 
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
        container.appendChild(await this.getSectionDash());
        container.appendChild(ul);

        return container;
    }

    attachEvents() {
    }

    metaExists(metaValue) {
        if (
            metaValue !== null &&
            metaValue !== "null" &&
            metaValue !== ScreenBrowse.EMPTY_STRING
        ) {
            return true;
        }

        return false;
    }

    addMetaLabel(metaValue, title) {
        return `<span 
            class="border rounded p-1 mr-1" 
            title="${title}">
            ${metaValue}
        </span>`;
    }

    addMetadata(book) {
        let html = ScreenBrowse.EMPTY_STRING;

        if (this.metaExists(book.published_date)) {
            html += this.addMetaLabel(formatDate(book.published_date), this.ctx.t("itemDetails.publishDate"));
        }
        if (this.metaExists(book.publisher)) {
            html += this.addMetaLabel(book.publisher, this.ctx.t("itemDetails.publisher"));
        }
        if (this.metaExists(book.page_count)) {
            html += this.addMetaLabel(book.page_count, this.ctx.t("itemDetails.pages"));
        }
        if (this.metaExists(book.isbn)) {
            html += this.addMetaLabel(book.isbn, this.ctx.t("itemDetails.isbn"));
        }

        return html;
    }

    addWidget(title, content) {
        return `
            <div class="flex-1 min-w-[200px] bg-white border-r rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">${title}</h3>
                <p class="text-gray-500">${content}</p>
            </div>`;
    }

    async sectionDashlets() {
        const stats = await this.getStats()
        const libStats = await this.getLibraryStats();
        return `
            <div class="flex flex-wrap border">
                <!-- Favorite Books Widget -->
                ${this.addWidget(this.ctx.t("browse.myLibraryTitle"), `You have <span id="${ScreenBrowse.ID_NAME_STATS_TOTAL}">${stats.my_books_count}</span> books in your library.`)}
                <!-- Favorite Books Widget -->
                ${this.addWidget(this.ctx.t("browse.favsTitle"), `You have <span id="${ScreenBrowse.ID_NAME_STATS_FAVS}">${stats.my_favs_count}</span> favorite books.`)}
                <!-- Reading Now Widget -->
                ${this.addWidget(this.ctx.t("browse.statusReadingTitle"), `Currently reading <span id="${ScreenBrowse.ID_NAME_STATS_READING}">${stats.reading_count}</span> books.`)}
                <!-- Read Books Widget -->
                ${this.addWidget(this.ctx.t("browse.statusReadTitle"), `You finished <span id="${ScreenBrowse.ID_NAME_STATS_READ}">${stats.read_count}</span> books.`)}
                <!-- All Authors Widget -->
                ${this.addWidget("Osszes szerzo", `Az osszes szerzo az adatbazisban ${libStats.all_books_count}`)}
                <!-- All Books Widget -->
                ${this.addWidget("Osszes konyv", `Az osszes konyv az adatbazisban ${libStats.all_authors_count}`)}
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