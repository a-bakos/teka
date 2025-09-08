"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import {
    IconProfilePageUsers,
    IconProfilePageUserSwitch,
    IconProfilePageUserPlus,
    IconProfilePageUserMinus
} from './icons';

import {DataAttr, Events, NotificationType} from "./consts";
import AppNotification from "./AppNotification";
import ScreenBuilder from "./ScreenBuilder";

export default class ScreenProfile {

    static EMPTY_STRING = "";

    static ID_NAME_MY_PROFILE_NAME_INPUT = "myProfile";
    static ID_NAME_MY_PROFILE_LANG = "myProfileLang";
    static ID_NAME_ADD_PROFILE_BTN = "addProfileBtn";
    static ID_NAME_ADD_PROFILE_INPUT = "addProfileInput";
    static ID_NAME_PROFILES_CONTAINER = "profilesContainer";
    static CLASS_NAME_SWITCH_PROFILE_BTN = "switchProfileBtn";
    static SELECTOR_SWITCH_PROFILE_BTN = "." + ScreenProfile.CLASS_NAME_SWITCH_PROFILE_BTN;

    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx);
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2 max-w-md mx-auto space-y-6">
                <h1 class="text-xl font-bold mb-4">${this.ctx.t("profile.title")}</h1>
                
                <!-- Update Profile Name -->
                <div class="flex items-center space-x-2">
                    <label for="input-profile-name" class="w-32">${this.ctx.t("profile.name")}</label>
                    <input 
                        name="input-profile-name" 
                        id="${ScreenProfile.ID_NAME_MY_PROFILE_NAME_INPUT}" 
                        class="border flex-1 p-2 rounded" 
                        type="text" 
                        placeholder="Charles Darwin"
                        value="">
                </div>
                
                <!-- Language Switcher -->
                <div class="flex items-center space-x-2">
                    <label for="language-select" class="w-32">${this.ctx.t("profile.language")}</label>
                    <select id="${ScreenProfile.ID_NAME_MY_PROFILE_LANG}" class="border flex-1 p-2 rounded">
                        <option value="en">${this.ctx.t("profile.eng")}</option>
                        <option value="hu">${this.ctx.t("profile.hun")}</option>
                    </select>
                </div>
                
                <button 
                    class="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
                    ${this.ctx.t("profile.update")}
                </button>
                
                <hr>
                
                <!-- Registered Profiles List -->
                <div>
                    <h2 class="font-semibold mb-2">
                        <span class="inline-block w-7">${IconProfilePageUsers}</span>                        
                        ${this.ctx.t("profile.registeredTitle")}
                    </h2>

                    <div id="${ScreenProfile.ID_NAME_PROFILES_CONTAINER}"></div>

                </div>
                
                   <!-- Add New Profile -->
                <label for="addProfileInput" class="block">
                    <h2 class="font-semibold mb-2">
                        <span class="inline-block w-7">${IconProfilePageUserPlus}</span>
                        ${this.ctx.t("profile.addTitle")}
                    </h2>
                </label>
                <div class="flex items-center space-x-2">
                    <input 
                        name="addProfileInput" 
                        id="${ScreenProfile.ID_NAME_ADD_PROFILE_INPUT}" 
                        class="border flex-1 p-2 rounded" 
                        type="text"
                        placeholder="Charles Darwin">
                    <button 
                        id="${ScreenProfile.ID_NAME_ADD_PROFILE_BTN}" 
                        class="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2">
                        ${this.ctx.t("profile.create")}
                    </button>
                </div>
                
                <!-- Remove Current Profile --> 
                <div>
                    <button id="profile-remove" class="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
                        <span class="inline-block w-5">${IconProfilePageUserMinus}</span>
                        ${this.ctx.t("profile.removeCurrent")}
                    </button>
                </div>
            </div>
            ${this.Footer.render()}
        `;
    }

    async afterRender() {
        await this.loadMyProfileData()
        await this.loadProfilesList()
    }

    async loadMyProfileData() {
        const name = document.getElementById(ScreenProfile.ID_NAME_MY_PROFILE_NAME_INPUT);
        const lang = document.getElementById(ScreenProfile.ID_NAME_MY_PROFILE_LANG);

        const myProfileData = await window.go.main.App.GetProfileData(this.ctx.getCurrentUserId());
        name.value = myProfileData.name;
        lang.value = myProfileData.lang;

        return myProfileData
    }

    // Load profiles list
    async loadProfilesList() {
        const container = document.getElementById(ScreenProfile.ID_NAME_PROFILES_CONTAINER);
        container.innerHTML = ScreenProfile.EMPTY_STRING;
        container.appendChild(ScreenBuilder.createPreloader());

        const profiles = await this.getProfiles();

        if (profiles) {
            setTimeout(() => {
                container.appendChild(profiles);
                container.querySelector(ScreenBuilder.SELECTOR_CLASS_PRELOADER).remove();
            }, ScreenBuilder.ARTIFICIAL_DELAY);
        }
    }

    async getProfiles() {
        // profiles is [{ id: "", name: ""}, { ... }]
        const profiles = await window.go.main.App.GetProfiles();

        if (profiles.length === 0) {
            const el = document.createElement("div");
            el.className = "w-full px-3 py-2 rounded border";
            el.innerText = this.ctx.t("profile.noUsers");
            return el;
        }

        const ul = document.createElement("ul");
        ul.className = "space-y-1";

        for (const profile of profiles) {
            const li = document.createElement("li");

            let btnClasses = "w-full text-left px-3 py-2 rounded border hover:bg-gray-100";
            if (profile.id === parseInt(this.ctx.getCurrentUserId())) {
                btnClasses += " relative bg-gray-100 cursor-not-allowed";
                profile.name = profile.name + ` ${this.ctx.t("profile.current")}`;
            }

            li.className = "relative";
            li.innerHTML = `
                <button
                    ${DataAttr.UID}="${profile.id}" 
                    class="${ScreenProfile.CLASS_NAME_SWITCH_PROFILE_BTN} ${btnClasses}">
                    ${profile.name}
                    <span class="w-7 absolute inline-block right-0">${IconProfilePageUserSwitch}</span>
                </button>
            `;

            ul.appendChild(li);
        }

        const profileSwitchButtons = ul.querySelectorAll(ScreenProfile.SELECTOR_SWITCH_PROFILE_BTN);
        profileSwitchButtons.forEach(btn => {
            if (parseInt(btn.getAttribute(DataAttr.UID)) === parseInt(this.ctx.getCurrentUserId())) {
                return;
            }
            btn.addEventListener(Events.CLICK, async (e) => {
                const uid = e.currentTarget.getAttribute(DataAttr.UID);
                if (uid === this.ctx.getCurrentUserId()) {
                    new AppNotification(NotificationType.GENERIC, this.ctx.t("profile.alreadyUsing"), true);
                    return;
                }
                this.ctx.setCurrentUserId(uid);
                const myProfileData = await this.loadMyProfileData();
                this.ctx.setCurrentUserName(myProfileData.name)
                await this.loadProfilesList();
                ElementFooter.reloadLoginData(this.ctx.getCurrentUserName());
                new AppNotification(NotificationType.SUCCESS, `${this.ctx.t("profile.hello", {name: myProfileData.name})}`, true);
            });
        });

        return ul;
    }

    attachEvents() {
        this.addNewProfile();
        this.removeProfile();
        this.switchProfile();
        this.updateProfile();
    }

    addNewProfile() {
        // Add new profile event listener
        document.getElementById(ScreenProfile.ID_NAME_ADD_PROFILE_BTN).addEventListener(Events.CLICK, async () => {
            const inputNewProfileName = document.getElementById(ScreenProfile.ID_NAME_ADD_PROFILE_INPUT)

            if (!inputNewProfileName.value) {
                new AppNotification(NotificationType.GENERIC, this.ctx.t("profile.missingProfileName"), true);
                inputNewProfileName.focus()
                return;
            }

            try {
                // todo need to handle existing users!
                const id = await window.go.main.App.CreateProfile(inputNewProfileName.value);
                inputNewProfileName.value = ScreenProfile.EMPTY_STRING;
                new AppNotification(NotificationType.SUCCESS, this.ctx.t("profile.profileCreated", {id: id}));
                await this.loadProfilesList()
            } catch (err) {
                new AppNotification(NotificationType.ERROR, this.ctx.t("profile.profileCreationError"));
                console.log("Profile creation failed:", err)
            }
        });
    }

    removeProfile() {
        // todo
    }

    switchProfile() {
        // todo
    }

    updateProfile() {
        // todo
    }
}

