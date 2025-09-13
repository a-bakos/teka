import ScreenBuilder from "./ScreenBuilder";
import Lang, {LANG_EN, LANG_HU} from "./Lang";
import {Action} from "./consts";

export default class AppContext {
    constructor() {
        this.currentUser = {
            id: null,
            name: null,
        };
        this.currentScreen = ScreenBuilder.SCREENS.STARTUP;
        this.previousScreen = null;
        this.actionRequest = null;
        this.currentItem = null;
        this.formType = null;
        this.i18n = new Lang(LANG_HU);
        this.i18n.init();
        this.debugMode = false;
        this.version = null;
    }

    t(key, vars = {}) {
        return this.i18n.t(key, vars);
    }

    setVersion(version) {
        this.version = version;
    }

    getVersion() {
        return this.version;
    }

    setActionRequest(action) {
        this.actionRequest = action;
    }

    getActionRequest() {
        return this.actionRequest;
    }

    resetActionRequest() {
        this.actionRequest = null;
    }

    getCurrentUserId() {
        return this.currentUser.id;
    }

    setCurrentUserId(id) {
        this.currentUser.id = id;
    }

    resetCurrentUserId() {
        this.currentUser.id = null;
    }

    setCurrentUserName(name) {
        this.currentUser.name = name;
    }

    getCurrentUserName() {
        return this.currentUser.name;
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    setCurrentScreen(screen) {
        this.currentScreen = screen;
    }

    setPreviousScreen(screen) {
        this.previousScreen = screen;
    }

    getPreviousScreen() {
        return this.previousScreen;
    }

    setCurrentItemId(id) {
        this.currentItem = id;
    }

    getCurrentItemId() {
        return this.currentItem;
    }

    resetCurrentItemId() {
        this.currentItem = null;
    }

    isActionRequestEdit() {
        return this.getActionRequest() === Action.EDIT &&
            this.getCurrentItemId() !== null &&
            (this.getPreviousScreen() === ScreenBuilder.SCREENS.ITEM || this.getPreviousScreen() === ScreenBuilder.SCREENS.BROWSE);
    }

    isActionRequestClone() {
        return this.getActionRequest() === Action.CLONE &&
            this.getCurrentItemId() !== null &&
            (this.getPreviousScreen() === ScreenBuilder.SCREENS.ITEM || this.getPreviousScreen() === ScreenBuilder.SCREENS.BROWSE);
    }

    addAttribute(attr, value) {
        return `${attr}="${value}"`;
    }
}