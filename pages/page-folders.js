import { Page } from './page.js';

export class PageFolders extends Page {
  constructor() {
    super("folders", "Folders");
  }

  render() {
    const folders = JSON.parse(localStorage.getItem("folders")) || ["Other"];
    return `
      <h2 class="page-title">${this.title}</h2>

      <form id="folder-form" class="folder-form">

        <label>New Folder:
          <input type="text" name="folder" required>
        </label>
        <button type="submit" class="btn">
          <svg class="icon"><use href="./assets/icons.svg#icon-add"></use></svg>
          Add
        </button>
      </form>

      <ul id="folder-list" class="folder-list">
        ${folders.map(f => `
          <li class="folder-item card">
            <div class="folder-header">
              <a href="?page=list&folder=${encodeURIComponent(f)}" class="folder-name">
                <svg class="icon"><use href="./assets/icons.svg#icon-folder"></use></svg>
                ${f}
              </a>
              ${f !== "Other" ? `
                <div class="folder-actions">
                  <button data-rename="${f}" class="icon-button">
                    <svg class="icon"><use href="./assets/icons.svg#icon-edit"></use></svg>
                  </button>
                  <button data-delete="${f}" class="icon-button btn-danger">
                    <svg class="icon"><use href="./assets/icons.svg#icon-delete"></use></svg>
                  </button>
                </div>
              ` : ""}
            </div>
          </li>
        `).join("")}
      </ul>



      <div class="detail-back">
        <a href="?page=list" class="btn btn-back">
          <svg class="icon"><use href="./assets/icons.svg#icon-back"></use></svg>
          Back to list
        </a>
      </div>
    `;
  }

  async pageShow() {
    await super.pageShow();

    const form = document.getElementById("folder-form");
    const list = document.getElementById("folder-list");

    form.addEventListener("submit", e => {
      e.preventDefault();
      const folderName = form.folder.value.trim();
      if (!folderName) return;

      const folders = JSON.parse(localStorage.getItem("folders")) || ["Other"];
      if (!folders.includes(folderName)) {
        folders.push(folderName);
        localStorage.setItem("folders", JSON.stringify(folders));
      }

      window.location.reload();
    });

    list.addEventListener("click", e => {
      let folders = JSON.parse(localStorage.getItem("folders")) || ["Other"];
      let notes   = JSON.parse(localStorage.getItem("notes"))   || [];

      if (e.target.closest("[data-delete]")) {
        const folder = e.target.closest("[data-delete]").dataset.delete;
        if (confirm(`Really delete folder '${folder}' and all its notes?`)) {
          folders     = folders.filter(f => f !== folder);
          const keep  = notes.filter(n => n.folder !== folder);
          localStorage.setItem("folders", JSON.stringify(folders));
          localStorage.setItem("notes",   JSON.stringify(keep));
          window.location.reload();
        }
      }

      if (e.target.closest("[data-rename]")) {
        const oldName = e.target.closest("[data-rename]").dataset.rename;
        const newName = prompt("Insert new folder name:", oldName)?.trim();
        if (newName && newName !== oldName) {
          if (folders.includes(newName)) {
            alert("A folder with that name already exists.");
            return;
          }
          const updatedFolders = folders.map(f => f === oldName ? newName : f);
          const updatedNotes   = notes.map(n => n.folder === oldName ? { ...n, folder: newName } : n);
          localStorage.setItem("folders", JSON.stringify(updatedFolders));
          localStorage.setItem("notes",   JSON.stringify(updatedNotes));
          window.location.reload();
        }
      }
    });
  }
}
