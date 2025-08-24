import {NotificationType} from "./consts";

export default class AppNotification {
    static SELECTOR_ID_APP_CONTAINER = "app";

    constructor(type, msg) {
        this.msg = msg

        this.elAppFrame = document.getElementById(AppNotification.SELECTOR_ID_APP_CONTAINER);

        switch (type) {
            case NotificationType.GENERIC:
                this.msgGeneric();
                break;
            case NotificationType.SUCCESS:
                this.msgSuccess();
                break;
            case NotificationType.WARNING:
                this.msgWarning();
                break;
            case NotificationType.ERROR:
                this.msgError();
                break;
            default:
        }
    }

    createEl(id, classList, elType = "div") {
        let el = document.createElement(elType)
        el.id = id;
        el.className = classList;
        el.innerHTML = this.msg;

        return el
    }

    msgGeneric() {
        let id = ""
        let classList = "bg-gray-200 absolute bottom-0 w-full p-3";
        let el = this.createEl(id, classList)
        this.elAppFrame.appendChild(el);
    }

    msgSuccess() {
        let id = ""
        let classList = "bg-green-500 absolute bottom-0 w-full p-3";
        let el = this.createEl(id, classList)
        this.elAppFrame.appendChild(el);
    }

    msgWarning() {
        let id = ""
        let classList = "bg-yellow-500 absolute bottom-0 w-full p-3";
        let el = this.createEl(id, classList)
        this.elAppFrame.appendChild(el);
    }

    msgError() {
        let id = ""
        let classList = "bg-red-500 absolute bottom-0 w-full p-3";
        let el = this.createEl(id, classList)
        this.elAppFrame.appendChild(el);
    }
}