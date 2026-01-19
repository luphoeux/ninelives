document.addEventListener("DOMContentLoaded", async () => {
  // Function to load global components
  async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (element) {
      try {
        const response = await fetch(`${file}?v=${new Date().getTime()}`);
        const html = await response.text();
        element.innerHTML = html;
        return true;
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return false;
      }
    }
    return false;
  }

  // Load header and footer first
  await Promise.all([
    loadComponent("global-header", "includes/header.html"),
    loadComponent("global-footer", "includes/footer.html"),
  ]);

  // Mobile Menu Toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav");
  const heroSection = document.querySelector(".hero");

  if (mobileToggle) {
    // Create and add overlay if it doesn't exist
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay && nav) {
      navOverlay = document.createElement('div');
      navOverlay.className = 'nav-overlay';
      nav.parentNode.insertBefore(navOverlay, nav.nextSibling);
    }

    const toggleMenu = (show) => {
      const active = show !== undefined ? show : !nav.classList.contains("active");
      nav.classList.toggle("active", active);
      if (navOverlay) navOverlay.classList.toggle("active", active);
      document.body.style.overflow = active ? "hidden" : "";
      
      const icon = mobileToggle.querySelector("i");
      if (active) {
        icon.classList.replace("ri-menu-line", "ri-close-line");
      } else {
        icon.classList.replace("ri-close-line", "ri-menu-line");
      }
    };

    mobileToggle.addEventListener("click", () => toggleMenu());
    if (navOverlay) navOverlay.addEventListener("click", () => toggleMenu(false));

    // Close menu when clicking a link
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // Navigation Active Link Highlighting
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Close mobile menu if open
        if (nav && nav.classList.contains("active")) {
          nav.classList.remove("active");
          const icon = mobileToggle.querySelector("i");
          icon.classList.remove("ri-close-line");
          icon.classList.add("ri-menu-line");
        }

        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector(".header");
  const hero = document.querySelector(".hero");
  
  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 80) {
        header.classList.add("scrolled");
        if (hero) hero.classList.add("scrolled-past");
      } else {
        header.classList.remove("scrolled");
        if (hero) hero.classList.remove("scrolled-past");
      }
    }
  });

  // Theme Toggle Logic
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

  // Theme is already set by inline script in <head>
  // Just sync the icon with the current theme
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark" && themeIcon) {
    themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
  }

  if (themeToggle && themeIcon) {
    themeToggle.addEventListener("click", () => {
      let theme = "light";
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.classList.replace("ri-sun-line", "ri-moon-line");
      } else {
        theme = "dark";
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
      }
      localStorage.setItem("theme", theme);
    });
  }

  // Floating Buttons (WhatsApp & Back to Top)
  const backToTopBtn = document.getElementById("backToTop");
  const whatsappBtn = document.querySelector(".whatsapp-float");
  
  if (backToTopBtn || whatsappBtn) {
    window.addEventListener("scroll", () => {
      const showButtons = window.scrollY > 300;
      if (backToTopBtn) {
        if (showButtons) backToTopBtn.classList.add("show");
        else backToTopBtn.classList.remove("show");
      }
      if (whatsappBtn) {
        if (showButtons) whatsappBtn.classList.add("show");
        else whatsappBtn.classList.remove("show");
      }
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  // Custom Circular Cursor for Hero Section
  let customCursor = null;

  if (heroSection) {
    customCursor = document.createElement("div");

    const updateCursorColor = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const bgColor = isDark ? "#FFFFFF" : "var(--primary-color)";
      const isHeroActive = heroSection.matches(':hover');
      
      customCursor.style.backgroundColor = bgColor;
      customCursor.style.boxShadow = isDark 
        ? '0 0 20px rgba(255,255,255,0.4)' 
        : '0 0 20px rgba(0, 0, 0, 0.2)';
    };

    customCursor.className = "custom-cursor";
    customCursor.style.cssText = `
            width: 24px;
            height: 24px;
            background-color: var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease, opacity 0.15s ease, background-color 0.5s ease;
            opacity: 0;
            transform: translate(-50%, -50%);
        `;
    document.body.appendChild(customCursor);

    updateCursorColor();

    const themeObserver = new MutationObserver(updateCursorColor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    heroSection.addEventListener("mousemove", (e) => {
      customCursor.style.left = e.clientX + "px";
      customCursor.style.top = e.clientY + "px";
      customCursor.style.opacity = "1";
    });

    heroSection.addEventListener("mouseleave", () => {
      customCursor.style.opacity = "0";
    });

    heroSection.addEventListener("mousedown", () => {
      customCursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    });

    heroSection.addEventListener("mouseup", () => {
      customCursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
  }

  // Canvas Blur Control
  const canvas = document.getElementById("bg-canvas");


  if (canvas && heroSection) {
    heroSection.addEventListener("mouseenter", () => {
      canvas.style.filter = "blur(12px)";
      if (customCursor) customCursor.style.opacity = "1";
    });
    heroSection.addEventListener("mouseleave", () => {
      canvas.style.filter = "blur(8px)";
      if (customCursor) customCursor.style.opacity = "0";
    });
  }

  // Carousel Drag-to-Scroll removed as per request
  
  // --- Internationalization (i18n) Logic ---
  let currentLang = localStorage.getItem('language');
  if (!currentLang) {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang.startsWith('en') ? 'en' : 'es';
    localStorage.setItem('language', currentLang);
  }

  function applyTranslations() {
    const t = translations[currentLang];
    
    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });

    // Translate aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (t[key]) {
        el.setAttribute('aria-label', t[key]);
      }
    });

    // Update switcher UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentLang = btn.getAttribute('data-lang');
        localStorage.setItem('language', currentLang);
        applyTranslations();
      });
    });
  }

  // Apply initial translations
  applyTranslations();
  initLangSwitcher();

  // Re-apply and re-init after component loads (since they contain i18n keys)
  applyTranslations(); 
  initLangSwitcher();

  // Highlight active link after potential translation update
  function highlightNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-list .nav-link").forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  highlightNav();
  
  // Character counter for message fields
  const messageHome = document.getElementById('message-home');
  const counterHome = document.getElementById('char-count-home');
  const messageContact = document.getElementById('message-contact');
  const counterContact = document.getElementById('char-count-contact');

  function updateCounter(textarea, counter) {
    if (textarea && counter) {
      textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        counter.textContent = `${length} / 150`;
      });
    }
  }

  updateCounter(messageHome, counterHome);
  updateCounter(messageContact, counterContact);
});
