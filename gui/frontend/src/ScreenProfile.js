"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

import iconProfilePageUsers from './assets/icons/users-thin.svg';
import iconProfilePageUserSwitch from './assets/icons/user-switch-thin.svg';
import iconProfilePageUserPlus from './assets/icons/user-plus-thin.svg';
import iconProfilePageUserMinus from './assets/icons/user-minus-thin.svg';

export default class ScreenProfile {
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
                    <button class="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">${this.ctx.t("profile.update")}</button>
                </div>
                
                    <!-- Language Switcher -->
                <div class="flex items-center space-x-2">
                    <label for="language-select" class="w-32">${this.ctx.t("profile.language")}</label>
                    <select id="language-select" class="border flex-1 p-2 rounded">
                        <option value="en">${this.ctx.t("profile.eng")}</option>
                        <option value="hu">${this.ctx.t("profile.hun")}</option>
                    </select>
                </div>
                
                <!-- Registered Profiles List -->
                <div>
                    <h2 class="font-semibold mb-2"><img alt="" class="w-7 inline" src="${iconProfilePageUsers}" />${this.ctx.t("profile.registeredTitle")}</h2>
                    <ul id="profile-list" class="space-y-1">
                        <li>
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100 bg-blue-100 font-bold">Agatha Christie ${this.ctx.t("profile.current")}</button>
                        </li>
                        <li class="relative">
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100">Hercule Poirot<img alt="" class="w-7 absolute inline right-0" src="${iconProfilePageUserSwitch}" /></button>
                        </li>
                        <li class="relative">
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100">Miss Marple<img alt="" class="w-7 absolute inline right-0" src="${iconProfilePageUserSwitch}" /></button>
                        </li>
                    </ul>
                </div>
                   <!-- Add New Profile -->
                <label for="-new-profile" class="block">
                    <h2 class="font-semibold mb-2"><img alt="" class="w-7 inline" src="${iconProfilePageUserPlus}" />${this.ctx.t("profile.addTitle")}</h2>
                </label>
                <div class="flex items-center space-x-2">
                    <input 
                        name="input-new-profile" 
                        id="input-new-profile" 
                        class="border flex-1 p-2 rounded" 
                        type="text"
                        placeholder="Charles Darwin"">
                    <button class="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2">${this.ctx.t("profile.create")}</button>
                </div>
                
                <!-- Remove Current Profile --> 
                <div>
                    <button id="profile-remove" class="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"><img alt="" class="w-5 inline" src="${iconProfilePageUserMinus}" />${this.ctx.t("profile.removeCurrent")}</button>
                </div>
            </div>
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
    }
}

