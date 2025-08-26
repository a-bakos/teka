"use strict"

import ScreenBuilder from "./ScreenBuilder";
import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import coverExample from './assets/images/pooh.jpg';
import {Events, NotificationType} from "./consts";
import AppNotification from "./AppNotification";

export default class ScreenBrowse {
    static EMPTY_STRING = "";
    static ID_NAME_ALL_BOOKS_CONTAINER = "allBooksContainer";
    static CLASS_NAME_DELETE_BOOK = "deleteBook";
    static SELECTOR_CLASS_DELETE_BOOK = "." + ScreenBrowse.CLASS_NAME_DELETE_BOOK;

    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                
                ${this.tempDashlets()}
                
                ${this.tempFilters()}
                
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
            }, ScreenBuilder.ARTIFICIAL_DELAY)
        }

        setTimeout(() => {
            const deleteBtns = document.querySelectorAll(ScreenBrowse.SELECTOR_CLASS_DELETE_BOOK);
            console.log(deleteBtns)
            for (let btn of deleteBtns) {
                btn.addEventListener(Events.CLICK, async () => {
                    let id = btn.dataset.iid;
                    console.log(id)
                    try {
                        const _isDeleted = await window.go.main.App.DeleteBook(id);
                        new AppNotification(NotificationType.SUCCESS, `Book deleted: ${id}`);
                    } catch (err) {
                        new AppNotification(NotificationType.ERROR, `Book deletion failed`);
                        console.log("Book deletion failed:", err)
                    }
                });
            }
        }, ScreenBuilder.ARTIFICIAL_DELAY + 10)
    }

    async getBooks() {
        const books = await window.go.main.App.GetBooks();

        if (books.length === 0) {
            const el = document.createElement("div");
            el.className = "w-full px-3 py-2 rounded border";
            el.innerText = "No books found";
            return el;
        }

        const ul = document.createElement("ul");
        ul.className = "mb-12";

        console.log(books)

        for (const book of books) {
            const li = document.createElement("li");
            li.innerHTML = `
                <div 
                    data-iid="${book.item_id}" 
                    class="flex items-center gap-4 p-2 border-b hover:bg-gray-50">
                  
                  <!-- Col 1: Small cover -->
                  <div class="w-16 h-24 flex-shrink-0">
                    <img 
                        data-screen="${ScreenBuilder.SCREENS.ITEM}" 
                        src="${coverExample}" 
                        alt="Book Cover" 
                        class="cursor-pointer w-full h-full object-cover rounded">
                  </div>
                
                  <!-- Col 2: Title + Author -->
                  <div class="flex-1">
                    <h3 
                        data-screen="${ScreenBuilder.SCREENS.ITEM}"
                        class="cursor-pointer text-lg font-semibold text-gray-900">
                        ${book.title}
                    </h3>
                    <p class="text-sm text-gray-500">${book.author_names}</p>
                    <p class="text-sm text-gray-500">${book.published_date} | ${book.publisher} | ${book.page_count} Oldal | ${book.isbn}</p>
                  </div>
                
                  <!-- Col 3: Actions -->
                  <div class="flex items-center gap-2 text-sm">
                    <button 
                        data-iid="${book.item_id}"
                        data-screen="${ScreenBuilder.SCREENS.ITEM}" 
                        class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        View
                    </button>
                    <button 
                        data-iid="${book.item_id}" 
                        class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit
                    </button>
                    <button 
                        data-iid="${book.item_id}" 
                        class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                        Clone
                    </button>
                    <button
                        data-iid="${book.item_id}" 
                        class="${ScreenBrowse.CLASS_NAME_DELETE_BOOK} px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
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

        return ul;
    }

    attachEvents() {
    }


    tempDashlets() {
        return `
            <div class="flex flex-wrap gap-4 p-4">
              <!-- Favorite Books Widget -->
              <div class="flex-1 min-w-[200px] bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50">
                <h3 class="text-lg font-semibold mb-2">My Library</h3>
                <p class="text-gray-500">You have <span id="favCount">2598</span> books in your library.</p>
                <div class="mt-2 flex gap-1 flex-wrap" id="favPreview">
                  <!-- Small covers or icons can go here -->
                </div>
              </div>

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
                    autofocus
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

}