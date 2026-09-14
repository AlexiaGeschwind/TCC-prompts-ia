/**
 * CenterAgro Landing Page JavaScript Logic
 * Handles interactive elements, counters, animations, and the WhatsApp Quote Generator.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STICKY HEADER & SCROLL EFFECTS
    // ==========================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially in case page loaded scrolled down

    // ==========================================
    // 2. MOBILE MENU INTERACTIVITY
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuToggleIcon = menuToggle.querySelector('i');
    
    // Toggle Menu Open/Closed
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        // Swap icon between hamburger (fa-bars) and close (fa-xmark)
        if (isActive) {
            menuToggleIcon.className = 'fa-solid fa-xmark';
        } else {
            menuToggleIcon.className = 'fa-solid fa-bars';
        }
    });

    // Close Menu when navigation links are clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggleIcon.className = 'fa-solid fa-bars';
        });
    });

    // ==========================================
    // 3. INTERSECTION OBSERVER FOR ACTIVE NAV LINKS
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Highlighting triggers when section occupies center screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================
    // 4. ANIMATING STATISTICS COUNTER
    // ==========================================
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(counter => {
            const textContent = counter.innerText;
            const targetAttr = counter.getAttribute('data-target');
            
            // Check if counter has numerical target to animate
            if (targetAttr) {
                const target = parseInt(targetAttr, 10);
                const speed = 200; // The higher the value, the slower the animation
                let current = 0;
                const increment = Math.ceil(target / speed);
                
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = `+${current.toLocaleString('pt-BR')}`;
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = `+${target.toLocaleString('pt-BR')}`;
                    }
                };
                
                updateCount();
            }
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true; // Run only once
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 5. SMART WHATSAPP QUOTE GENERATOR FORM
    // ==========================================
    const quoteForm = document.getElementById('quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract Values from Form
            const name = document.getElementById('client-name').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const location = document.getElementById('client-city').value.trim();
            const machine = document.getElementById('machine-type').value;
            const brand = document.getElementById('machine-brand').value;
            const parts = document.getElementById('part-description').value.trim();
            
            // Validate inputs
            if (!name || !phone || !location || !machine || !brand || !parts) {
                alert('Por favor, preencha todos os campos obrigatórios (*).');
                return;
            }

            // Construct Clean Structured Whatsapp Message (using GFM formatting structure for atendente readability)
            const textMessage = 
`Olá, CenterAgro! Gostaria de solicitar uma cotação de peças.

*DADOS DO CLIENTE:*
👤 *Nome:* ${name}
📍 *Localização:* ${location}
📱 *WhatsApp:* ${phone}

*DADOS DO EQUIPAMENTO:*
🚜 *Máquina:* ${machine}
🏷️ *Marca:* ${brand}

*PEÇAS SOLICITADAS:*
🛠️ ${parts}

_Cotação enviada através do site oficial da CenterAgro._`;

            // URL Encode the message
            const encodedText = encodeURIComponent(textMessage);
            
            // Official CenterAgro WhatsApp number: (55) 98452-7182
            const whatsappNumber = '5555984527182';
            
            // Construct API Link
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
            
            // Feedback transition animation inside the button
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.style.background = 'hsl(142, 70%, 45%)';
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando orçamento...';
            
            // Redirect after brief pleasant delay to let user see feedback
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                
                // Reset Button
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.innerHTML = originalBtnContent;
                
                // Optional: Clear form
                quoteForm.reset();
            }, 1000);
        });
    }

    // ==========================================
    // 6. PHONE INPUT AUTO-MASKING
    // ==========================================
    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
});
