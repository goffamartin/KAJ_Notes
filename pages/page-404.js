import { Page } from './page.js';

export class Page404 extends Page {
  constructor() {
    super("404", "Page not found");
  }

  render() {
    return `<h2>404</h2><p>Page not found</p><a href="?page=list">back</a>`;
  }
}