import { Page } from './page.js';

export class PageDetail extends Page {
  constructor() {
    super("detail", "Note Detail");
  }

  async render() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes.find(n => n.id === id);

    if (!note) {
      return `<h2>Note not found</h2>
        <a href="?page=list" class="btn btn-back">
          <svg class="icon"><use href="./assets/icons.svg#icon-back"></use></svg> Back
        </a>`;
    }

    let html = `
      <h2 class="page-title">Note Detail</h2>
      <div class="card">
        ${note.title ? `<h3>${escapeHtml(note.title)}</h3>` : ""}
        ${note.text ? `<p style="white-space:pre-line;">${escapeHtml(note.text)}</p>` : ""}
    `;

    // Image preview
    if (note.hasImage) {
      const imgBlob = await localforage.getItem(`note-image-${note.id}`);
      if (imgBlob) {
        const imgUrl  = URL.createObjectURL(imgBlob);
        html += `<img src="${imgUrl}" class="note-image" style="max-width:100%; margin-top:1rem; border-radius:6px;">`;
      }
    }
    // Audio preview
    if (note.hasAudio) {
      const audBlob = await localforage.getItem(`note-audio-${note.id}`);
      if (audBlob) {
        const audUrl  = URL.createObjectURL(audBlob);
        html += `<audio controls src="${audUrl}" style="margin-top:1rem;"></audio>`;
      }
    }
    // Video/Youtube preview
    if (note.video) {
      html += `<iframe src="${note.video}" width="100%" height="315" frameborder="0" allowfullscreen style="margin-top:1rem;"></iframe>`;
    }

    // Buttons
    html += `
      <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
        <button data-delete class="btn-danger" type="button">
          <svg class="icon"><use href="./assets/icons.svg#icon-delete"></use></svg> Delete
        </button>
        <a href="?page=form&id=${note.id}" class="btn">
          <svg class="icon"><use href="./assets/icons.svg#icon-edit"></use></svg> Edit
        </a>
      </div>
    </div>
    <div style="margin-top:1rem;">
      <a href="?page=list&folder=${encodeURIComponent(note.folder)}" class="btn btn-back">
        <svg class="icon"><use href="./assets/icons.svg#icon-back"></use></svg> Back
      </a>
    </div>
    `;

    return html;
  }

  async pageShow() {
    await super.pageShow();
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes.find(n => n.id === id);

    const deleteBtn = document.querySelector("[data-delete]");
    deleteBtn?.addEventListener("click", async () => {
      // Remove blobs if present
      if (note?.hasImage) await localforage.removeItem(`note-image-${note.id}`);
      if (note?.hasAudio) await localforage.removeItem(`note-audio-${note.id}`);
      // Remove note metadata
      const newNotes = notes.filter(n => n.id !== id);
      localStorage.setItem("notes", JSON.stringify(newNotes));
      window.location.href = `?page=list`;
    });
  }
}