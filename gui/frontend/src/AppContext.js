import ScreenBuilder from "./ScreenBuilder";
import Lang, {LANG_EN, LANG_HU} from "./Lang";

export default class AppContext {
    constructor() {
        this.currentUser = {
            id: null,
            name: null,
        };
        this.currentScreen = ScreenBuilder.SCREENS.STARTUP;
        this.previousScreen = null;
        this.currentItem = null;
        this.formType = null;
        this.i18n = new Lang(LANG_HU);
        this.i18n.init();
    }

    t(key, vars = {}) {
        return this.i18n.t(key, vars);
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
}