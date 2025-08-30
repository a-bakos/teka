"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";
import {IconStartupUser} from "./icons.js";
import ScreenBuilder from "./ScreenBuilder";
import {Events} from "./consts";

export default class ScreenStartup {
    static EMPTY_STRING = "";
    static ID_NAME_PROFILE_SELECTOR_CONTAINER = "profileSelectorContainer";

    static CLASS_NAME_PROFILE_SELECTOR = "profileSelector";
    static SELECTOR_PROFILE_SELECTOR = "." + ScreenStartup.CLASS_NAME_PROFILE_SELECTOR;

    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);
    }

    render() {
        return `  
            <section class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div id="${ScreenStartup.ID_NAME_PROFILE_SELECTOR_CONTAINER}"></div>
            </section>
            ${this.Footer.render()}
        `;
    }

    async afterRender() {
        const container = document.getElementById(ScreenStartup.ID_NAME_PROFILE_SELECTOR_CONTAINER);
        container.innerHTML = ScreenStartup.EMPTY_STRING;
        container.appendChild(ScreenBuilder.createPreloader());

        const profiles = await this.getProfiles()
        if (profiles) {
            setTimeout(() => {
                container.appendChild(profiles);
                container.querySelector(ScreenBuilder.SELECTOR_CLASS_PRELOADER).remove();

                const profileSelectors = document.querySelectorAll(ScreenStartup.SELECTOR_PROFILE_SELECTOR);
                for (const profileSelector of profileSelectors) {
                    profileSelector.addEventListener(Events.CLICK, () => {
                        this.ctx.setCurrentUserId(profileSelector.dataset.uid);
                    });
                }
            }, ScreenBuilder.ARTIFICIAL_DELAY);

        }
    }

    attachEvents() {
    }

    async getProfiles() {
        // profiles is [{ id: "", name: ""}, { ... }]
        const profiles = await window.go.main.App.GetProfiles();

        const container = document.createElement("div");
        container.className = "grid grid-cols-5 gap-8";

        for (const profile of profiles) {
            const div = document.createElement("div");
            div.className = `${ScreenStartup.CLASS_NAME_PROFILE_SELECTOR} flex flex-col items-center cursor-pointer hover:scale-105 transform transition`;
            div.dataset.screen = ScreenBuilder.SCREENS.BROWSE;
            div.dataset.uid = profile.id;

            const span = document.createElement("span");
            span.className = "w-24 h-24 rounded-full mb-2 object-cover";
            span.innerHTML = IconStartupUser;

            const p = document.createElement("p");
            p.className = "text-lg font-medium";
            p.innerHTML = profile.name;

            div.appendChild(span);
            div.appendChild(p);

            container.appendChild(div);
        }

        // New profile button
        const newProfileButton = document.createElement("div");
        newProfileButton.dataset.screen = ScreenBuilder.SCREENS.BROWSE; // todo change this later
        newProfileButton.className = "flex flex-col items-center cursor-pointer hover:scale-105 transform transition";

        const innerDiv = document.createElement("div");
        innerDiv.className = "w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-2 text-3xl font-bold text-gray-600";
        innerDiv.innerText = "+";

        const p = document.createElement("p");
        p.className = "text-lg font-medium";
        p.innerText = "New Profile";
        newProfileButton.appendChild(innerDiv);
        newProfileButton.appendChild(p);

        container.appendChild(newProfileButton)

        return container;
    }
}