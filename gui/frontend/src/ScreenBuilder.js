"use strict"

import ScreenBrowse from "./ScreenBrowse";
import ScreenStartup from "./ScreenStartup";
import ScreenSettings from "./ScreenSettings";
import ScreenProfile from "./ScreenProfile";
import ScreenItem from "./ScreenItem";
import ScreenForm from "./ScreenForm";

// screen variations:
// startup screen -> (eg like on netflix) profile selector, new profile, global app settings
// browser screen -> list catalog items, search, filter
// item profile screen -> item details, image, metadata
// new book screen -> details form, image uploader,
// edit book screen -> same as new book screen but with data
// settings screen -> app settings
// profile screen -> current profile, change profile, add profile

export default class ScreenBuilder {
    static SCREENS = {
        STARTUP: "startup",
        BROWSE: "browse",
        ITEM: "item",
        FORM: "form",
        SETTINGS: "settings",
        PROFILE: "profile"
    };

    constructor(context) {
        this.appContext = context;
    }

    render() {
        switch (this.appContext.currentScreen) {
            case ScreenBuilder.SCREENS.STARTUP: return new ScreenStartup(this.appContext).render();
            case ScreenBuilder.SCREENS.BROWSE: return new ScreenBrowse(this.appContext).render();
            case ScreenBuilder.SCREENS.ITEM: return new ScreenItem(this.appContext).render();
            case ScreenBuilder.SCREENS.FORM: return new ScreenForm(this.appContext).render();
            case ScreenBuilder.SCREENS.SETTINGS: return new ScreenSettings(this.appContext).render();
            case ScreenBuilder.SCREENS.PROFILE: return new ScreenProfile(this.appContext).render();
            default: return this.renderNotFound();
        }
    }

    renderNotFound() {
        return `<div>We're lost.</div>`
    }
}