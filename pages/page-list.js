import { Page } from './page.js';

export class PageList extends Page {
  constructor() {
    super("list", "Notes List");
  }

    async render() {
    const params = new URLSearchParams(window.location.search);
    const folder = params.get("folder") || "Other";
    const notes = (JSON.parse(localStorage.getItem("notes")) || []).filter(n => n.folder === folder);

    
    let html = `<h2 class="page-title">${this.title} – ${folder}</h2>`;

    if (notes.length === 0) {
      html += `<p>No notes in folder <strong>${folder}</strong>.</p>`;
    } else {
      html += `<div id="notes-container">`;
      for (let note of notes) {
  html += `<div class="note-card" data-id="${note.id}" style="cursor:pointer;">`;
  html += `<div class="note-header">
            <div class="note-title">${note.title || "Untitled"}</div>
            <div class="note-date">${new Date(note.date).toLocaleDateString("cs-CZ")}</div>
          </div>`;

    if (note.video) {
      html += `<h5>Video</h5>`;
      html += `<iframe src="${note.video}" class="note-video" allowfullscreen></iframe>`;
    }
    if (note.hasImage) {
      const imgBlob = await localforage.getItem(`note-image-${note.id}`);
      if (imgBlob) {
        const imgUrl = URL.createObjectURL(imgBlob);
        html += `<h5>Image</h5>`;
        html += `<img src="${imgUrl}" class="note-img" alt="Note image">`;
      }
    }
    if (note.hasAudio) {
      const audBlob = await localforage.getItem(`note-audio-${note.id}`);
      if (audBlob) {
        const audUrl = URL.createObjectURL(audBlob);
        html += `<h5>Audio</h5>`;
        html += `<audio controls src="${audUrl}" class="note-audio"></audio>`;
      }
    }

    if (note.text) {
      html += `<h5>Text</h5>`;
      html += `<div class="note-content">${note.text}</div>`;
    }
    html += `</div>`;
  }
      html += `</div>`;
    }
            html += `<a href="?page=form&folder=${encodeURIComponent(folder)}" class="btn add-note fab">
              <svg class="icon"><use href="./assets/icons.svg#icon-note"></use></svg> New note
            </a>`;
    return html;
  }

  async pageShow() {
    const html = await this.render();
    this.container.innerHTML = html;

    const container = document.getElementById("notes-container");
    if (container) {
      container.addEventListener("click", e => {
        const noteEl = e.target.closest(".note-card");
        if (noteEl) {
          window.location.href = `?page=detail&id=${noteEl.dataset.id}`;
        }
      });
    }
  }
}
