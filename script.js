/**
 * PORTFOLIO JAVASCRIPT — LUIZ FERNANDO
 * Interactive Cyber-Obsidian Tech Portfolio
 * Features: Interactive Matrix Grid Canvas, Theme Switcher,
 * Repository & Visual Switcher, Dynamic Modals, Stats Counter, Clipboard Copy.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollNav();
  initMobileMenu();
  initInteractiveCanvas();
  initProjectsAndRepos();
  initSkillsFilter();
  initStatsObserver();
  initClipboardToast();
  initContactForm();
  updateCurrentYear();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark Obsidian / Light Clean)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('luiz-portfolio-theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('luiz-portfolio-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }
}

/* ==========================================================================
   2. STICKY NAV & SCROLL SPY
   ========================================================================== */
function initScrollNav() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileBtn.textContent = '☰';
      });
    });
  }
}

/* ==========================================================================
   4. INTERACTIVE HIGH-TECH CANVAS (Cyber Neural Grid)
   ========================================================================== */
function initInteractiveCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Generate particles
  const particleCount = Math.min(Math.floor((width * height) / 16000), 70);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.5 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repel / attract interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(14, 165, 233, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(14, 165, 233, ';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * (isDark ? 0.18 : 0.12);
          ctx.strokeStyle = `${lineColor}${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   5. REPOSITORIES & PROJECTS DATABASE + MODALS
   ========================================================================== */
const PROJECTS_DATABASE = {
  heineken: {
    title: "Universidade Heineken • Portal Onboarding",
    category: "Projeto Web / React (Vercel)",
    image: "assets/project-heineken.svg",
    description: "Portal web desenvolvido em React para atuar como guia de integração de novos colaboradores. O sistema organiza módulos de videoaulas explicativas e questionários interativos de fixação de conteúdo.",
    features: [
      "Trilhas de aprendizagem divididas por módulos em vídeo",
      "Questionários de fixação de conteúdo após cada etapa",
      "Interface responsiva adaptada para mobile e desktop",
      "Deploy contínuo realizado na plataforma Vercel"
    ],
    tags: ["React", "JavaScript", "HTML5", "CSS3", "Vercel Deploy"],
    liveLink: "https://universidade-heineken-front-mu.vercel.app/login",
    codeLink: "https://github.com"
  },
  ai: {
    title: "Synapse.AI • Gerador de Prompts",
    category: "Interface Web / IA",
    image: "assets/project-ai.svg",
    description: "Interface interativa voltada para organização, teste e refinamento de prompts assistidos por IA para auxílio em tarefas de programação e suporte ao desenvolvimento.",
    features: [
      "Painel para teste e formatação de prompts",
      "Templates categorizados para suporte ao desenvolvimento",
      "Interface responsiva desenvolvida em React",
      "Estrutura organizada para integração de chamadas de API"
    ],
    tags: ["Python", "IA Generativa", "React", "JavaScript"],
    liveLink: "javascript:void(0)",
    codeLink: "https://github.com"
  },
  saas: {
    title: "NetControl • Painel de Suporte & Redes",
    category: "Frontend / Suporte & Redes",
    image: "assets/project-saas.svg",
    description: "Protótipo de dashboard para acompanhamento de chamados de suporte técnico e visualização de status básico de conectividade de rede local.",
    features: [
      "Acompanhamento de status de chamados técnicos",
      "Gráficos para visualização de dados operacionais",
      "Filtros de busca rápida por categoria",
      "Componentização e layout responsivo em React"
    ],
    tags: ["React", "JavaScript", "Redes TCP/IP", "CSS Grid"],
    liveLink: "javascript:void(0)",
    codeLink: "https://github.com"
  },
  ecommerce: {
    title: "NexusStore • Interface E-Commerce",
    category: "Frontend / E-Commerce",
    image: "assets/project-ecommerce.svg",
    description: "Interface para comércio eletrônico com catálogo de produtos, filtros por categoria e gerenciamento de estado do carrinho de compras.",
    features: [
      "Busca dinâmica e filtros por categorias de produtos",
      "Carrinho com cálculo e atualização de itens",
      "Layout responsivo para dispositivos móveis e desktops",
      "Estruturação semântica com HTML5 e CSS3"
    ],
    tags: ["JavaScript", "React", "HTML5", "CSS3"],
    liveLink: "javascript:void(0)",
    codeLink: "https://github.com"
  }
};

function initProjectsAndRepos() {
  // Category Filters
  const filterBtns = document.querySelectorAll('.p-filter-btn');
  const allCards = document.querySelectorAll('.repo-card-item, .visual-project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      allCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || (cat && cat.includes(filter))) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // View Switcher (Repositories vs Visual Cards)
  const switchBtns = document.querySelectorAll('.v-switch-btn');
  const reposLayout = document.getElementById('repos-grid-layout');
  const visualLayout = document.getElementById('visual-cards-grid');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.getAttribute('data-view');
      if (view === 'visual') {
        if (reposLayout) reposLayout.style.display = 'none';
        if (visualLayout) {
          visualLayout.style.display = 'grid';
          visualLayout.style.opacity = '0';
          setTimeout(() => {
            visualLayout.style.transition = 'opacity 0.25s ease';
            visualLayout.style.opacity = '1';
          }, 10);
        }
      } else {
        if (visualLayout) visualLayout.style.display = 'none';
        if (reposLayout) {
          reposLayout.style.display = 'grid';
          reposLayout.style.opacity = '0';
          setTimeout(() => {
            reposLayout.style.transition = 'opacity 0.25s ease';
            reposLayout.style.opacity = '1';
          }, 10);
        }
      }
    });
  });

  // Modal Handling
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalCat = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalList = document.getElementById('modal-features');
  const modalTags = document.getElementById('modal-tags');
  const modalLive = document.getElementById('modal-live-link');
  const modalCode = document.getElementById('modal-code-link');

  const openBtns = document.querySelectorAll('.open-modal-trigger');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project-id');
      const project = PROJECTS_DATABASE[pId];

      if (project) {
        modalImg.src = project.image;
        modalImg.alt = project.title;
        modalCat.textContent = project.category;
        modalTitle.textContent = project.title;
        modalDesc.textContent = project.description;

        modalList.innerHTML = project.features
          .map(f => `<li>${f}</li>`)
          .join('');

        modalTags.innerHTML = project.tags
          .map(t => `<span class="terminal-tag">${t}</span>`)
          .join('');

        modalLive.href = project.liveLink;
        modalCode.href = project.codeLink;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

/* ==========================================================================
   6. SKILLS MATRIX FILTER
   ========================================================================== */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.tech-tab-btn');
  const skillCards = document.querySelectorAll('.skill-matrix-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCats = card.getAttribute('data-category').split(' ');
        if (cat === 'all' || cardCats.includes(cat)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. STATS COUNTER WITH INTERSECTION OBSERVER
   ========================================================================== */
function initStatsObserver() {
  const statNums = document.querySelectorAll('.stat-num');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNums.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const duration = 1200;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-column');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   8. 1-CLICK CLIPBOARD COPY & TOAST ALERT
   ========================================================================== */
function initClipboardToast() {
  const copyBtn = document.getElementById('copy-email-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-clipboard') || 'Luizle54@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`[clipboard: success] Copiado: ${email}`);
      }).catch(() => {
        showToast('[clipboard: error] Não foi possível copiar.');
      });
    });
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = msg;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.25s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/* ==========================================================================
   9. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      if (feedback) {
        feedback.textContent = '⚠ Preencha todos os campos obrigatórios (*).';
        feedback.style.color = '#f87171';
      }
      return;
    }

    if (feedback) {
      feedback.textContent = '✓ Mensagem preparada! Redirecionando para envio de e-mail...';
      feedback.style.color = '#34d399';
    }

    const subject = encodeURIComponent(document.getElementById('form-subject').value.trim() || `Contato via Portfólio de ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);

    setTimeout(() => {
      window.location.href = `mailto:Luizle54@gmail.com?subject=${subject}&body=${body}`;
    }, 600);
  });
}

function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
