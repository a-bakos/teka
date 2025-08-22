import ScreenSettings from "./ScreenSettings";
import ScreenItem from "./ScreenItem";
import ScreenForm from "./ScreenForm";
import ScreenBrowse from "./ScreenBrowse";
import ScreenStartup from "./ScreenStartup";
import ScreenProfile from "./ScreenProfile";

// Example Flow: User clicks "Browse" from Startup
// ScreenStartup.render() generates HTML with data-screen="browse"
// ScreenBuilder attaches a click listener
// User clicks -> listener sets ctx.currentScreen = "browse" -> calls render()
// Now ScreenBuilder sees "browse", instantiates ScreenBrowse, injects its HTML
// Wires up nav buttons (again) + calls ScreenBrowse.attachEvents() for extra stuff
// Screen swapped without reload

// ScreenBuilder = traffic cop (decides what to show, attaches nav)
// Screens = templates + local event wiring
// AppContext = state brain (remembers where you are, language, user, etc)

export default class ScreenBuilder {
    static SCREENS = {
        STARTUP: "startup",
        BROWSE: "browse",
        PROFILE: "profile",
        SETTINGS: "settings",
        FORM: "form",
        ITEM: "item",
    };

    // Any button or element with a data-screen attribute automatically becomes a navigation trigger
    static NAV_SCREEN_TRIGGER = "[data-screen]";

    constructor(ctx, appFrame) {
        this.ctx = ctx;
        this.appFrame = appFrame;
    }

    render() {
        let screen;
        switch (this.ctx.currentScreen) {
            case ScreenBuilder.SCREENS.SETTINGS:
                screen = new ScreenSettings(this.ctx);
                break;
            case ScreenBuilder.SCREENS.PROFILE:
                screen = new ScreenProfile(this.ctx);
                break;
            case ScreenBuilder.SCREENS.ITEM:
                screen = new ScreenItem(this.ctx);
                break;
            case ScreenBuilder.SCREENS.FORM:
                screen = new ScreenForm(this.ctx);
                break;
            case ScreenBuilder.SCREENS.BROWSE:
                screen = new ScreenBrowse(this.ctx);
                break;
            case ScreenBuilder.SCREENS.STARTUP:
            default:
                screen = new ScreenStartup(this.ctx);
                break;
        }

        this.appFrame.innerHTML = screen.render();

        // Wire up generic navigation buttons
        this.appFrame.querySelectorAll(ScreenBuilder.NAV_SCREEN_TRIGGER).forEach(btn => {
            btn.addEventListener("click", () => {
                this.ctx.currentScreen = btn.dataset.screen;
                this.render();
            })
        })

        // Call screen-specific event wiring (optional)
        if (typeof screen.attachEvents === "function") {
            screen.attachEvents();
        }
    }
}
