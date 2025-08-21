"use strict"

export default class ScreenBookList {
    constructor() {}

    render() {
        const div = document.createElement("div");
        div.innerHTML = '<h1 class="bg-red-500">Books</h1>';
        return div;
    }
}