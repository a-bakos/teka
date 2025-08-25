"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import {IconStartupUser} from "./icons.js";
import ScreenBuilder from "./ScreenBuilder";
import AppNotification from "./AppNotification";
import {Events, NotificationType} from "./consts";

export default class ScreenStartup {
    static EMPTY_STRING = "";
    static ID_NAME_PROFILE_SELECTOR_CONTAINER = "profileSelectorContainer";

    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);
    }

    render() {
        return `  
            ${this.Nav.render()}
            <section class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 class="text-3xl font-bold mb-8">Select a Profile</h1>
            
                <!-- Existing profiles -->
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
            }, ScreenBuilder.ARTIFICIAL_DELAY)
        }
    }

    attachEvents() {
        new AppNotification(NotificationType.SUCCESS, `Profile created with ID: ${200}`, true);
        new AppNotification(NotificationType.WARNING, `Profile created with ID: ${200}`);
        new AppNotification(NotificationType.ERROR, `Profile created with ID: ${200}`, true);
        new AppNotification(NotificationType.GENERIC, `Profile created with ID: ${200}`);
    }

    async getProfiles() {
        // profiles is [{ id: "", name: ""}, { ... }]
        const profiles = await window.go.main.App.GetProfiles();

        const container = document.createElement("div");
        container.className = "grid grid-cols-1 gap-8";

        for (const profile of profiles) {
            const div = document.createElement("div");
            div.className = "flex flex-col items-center cursor-pointer hover:scale-105 transform transition";
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
        newProfileButton.appendChild(p)

        container.appendChild(newProfileButton)

        return container;
    }
}