/**
 * CenterAgro Landing Page - Core JavaScript
 * Handles: Mobile Menu, Sticky Header, Scroll Reveal, WhatsApp Redirect, Interactive Wizard, Category Routing
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sticky Header & Back to Top Scroll Actions
     ========================================================================== */
  const header = document.getElementById('header');
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    // Header transition on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to Top visibility
    if (window.scrollY > 600) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.transform = 'translateY(0)';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.transform = 'translateY(10px)';
    }
  });

  // Scroll to Top Action
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. Mobile Hamburger Menu Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');

        // Update active class immediately on click
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  /* ==========================================================================
     3. Active Navigation Link on Scroll (Spy Link)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let scrollPosition = window.scrollY + 160; // Offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (correspondingLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  });

  /* ==========================================================================
     4. Scroll Reveal Animations (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Stop tracking once visible
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of element is in view
    rootMargin: '0px 0px -50px 0px' // Slightly offset bottom threshold
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     5. Interactive Budget Wizard Simulator
     ========================================================================== */
  const wizardForm = document.getElementById('wizard-form');
  const steps = document.querySelectorAll('.wizard-step-content');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLine = document.getElementById('progress-line');
  
  const categoryInputs = document.querySelectorAll('input[name="wizard_category"]');
  const brandInputs = document.querySelectorAll('input[name="wizard_brand"]');
  
  let currentStep = 1;

  // Next / Prev button event listeners
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');

  // Input listeners to activate "Next" button in step 1 & 2
  categoryInputs.forEach(input => {
    input.addEventListener('change', () => {
      const step1NextBtn = steps[0].querySelector('.btn-next');
      if (step1NextBtn) step1NextBtn.removeAttribute('disabled');
      
      // Live update summary
      const summaryCat = document.getElementById('summary-cat');
      if (summaryCat) summaryCat.textContent = input.value;
    });
  });

  brandInputs.forEach(input => {
    input.addEventListener('change', () => {
      const step2NextBtn = steps[1].querySelector('.btn-next');
      if (step2NextBtn) step2NextBtn.removeAttribute('disabled');
      
      // Live update summary
      const summaryBrand = document.getElementById('summary-brand');
      if (summaryBrand) summaryBrand.textContent = input.value;
    });
  });

  // Handle Forward Navigation
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < 3) {
        // Mark current step as complete
        const currentProgressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        if (currentProgressStep) {
          currentProgressStep.classList.remove('active');
          currentProgressStep.classList.add('complete');
        }

        // Hide current step, show next
        steps[currentStep - 1].classList.remove('active');
        currentStep++;
        steps[currentStep - 1].classList.add('active');

        // Set next step as active
        const nextProgressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        if (nextProgressStep) {
          nextProgressStep.classList.add('active');
        }

        // Update progress bar connecting line
        updateProgressLine();
      }
    });
  });

  // Handle Backward Navigation
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        // Revert active step state
        const currentProgressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        if (currentProgressStep) {
          currentProgressStep.classList.remove('active');
        }

        // Hide current step, show previous
        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        steps[currentStep - 1].classList.add('active');

        // Set previous step active and remove complete
        const prevProgressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        if (prevProgressStep) {
          prevProgressStep.classList.remove('complete');
          prevProgressStep.classList.add('active');
        }

        // Update progress bar connecting line
        updateProgressLine();
      }
    });
  });

  // Helper to adjust the background progress bar width
  function updateProgressLine() {
    if (!progressLine) return;
    
    let widthPercent = 0;
    if (currentStep === 2) widthPercent = 50;
    if (currentStep === 3) widthPercent = 100;
    
    // Smooth transition
    progressLine.style.background = `linear-gradient(to right, var(--primary-glow) ${widthPercent}%, rgba(15, 92, 46, 0.1) ${widthPercent}%)`;
  }

  // Handle Form Submission (WhatsApp Integration)
  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve all values
      const selectedCategory = document.querySelector('input[name="wizard_category"]:checked')?.value || 'Não informado';
      const selectedBrand = document.querySelector('input[name="wizard_brand"]:checked')?.value || 'Não informado';
      const partDescription = document.getElementById('wizard_part_desc')?.value || '';
      const clientName = document.getElementById('wizard_client_name')?.value || '';
      const clientCity = document.getElementById('wizard_client_city')?.value || '';

      // Validate inputs are filled
      if (!partDescription || !clientName || !clientCity) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Format professional WhatsApp text
      const phone = "5555984527182"; // WhatsApp da CenterAgro
      const message = `Olá *CenterAgro*! Gostaria de realizar um orçamento pelo site.

📋 *DADOS DO ORÇAMENTO*
• *Categoria:* ${selectedCategory}
• *Marca:* ${selectedBrand}
• *Peça desejada:* ${partDescription}

👤 *CONTATO DO CLIENTE*
• *Nome:* ${clientName}
• *Cidade/Estado:* ${clientCity}

*(Enviado via Assistente Inteligente da Landing Page)*`;

      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

      // Open in a new tab
      window.open(whatsappUrl, '_blank');
    });
  }

  /* ==========================================================================
     6. Category Quick Links directly into the Simulator
     ========================================================================== */
  const categoryLinks = document.querySelectorAll('[data-cat-select]');

  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const selectedCategoryValue = link.getAttribute('data-cat-select');
      
      // Find the corresponding radio input in Wizard Step 1
      const radioInput = document.querySelector(`input[name="wizard_category"][value="${selectedCategoryValue}"]`);
      if (radioInput) {
        // Select the radio button programmatically
        radioInput.checked = true;
        
        // Trigger the input change event to update validation state and next button
        const changeEvent = new Event('change');
        radioInput.dispatchEvent(changeEvent);
        
        // Reset the wizard to Step 1 so they can proceed cleanly
        resetWizardToStep1();

        // Smooth scroll to the wizard section
        const wizardSection = document.getElementById('orcamento');
        if (wizardSection) {
          const headerHeight = header.offsetHeight || 80;
          const sectionOffsetTop = wizardSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: sectionOffsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Reverts the wizard back to step 1, preserving user inputs
  function resetWizardToStep1() {
    currentStep = 1;
    
    // Hide all steps, make step 1 active
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Reset progress step classes
    progressSteps.forEach((step, index) => {
      step.classList.remove('complete');
      if (index === 0) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Reset progress bar line
    updateProgressLine();
  }

});
