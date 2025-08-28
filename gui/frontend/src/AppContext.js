import ScreenBuilder from "./ScreenBuilder";
import Lang, {LANG_EN, LANG_HU} from "./Lang";

export default class AppContext {
    constructor() {
        this.currentUserId = null;
        this.currentScreen = ScreenBuilder.SCREENS.STARTUP;
        this.currentItem = null;
        this.formType = null;
        this.i18n = new Lang(LANG_HU);
        this.i18n.init();
    }

    t(key, vars = {}) {
        return this.i18n.t(key, vars);
    }

    setCurrentUserId(id) {
        this.currentUserId = id;
    }

    resetCurrentUserId() {
        this.currentUserId = null;
    }

    setCurrentItemId(id) {
        this.currentItem = id;
    }

    resetCurrentItemId() {
        this.currentItem = null;
    }
}