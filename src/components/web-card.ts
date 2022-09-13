import { gsap } from "gsap";

const API_URL = "https://api.adviceslip.com/advice";

interface Tip {
  id: number;
  advice: string;
}

interface TipResponse {
  data: Tip | false;
  error: boolean;
}

class WebCard extends HTMLElement {
  adviceElement: HTMLDivElement;
  adviceIdElement: HTMLHeadingElement;
  adviceValueElement: HTMLParagraphElement;
  generateButtonElement: HTMLButtonElement;

  constructor() {
    super();
    this.adviceElement = <HTMLDivElement>this.querySelector("#advice");
    this.adviceIdElement = <HTMLHeadingElement>this.querySelector("#advice-id");
    this.adviceValueElement = <HTMLParagraphElement>this.querySelector("#advice-value");
    this.generateButtonElement = <HTMLButtonElement>this.querySelector("#generate-button");
    this.displayTip = this.displayTip.bind(this);
  }

  connectedCallback() {
    this.displayInitialTip();
    this.generateButtonElement.addEventListener("click", this.displayTip);
  }

  disconnectedCallback() {
    this.adviceIdElement.textContent = "";
    this.adviceValueElement.textContent = "";
    this.generateButtonElement.removeEventListener("click", this.displayTip);
  }

  animateHeight() {
    gsap.to(this, {
      height: "auto",
      duration: 0.15,
    });
  }

  async fetchTip(): Promise<TipResponse> {
    return await fetch(API_URL)
      .then((response) => response.json())
      .then((tip) => {
        const { id, advice } = tip.slip;
        return { data: { id, advice }, error: false };
      })
      .catch(() => {
        return { data: false, error: true };
      });
  }

  async displayInitialTip() {
    if (!this.hasAttribute("disabled")) this.generateButtonElement.setAttribute("disabled", "");
    const { data, error } = await this.fetchTip();
    gsap.from(this.adviceElement, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power1",
      clearProps: "all",
      onStart: () => {
        this.style.height = `${this.clientHeight}px`;
        if (data) {
          this.adviceIdElement.textContent = `advice #${String(data.id)}`;
          this.adviceValueElement.textContent = `“${String(data.advice)}”`;
        } else if (error) {
          this.adviceIdElement.textContent = "Error";
          this.adviceValueElement.textContent = "Oups, something went wrong :(";
        }
        this.animateHeight();
      },
      onComplete: () => {
        this.generateButtonElement.removeAttribute("disabled");
      }
    });
  }

  async displayTip() {
    this.generateButtonElement.setAttribute("disabled", "");
    const { data, error } = await this.fetchTip();
    gsap.to(this.adviceElement, {
      opacity: 0,
      x: -64,
      duration: 0.3,
      ease: "power1",
      onComplete: () => {
        this.style.height = `${this.clientHeight}px`;
        if (data) {
          this.adviceIdElement.textContent = `advice #${String(data.id)}`;
          this.adviceValueElement.textContent = `“${String(data.advice)}”`;
        } else if (error) {
          this.adviceIdElement.textContent = "Error";
          this.adviceValueElement.textContent = "Oups, something went wrong :(";
        }
        this.animateHeight();
        gsap.set(this.adviceElement, { x: 64 });
        gsap.to(this.adviceElement, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: "power1",
          clearProps: "all",
          onComplete: () => {
            this.generateButtonElement.removeAttribute("disabled");
          }
        });
      }
    });
  }
}

export default WebCard;