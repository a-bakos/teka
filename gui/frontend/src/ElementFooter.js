"use strict"

export default class ElementFooter {
    static EMPTY_STRING = "";

    constructor(appContext) {
        this.ctx = appContext;
    }

    render() {
        let debugArea = ElementFooter.EMPTY_STRING;
        if (this.ctx.debugMode === true) {
            debugArea = `
                <div class="fixed bottom-5 w-full opacity-75 font-mono font-xs bg-red-200 p-3">
                    <p>Current screen: ${this.ctx.getCurrentScreen()} | Previous screen: ${this.ctx.getPreviousScreen()}</p>
                    <p>Action request: ${this.ctx.getActionRequest()} | Current item: ${this.ctx.getCurrentItemId()}</p>
                    <p>Current user: ${this.ctx.getCurrentUserName()} (${this.ctx.getCurrentUserId()})</p>
                </div>
            `;
        }

        return `
            ${debugArea}
            <footer class="fixed bottom-0 w-full select-none bg-white">
                <div class="flex border-t p-1 text-xs">
                    <div class="w-1/3">${this.loginData()}</div>
                    <div class="w-1/3"><p class="block w-full text-center">Téka v${this.ctx.getVersion()} 2025</p></div>
                    <div class="w-1/3"><p class="block w-full text-right">Catalouging App</p></div>
                </div>
            </footer> 
        `;
    }

    static ID_NAME_LOGIN = "footerLoginName";

    loginData() {
        if (null !== this.ctx.getCurrentUserName()) {
            return `<p class="block w-full">
                ${this.ctx.t("footer.loggedIn")}
                <span id="${ElementFooter.ID_NAME_LOGIN}">${this.ctx.getCurrentUserName()}</span>
            </p>`;
        } else {
            return ElementFooter.EMPTY_STRING;
        }
    }

    static reloadLoginData(loginName) {
        document.getElementById(ElementFooter.ID_NAME_LOGIN).innerHTML = loginName;
    }

    attachEvents() {
    }
}