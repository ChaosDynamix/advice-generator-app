import "./main.css";

import AppCard from "./components/app-card";

customElements.define("app-card", AppCard, { extends: "main" });

const app = document.getElementById("app");
const appCard = document.createElement("main", { is: "app-card" });

window.addEventListener("load", () => {
    app?.append(appCard);
});