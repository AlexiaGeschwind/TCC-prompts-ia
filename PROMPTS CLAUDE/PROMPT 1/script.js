/* =============================================
   CENTERAGRO – script.js
   Interatividade da Landing Page
   ============================================= */

/* ---------- Header scroll effect ---------- */
const header = document.getElementById('header');
const scrollThreshold = 60;

function onScroll() {
  if (window.scrollY > scrollThreshold) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile menu toggle ---------- */
const menuToggle = document.getElementById('menu-toggle');
const mainNav    = document.getElementById('main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close menu when a nav link is clicked
mainNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Intersection Observer – animate on scroll ---------- */
const animItems = document.querySelectorAll(
  '.produto-card, .dif-card, .stat-card, .contact-item, .sobre__card-wrap'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${(i % 6) * 80}ms`;
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animItems.forEach(el => observer.observe(el));

/* ---------- Contact Form – basic UX ---------- */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('form-submit-btn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        valid = false;
      }
    });

    if (!valid) {
      required[0].focus();
      return;
    }

    // Build WhatsApp message
    const nome      = document.getElementById('input-nome').value.trim();
    const telefone  = document.getElementById('input-telefone').value.trim();
    const email     = document.getElementById('input-email').value.trim();
    const tipo      = document.getElementById('input-tipo').value;
    const mensagem  = document.getElementById('input-mensagem').value.trim();

    const tipoLabel = {
      produtor: 'Produtor Rural',
      revenda: 'Revenda / Distribuidora',
      cooperativa: 'Cooperativa',
      mecanica: 'Oficina Mecânica',
      outro: 'Outro'
    };

    let msg = `Olá! Vim pelo site da CenterAgro e gostaria de um orçamento.\n\n`;
    msg += `*Nome:* ${nome}\n`;
    msg += `*Telefone:* ${telefone}\n`;
    if (email) msg += `*E-mail:* ${email}\n`;
    if (tipo)  msg += `*Tipo de cliente:* ${tipoLabel[tipo] || tipo}\n`;
    msg += `\n*Peça / Máquina procurada:*\n${mensagem}`;

    const wppNumber = '5554999999999';
    const wppUrl = `https://wa.me/${wppNumber}?text=${encodeURIComponent(msg)}`;

    // Visual feedback
    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Redirecionando ao WhatsApp...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      window.open(wppUrl, '_blank', 'noopener');
      submitBtn.innerHTML = originalHtml;
      submitBtn.disabled = false;
      form.reset();
    }, 800);
  });

  // Live field validation feedback
  form.querySelectorAll('.form-input').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

/* ---------- Phone mask ---------- */
const phoneInput = document.getElementById('input-telefone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 2) {
      v = `(${v.substring(0,2)}) ${v.substring(2)}`;
    }
    if (v.length > 10) {
      v = `${v.substring(0,10)}-${v.substring(10)}`;
    }
    e.target.value = v;
  });
}
