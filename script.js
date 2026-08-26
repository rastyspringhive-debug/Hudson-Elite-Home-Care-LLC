document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Header
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuToggle && mobileMenuClose && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ----------------------------------------------------
// TESTIMONIALS SLIDER
// ----------------------------------------------------
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');
const avatars = document.querySelectorAll('.testimonial-avatar');

function updateTestimonialDOM() {
    if (!testimonials.length || !avatars.length) return;
    
    // Hide all items and remove active class from avatars
    testimonials.forEach(t => t.classList.remove('active'));
    avatars.forEach(a => a.classList.remove('active'));
    
    // Show current item and activate corresponding avatar
    testimonials[currentTestimonial].classList.add('active');
    avatars[currentTestimonial].classList.add('active');
}

function setTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialDOM();
}

function changeTestimonial(direction) {
    currentTestimonial += direction;
    
    // Wrap around
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    updateTestimonialDOM();
}

// ----------------------------------------------------
// HERO SLIDER
// ----------------------------------------------------
const heroSection = document.querySelector('.hero-cover-section');
const heroPrev = document.querySelector('.hero-slider-prev');
const heroNext = document.querySelector('.hero-slider-next');

if (heroSection && heroPrev && heroNext) {
    const heroImages = [
        'images/companion-care-cards.jpg',
        'images/ig1.jpg',
        'images/ig2.jpg',
        'images/ig3.jpg'
    ];
    let currentHeroSlide = 0;

    function updateHeroSlide() {
        heroSection.style.backgroundImage = `url('${heroImages[currentHeroSlide]}')`;
    }

    heroPrev.addEventListener('click', () => {
        currentHeroSlide = (currentHeroSlide - 1 + heroImages.length) % heroImages.length;
        updateHeroSlide();
    });

    heroNext.addEventListener('click', () => {
        currentHeroSlide = (currentHeroSlide + 1) % heroImages.length;
        updateHeroSlide();
    });
}
// ========================================
// SERVICES CAROUSEL (TRANSLATEX)
// ========================================
    const carousel = document.getElementById('servicesCarousel');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (carousel && prevBtn && nextBtn) {
        const cards = carousel.querySelectorAll('.service-card-curvy');
        const totalCards = cards.length;
        let currentIndex = 0;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let isDragging = false;
        
        function getCardsVisible() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function updateArrowStates() {
            // Arrows are always active in loop mode
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
            prevBtn.style.pointerEvents = 'auto';

            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.pointerEvents = 'auto';
        }

        function slideToCurrentIndex() {
            const cardsVisible = getCardsVisible();
            const maxIndex = Math.max(0, totalCards - cardsVisible);
            
            // Loop index
            if (currentIndex < 0) currentIndex = maxIndex;
            if (currentIndex > maxIndex) currentIndex = 0;
            
            const cardWidth = cards[0].offsetWidth;
            const gap = 20;
            const moveAmount = (cardWidth + gap) * currentIndex;
            
            carousel.style.transform = `translateX(-${moveAmount}px)`;
            prevTranslate = -moveAmount;
            
            updateArrowStates();
        }

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            slideToCurrentIndex();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            slideToCurrentIndex();
        });

        window.addEventListener('resize', () => {
            // Recalculate on resize
            carousel.style.transition = 'none';
            slideToCurrentIndex();
            // Restore transition
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease';
            }, 50);
        });
        
        // Touch events for swiping
        carousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            carousel.style.transition = 'none';
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            currentTranslate = prevTranslate + diff;
            carousel.style.transform = `translateX(${currentTranslate}px)`;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            isDragging = false;
            carousel.style.transition = 'transform 0.5s ease';
            const movedBy = currentTranslate - prevTranslate;
            
            // If swiped left enough
            if (movedBy < -50) {
                currentIndex++;
            }
            // If swiped right enough
            else if (movedBy > 50) {
                currentIndex--;
            }
            
            slideToCurrentIndex();
        });

        // Initialize
        updateArrowStates();
    }

// ========================================
// TESTIMONIALS SPLIT LAYOUT
// ========================================
const testiListItems = document.querySelectorAll('.testi-list-item');
const testiDisplayCards = document.querySelectorAll('.testi-display-card');

if (testiListItems.length > 0 && testiDisplayCards.length > 0) {
    testiListItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items and cards
            testiListItems.forEach(li => li.classList.remove('active'));
            testiDisplayCards.forEach(card => card.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get index and show corresponding card
            const index = item.getAttribute('data-testi');
            const targetCard = document.getElementById(`testi-display-${index}`);
            if (targetCard) {
                targetCard.classList.add('active');
            }
        });
    });
}

// ========================================
// FAQ ACCORDION
// ========================================
const accordionIcons = document.querySelectorAll('.accordion-icon');

if (accordionIcons.length > 0) {
    accordionIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Find the parent accordion item
            const item = e.currentTarget.closest('.accordion-item');
            if (item) {
                item.classList.toggle('active');
            }
        });
    });
}
