"use strict"

import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

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
                <h1 class="text-xl font-bold mb-4">Profile Settings</h1>
                
                <!-- Update Profile Name -->
                <div class="flex items-center space-x-2">
                    <label for="input-profile-name" class="w-32">Profile Name</label>
                    <input name="input-profile-name" id="input-profile-name" class="border flex-1 p-2 rounded" type="text" placeholder="Profile Name" value="Agatha Christie">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">Update</button>
                </div>
                
                    <!-- Language Switcher -->
                <div class="flex items-center space-x-2">
                    <label for="language-select" class="w-32">Language</label>
                    <select id="language-select" class="border flex-1 p-2 rounded">
                        <option value="en">English</option>
                        <option value="hu">Hungarian</option>
                    </select>
                </div>
                
                <!-- Registered Profiles List -->
                <div>
                    <h2 class="font-semibold mb-2">Registered Profiles</h2>
                    <ul id="profile-list" class="space-y-1">
                        <!-- Example items, replace with dynamic rendering -->
                        <li>
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100 bg-blue-100 font-bold">Agatha Christie (current)</button>
                        </li>
                        <li>
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100">Hercule Poirot</button>
                        </li>
                        <li>
                            <button class="w-full text-left px-3 py-2 rounded border hover:bg-gray-100">Miss Marple</button>
                        </li>
                    </ul>
                </div>
               
                   <!-- Add New Profile -->
                <div class="flex items-center space-x-2">
                    <label for="input-new-profile" class="w-32">Add Profile</label>
                    <input name="input-new-profile" id="input-new-profile" class="border flex-1 p-2 rounded" type="text" placeholder="New Profile Name">
                    <button class="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2">Add</button>
                </div>
                
                <!-- Remove Current Profile -->
                <div>
                    <button id="profile-remove" class="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">Remove Current Profile</button>
                </div>
            </div>
            ${this.Footer.render()}
        `;
    }

    attachEvents() {
    }
}

