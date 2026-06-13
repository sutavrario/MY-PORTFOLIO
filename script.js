/* ============================================================
   SUTAVRA MITRA — PORTFOLIO INTERACTIVE EFFECTS
   Multilingual name animation, cursor glow, particles,
   scroll reveals, magnetic hover, and smooth navigation
   ============================================================ */

(function () {
    'use strict';

    // ─── Configuration ────────────────────────────────────────
    const CONFIG = {
        particles: {
            count: 100,
            maxSize: 2.5,
            minSize: 0.5,
            speed: 0.25,
            connectionDistance: 130,
            cursorRepelRadius: 180,
            cursorRepelForce: 0.1,
            colors: ['rgba(139,0,0,', 'rgba(220,20,60,', 'rgba(255,65,54,']
        },
        nameAnimation: {
            interval: 3000,
            scrambleSpeed: 40,
            scrambleIterations: 12
        }
    };

    // ─── Multilingual Name Data ──────────────────────────────
    const NAME_TRANSLATIONS = [
        { text: 'Sutavra Mitra', lang: 'English', font: "'Space Mono', monospace" },
        { text: 'সুতাভ্র মিত্র', lang: 'Bengali', font: "'Noto Sans Bengali', sans-serif" },
        { text: 'सुताभ्र मित्र', lang: 'Hindi', font: "'Noto Sans Devanagari', sans-serif" },
    ];

    const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>';

    // ─── State ─────────────────────────────────────────────────
    let mouse = { x: -1000, y: -1000 };
    let currentLangIndex = 0;
    let isScrambling = false;

    // ─── DOM Elements ──────────────────────────────────────────
    const cursorGlow = document.getElementById('cursor-glow');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    const heroName = document.getElementById('hero-name');
    const langLabel = document.getElementById('language-label');
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelector('.nav-links');

    // ─── Cursor Glow ──────────────────────────────────────────
    function initCursorGlow() {
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        // Click shockwave
        document.addEventListener('click', (e) => {
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 0; height: 0;
                border: 2px solid rgba(220,20,60,0.6);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 9998;
                box-shadow: 0 0 15px rgba(220,20,60,0.3);
            `;
            document.body.appendChild(ring);
            ring.animate([
                { width: '0px', height: '0px', opacity: 1 },
                { width: '200px', height: '200px', opacity: 0 }
            ], { duration: 500, easing: 'ease-out' });
            setTimeout(() => ring.remove(), 500);
        });

        document.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });
    }

    // ─── Particle System ──────────────────────────────────────
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize;
            this.speedX = (Math.random() - 0.5) * CONFIG.particles.speed;
            this.speedY = (Math.random() - 0.5) * CONFIG.particles.speed;
            this.colorIndex = Math.floor(Math.random() * CONFIG.particles.colors.length);
            this.alpha = Math.random() * 0.5 + 0.1;
            this.baseAlpha = this.alpha;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update(time) {
            // Drift motion
            this.x += this.speedX;
            this.y += this.speedY;

            // Pulse alpha
            this.alpha = this.baseAlpha + Math.sin(time * 0.001 + this.pulseOffset) * 0.1;

            // Cursor repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - (mouse.y + window.scrollY);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.particles.cursorRepelRadius && dist > 0) {
                const force = (CONFIG.particles.cursorRepelRadius - dist) / CONFIG.particles.cursorRepelRadius;
                this.x += (dx / dist) * force * CONFIG.particles.cursorRepelForce * 10;
                this.y += (dy / dist) * force * CONFIG.particles.cursorRepelForce * 10;
                this.alpha = Math.min(1, this.baseAlpha + force * 0.5);
            }

            // Wrap around screen
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            const color = CONFIG.particles.colors[this.colorIndex];
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = color + this.alpha + ')';
            ctx.fill();

            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = color + (this.alpha * 0.15) + ')';
            ctx.fill();
        }
    }

    function initParticles() {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < CONFIG.particles.count; i++) {
            particles.push(new Particle());
        }
        window.addEventListener('resize', () => {
            resizeCanvas();
        });
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.particles.connectionDistance) {
                    const alpha = (1 - dist / CONFIG.particles.connectionDistance) * 0.06;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(220, 20, 60, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update(time);
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    // ─── Multilingual Name Scramble Animation ─────────────────
    function scrambleText(targetText, targetFont, callback) {
        if (isScrambling) return;
        isScrambling = true;

        const originalText = heroName.textContent;
        const maxLen = Math.max(originalText.length, targetText.length);
        let iteration = 0;

        const interval = setInterval(() => {
            let display = '';
            for (let i = 0; i < maxLen; i++) {
                if (i < targetText.length) {
                    if (iteration >= CONFIG.nameAnimation.scrambleIterations - (maxLen - i)) {
                        display += targetText[i];
                    } else if (targetText[i] === ' ') {
                        display += ' ';
                    } else {
                        display += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                    }
                }
            }

            heroName.textContent = display;
            iteration++;

            if (iteration > CONFIG.nameAnimation.scrambleIterations + maxLen) {
                clearInterval(interval);
                heroName.textContent = targetText;
                heroName.style.fontFamily = targetFont;
                isScrambling = false;
                if (callback) callback();
            }
        }, CONFIG.nameAnimation.scrambleSpeed);
    }

    function cycleLanguage() {
        currentLangIndex = (currentLangIndex + 1) % NAME_TRANSLATIONS.length;
        const next = NAME_TRANSLATIONS[currentLangIndex];

        // Fade out label
        langLabel.style.opacity = '0';

        scrambleText(next.text, next.font, () => {
            langLabel.textContent = next.lang;
            langLabel.style.opacity = '1';
        });
    }

    function initNameAnimation() {
        // Set initial
        heroName.textContent = NAME_TRANSLATIONS[0].text;
        heroName.style.fontFamily = NAME_TRANSLATIONS[0].font;
        langLabel.textContent = NAME_TRANSLATIONS[0].lang;

        // Start cycling
        setInterval(cycleLanguage, CONFIG.nameAnimation.interval);
    }

    // ─── Scroll Reveal ────────────────────────────────────────
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate skill bars when visible
                    const skillFills = entry.target.querySelectorAll('.skill-fill');
                    skillFills.forEach(fill => {
                        const width = fill.dataset.width;
                        fill.style.width = width + '%';
                    });

                    // Animate stat numbers
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(num => {
                        animateNumber(num);
                    });
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal-item').forEach(el => {
            observer.observe(el);
        });
    }

    function animateNumber(element) {
        const target = parseInt(element.dataset.target);
        if (!target || element.dataset.animated) return;
        element.dataset.animated = 'true';

        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    }

    // ─── Navigation ───────────────────────────────────────────
    function initNavigation() {
        // Scroll detection for nav background
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Mobile hamburger
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
    }

    // ─── Magnetic Hover Effect ────────────────────────────────
    function initMagneticHover() {
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ─── Contact Form ─────────────────────────────────────────
    function initContactForm() {
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit span');

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            btn.textContent = 'Sending...';

            try {
                const response = await fetch("https://formsubmit.co/ajax/mitrasutavra65@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Portfolio Message from ${name}`
                    })
                });

                if (response.ok) {
                    btn.textContent = 'Sent! ✓';
                    form.reset();
                } else {
                    btn.textContent = 'Error! ✗';
                }
            } catch (error) {
                btn.textContent = 'Error! ✗';
            }

            setTimeout(() => {
                btn.textContent = 'Send Message';
            }, 3000);
        });
    }

    // ─── Page Transition Overlay ──────────────────────────────
    function initPageLoad() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.6s ease';
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }

    // ─── Parallax on Scroll + Image Dissolve ────────────────
    function initParallaxScroll() {
        const heroContent = document.querySelector('.hero-content');
        const heroSection = document.querySelector('.hero-section');
        const heroGlow = document.querySelector('.hero-glow');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            if (heroContent && scrollY < vh) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / (vh * 0.7));
            }

            // Dissolve the background image as user scrolls
            if (heroSection) {
                const fadeStart = vh * 0.15;
                const fadeEnd = vh * 0.65;
                let imgOpacity = 1;

                if (scrollY > fadeStart) {
                    imgOpacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
                }

                heroSection.style.setProperty('--hero-img-opacity', imgOpacity);

                // Apply to the ::after pseudo-element via a CSS variable
                // We use a direct style on a real element instead
                const afterEl = heroSection;
                afterEl.style.cssText = `--hero-img-opacity: ${imgOpacity}`;
            }

            // Intensify red glow as image fades
            if (heroGlow) {
                const glowStart = vh * 0.2;
                const glowEnd = vh * 0.6;
                let glowOpacity = 0;

                if (scrollY > glowStart) {
                    glowOpacity = Math.min(1, (scrollY - glowStart) / (glowEnd - glowStart));
                }

                heroGlow.style.opacity = glowOpacity;
            }
        });
    }

    // ─── Initialize Everything ────────────────────────────────
    function init() {
        initPageLoad();
        initCursorGlow();
        initParticles();
        requestAnimationFrame(animateParticles);
        initNameAnimation();
        initScrollReveal();
        initNavigation();
        initMagneticHover();
        initContactForm();
        initParallaxScroll();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
