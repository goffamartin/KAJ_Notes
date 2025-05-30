import { Page } from './page.js';

export class PageForm extends Page {
  constructor() {
    super("form", "Add Note");
  }

  async render() {
    const folders = JSON.parse(localStorage.getItem("folders")) || ["Other"];
    const options = folders.map(f => `<option value="${f}">${f}</option>`).join("");
    return `
      <h2 class="page-title">${this.title}</h2>
      <form id="note-form" class="note-form" autocomplete="off">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" name="title" />
        </div>
        <div class="form-group">
          <label for="text">Text</label>
          <textarea id="text" name="text" rows="8"></textarea>
        </div>
        <div class="form-group" id="image-preview-group"></div>
        <div class="form-group">
          <label for="image">Image</label>
          <input id="image" type="file" name="image" accept="image/*" />
        </div>
        <div class="form-group" id="audio-preview-group"></div>
        <div class="form-group">
          <label for="audio">Audio</label>
          <input id="audio" type="file" name="audio" accept="audio/*" />
        </div>
        <div class="form-group">
          <label for="video">Video URL</label>
          <input id="video" type="url" name="video" />
        </div>
        <div class="form-group">
          <label for="folder">Folder</label>
          <select id="folder" name="folder">${options}</select>
        </div>
        <button type="submit" class="btn note-form-submit">
          <svg class="icon"><use href="./assets/icons.svg#icon-save"></use></svg>
          Save
        </button>
      </form>
      <div class="detail-back">
        <a href="?page=list" class="btn btn-back">
          <svg class="icon"><use href="./assets/icons.svg#icon-back"></use></svg>
          Back
        </a>
      </div>
    `;
  }

  async pageShow() {
    await super.pageShow();

    const form = document.getElementById("note-form");
    const imageInput = form.querySelector("#image");
    const audioInput = form.querySelector("#audio");
    const imagePreviewGroup = document.getElementById("image-preview-group");
    const audioPreviewGroup = document.getElementById("audio-preview-group");
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    let editingIndex = -1;
    let hasImage = false, hasAudio = false;
    let existing = null;

    // === Populate for edit ===
    if (editId !== null) {
      existing = notes.find((n, idx) => {
        if (n.id === Number(editId)) {
          editingIndex = idx;
          return true;
        }
        return false;
      });
      if (existing) {
        form.title.value = existing.title || "";
        form.text.value = existing.text || "";
        form.video.value = existing.video || "";
        form.folder.value = existing.folder || "Other";
        this.title = "Edit Note";
        document.querySelector("h2.page-title").textContent = this.title;
        // Show previews for existing image/audio
        if (existing.hasImage) {
          const imgBlob = await localforage.getItem(`note-image-${existing.id}`);
          if (imgBlob) {
            const imgUrl = URL.createObjectURL(imgBlob);
            imagePreviewGroup.innerHTML = `
              <div style="margin-bottom:0.5rem;">
                <img src="${imgUrl}" style="max-width:150px; border-radius:5px; display:block;">
                <button type="button" id="remove-image-btn" class="btn btn-danger" style="margin-top:0.3rem;">
                  <svg class="icon"><use href="./assets/icons.svg#icon-delete"></use></svg> Remove Image
                </button>
              </div>`;
            hasImage = true;
            // Odstranění obrázku
            imagePreviewGroup.querySelector("#remove-image-btn").onclick = async (ev) => {
              ev.preventDefault();
              await localforage.removeItem(`note-image-${existing.id}`);
              hasImage = false;
              imagePreviewGroup.innerHTML = '';
              // také označíme, že se má obrázek odstranit i v metadata
              existing.hasImage = false;
            };
          }
        }
        if (existing.hasAudio) {
          const audBlob = await localforage.getItem(`note-audio-${existing.id}`);
          if (audBlob) {
            const audUrl = URL.createObjectURL(audBlob);
            audioPreviewGroup.innerHTML = `
              <div style="margin-bottom:0.5rem;">
                <audio src="${audUrl}" controls style="display:block;"></audio>
                <button type="button" id="remove-audio-btn" class="btn btn-danger" style="margin-top:0.3rem;">
                  <svg class="icon"><use href="./assets/icons.svg#icon-delete"></use></svg> Remove Audio
                </button>
              </div>`;
            hasAudio = true;
            // Odstranění audia
            audioPreviewGroup.querySelector("#remove-audio-btn").onclick = async (ev) => {
              ev.preventDefault();
              await localforage.removeItem(`note-audio-${existing.id}`);
              hasAudio = false;
              audioPreviewGroup.innerHTML = '';
              existing.hasAudio = false;
            };
          }
        }
      }
    }

    // === File input live preview ===
    imageInput.addEventListener("change", e => {
      if (imageInput.files && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const imgUrl = URL.createObjectURL(file);
        imagePreviewGroup.innerHTML = `
          <div style="margin-bottom:0.5rem;">
            <img src="${imgUrl}" style="max-width:150px; border-radius:5px; display:block;">
            <button type="button" id="remove-image-btn" class="btn btn-danger" style="margin-top:0.3rem;">
              <svg class="icon"><use href="./assets/icons.svg#icon-delete"></use></svg> Remove Image
            </button>
          </div>`;
        // odstranění vybraného obrázku (neuloží se)
        imagePreviewGroup.querySelector("#remove-image-btn").onclick = (ev) => {
          ev.preventDefault();
          imageInput.value = '';
          imagePreviewGroup.innerHTML = '';
        };
      }
    });

    audioInput.addEventListener("change", e => {
      if (audioInput.files && audioInput.files.length > 0) {
        const file = audioInput.files[0];
        const audUrl = URL.createObjectURL(file);
        audioPreviewGroup.innerHTML = `
          <div style="margin-bottom:0.5rem;">
            <audio src="${audUrl}" controls style="display:block;"></audio>
            <button type="button" id="remove-audio-btn" class="btn btn-danger" style="margin-top:0.3rem;">
              <svg class="icon"><use href="./assets/icons.svg#icon-delete"></use></svg> Remove Audio
            </button>
          </div>`;
        // odstranění vybraného audia (neuloží se)
        audioPreviewGroup.querySelector("#remove-audio-btn").onclick = (ev) => {
          ev.preventDefault();
          audioInput.value = '';
          audioPreviewGroup.innerHTML = '';
        };
      }
    });

    // === Submit ===
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const data = new FormData(form);
      const title    = data.get("title").trim();
      const text     = data.get("text").trim();
      const rawVideo = data.get("video").trim();
      const folder   = data.get("folder") || "Other";
      const imgFile  = data.get("image");
      const audFile  = data.get("audio");
      if (!text && !rawVideo && (!imgFile || !imgFile.size) && (!audFile || !audFile.size) && !hasImage && !hasAudio) {
        alert("At least one of Text, Image, Audio or Video is required.");
        return;
      }
      // Note ID (new or edit)
      const noteId = editingIndex !== -1 ? notes[editingIndex].id : Date.now();

      // Save blobs in localForage
      // -- obrázek --
      if (imgFile && imgFile.size > 0) {
        await localforage.setItem(`note-image-${noteId}`, imgFile);
        hasImage = true;
      } else if (editingIndex !== -1 && existing && existing.hasImage === false) {
        // Pokud existující obrázek byl odebrán
        await localforage.removeItem(`note-image-${noteId}`);
        hasImage = false;
      }
      // -- audio --
      if (audFile && audFile.size > 0) {
        await localforage.setItem(`note-audio-${noteId}`, audFile);
        hasAudio = true;
      } else if (editingIndex !== -1 && existing && existing.hasAudio === false) {
        // Pokud existující audio bylo odebráno
        await localforage.removeItem(`note-audio-${noteId}`);
        hasAudio = false;
      }

      // YouTube embed
      const video = (() => {
        const m = rawVideo.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        return m ? `https://www.youtube.com/embed/${m[1]}` : rawVideo;
      })();

      // Compose note metadata
      const note = {
        id:     noteId,
        title,
        text,
        folder,
        video,
        hasImage,
        hasAudio,
        date:   new Date().toISOString()
      };

      // Save to localStorage
      if (editingIndex !== -1) {
        notes[editingIndex] = note;
      } else {
        notes.unshift(note);
      }
      localStorage.setItem("notes", JSON.stringify(notes));

      // Go back to list
      window.location.href = `?page=list&folder=${encodeURIComponent(folder)}`;
    }, { once: true });
  }
}
