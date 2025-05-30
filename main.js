import { Router } from './router.js';
import { PageList }    from './pages/page-list.js';
import { PageForm }    from './pages/page-form.js';
import { PageDetail }  from './pages/page-detail.js';
import { PageFolders } from './pages/page-folders.js';
import { Page404 }     from './pages/page-404.js';

const router = new Router([
  new PageList(),
  new PageForm(),
  new PageDetail(),
  new PageFolders(),
  new Page404()
], "list");

window.router = router;

// Hamburger + Sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    sidebar.classList.toggle("open");
  });

  const folders = JSON.parse(localStorage.getItem("folders")) || ["Other"];
  const container = document.getElementById("sidebar-folders");
  if (container) {
    container.innerHTML = folders.map(f =>
      `<li><a href="?page=list&folder=${encodeURIComponent(f)}">${f}</a></li>`
    ).join("");
  }

  // Sidebar navigační tlačítka
  document.querySelectorAll('[data-nav]').forEach(btn =>
    btn.addEventListener('click', () => router.navigate(`?page=${btn.dataset.nav}`))
  );

});


