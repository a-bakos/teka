import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import {Greet} from '../wailsjs/go/main/App';

import Lang from './Lang.js';

const LANG_EN = 'en';
const LANG_HU = 'hu';
const i18n = new Lang(LANG_EN);

import ScreenManager from "./ScreenManager.js";
import ScreenBookList from "./ScreenBookList";

const SELECTOR_ID_APP_CONTAINER = "app";

const screenManager = new ScreenManager(SELECTOR_ID_APP_CONTAINER);
screenManager.load(new ScreenBookList());

(async () => {
    await i18n.init();
    console.log(i18n.t('app.greeting', { name: 'John' }));

    i18n.setLang(LANG_HU);
    console.log(i18n.t('app.greeting', { name: 'John' }));
})();

////

export const AppContext = {
    currentUserId: 0,
    currentScreen: '',
    appLang: i18n.currentLang,
};

export function setScreen(screenName) {
    AppContext.currentScreen = screenName;
    renderScreen(screenName);
}

export function renderScreen(screenName) {
    // todo
}

export function setUserId(id) {
    AppContext.currentUserId = id;
}

///////////


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

