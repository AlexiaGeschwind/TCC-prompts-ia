/* ==========================================================================
   CenterAgro Landing Page JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Toggle System (Light / Dark Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = 'light';
        
        if (currentTheme === 'light') {
            newTheme = 'dark';
        }
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });


    // --- 2. Mobile Menu (Hamburger Drawer) ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenuPanel.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        // Prevent body scroll when menu is active
        document.body.style.overflow = mobileMenuPanel.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenuPanel.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });


    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const scrollObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve after animating once to maintain performance
                observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });


    // --- 4. Active Navigation Links Highlighter on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Account for header height
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);


    // --- 5. FAQ Accordion Panels with Smooth Heights ---
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            const panel = trigger.nextElementSibling;
            
            // Close other open FAQ panels
            faqTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    otherTrigger.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current panel
            trigger.setAttribute('aria-expanded', !expanded);
            if (!expanded) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            } else {
                panel.style.maxHeight = null;
            }
        });
    });


    // --- 6. Real-time Shop Hours Tracker ---
    const hoursStatusEl = document.getElementById('hours-open');

    function checkShopStatus() {
        if (!hoursStatusEl) return;
        
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hour = now.getHours();
        const minute = now.getMinutes();
        const timeInMinutes = hour * 60 + minute;

        let isOpen = false;

        // Seg a Qui (1-4): 07:45 - 12:00, 13:30 - 18:00
        // Sex (5): 07:45 - 12:00, 13:30 - 18:15
        // Sáb (6): 08:00 - 12:00
        // Dom (0): Fechado

        const morningOpen = 7 * 60 + 45; // 07:45
        const morningClose = 12 * 60;    // 12:00
        const afternoonOpen = 13 * 60 + 30; // 13:30

        if (day >= 1 && day <= 4) {
            const afternoonClose = 18 * 60; // 18:00
            if ((timeInMinutes >= morningOpen && timeInMinutes <= morningClose) || 
                (timeInMinutes >= afternoonOpen && timeInMinutes <= afternoonClose)) {
                isOpen = true;
            }
        } else if (day === 5) {
            const afternoonClose = 18 * 60 + 15; // 18:15
            if ((timeInMinutes >= morningOpen && timeInMinutes <= morningClose) || 
                (timeInMinutes >= afternoonOpen && timeInMinutes <= afternoonClose)) {
                isOpen = true;
            }
        } else if (day === 6) {
            const saturdayOpen = 8 * 60; // 08:00
            if (timeInMinutes >= saturdayOpen && timeInMinutes <= morningClose) {
                isOpen = true;
            }
        }

        if (isOpen) {
            hoursStatusEl.textContent = 'Aberto Agora';
            hoursStatusEl.style.color = 'var(--accent-color)';
        } else {
            hoursStatusEl.textContent = 'Plantão WhatsApp';
            hoursStatusEl.style.color = 'var(--warning-color)';
        }
    }

    checkShopStatus();
    // Refresh every minute
    setInterval(checkShopStatus, 60000);


    // --- 7. Interactive Multi-Step Quotation Wizard (Form) ---
    const wizardForm = document.getElementById('wizard-form');
    const steps = document.querySelectorAll('.wizard-step');
    const nextBtns = document.querySelectorAll('.next-step-btn');
    const prevBtns = document.querySelectorAll('.prev-step-btn');
    const currentStepNumEl = document.getElementById('current-step-num');
    const progressFill = document.getElementById('progress-fill');
    const successState = document.getElementById('wizard-success-state');
    const manualWhatsappLink = document.getElementById('manual-whatsapp-link');
    const resetWizardBtn = document.getElementById('reset-wizard-btn');

    let currentStep = 1;

    // Next step button listener
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateWizard();
            }
        });
    });

    // Prev step button listener
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateWizard();
        });
    });

    function updateWizard() {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
        });

        // Show active step
        const activeStepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        if (activeStepEl) {
            activeStepEl.classList.add('active');
        }

        // Update top subtitles & progress bars
        currentStepNumEl.textContent = currentStep;
        const percent = (currentStep / steps.length) * 100;
        progressFill.style.width = `${percent}%`;
    }

    // Step-by-Step validation functions
    function validateStep(step) {
        let isValid = true;
        
        if (step === 1) {
            // Option is pre-selected, model input is optional
            return true;
        }
        
        if (step === 2) {
            const partsInput = document.getElementById('parts-needed');
            const partsGroup = partsInput.closest('.form-group');
            
            if (partsInput.value.trim() === '') {
                partsGroup.classList.add('has-error');
                isValid = false;
            } else {
                partsGroup.classList.remove('has-error');
            }
        }
        
        if (step === 3) {
            const nameInput = document.getElementById('client-name');
            const phoneInput = document.getElementById('client-phone');
            const cityInput = document.getElementById('client-city');
            const consentInput = document.getElementById('terms-consent');

            // Name
            if (nameInput.value.trim().length < 2) {
                nameInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            } else {
                nameInput.closest('.form-group').classList.remove('has-error');
            }

            // Phone (validation for standard BR phone styles)
            const phoneClean = phoneInput.value.replace(/\D/g, '');
            if (phoneClean.length < 10 || phoneClean.length > 11) {
                phoneInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            } else {
                phoneInput.closest('.form-group').classList.remove('has-error');
            }

            // City
            if (cityInput.value.trim().length < 3) {
                cityInput.closest('.form-group').classList.add('has-error');
                isValid = false;
            } else {
                cityInput.closest('.form-group').classList.remove('has-error');
            }

            // Consent check
            if (!consentInput.checked) {
                isValid = false;
            }
        }

        return isValid;
    }

    // Dynamic error clearing
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(ctrl => {
        ctrl.addEventListener('input', () => {
            ctrl.closest('.form-group').classList.remove('has-error');
        });
    });

    // Form Submission / Redirect to WhatsApp API
    wizardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateStep(3)) return;

        // Gather all inputs
        const machineType = document.querySelector('input[name="machineType"]:checked').value;
        const machineModel = document.getElementById('machine-details').value.trim() || 'Não especificado';
        const partsNeeded = document.getElementById('parts-needed').value.trim();
        const clientName = document.getElementById('client-name').value.trim();
        const clientPhone = document.getElementById('client-phone').value.trim();
        const clientCity = document.getElementById('client-city').value.trim();

        // Format the message template
        const whatsAppMessage = 
`*SOLICITAÇÃO DE ORÇAMENTO - CENTERAGRO*
----------------------------------------
🚜 *Equipamento:* ${machineType}
⚙️ *Modelo:* ${machineModel}

📋 *Peças Solicitadas:*
${partsNeeded}

👤 *Dados do Cliente:*
- *Nome:* ${clientName}
- *WhatsApp:* ${clientPhone}
- *Cidade/UF:* ${clientCity}
----------------------------------------
_Enviado via simulador de cotação online._`;

        // Direct WhatsApp number of CenterAgro: 55 55 98452-7182
        const phoneNumber = '5555984527182';
        const encodedMessage = encodeURIComponent(whatsAppMessage);
        const whatsAppUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // Switch to success view and update manual links
        wizardForm.style.display = 'none';
        successState.style.display = 'block';
        manualWhatsappLink.href = whatsAppUrl;

        // Open in new window automatically
        window.open(whatsAppUrl, '_blank');
    });

    // Reset wizard form
    resetWizardBtn.addEventListener('click', () => {
        wizardForm.reset();
        currentStep = 1;
        updateWizard();
        successState.style.display = 'none';
        wizardForm.style.display = 'block';
    });


    // --- 8. Brazilian Phone Mask for Client Input ---
    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
});
