export class Router {
    constructor(pages, defaultPage) {
      this.pages = pages;
      this.defaultPage = defaultPage;
      this.currentPage = null;
  
      this.route();
      window.addEventListener("popstate", () => this.route());
  
      document.body.addEventListener("click", e => {
        if (e.target.tagName === "A" && e.target.href.includes("?page=")) {
          e.preventDefault();
          const url = new URL(e.target.href);
          history.pushState(null, null, url);
          this.route();
        }
      });
    }
  
    async route() {
      const url = new URL(window.location.href);
      const pageKey = url.searchParams.get("page") || this.defaultPage;
  
      if (this.currentPage) {
        await this.currentPage.pageHide();
      }
  
      const found = this.pages.find(p => p.key === pageKey);
      this.currentPage = found || this.pages.find(p => p.key === "404");
  
      await this.currentPage.pageShow();
    }

    navigate(href) {
  history.pushState(null, null, href);
  this.route();
  }
}
  