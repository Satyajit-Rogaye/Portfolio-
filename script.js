const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const menuToggle = $("#menuToggle");
const nav = $("#nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
$$(".nav-link", nav).forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const themeToggle = $("#themeToggle");
const storedTheme = (() => { try { return localStorage.getItem("portfolio-theme"); } catch { return null; } })();
if (storedTheme === "light") document.body.classList.add("light");
function setThemeButton() {
  const light = document.body.classList.contains("light");
  themeToggle.textContent = light ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
}
setThemeButton();
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  setThemeButton();
  try { localStorage.setItem("portfolio-theme", document.body.classList.contains("light") ? "light" : "dark"); } catch {}
});

$("#year").textContent = new Date().getFullYear();
const progress = $("#scrollProgress");
const backTop = $("#backTop");
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  backTop.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

const navLinks = $$(".nav-link");
const observedSections = $$("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  observedSections.forEach(section => sectionObserver.observe(section));
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("in-view"); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach(el => revealObserver.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("in-view"));
}

// Project filtering and search
let currentFilter = "all";
const projectSearch = $("#projectSearch");
const projectCards = $$(".project-card");
function filterProjects() {
  const term = projectSearch.value.trim().toLowerCase();
  let visible = 0;
  projectCards.forEach(card => {
    const matchesCategory = currentFilter === "all" || card.dataset.category === currentFilter;
    const haystack = `${card.dataset.title} ${card.dataset.description} ${card.dataset.tools}`.toLowerCase();
    const matchesTerm = haystack.includes(term);
    card.hidden = !(matchesCategory && matchesTerm);
    if (!card.hidden) visible++;
  });
  $("#noProjects").hidden = visible !== 0;
}
$$(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
  currentFilter = btn.dataset.filter;
  $$(".filter-btn").forEach(b => b.classList.toggle("active", b === btn));
  filterProjects();
}));
projectSearch.addEventListener("input", filterProjects);

// Project detail modal
const projectModal = $("#projectModal");
$$("[data-open-project]").forEach(btn => btn.addEventListener("click", () => {
  const card = btn.closest(".project-card");
  $("#projectModalTitle").textContent = card.dataset.title;
  $("#projectModalDescription").textContent = card.dataset.description;
  $("#projectModalTools").replaceChildren(...card.dataset.tools.split(",").map(tool => {
    const tag = document.createElement("span"); tag.textContent = tool.trim(); return tag;
  }));
  $("#projectModalRepo").href = card.dataset.repo;
  if (typeof projectModal.showModal === "function") projectModal.showModal();
  else window.open(card.dataset.repo, "_blank", "noopener");
}));
$$("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => projectModal.close()));
projectModal.addEventListener("click", e => { if (e.target === projectModal) projectModal.close(); });

// Certificate search and preview
const certModal = $("#certModal");
const certCards = $$(".cert-card");
function filterCerts() {
  const term = $("#certSearch").value.trim().toLowerCase();
  let visible = 0;
  certCards.forEach(card => {
    const matches = `${card.dataset.title} ${card.dataset.provider} ${card.dataset.date}`.toLowerCase().includes(term);
    card.hidden = !matches;
    if (matches) visible++;
  });
  $("#certCount").textContent = visible;
  $("#noCerts").hidden = visible !== 0;
}
$("#certSearch").addEventListener("input", filterCerts);
$$("[data-open-cert]").forEach(btn => btn.addEventListener("click", () => {
  const card = btn.closest(".cert-card");
  const file = card.dataset.file;
  $("#certModalTitle").textContent = card.dataset.title;
  $("#certModalMeta").textContent = `${card.dataset.provider} · ${card.dataset.date}`;
  $("#certModalDescription").textContent = card.dataset.description;
  $("#certDownload").href = file;
  const preview = $("#certificatePreview");
  preview.replaceChildren();
  const ext = file.split(".").pop().toLowerCase();
  if (ext === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = `${file}#toolbar=1&navpanes=0`;
    iframe.title = `${card.dataset.title} PDF preview`;
    preview.appendChild(iframe);
  } else {
    const img = document.createElement("img");
    img.src = file;
    img.alt = `${card.dataset.title} certificate`;
    preview.appendChild(img);
  }
  if (typeof certModal.showModal === "function") certModal.showModal();
  else window.open(file, "_blank", "noopener");
}));
$$("[data-close-cert]").forEach(btn => btn.addEventListener("click", () => certModal.close()));
certModal.addEventListener("click", e => { if (e.target === certModal) certModal.close(); });

// Escape key closes dialogs naturally; prevent stale focus when menu changes.
document.addEventListener("keydown", e => {
  if (e.key === "Escape") nav.classList.remove("open");
});