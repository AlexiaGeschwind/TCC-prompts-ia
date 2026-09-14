/* ==========================================================================
   CENTERAGRO LANDING PAGE - SCRIPTS E INTERATIVIDADE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. MUDANÇA DE ESTILO DO HEADER AO ROLAR (SCROLLED HEADER) */
    const header = document.querySelector('.header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Executa na carga inicial caso a página já inicie rolada


    /* 2. MENU MOBILE RESPONSIVO */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-item');

    const toggleMenu = () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll'); // Evita rolagem do body com menu aberto
    };

    const closeMenu = () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em qualquer item de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });


    /* 3. ACTIVE SCROLL SPY (INDICADOR DE SEÇÃO ATIVA NO MENU) */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset para compensar o header
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);


    /* 4. FAQ ACCORDION INTERATIVO (SANFONA COM SUAVE TRANSIÇÃO) */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        trigger.addEventListener('click', () => {
            const isCurrentlyActive = item.classList.contains('active');

            // 1. Fechar todos os outros FAQs abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });

            // 2. Alternar o item clicado
            if (isCurrentlyActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                // Calcula a altura interna real para abrir suavemente
                content.style.maxHeight = content.scrollHeight + 'px';
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* 5. ANIMAÇÕES AO ROLAR A PÁGINA (INTERSECTION OBSERVER) */
    const revealElements = document.querySelectorAll(
        '.reveal-fade-in, .reveal-fade-in-up, .reveal-slide-in-left, .reveal-slide-in-right'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Se for a caixa do Hero contendo números, dispara a animação numérica
                if (entry.target.classList.contains('hero-content')) {
                    animateCounters();
                }
                
                // Desativa a observação para este elemento após animar uma vez
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* 6. ANIMAÇÃO DE CONTADORES NUMÉRICOS NO HERO (COUNTERS EFFECT) */
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        const counters = document.querySelectorAll('.metric-num');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            
            // Ajusta a velocidade de incremento baseada no tamanho do número final
            const speed = target > 1000 ? Math.ceil(target / 100) : Math.ceil(target / 50);
            
            const updateCount = () => {
                count += speed;
                
                if (count >= target) {
                    counter.innerText = target.toLocaleString('pt-BR');
                } else {
                    counter.innerText = count.toLocaleString('pt-BR');
                    setTimeout(updateCount, 15);
                }
            };
            
            updateCount();
        });
    };

    // Caso o Intersection Observer não seja suportado, roda os contadores por padrão
    if (!window.IntersectionObserver) {
        animateCounters();
    }


    /* 7. FORMULÁRIO DE CONTATO E SIMULAÇÃO DE ENVIO */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const btnSubmit = document.getElementById('btnSubmit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Desabilita o botão para evitar múltiplos cliques
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin btn-icon-right"></i>';

            // Captura de valores (para simulação ou futura integração)
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simula um delay de rede de 1.5s
            setTimeout(() => {
                // Sucesso na simulação
                formFeedback.classList.remove('hidden', 'error');
                formFeedback.classList.add('success');
                formFeedback.innerHTML = `<i class="fas fa-check-circle"></i> Obrigado, <strong>${name}</strong>! Sua mensagem foi enviada com sucesso. Nossa equipe de especialistas entrará em contato em instantes via WhatsApp ou e-mail.`;

                // Reseta o formulário
                contactForm.reset();

                // Restaura o botão
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'Enviar Mensagem <i class="far fa-paper-plane btn-icon-right"></i>';

                // Rola suavemente até a caixa de feedback
                formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Oculta a mensagem de feedback após 8 segundos
                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 8000);

            }, 1500);
        });
    }

});
