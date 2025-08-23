"use strict"

import ScreenBuilder from "./ScreenBuilder";
import ElementNav from "./ElementNav";
import ElementFooter from "./ElementFooter";

export default class ScreenBrowse {
    constructor(appContext) {
        this.ctx = appContext
        this.Nav = new ElementNav(this.ctx)
        this.Footer = new ElementFooter(this.ctx)
    }

    render() {
        return `
            ${this.Nav.render()}
            <div class="pt-16 p-2">
                <h1 class="bg-red-500">Books browser</h1>
                
                each item is shown as
                Title First | Edit | Clone | Delete | Custom notes Y/N | 
                Author 
                Cover
                
                Favorites
                
                Reading now + Read
                
                My library w/ total
                
                Search bar: search for title, author
                
                Filter by title, author
                
                Author list
                
                <button id="addNew" data-screen="${ScreenBuilder.SCREENS.ITEM}">KONYV ADATLAP</button>
                <hr>
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a><br>            
                <a href="">Item1</a>            
            </div>
            ${this.Footer.render()}        
        `;
    }

    attachEvents() {
        // only custom events, no nav stuff
        document.getElementById("addNew").addEventListener("click", () => {
            console.log("ADDING NEW book...");
        });
    }
}