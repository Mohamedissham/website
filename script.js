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
document.addEventListener('DOMContentLoaded', function() {
    // Main carousel elements
    const carousel = document.querySelector('.image-carousel');
    const container = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const images = document.querySelectorAll('.carousel-image');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    
    // Modal elements
    const modal = document.querySelector('.image-modal');
    const modalCarousel = document.querySelector('.modal-carousel');
    const modalSlides = document.querySelectorAll('.modal-slide');
    const modalImages = document.querySelectorAll('.modal-image');
    const closeModal = document.querySelector('.close-modal');
    
    let currentIndex = 0;
    let startX, currentX;
    let isDragging = false;
    let isClick = true;

    // Initialize modal images with same sources as carousel
    images.forEach((img, index) => {
        modalImages[index].src = img.src;
    });

    // ===== MAIN CAROUSEL FUNCTIONALITY =====
    // Arrow navigation
    leftArrow.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    rightArrow.addEventListener('click', function() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Touch events for mobile swipe
    carousel.addEventListener('touchstart', handleCarouselTouchStart, { passive: false });
    carousel.addEventListener('touchmove', handleCarouselTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleCarouselTouchEnd);

    // Mouse events for desktop
    carousel.addEventListener('mousedown', handleCarouselMouseDown);
    document.addEventListener('mousemove', handleCarouselMouseMove);
    document.addEventListener('mouseup', handleCarouselMouseEnd);

    // Click to open modal
    images.forEach((img, index) => {
        img.addEventListener('click', function() {
            if (isClick) {
                currentIndex = index;
                openModal(currentIndex);
            }
        });
    });

    // ===== MODAL FULLSCREEN FUNCTIONALITY =====
    // Close modal
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // Modal swipe handling
    modal.addEventListener('touchstart', handleModalTouchStart, { passive: false });
    modal.addEventListener('touchmove', handleModalTouchMove, { passive: false });
    modal.addEventListener('touchend', handleModalTouchEnd);

    // ===== FUNCTIONS =====
    function openModal(index) {
        currentIndex = index;
        modalCarousel.style.transform = `translateX(-${index * 100}%)`;
        modal.style.display = "block";
        document.body.style.overflow = 'hidden';
    }

    function closeModalHandler() {
        modal.style.display = "none";
        document.body.style.overflow = '';
    }

    function updateCarousel() {
        container.style.transform = `translateX(-${currentIndex * 33.333}%)`;
    }

    // Carousel touch handlers
    function handleCarouselTouchStart(e) {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = false;
        isClick = true;
        e.preventDefault();
    }

    function handleCarouselTouchMove(e) {
        currentX = e.touches[0].clientX;
        if (Math.abs(currentX - startX) > 10) {
            isDragging = true;
            isClick = false;
        }
        e.preventDefault();
    }

    function handleCarouselTouchEnd() {
        if (isDragging) {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < slides.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateCarousel();
            }
        }
        isDragging = false;
    }

    // Carousel mouse handlers
    function handleCarouselMouseDown(e) {
        startX = e.clientX;
        currentX = startX;
        isDragging = false;
        isClick = true;
    }

    function handleCarouselMouseMove(e) {
        if (startX !== null) {
            currentX = e.clientX;
            if (Math.abs(currentX - startX) > 10) {
                isDragging = true;
                isClick = false;
            }
        }
    }

    function handleCarouselMouseEnd() {
        if (isDragging) {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < slides.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateCarousel();
            }
        }
        isDragging = false;
        startX = null;
    }

    // Modal touch handlers
    function handleModalTouchStart(e) {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = false;
        e.preventDefault();
    }

    function handleModalTouchMove(e) {
        if (!isDragging && Math.abs(e.touches[0].clientX - startX) > 10) {
            isDragging = true;
        }
        
        if (isDragging) {
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const offset = -currentIndex * 100 + (diff / window.innerWidth * 100);
            modalCarousel.style.transform = `translateX(${offset}%)`;
            e.preventDefault();
        }
    }

    function handleModalTouchEnd() {
        if (isDragging) {
            const diff = currentX - startX;
            const threshold = window.innerWidth * 0.15;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (diff < 0 && currentIndex < modalSlides.length - 1) {
                    currentIndex++;
                }
            }
            
            modalCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        isDragging = false;
    }
});
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