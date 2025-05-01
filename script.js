/* ===== DOM Ready ===== */
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initCounters();
    initSlideshow();
    initCarousel();
    initPreloader();
    initScrollAnimations();
});

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');
    
    if (!mobileMenu || !navbar) return;

    // Toggle menu
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
}

/* ===== Smooth Scrolling ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ===== Back to Top Button ===== */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });
}

/* ===== Counter Animation ===== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(counter) {
    const target = parseFloat(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    let count = parseFloat(counter.innerText);
    const isDecimal = target % 1 !== 0;
    const inc = (target - count) / 200; // Speed

    const update = () => {
        count += inc;
        if ((inc > 0 && count < target) || (inc < 0 && count > target)) {
            counter.innerText = isDecimal ? count.toFixed(1) : Math.floor(count);
            setTimeout(update, 10);
        } else {
            counter.innerText = isDecimal ? target.toFixed(1) : target;
            if (suffix) counter.innerText += suffix;
        }
    };

    update();
}

/* ===== Hero Slideshow ===== */
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    let currentSlide = 0;
    slides[0].classList.add('active');

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}
function initCarousel() {
    const carousel = document.querySelector('.image-carousel');
    const container = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    let currentIndex = 0;
    let startX, currentX;
    let isDragging = false;
    let intervalId;
    const slideInterval = 5000; // 5 seconds

    // Initialize carousel
    function init() {
        updateSlidePosition();
        startAutoSlide();
        
        // Arrow navigation
        leftArrow.addEventListener('click', prevSlide);
        rightArrow.addEventListener('click', nextSlide);
        
        // Touch events for mobile swipe
        carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
        carousel.addEventListener('touchend', handleTouchEnd);
        
        // Mouse events for desktop
        carousel.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseEnd);
        
        // Pause on hover
        carousel.addEventListener('mouseenter', pauseAutoSlide);
        carousel.addEventListener('mouseleave', resumeAutoSlide);
    }

    // Update slide position
    function updateSlidePosition() {
        container.style.transform = `translateX(-${currentIndex * 33.333}%)`;
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
    }

    // Navigation functions
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlidePosition();
        resetAutoSlide();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlidePosition();
        resetAutoSlide();
    }

    // Auto-slide functionality
    function startAutoSlide() {
        intervalId = setInterval(nextSlide, slideInterval);
    }

    function pauseAutoSlide() {
        clearInterval(intervalId);
    }

    function resumeAutoSlide() {
        startAutoSlide();
    }

    function resetAutoSlide() {
        clearInterval(intervalId);
        startAutoSlide();
    }

    // Touch handlers
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = false;
        e.preventDefault();
    }

    function handleTouchMove(e) {
        currentX = e.touches[0].clientX;
        if (Math.abs(currentX - startX) > 10) {
            isDragging = true;
        }
        e.preventDefault();
    }

    function handleTouchEnd() {
        if (isDragging) {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        isDragging = false;
    }

    // Mouse handlers
    function handleMouseDown(e) {
        startX = e.clientX;
        currentX = startX;
        isDragging = false;
    }

    function handleMouseMove(e) {
        if (startX !== null) {
            currentX = e.clientX;
            if (Math.abs(currentX - startX) > 10) {
                isDragging = true;
            }
        }
    }

    function handleMouseEnd() {
        if (isDragging) {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        isDragging = false;
        startX = null;
    }

    // Initialize
    init();
}

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});

/* ===== Preloader ===== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
}

/* ===== Scroll Animations ===== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}