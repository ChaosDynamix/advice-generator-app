import { CSSPlugin, gsap } from "gsap";

import "./main.css";

import WebCard from "./components/web-card";

gsap.registerPlugin(CSSPlugin);

customElements.define("web-card", WebCard, { extends: "main" });