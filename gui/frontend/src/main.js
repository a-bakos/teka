import './style.css';

import ScreenBuilder from "./ScreenBuilder";
import AppContext from "./AppContext";

const SELECTOR_ID_APP_CONTAINER = "app";

const ctx = new AppContext();
ctx.currentScreen = ScreenBuilder.SCREENS.STARTUP; // Start screen
const appFrame = document.getElementById(SELECTOR_ID_APP_CONTAINER);

new ScreenBuilder(ctx, appFrame).render();
