import {Events, NotificationType} from "./consts";
import randomStringGenerator from "./utils";
import {IconError, IconGeneric, IconSuccess, IconWarning} from "./icons";
import ScreenBuilder from "./ScreenBuilder";

export default class AppNotification {
    static EMPTY_STRING = "";
    static DEFAULT_NOTIFICATION_EL = "div";

    static ID_NAME_BASE_NOTIFICATION_PILL = "appNotificationPill-";
    static ID_NAME_BASE_NOTIFICATION_CLOSE = "appNotificationClose-";
    static CLASSNAME_NOTIFICATION_PILL = "appNotificationPill";

    static SELECTOR_CLASS_NOTIFICATION_PILL = "." + AppNotification.CLASSNAME_NOTIFICATION_PILL;

    static TW_CLASS_BOTTOM_PREFIX = "bottom-";
    static TW_CLASS_BOTTOM_DEFAULT_POSITION = "bottom-12";

    static MULTIPLE_NOTIFICATION_POSITION_OFFSET = 8;
    static SELF_DESTROY_TIMEOUT = 2000;

    // Animation: notification pill to move off-screen
    static TW_CLASS_ANI_MOVE_FROM = "translate-y-0"; // default visible state
    static TW_CLASS_ANI_VISIBILITY_FROM = "opacity-100"; // default visible state
    static TW_CLASS_ANI_MOVE_TO = "translate-y-10"; // animation end state
    static TW_CLASS_ANI_VISIBILITY_TO = "opacity-0"; // animation end state

    constructor(type, msg, selfDestroy = false) {
        this.msg = msg;
        this.selfDestroy = selfDestroy;

        this.elAppFrame = document.getElementById(ScreenBuilder.ID_NAME_APP_CONTAINER);

        let rand = randomStringGenerator();
        this.currentNotificationId = AppNotification.ID_NAME_BASE_NOTIFICATION_PILL + rand;
        this.currentNotificationCloseId = AppNotification.ID_NAME_BASE_NOTIFICATION_CLOSE + rand;

        switch (type) {
            case NotificationType.GENERIC: {
                let icon = IconGeneric;
                let classList = "bg-gray-400";
                this.createEl(icon, classList);
                break;
            }
            case NotificationType.SUCCESS: {
                let icon = IconSuccess;
                let classList = "bg-green-500";
                this.createEl(icon, classList);
                break;
            }
            case NotificationType.WARNING: {
                let icon = IconWarning;
                let classList = "bg-yellow-500";
                this.createEl(icon, classList);
                break;
            }
            case NotificationType.ERROR: {
                let icon = IconError;
                let classList = "bg-red-500";
                this.createEl(icon, classList);
                break;
            }
            default:
        }

        this.attachEvents();
    }

    createEl(
        icon = AppNotification.EMPTY_STRING,
        classList = AppNotification.EMPTY_STRING,
        elType = AppNotification.DEFAULT_NOTIFICATION_EL
    ) {
        console.log(classList)
        let el = document.createElement(elType)
        el.id = this.currentNotificationId;
        el.className = `${AppNotification.CLASSNAME_NOTIFICATION_PILL} fixed bottom-12 right-6 flex items-center max-w-md px-6 py-3 pr-3 text-lg text-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-out ${AppNotification.TW_CLASS_ANI_MOVE_FROM} ${AppNotification.TW_CLASS_ANI_VISIBILITY_FROM} ` + classList;

        el = this.maybeStackNotifications(el)

        // ICON | MESSAGE | CLOSE BTN
        el.innerHTML = `
            <div class="flex-shrink-0 mr-3">
                <span class="inline-block w-7 text-white">${icon}</span>    
            </div>

            <div class="flex-1">
                <p class="font-medium">${this.msg}</p>
            </div>

            <button 
                id="${this.currentNotificationCloseId}" 
                class="ml-1 px-3 py-1 text-white hover:text-gray-200 focus:outline-none">
                ✕
            </button>
        `;

        this.elAppFrame.appendChild(el);
    }

    attachEvents() {
        if (document.getElementById(this.currentNotificationCloseId)) {
            const closeButton = document.getElementById(this.currentNotificationCloseId);
            closeButton.addEventListener(Events.CLICK, () => {
                if (document.getElementById(this.currentNotificationId)) {
                    let pill = document.getElementById(this.currentNotificationId)
                    pill.classList.remove(
                        AppNotification.TW_CLASS_ANI_MOVE_FROM,
                        AppNotification.TW_CLASS_ANI_VISIBILITY_FROM
                    );
                    pill.classList.add(
                        AppNotification.TW_CLASS_ANI_MOVE_TO,
                        AppNotification.TW_CLASS_ANI_VISIBILITY_TO
                    );

                    // Remove item from DOM
                    setTimeout(() => {
                        pill.remove();
                    }, 400);
                }
            });
        }

        if (this.selfDestroy) {
            let pill = document.getElementById(this.currentNotificationId);
            setTimeout(() => {
                pill.classList.remove(
                    AppNotification.TW_CLASS_ANI_MOVE_FROM,
                    AppNotification.TW_CLASS_ANI_VISIBILITY_FROM
                );
                pill.classList.add(
                    AppNotification.TW_CLASS_ANI_MOVE_TO,
                    AppNotification.TW_CLASS_ANI_VISIBILITY_TO
                );
                pill.addEventListener(Events.TRANSITION_END, () => {
                    pill.remove();
                }, {once: true});
            }, AppNotification.SELF_DESTROY_TIMEOUT);
        }
    }

    maybeStackNotifications(currentEl) {
        setTimeout(() => {
            let pills = document.querySelectorAll(AppNotification.SELECTOR_CLASS_NOTIFICATION_PILL);
            let bottoms = [];
            if (pills.length > 1) {
                pills.forEach((el, val) => {
                    // Find the first class that starts with "bottom-"
                    let res = [...el.classList].find(c => c.startsWith(AppNotification.TW_CLASS_BOTTOM_PREFIX));
                    // Break at "bottom-" to get the position number, store it
                    res = res.replace(AppNotification.TW_CLASS_BOTTOM_PREFIX, AppNotification.EMPTY_STRING);
                    bottoms.push(parseInt(res))
                })
                // Reverse sort position values, get the largest and add offset, insert to classlist of current element
                bottoms.sort()
                let largestFirst = bottoms.toReversed()
                let newBottomPosition = largestFirst[0] + AppNotification.MULTIPLE_NOTIFICATION_POSITION_OFFSET
                currentEl.classList.add(AppNotification.TW_CLASS_BOTTOM_PREFIX + newBottomPosition);
                currentEl.classList.remove(AppNotification.TW_CLASS_BOTTOM_DEFAULT_POSITION);
            }
        }, 10);
        return currentEl;
    }
}