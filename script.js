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

/* ===== Features Carousel ===== */
function initCarousel() {
    const carousel = document.querySelector('.carousel-container');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const carouselElement = document.querySelector('.image-carousel');
    
    if (!carousel || !carouselSlides.length) return;

    let currentIndex = 0;
    let interval;
    const slideInterval = 4000;

    function showSlide(index) {
        // Wrap around if at end
        if (index >= carouselSlides.length) index = 0;
        if (index < 0) index = carouselSlides.length - 1;
        
        carousel.style.transform = `translateX(-${index * 33.333}%)`;
        
        carouselSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function startCarousel() {
        clearInterval(interval);
        interval = setInterval(nextSlide, slideInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startCarousel();
        });
    });

    // Pause on hover
    carouselElement?.addEventListener('mouseenter', () => clearInterval(interval));
    carouselElement?.addEventListener('mouseleave', startCarousel);

    // Initialize
    showSlide(0);
    startCarousel();
}

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

/* ===== Email Validation ===== */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}