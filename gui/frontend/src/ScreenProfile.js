"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import {
    IconProfilePageUsers,
    IconProfilePageUserSwitch,
    IconProfilePageUserPlus,
    IconProfilePageUserMinus
} from './icons';

import {Events, NotificationType} from "./consts";
import AppNotification from "./AppNotification";

export default class ScreenProfile {

    static EMPTY_STRING = "";

    static SELECTOR_ID_ADD_PROFILE_BTN = "addProfileBtn";
    static SELECTOR_ID_ADD_PROFILE_INPUT = "addProfileInput";
    static SELECTOR_ID_ADD_PROFILE_RESULT = "addProfileResult";

    constructor(appContext) {
        this.ctx = appContext;
        this.Nav = new ElementNav(this.ctx);
        this.Footer = new ElementFooter(this.ctx)
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
                        id="input-profile-name" 
                        class="border flex-1 p-2 rounded" 
                        type="text" 
                        placeholder="Charles Darwin"
                        value="">
                </div>
                
                <!-- Language Switcher -->
                <div class="flex items-center space-x-2">
                    <label for="language-select" class="w-32">${this.ctx.t("profile.language")}</label>
                    <select id="language-select" class="border flex-1 p-2 rounded">
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
                    <ul id="profile-list" class="space-y-1">
                        <li>
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100 bg-blue-100 font-bold">Agatha Christie ${this.ctx.t("profile.current")}</button>
                        </li>
                        <li class="relative">
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100">
                                Hercule Poirot
                                <span class="w-7 absolute inline-block right-0">${IconProfilePageUserSwitch}</span>
                            </button>
                        </li>
                        <li class="relative">
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100">
                                Miss Marple
                                <span class="w-7 absolute inline-block right-0">${IconProfilePageUserSwitch}</span>
                            </button>
                        </li>
                    </ul>
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
                        id="${ScreenProfile.SELECTOR_ID_ADD_PROFILE_INPUT}" 
                        class="border flex-1 p-2 rounded" 
                        type="text"
                        placeholder="Charles Darwin"">
                    <button 
                        id="${ScreenProfile.SELECTOR_ID_ADD_PROFILE_BTN}" 
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

    attachEvents() {
        // Add new profile event listener
        document.getElementById(ScreenProfile.SELECTOR_ID_ADD_PROFILE_BTN).addEventListener(Events.CLICK, async () => {
            const inputNewProfileName = document.getElementById(ScreenProfile.SELECTOR_ID_ADD_PROFILE_INPUT)

            if (!inputNewProfileName.value) return;

            try {
                const id = await window.go.main.App.CreateProfile(inputNewProfileName.value);
                inputNewProfileName.value = ScreenProfile.EMPTY_STRING;

                new AppNotification(NotificationType.SUCCESS, `Profile created with ID: ${id}`);
            } catch (err) {
                console.log("Profile creation failed:", err)
            }
        })

        // Remove profile event listener
        // todo

        // Switch profile event listener
        // todo

        // Update profile event listener
        // todo
    }
}

