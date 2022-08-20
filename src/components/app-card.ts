import desktopImage from "/src/images/pattern-divider-desktop.svg";
import mobileImage from "/src/images/pattern-divider-mobile.svg";
import diceIcon from "/src/images/icon-dice.svg";

const API_URL = "https://api.adviceslip.com/advice";

class AppCard extends HTMLElement {
  #initialCall: boolean = true;
  protected titleElement = document.createElement("h1");
  protected descriptionElement = document.createElement("p");
  protected adviceElement = document.createElement("span");
  protected pictureElement = document.createElement("picture");
  protected sourceElement = document.createElement("source");
  protected imageElement = document.createElement("img");
  protected buttonElement = document.createElement("button");
  protected iconElement = document.createElement("img");

  constructor() {
    super();
    this.displayTip = this.displayTip.bind(this);
  }

  connectedCallback() {
    if (this.#initialCall) {
      this.classList.add("card");
      this.titleElement.classList.add("card__title");
      this.descriptionElement.classList.add("card__description");
      this.pictureElement.classList.add("card__picture");
      this.imageElement.classList.add("card__image");
      this.buttonElement.classList.add("card__button");
      this.iconElement.classList.add("card__icon");
      this.sourceElement.setAttribute("srcset", desktopImage);
      this.sourceElement.setAttribute("media", "(min-width: 572px)");
      this.imageElement.setAttribute("draggable", "false");
      this.imageElement.setAttribute("src", mobileImage);
      this.imageElement.setAttribute("alt", "separator illustration");
      this.buttonElement.setAttribute("aria-label", "random advice generator button");
      this.iconElement.setAttribute("draggable", "false");
      this.iconElement.setAttribute("src", diceIcon);
      this.iconElement.setAttribute("alt", "dice icon");
      this.descriptionElement.append("“", this.adviceElement, "”");
      this.pictureElement.append(this.sourceElement, this.imageElement);
      this.buttonElement.append(this.iconElement);
      this.append(this.titleElement, this.descriptionElement, this.pictureElement, this.buttonElement);
      this.#initialCall = false;
    }
    this.displayTip();
    this.buttonElement.addEventListener("click", this.displayTip);
  }

  disconnectedCallback() {
    this.buttonElement.removeEventListener("click", this.displayTip);
  }

  displayTip() {
    this.titleElement.textContent = "Loading advice id...";
    this.adviceElement.textContent = "Loading advice...";
    this.buttonElement.setAttribute("disabled", "");
    fetch(API_URL)
      .then((response) => response.json())
      .then((tip) => {
        this.titleElement.textContent = `advice #${String(tip.slip.id)}`;
        this.adviceElement.textContent = tip.slip.advice;
        this.buttonElement.removeAttribute("disabled");
      })
      .catch(() => {
        this.titleElement.textContent = "error";
        this.adviceElement.textContent = "Oups, the API seems to be broken";
      });
  }
}

export default AppCard;