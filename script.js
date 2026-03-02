// ══════════════════════════════════
// Creative Navigation — Sliding Indicator, Overlay Menu, Scroll Progress
// ══════════════════════════════════

const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const navLinks = document.getElementById('navLinks');

// Toggle full-screen overlay menu
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
});

// Close overlay when clicking a link
if (mobileOverlay) {
    mobileOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ── Sliding Nav Indicator ──
function moveIndicator() {
    const indicator = document.getElementById('navIndicator');
    const activeLink = document.querySelector('.nav-links .nav-link.active');
    if (!indicator || !activeLink) return;

    const li = activeLink.parentElement;
    const navRect = navLinks.getBoundingClientRect();
    const liRect = li.getBoundingClientRect();

    indicator.style.left = (liRect.left - navRect.left) + 'px';
    indicator.style.width = liRect.width + 'px';
}

// Run on load and resize
window.addEventListener('load', moveIndicator);
window.addEventListener('resize', moveIndicator);

// Active navigation link with sliding indicator
const sections = document.querySelectorAll('section');
const navLinksItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    let changed = false;
    navLinksItems.forEach(link => {
        const wasActive = link.classList.contains('active');
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            if (!wasActive) changed = true;
        }
    });
    if (changed) moveIndicator();
});

// ── Scroll Progress Bar ──
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 120; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Portfolio filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filterValue) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
    
    // GitHub and live site links
    document.querySelectorAll('.live-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const portfolioItem = btn.closest('.portfolio-item');
            const githubRepo = portfolioItem.getAttribute('data-github');
            const liveUrl = `https://MathekoTauu.github.io/${githubRepo}`;
            window.open(liveUrl, '_blank');
        });
    });
});

// Contact form submission with Formspree
const contactForm = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        // Show loading state
        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.textContent = 'Thank you! Your message has been sent. I\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
                this.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error
            formStatus.textContent = 'Something went wrong. Please try again or email me directly at mathekomasemola8@gmail.com';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
        } finally {
            // Reset button
            btnText.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations (skip hero — it has its own animations)
document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Hero stat counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.proof-number[data-target]');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1600;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}

// Trigger counters when proof bar is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

const heroProof = document.querySelector('.hero-proof');
if (heroProof) heroObserver.observe(heroProof);