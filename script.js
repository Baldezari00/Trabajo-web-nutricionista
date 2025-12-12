// ===================================
// VARIABLES GLOBALES
// ===================================

let currentTheme = 'green';
let currentTestimonial = 0;

// ===================================
// THEME SWITCHER
// ===================================

function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Cargar tema guardado (usando variable en memoria)
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
    }
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            body.setAttribute('data-theme', theme);
            currentTheme = theme;
            
            // Feedback visual
            themeBtns.forEach(b => b.style.borderColor = 'transparent');
            btn.style.borderColor = 'rgba(0,0,0,0.3)';
        });
    });
}

// ===================================
// STICKY HEADER
// ===================================

function initStickyHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// MOBILE MENU
// ===================================

function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Cerrar al hacer click en un link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const elements = document.querySelectorAll(
        '.service-card, .step, .modality-card, .pricing-card, .testimonial-card, .faq-item, .contact-method'
    );
    
    elements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ===================================
// FAQ ACCORDION
// ===================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Cerrar otros items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Testimonios Slider
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonio-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        // Remover clase active de todos
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Asegurar que el índice esté en rango
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;
        else currentSlide = n;
        
        // Agregar clase active al slide y dot actual
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Click en dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            // Reiniciar el intervalo automático
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Auto-slide cada 5 segundos
    slideInterval = setInterval(nextSlide, 5000);

    // Pausar en hover
    const sliderContainer = document.querySelector('.testimonios-slider');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// ===================================
// FORM VALIDATION
// ===================================

function initFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email inválido';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9\s\-\+\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Teléfono inválido';
        }
    }
    
    // Update UI
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    } else {
        field.classList.remove('error');
        removeFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    removeFieldError(field);
    
    const error = document.createElement('span');
    error.classList.add('field-error');
    error.textContent = message;
    error.style.color = 'var(--secondary)';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '0.3rem';
    error.style.display = 'block';
    
    field.parentNode.appendChild(error);
}

function removeFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) error.remove();
}

// ===================================
// EMAILJS INTEGRATION
// ===================================

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showFormMessage('Por favor completá todos los campos correctamente', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        from_name: form.nombre.value,
        reply_to: form.email.value,
        telefono: form.telefono.value,
        edad: form.edad.value || 'No especificada',
        peso_talla: form.peso_talla.value || 'No especificado',
        message: form.motivo.value,
        preferencia: form.preferencia.value,
        fecha: new Date().toLocaleDateString('es-AR')
    };
    
    try {
        // CONFIGURAR EMAILJS AQUÍ
        // Descomenta y configura con tus credenciales:
        /*
        emailjs.init('TU_PUBLIC_KEY');
        const response = await emailjs.send(
            'TU_SERVICE_ID',
            'TU_TEMPLATE_ID',
            formData
        );
        */
        
        // Simulación para demo (ELIMINAR en producción)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        showFormMessage('¡Mensaje enviado! Te contactaré pronto 😊', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Error:', error);
        showFormMessage('Hubo un error. Por favor intenta por WhatsApp.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('form-message', type);
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        padding: 1rem;
        border-radius: 10px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
        animation: fadeIn 0.3s ease;
        background: ${type === 'success' ? 'var(--primary)' : 'var(--secondary)'};
        color: var(--light);
    `;
    
    const form = document.getElementById('contactForm');
    form.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// ===================================
// WHATSAPP FLOAT BUTTON
// ===================================

function createWhatsAppButton() {
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/5491134567890?text=Hola,%20quiero%20consultar%20por%20un%20plan%20nutricional';
    whatsappBtn.target = '_blank';
    whatsappBtn.classList.add('whatsapp-float');
    whatsappBtn.innerHTML = `
        <svg viewBox="0 0 32 32" fill="white" width="28" height="28">
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-5.247 1.408 1.417-5.263-0.321-0.53c-1.294-2.142-1.981-4.599-1.981-7.12 0-7.444 6.056-13.5 13.5-13.5s13.5 6.056 13.5 13.5-6.056 13.5-13.5 13.5zM21.95 18.367c-0.307-0.154-1.822-0.899-2.104-1.002-0.282-0.103-0.487-0.154-0.692 0.154s-0.795 1.002-0.975 1.207c-0.179 0.205-0.359 0.231-0.667 0.077s-1.299-0.479-2.475-1.528c-0.916-0.816-1.534-1.824-1.713-2.132s-0.019-0.473 0.135-0.626c0.139-0.139 0.308-0.359 0.462-0.538s0.205-0.308 0.308-0.513c0.103-0.205 0.051-0.385-0.026-0.538s-0.692-1.667-0.949-2.283c-0.251-0.6-0.506-0.519-0.692-0.529-0.179-0.009-0.385-0.011-0.59-0.011s-0.538 0.077-0.82 0.385c-0.282 0.308-1.076 1.053-1.076 2.567s1.102 2.978 1.256 3.183c0.154 0.205 2.167 3.308 5.251 4.639 0.733 0.317 1.305 0.506 1.751 0.648 0.737 0.234 1.408 0.201 1.939 0.122 0.591-0.089 1.822-0.745 2.079-1.464s0.257-1.336 0.179-1.464c-0.077-0.128-0.282-0.205-0.59-0.359z"/>
        </svg>
        <span class="tooltip">Consultá por WhatsApp</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #25D366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
        }
        
        .whatsapp-float .tooltip {
            position: absolute;
            right: 70px;
            background: var(--text);
            color: var(--light);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .whatsapp-float:hover .tooltip {
            opacity: 1;
        }
        
        @media (max-width: 768px) {
            .whatsapp-float {
                bottom: 20px;
                right: 20px;
                width: 55px;
                height: 55px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(whatsappBtn);
}

// ===================================
// INIT ALL
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFAQ();
    initTestimonialsSlider();
    initFormValidation();
    createWhatsAppButton();
    
    console.log('✅ Nutricionista Website Loaded');
});

// ===================================
// ADICIONAL: EMAILJS SETUP GUIDE
// ===================================

/*
CONFIGURACIÓN DE EMAILJS:

1. Registrate en https://www.emailjs.com/
2. Crea un servicio de email (Gmail, Outlook, etc.)
3. Crea un template con estas variables:
   - {{from_name}}
   - {{reply_to}}
   - {{telefono}}
   - {{edad}}
   - {{peso_talla}}
   - {{message}}
   - {{preferencia}}
   - {{fecha}}

4. Agrega este script en tu HTML (antes de script.js):
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

5. En handleFormSubmit(), descomenta y configura:
   emailjs.init('TU_PUBLIC_KEY');
   emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', formData);

6. Elimina la simulación del setTimeout

TEMPLATE EJEMPLO:
-----------------
Nueva consulta de: {{from_name}}
Email: {{reply_to}}
Teléfono: {{telefono}}
Edad: {{edad}}
Peso/Talla: {{peso_talla}}
Preferencia: {{preferencia}}

Motivo de consulta:
{{message}}

Fecha: {{fecha}}
*/