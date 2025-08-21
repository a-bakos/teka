import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import {Greet} from '../wailsjs/go/main/App';

import ScreenBuilder from "./ScreenBuilder";
import AppContext from "./AppContext";

const SELECTOR_ID_APP_CONTAINER = "app";

////

const ctx = new AppContext();
const screenBuilder = new ScreenBuilder(ctx);
const appFrame = document.getElementById(SELECTOR_ID_APP_CONTAINER);

function render() {
    appFrame.innerHTML = screenBuilder.render()
}

// Initial render
render();

document.querySelectorAll("nav button").forEach(btn => {
    btn.addEventListener("click", () => {
        ctx.currentScreen = btn.dataset.screen;
        render();
    })
})

// ui elements
// menu
// search bar
// related books (other items from author)

///////////

/*
document.querySelector('#app').innerHTML = `
    <img id="logo" class="logo">
      <p id="langtest"></p>
      <div class="result" id="result">Please enter your name below 👇</div>
      <div class="input-box" id="input">
        <input class="input" id="name" type="text" autocomplete="off" />
        <button class="btn" onclick="greet()">Greet</button>
      </div>
    </div>
`;
document.getElementById('logo').src = logo;

document.getElementById('langtest').innerHTML = i18n.t('app.title')

let nameElement = document.getElementById("name");
nameElement.focus();
let resultElement = document.getElementById("result");

// Setup the greet function
window.greet = function () {
    // Get name
    let name = nameElement.value;

    // Check if the input is empty
    if (name === "") return;

    // Call App.Greet(name)
    try {
        Greet(name)
            .then((result) => {
                // Update result with data back from App.Greet()
                resultElement.innerText = result;
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};
*/
