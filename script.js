const business = {
  name: "Sabor da Esquina",
  segment: "Lanchonete",
  city: "Campinas - SP",
  whatsapp: "5519999990000",
  instagram: "@sabordaesquina",
  address: "Rua das Acácias, 245 - Centro, Campinas - SP"
};

const catalogItems = [
  {
    name: "Burger da Casa",
    category: "Lanches",
    description: "Pão brioche, blend bovino, queijo prato, molho da casa e salada fresca.",
    price: "R$ 28,90",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=84",
    featured: true
  },
  {
    name: "X-Salada Clássico",
    category: "Lanches",
    description: "Hambúrguer, queijo, alface, tomate, milho e maionese temperada.",
    price: "R$ 22,90",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=84",
    featured: false
  },
  {
    name: "Combo Família",
    category: "Promoções",
    description: "Dois burgers, uma porção média de fritas e dois refrigerantes lata.",
    price: "R$ 69,90",
    image: "https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=84",
    featured: true
  },
  {
    name: "Porção de Fritas",
    category: "Porções",
    description: "Batatas crocantes servidas com molho especial da casa.",
    price: "R$ 24,90",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=84",
    featured: false
  },
  {
    name: "Frango Crocante",
    category: "Porções",
    description: "Iscas de frango empanadas, sequinhas e acompanhadas de molho suave.",
    price: "R$ 32,90",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=800&q=84",
    featured: false
  },
  {
    name: "Refrigerante Lata",
    category: "Bebidas",
    description: "Opções geladas para acompanhar seu lanche ou porção.",
    price: "R$ 6,50",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=84",
    featured: false
  },
  {
    name: "Suco Natural",
    category: "Bebidas",
    description: "Sabores do dia preparados na hora, conforme disponibilidade.",
    price: "R$ 9,90",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=84",
    featured: false
  },
  {
    name: "Brownie da Casa",
    category: "Sobremesas",
    description: "Brownie macio com casquinha crocante, servido em embalagem individual.",
    price: "R$ 12,90",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=84",
    featured: true
  }
];

const elements = {
  header: document.querySelector(".site-header"),
  catalogGrid: document.querySelector("#catalogGrid"),
  categoryTabs: document.querySelector("#categoryTabs"),
  searchInput: document.querySelector("#searchInput"),
  emptyState: document.querySelector("#emptyState"),
  menuToggle: document.querySelector(".menu-toggle"),
  navLinks: document.querySelector("#navLinks"),
  whatsappLinks: document.querySelectorAll("[data-whatsapp-general]"),
  featuredOrderButton: document.querySelector("#featuredOrderButton"),
  parallaxItems: document.querySelectorAll("[data-parallax]")
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeCategory = "Todos";
let ticking = false;

function createWhatsAppLink(message) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

function normalizeText(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getCategories() {
  return ["Todos", ...new Set(catalogItems.map((item) => item.category))];
}

function getFeaturedItem() {
  return catalogItems.find((item) => item.name === "Combo Família") || catalogItems.find((item) => item.featured) || catalogItems[0];
}

function getItemWhatsAppMessage(item) {
  return `Olá, vim pelo site da ${business.name} e quero pedir ${item.name}. Pode confirmar disponibilidade e forma de pagamento?`;
}

function matchesSearch(item, searchTerm) {
  const haystack = normalizeText(`${item.name} ${item.category} ${item.description}`);
  return haystack.includes(normalizeText(searchTerm));
}

function getFilteredItems() {
  const searchTerm = elements.searchInput.value;

  return catalogItems.filter((item) => {
    const isSameCategory = activeCategory === "Todos" || item.category === activeCategory;
    return isSameCategory && matchesSearch(item, searchTerm);
  });
}

function renderCategories() {
  elements.categoryTabs.innerHTML = getCategories()
    .map((category) => {
      const isActive = category === activeCategory;
      return `
        <button class="category-tab ${isActive ? "is-active" : ""}" type="button" data-category="${category}" aria-pressed="${isActive}">
          ${category}
        </button>
      `;
    })
    .join("");
}

function renderCatalog() {
  const filteredItems = getFilteredItems();

  elements.catalogGrid.innerHTML = filteredItems
    .map((item, index) => `
      <article class="product-card tilt-card ${item.featured ? "is-featured" : ""}" data-tilt style="animation-delay: ${index * 55}ms">
        <div class="product-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          ${item.featured ? '<span class="badge">Destaque</span>' : ""}
        </div>
        <div class="product-content">
          <div class="product-meta">
            <span class="product-category">${item.category}</span>
            <strong class="product-price">${item.price}</strong>
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <a class="btn btn-primary magnetic" href="${createWhatsAppLink(getItemWhatsAppMessage(item))}" target="_blank" rel="noopener">
            Pedir pelo WhatsApp
          </a>
        </div>
      </article>
    `)
    .join("");

  elements.emptyState.hidden = filteredItems.length > 0;
  setupTilt(elements.catalogGrid.querySelectorAll("[data-tilt]"));
  setupMagnetic(elements.catalogGrid.querySelectorAll(".magnetic"));
}

function updateCatalog() {
  renderCategories();
  renderCatalog();
}

function setupWhatsAppLinks() {
  const message = `Olá, vim pelo site da ${business.name} e gostaria de fazer um pedido. Pode me atender?`;

  elements.whatsappLinks.forEach((link) => {
    link.href = createWhatsAppLink(message);
  });

  const featuredItem = getFeaturedItem();
  if (elements.featuredOrderButton && featuredItem) {
    elements.featuredOrderButton.href = createWhatsAppLink(getItemWhatsAppMessage(featuredItem));
  }
}

function closeMobileMenu() {
  elements.menuToggle.classList.remove("is-open");
  elements.navLinks.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  elements.menuToggle.setAttribute("aria-expanded", "false");
}

function setupMenu() {
  elements.menuToggle.addEventListener("click", () => {
    const isOpen = elements.menuToggle.classList.toggle("is-open");
    elements.navLinks.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  elements.navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = elements.navLinks.contains(event.target);
    const clickedToggle = elements.menuToggle.contains(event.target);
    if (!clickedInsideMenu && !clickedToggle && elements.navLinks.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.navLinks.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });
}

function setupCatalogEvents() {
  elements.categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;
    updateCatalog();

    if (window.gsap && !prefersReducedMotion) {
      gsap.fromTo(".product-card", { y: 24, opacity: 0, scale: 0.98 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.045,
        ease: "power3.out"
      });
    }
  });

  elements.searchInput.addEventListener("input", renderCatalog);
}

function updateScrollEffects() {
  const scrollY = window.scrollY;
  elements.header.classList.toggle("is-scrolled", scrollY > 24);

  if (!prefersReducedMotion) {
    elements.parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0.06);
      const rect = item.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top) * speed;
      item.style.translate = `0 ${offset}px`;
    });
  }
}

function requestScrollUpdate() {
  if (ticking) return;

  window.requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });

  ticking = true;
}

function setupScrollState() {
  updateScrollEffects();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
}

function setupGsapAnimations() {
  if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
    document.querySelectorAll("[data-animate], [data-animate-group], .animate-item").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(".hero .animate-item", { y: 34, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out"
  });

  gsap.fromTo(".hero-plate", { y: 42, rotate: 2, opacity: 0 }, {
    y: 0,
    rotate: 0,
    opacity: 1,
    duration: 1.05,
    ease: "power3.out",
    delay: 0.16
  });

  gsap.utils.toArray("[data-animate]").forEach((element) => {
    gsap.fromTo(element, { y: 42, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.82,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 82%"
      }
    });
  });

  gsap.utils.toArray("[data-animate-group]").forEach((group) => {
    const items = group.querySelectorAll(".animate-item");
    gsap.fromTo(items, { y: 32, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.78,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: group,
        start: "top 82%"
      }
    });
  });

}

function setupTilt(targets = document.querySelectorAll("[data-tilt]")) {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

  targets.forEach((card) => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = "true";

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((0.5 - y / rect.height)) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupMagnetic(targets = document.querySelectorAll(".magnetic")) {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

  targets.forEach((button) => {
    if (button.dataset.magneticReady) return;
    button.dataset.magneticReady = "true";

    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

function init() {
  document.body.classList.add("js-enabled");
  setupWhatsAppLinks();
  setupMenu();
  setupCatalogEvents();
  setupScrollState();
  updateCatalog();
  setupGsapAnimations();
  setupTilt();
  setupMagnetic();
}

init();
