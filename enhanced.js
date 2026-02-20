// ===== ENHANCED INTERACTIVE FEATURES =====

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.querySelector('.scroll-progress');

function updateScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Check for saved theme
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    
    if (theme === 'light') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        root.style.setProperty('--dark-bg', '#f8fafc');
        root.style.setProperty('--light-bg', '#e2e8f0');
        root.style.setProperty('--lighter-bg', '#cbd5e1');
        root.style.setProperty('--text-primary', '#0f172a');
        root.style.setProperty('--text-secondary', '#334155');
        root.style.setProperty('--text-muted', '#64748b');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        root.style.setProperty('--dark-bg', '#0f172a');
        root.style.setProperty('--light-bg', '#1e293b');
        root.style.setProperty('--lighter-bg', '#334155');
        root.style.setProperty('--text-primary', '#f8fafc');
        root.style.setProperty('--text-secondary', '#cbd5e1');
        root.style.setProperty('--text-muted', '#94a3b8');
    }
});

// ===== 3D CARD TILT EFFECT =====
const tiltCards = document.querySelectorAll('.project-card, .cert-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
const magneticButtons = document.querySelectorAll('.btn, .social-link');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// Cursor trail effect removed for cleaner look

// ===== PARALLAX SCROLLING EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero elements
    const heroImage = document.querySelector('.hero-image');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
    
    floatingCards.forEach((card, index) => {
        const speed = 0.1 + (index * 0.05);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== ANIMATED TEXT REVEAL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const textRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            textRevealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .section-tag, p, h3').forEach(el => {
    textRevealObserver.observe(el);
});

// ===== PROFILE PHOTO LOAD WITH EFFECT =====
const profilePhoto = document.getElementById('profilePhoto');
if (profilePhoto) {
    // You can add an actual image here
    profilePhoto.style.opacity = '0';
    setTimeout(() => {
        profilePhoto.style.transition = 'opacity 1s ease';
        profilePhoto.style.opacity = '1';
    }, 500);
}

// ===== SMOOTH SECTION TRANSITIONS =====
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Make first section visible immediately
if (sections[0]) {
    sections[0].style.opacity = '1';
    sections[0].style.transform = 'translateY(0)';
}

// ===== INTERACTIVE SKILL BARS WITH TOOLTIP =====
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const skillPercent = this.querySelector('.skill-percent').textContent;
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = `Proficiency: ${skillPercent}`;
        tooltip.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gradient-primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            white-space: nowrap;
            pointer-events: none;
            animation: fadeInUp 0.3s ease;
        `;
        this.style.position = 'relative';
        this.appendChild(tooltip);
    });
    
    item.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.skill-tooltip');
        if (tooltip) tooltip.remove();
    });
});

// ===== PROJECT CARD HOVER SOUND EFFECT (Optional) =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Add haptic feedback for touch devices
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    });
});

// ===== SCROLL SNAP EFFECT FOR SECTIONS (Optional) =====
let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    
    isScrolling = setTimeout(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Section is in view
                section.style.opacity = '1';
            }
        });
    }, 66);
});

// ===== ENHANCED FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
        
        // Real-time validation
        if (this.value.trim() === '') {
            this.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        } else {
            this.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = 'var(--primary-color)';
        }
    });
});

// ===== LOADING ANIMATION FOR IMAGES =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.animation = 'fadeIn 0.5s ease';
    });
});

// ===== KEYBOARD NAVIGATION ENHANCEMENT =====
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        themeToggle.click();
    }
    
    // Press '↑' to scroll to top
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Press '↓' to scroll to bottom
    if (e.key === 'End') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
    }
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`%c⚡ Portfolio loaded in ${Math.round(loadTime)}ms`, 
                   'color: #6366f1; font-size: 14px; font-weight: bold;');
    });
}

// ===== INTERSECTION OBSERVER FOR LAZY ANIMATIONS =====
const animateOnScrollElements = document.querySelectorAll('.cert-card, .timeline-item');

const lazyAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
            lazyAnimationObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

animateOnScrollElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.95)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    lazyAnimationObserver.observe(el);
});

console.log('%c✨ Enhanced Interactive Features Loaded! ✨', 
           'color: #ec4899; font-size: 16px; font-weight: bold;');
console.log('%c🎨 Keyboard Shortcuts:\n- Press "T" to toggle theme\n- Press "Home" to scroll to top\n- Press "End" to scroll to bottom', 
           'color: #8b5cf6; font-size: 12px;');
