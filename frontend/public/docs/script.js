
const siteOrigin = window.location.origin;
const siteHost = window.location.host;

function applySitePlaceholders(root = document) {
  root.querySelectorAll("[data-site-origin]").forEach((el) => {
    el.textContent = siteOrigin;
  });
  root.querySelectorAll("[data-site-host]").forEach((el) => {
    el.textContent = siteHost;
  });
  root.querySelectorAll("[data-copy]").forEach((el) => {
    const value = el.getAttribute("data-copy");
    if (!value) return;
    if (value.includes("__SITE_ORIGIN__")) {
      el.setAttribute("data-copy", value.replaceAll("__SITE_ORIGIN__", siteOrigin));
    }
    if (value.includes("__SITE_HOST__")) {
      el.setAttribute("data-copy", value.replaceAll("__SITE_HOST__", siteHost));
    }
  });
}

document.body.innerHTML = document.body.innerHTML
  .replaceAll("__SITE_ORIGIN__", siteOrigin)
  .replaceAll("__SITE_HOST__", siteHost);
applySitePlaceholders();

const body = document.body;
const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector(".menu-button");
const navLinks = Array.from(document.querySelectorAll(".sidebar-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
let activeId = "";
let ticking = false;

function closeSidebar() {
  body.classList.remove("sidebar-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

menuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("sidebar-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

document.addEventListener("click", (event) => {
  if (!body.classList.contains("sidebar-open")) return;
  if (sidebar?.contains(event.target) || menuButton?.contains(event.target)) return;
  closeSidebar();
});

function setActiveSection(id) {
  if (!id || id === activeId) return;
  activeId = id;

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);

    if (isActive && sidebar && window.matchMedia("(min-width: 921px)").matches) {
      link.scrollIntoView({ block: "nearest" });
    }
  });
}

function updateActiveSection() {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.28, 220);
  let current = sections[0]?.id;

  for (const section of sections) {
    if (section.offsetTop <= marker) {
      current = section.id;
    } else {
      break;
    }
  }

  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1]?.id;
  }

  setActiveSection(current);
  ticking = false;
}

function requestActiveSectionUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateActiveSection);
}

window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
window.addEventListener("resize", requestActiveSectionUpdate);
window.addEventListener("load", updateActiveSection);
updateActiveSection();

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      const oldText = button.textContent;
      button.textContent = "已复制";
      button.classList.add("copied");
      window.setTimeout(() => {
        button.textContent = oldText;
        button.classList.remove("copied");
      }, 1400);
    } catch {
      const oldText = button.textContent;
      button.textContent = "复制失败";
      window.setTimeout(() => {
        button.textContent = oldText || "复制";
      }, 1400);
    }
  });
});

document.querySelectorAll("[data-tabs]").forEach((tabsRoot) => {
  const buttons = Array.from(tabsRoot.querySelectorAll(":scope > .tab-list .tab-button, :scope > .card-head .tab-list .tab-button, :scope > .tool-panel-head .tab-list .tab-button"));
  const panels = Array.from(tabsRoot.querySelectorAll(":scope > .tab-panel"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab-target");
      if (!target) return;

      buttons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute("data-tab-panel") === target);
      });
    });
  });
});

const lightbox = document.querySelector(".image-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = lightbox?.querySelector("button");

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  lightboxImage.removeAttribute("alt");
}

document.querySelectorAll("figure img").forEach((image) => {
  image.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "图片预览";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
    closeLightbox();
  }
});
