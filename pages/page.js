// === Základní Page třída ===
export class Page {
    constructor(key, title) {
      this.key = key;
      this.title = title;
      this.container = document.getElementById("content");
    }
  
    async render() {
      return `<h2>${this.title}</h2>`;
    }
  
    async pageShow() {
      this.container.innerHTML = await this.render();
      document.title = this.title;
    }
  
    async pageHide() {
      this.container.innerHTML = "";
    }
  }
  