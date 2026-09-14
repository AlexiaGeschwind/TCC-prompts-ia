// script.js
// Scroll‑reveal using Intersection Observer
const observerOptions = {
  threshold: 0.1,
};
const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
};
const observer = new IntersectionObserver(revealCallback, observerOptions);

document.querySelectorAll('section').forEach(sec => {
  sec.classList.add('scroll-reveal');
  observer.observe(sec);
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Contact form handling (simple client‑side validation & feedback)
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // In a real scenario, you'd send the data via AJAX.
    alert('Obrigado! Sua mensagem foi enviada.');
    form.reset();
  });
}
