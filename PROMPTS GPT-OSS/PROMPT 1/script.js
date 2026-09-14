// script.js – Simple interactions for CenterAgro landing page

// Smooth scroll for internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Reveal sections on scroll using IntersectionObserver
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Add "reveal" class to sections that should animate
['.benefits', '.testimonials', '.contact', '.footer'].forEach(selector => {
  document.querySelectorAll(selector).forEach(el => revealObserver.observe(el));
});

// Optional: simple form validation (prevent empty submission)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    const nome = contactForm.querySelector('input[name="nome"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const mensagem = contactForm.querySelector('textarea[name="mensagem"]').value.trim();
    if (!nome || !email || !mensagem) {
      e.preventDefault();
      alert('Por favor, preencha todos os campos antes de enviar.');
    }
  });
}
