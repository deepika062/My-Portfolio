// ===== HELPERS =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const toastEl = $('#toast');
let toastTimer;

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        const field = document.createElement('textarea');
        field.value = text;
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        field.remove();
    }
    showToast('Copied to clipboard');
}

// ===== THEME TOGGLE =====
const themeToggle = $('#themeToggle');
const themeColorMeta = $('meta[name="theme-color"]');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeColorMeta.setAttribute('content', isDark ? '#121212' : '#FAF8F5');
}

function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
        localStorage.setItem('theme', next);
    } catch (e) {}
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
themeToggle.addEventListener('click', toggleTheme);

// ===== NAVBAR, SCROLL PROGRESS, BACK TO TOP =====
const navbar = $('#navbar');
const scrollProgress = $('.scroll-progress');
const backToTop = $('#backToTop');

function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    backToTop.classList.toggle('show', window.scrollY > 600);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

// ===== MOBILE MENU =====
const hamburger = $('#hamburger');
const navMenu = $('#navMenu');

function setMenu(open) {
    navMenu.classList.toggle('active', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('active')));
$$('.nav-link').forEach(link => link.addEventListener('click', () => setMenu(false)));

// ===== ACTIVE NAV LINK ON SCROLL =====
const navLinks = $$('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });

$$('main section[id]').forEach(section => sectionObserver.observe(section));

// ===== SCROLL REVEAL (staggered within each group) =====
const revealElements = $$('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
} else {
    revealElements.forEach(el => {
        const siblings = [...el.parentElement.children].filter(child => child.classList.contains('reveal'));
        el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 6) * 70}ms`);
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ===== CARD SPOTLIGHT (glow follows the pointer) =====
$$('.spotlight').forEach(card => {
    card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});

// ===== TYPING EFFECT =====
const typingTexts = ['MERN Full Stack Developer', 'React.js & TypeScript', 'Node.js & Real-time Systems', 'Azure & AWS Cloud'];
const typingElement = $('.typing-text');

if (typingElement && !prefersReducedMotion) {
    let textIndex = 0;
    let charIndex = typingTexts[0].length;
    let isDeleting = false;

    function type() {
        const currentText = typingTexts[textIndex];
        charIndex += isDeleting ? -1 : 1;
        typingElement.textContent = currentText.substring(0, charIndex);

        let delay = isDeleting ? 40 : 85;

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            delay = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            delay = 350;
        }

        setTimeout(type, delay);
    }

    // Show the first title fully, then start cycling
    isDeleting = true;
    setTimeout(type, 2500);
}

// ===== ANIMATED COUNTERS =====
function animateCounter(element) {
    const dataCount = element.getAttribute('data-count');
    const targetValue = parseFloat(dataCount);
    const decimals = dataCount.includes('.') ? dataCount.split('.')[1].length : 0;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = (targetValue * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

if (!prefersReducedMotion) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    $$('.stat-value').forEach(stat => statObserver.observe(stat));
}

// ===== SKILL FILTERS =====
const filterButtons = $$('.filter-btn');
const skillTiles = $$('.skill-tile');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            const isActive = btn === button;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        skillTiles.forEach(tile => {
            const show = filter === 'all' || tile.dataset.cat === filter;
            tile.classList.toggle('is-hidden', !show);
            tile.classList.remove('is-entering');
            if (show) {
                void tile.offsetWidth; // restart the entry animation
                tile.classList.add('is-entering');
            }
        });
    });
});

// ===== PROJECT DETAILS MODAL =====
const projectModal = $('#projectModal');
const projectModalBody = $('#projectModalBody');
let lastFocused = null;

function openProject(card) {
    const template = $('.project-details', card);
    if (!template) return;
    lastFocused = card;
    projectModalBody.replaceChildren(template.content.cloneNode(true));
    projectModal.showModal();
    document.body.classList.add('modal-open');
}

$$('.project-card').forEach(card => {
    card.addEventListener('click', () => openProject(card));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProject(card);
        }
    });
});

// Certificates open in the same dialog as an image
$$('[data-cert]').forEach(button => {
    button.addEventListener('click', () => {
        lastFocused = button;
        const title = document.createElement('h3');
        title.textContent = button.dataset.certTitle;
        const link = document.createElement('a');
        link.href = button.dataset.cert;
        link.target = '_blank';
        link.rel = 'noopener';
        const img = document.createElement('img');
        img.src = button.dataset.cert;
        img.alt = button.dataset.certTitle;
        img.className = 'cert-image';
        link.appendChild(img);
        projectModalBody.replaceChildren(title, link);
        projectModal.showModal();
        document.body.classList.add('modal-open');
    });
});

$('.modal-close', projectModal).addEventListener('click', () => projectModal.close());

// Close when clicking the backdrop
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.close();
});

projectModal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
});

// ===== COPY BUTTONS =====
$$('[data-copy]').forEach(button => {
    button.addEventListener('click', () => copyText(button.dataset.copy));
});

// ===== CONTACT FORM =====
const contactForm = $('#contactForm');
const formStatus = $('.form-status', contactForm);
const CONTACT_EMAIL = 'deepikarawal1435@gmail.com';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = $$('input, textarea', contactForm);
    let valid = true;
    fields.forEach(field => {
        const ok = field.checkValidity() && field.value.trim() !== '';
        field.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
    });

    if (!valid) {
        formStatus.textContent = 'Please fill in all fields with a valid email.';
        return;
    }

    const data = Object.fromEntries(new FormData(contactForm));
    const formspreeId = contactForm.dataset.formspreeId;

    // No form service configured: hand the message to the visitor's email app
    if (!formspreeId) {
        const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        formStatus.textContent = 'Opening your email app…';
        return;
    }

    const submitButton = $('button[type="submit"]', contactForm);
    submitButton.disabled = true;
    formStatus.textContent = 'Sending…';

    try {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Request failed');
        contactForm.reset();
        formStatus.textContent = 'Thanks! Your message has been sent.';
        showToast('Message sent');
    } catch (err) {
        formStatus.textContent = `Couldn't send right now. Please email ${CONTACT_EMAIL}.`;
    } finally {
        submitButton.disabled = false;
    }
});

contactForm.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));

// ===== COMMAND PALETTE (Ctrl/Cmd + K) =====
const palette = $('#palette');
const paletteInput = $('#paletteInput');
const paletteList = $('#paletteList');

const goTo = (id) => () => document.getElementById(id).scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });

const commands = [
    { label: 'Home', icon: 'fas fa-house', group: 'Go to', run: goTo('home') },
    { label: 'About', icon: 'fas fa-user', group: 'Go to', run: goTo('about') },
    { label: 'Skills', icon: 'fas fa-code', group: 'Go to', run: goTo('skills') },
    { label: 'Projects', icon: 'fas fa-folder-open', group: 'Go to', run: goTo('projects') },
    { label: 'Experience', icon: 'fas fa-briefcase', group: 'Go to', run: goTo('experience') },
    { label: 'Education', icon: 'fas fa-graduation-cap', group: 'Go to', run: goTo('education') },
    { label: 'Contact', icon: 'fas fa-envelope', group: 'Go to', run: goTo('contact') },
    { label: 'Copy email address', icon: 'far fa-copy', group: 'Action', run: () => copyText(CONTACT_EMAIL) },
    {
        label: 'Download resume', icon: 'fas fa-download', group: 'Action', run: () => {
            const link = document.createElement('a');
            link.href = 'assets/Deepika_Resume.pdf';
            link.download = '';
            link.click();
        }
    },
    { label: 'Toggle light / dark theme', icon: 'fas fa-circle-half-stroke', group: 'Action', run: toggleTheme },
    { label: 'Open GitHub', icon: 'fab fa-github', group: 'Link', run: () => window.open('https://github.com/deepika062', '_blank', 'noopener') },
    { label: 'Open LinkedIn', icon: 'fab fa-linkedin-in', group: 'Link', run: () => window.open('https://linkedin.com/in/deepika1107', '_blank', 'noopener') },
    { label: 'Chat on WhatsApp', icon: 'fab fa-whatsapp', group: 'Link', run: () => window.open('https://wa.me/918708794625', '_blank', 'noopener') }
];

let visibleCommands = commands;
let selectedIndex = 0;

function renderPalette() {
    const query = paletteInput.value.trim().toLowerCase();
    visibleCommands = commands.filter(cmd => cmd.label.toLowerCase().includes(query) || cmd.group.toLowerCase().includes(query));
    selectedIndex = Math.min(selectedIndex, Math.max(visibleCommands.length - 1, 0));

    if (!visibleCommands.length) {
        paletteList.innerHTML = '<li class="palette-empty">No results</li>';
        return;
    }

    paletteList.innerHTML = visibleCommands.map((cmd, i) => `
        <li class="palette-item${i === selectedIndex ? ' is-selected' : ''}" role="option" aria-selected="${i === selectedIndex}" data-index="${i}">
            <i class="${cmd.icon}"></i>
            <span>${cmd.label}</span>
            <span class="palette-group">${cmd.group}</span>
        </li>`).join('');

    const selected = $('.is-selected', paletteList);
    if (selected) selected.scrollIntoView({ block: 'nearest' });
}

function openPalette() {
    if (palette.open) return;
    paletteInput.value = '';
    selectedIndex = 0;
    renderPalette();
    palette.showModal();
    paletteInput.focus();
}

function runCommand(index) {
    const cmd = visibleCommands[index];
    if (!cmd) return;
    palette.close();
    cmd.run();
}

$('#paletteOpen').addEventListener('click', openPalette);

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        palette.open ? palette.close() : openPalette();
    }
});

paletteInput.addEventListener('input', () => {
    selectedIndex = 0;
    renderPalette();
});

paletteInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % Math.max(visibleCommands.length, 1);
        renderPalette();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + visibleCommands.length) % Math.max(visibleCommands.length, 1);
        renderPalette();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        runCommand(selectedIndex);
    }
});

paletteList.addEventListener('click', (e) => {
    const item = e.target.closest('.palette-item');
    if (item) runCommand(Number(item.dataset.index));
});

palette.addEventListener('click', (e) => {
    if (e.target === palette) palette.close();
});
