import ScreenBuilder from "./ScreenBuilder";
import randomStringGenerator from "./utils";
import {Events} from "./consts";

export default class Modal {

    static ID_NAME_BASE_MODAL = "appModal-";
    static ID_NAME_BASE_MODAL_BTN_YES = Modal.ID_NAME_BASE_MODAL + "-confirm-";
    static ID_NAME_BASE_MODAL_BTN_NO = Modal.ID_NAME_BASE_MODAL + "-cancel-";

    constructor(msg) {
        this.msg = msg;

        this.elAppFrame = document.getElementById(ScreenBuilder.ID_NAME_APP_CONTAINER);
        let rand = randomStringGenerator();
        this.currentModalId = Modal.ID_NAME_BASE_MODAL + rand;
        this.currentModalBtnYesId = Modal.ID_NAME_BASE_MODAL_BTN_YES + rand;
        this.currentModalBtnNoId = Modal.ID_NAME_BASE_MODAL_BTN_NO + rand;

        this.modal = this.createEl();
        this.elAppFrame.appendChild(this.modal);
    }

    createEl() {
        const modal = document.createElement("div");
        modal.id = this.currentModalId;
        modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

        const modalBox = document.createElement("div");
        modalBox.className = "bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 text-center";

        const modalContent = document.createElement("p");
        modalContent.className = "text-lg font-medium text-gray-800 mb-6";
        modalContent.innerHTML = this.msg;

        modalBox.appendChild(modalContent);

        const buttonWrap = document.createElement("div");
        buttonWrap.className = "flex justify-center gap-4";

        const buttonYes = document.createElement("button");
        buttonYes.id = this.currentModalBtnYesId;
        buttonYes.className = "px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition";
        buttonYes.innerText = "Yes";
        buttonYes.value = "true";

        const buttonNo = document.createElement("button");
        buttonNo.id = this.currentModalBtnNoId;
        buttonNo.className = "px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition";
        buttonNo.innerText = "No";
        buttonNo.value = "false";

        buttonWrap.appendChild(buttonYes);
        buttonWrap.appendChild(buttonNo);

        modalBox.appendChild(buttonWrap);

        modal.appendChild(modalBox)

        return modal;
    }

    waitForChoice() {
        return new Promise((resolve) => {
            const yesBtn = document.getElementById(this.currentModalBtnYesId);
            const noBtn = document.getElementById(this.currentModalBtnNoId);

            yesBtn.addEventListener(Events.CLICK, () => {
                this.destroy();
                resolve(true);
            });

            noBtn.addEventListener(Events.CLICK, () => {
                this.destroy();
                resolve(false);
            });
        });
    }

    destroy() {
        this.modal.remove();
    }
}
