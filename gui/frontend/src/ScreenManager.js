"use strict"

export default class ScreenManager {
    static EMPTY_STRING = "";

    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    load(screenFn) {
        this.container.innerHTML = ScreenManager.EMPTY_STRING; // clear container
        this.container.appendChild(screenFn);
    }
}