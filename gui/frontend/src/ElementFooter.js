"use strict"

export default class ElementFooter {
    static EMPTY_STRING = "";

    constructor(appContext) {
        this.ctx = appContext;
    }

    render() {
        return `
            <footer class="fixed bottom-0 w-full select-none bg-white">
                <div class="flex border-t p-1 text-xs">
                    <div class="w-1/3">${this.loginData()}</div>
                    <div class="w-1/3"><p class="block w-full text-center">Téka v0.1.0 2025</p></div>
                    <div class="w-1/3"><p class="block w-full text-right">something here</p></div>
                </div>
            </footer> 
        `;
    }

    loginData() {
        if (null !== this.ctx.getCurrentUserName()) {
            return `<p class="block w-full">${this.ctx.t("footer.loggedIn")} ${this.ctx.getCurrentUserName()}</p>`;
        } else {
            return ElementFooter.EMPTY_STRING;
        }
    }

    attachEvents() {
    }
}