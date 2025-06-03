// Slider functionality
let currentSlide = 0;
let isAnimating = false;

// Get slider elements
const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderItems = document.querySelectorAll('.slider-item');

// Calculate slides per view based on screen size
function getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
}

// Update slider position
function updateSlider() {
    if (!sliderTrack) return;
    
    const slidesPerView = getSlidesPerView();
    const maxSlide = Math.max(0, sliderItems.length - slidesPerView);
    
    // Ensure current slide is within bounds
    if (currentSlide > maxSlide) {
        currentSlide = maxSlide;
    }
    
    const translateX = -(currentSlide * (100 / slidesPerView));
    sliderTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update button states
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide >= maxSlide;
}

// Move slider
function moveSlider(direction) {
    if (isAnimating) return;
    
    isAnimating = true;
    const slidesPerView = getSlidesPerView();
    const maxSlide = Math.max(0, sliderItems.length - slidesPerView);
    
    currentSlide += direction;
    
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide > maxSlide) currentSlide = maxSlide;
    
    updateSlider();
    
    setTimeout(() => {
        isAnimating = false;
    }, 2500);
}

// Auto advance slider
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        const slidesPerView = getSlidesPerView();
        const maxSlide = Math.max(0, sliderItems.length - slidesPerView);
        
        if (currentSlide >= maxSlide) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        updateSlider();
    }, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Touch/Swipe functionality
let startX = 0;
let startY = 0;
let isDragging = false;

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    stopAutoSlide();
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        e.preventDefault();
        
        if (diffX > 0) {
            moveSlider(1);
        } else {
            moveSlider(-1);
        }
        
        isDragging = false;
        startAutoSlide();
    }
}

function handleTouchEnd() {
    isDragging = false;
    startAutoSlide();
}

// Search functionality
function handleSearch() {
    const location = document.getElementById('location').value;
    const propertyType = document.getElementById('property-type').value;
    const priceRange = document.getElementById('price-range').value;
    
    console.log('Search triggered:', {
        location,
        propertyType,
        priceRange
    });
    
    // Add your search logic here
    alert(`Searching for ${propertyType || 'all properties'} in ${location || 'all locations'} with budget ${priceRange || 'any budget'}`);
}

// Filter properties (placeholder function)
function filterProperties(location, type, priceRange) {
    const propertyCards = document.querySelectorAll('.properties-grid .property-card');
    
    propertyCards.forEach(card => {
        let show = true;
        
        if (location) {
            const cardLocation = card.querySelector('.property-location').textContent.toLowerCase();
            if (!cardLocation.includes(location.toLowerCase())) {
                show = false;
            }
        }
        
        if (type) {
            const cardType = card.querySelector('.property-type-badge').textContent.toLowerCase();
            if (!cardType.includes(type.toLowerCase())) {
                show = false;
            }
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on target
        let displayValue;
        if (target >= 1000) {
            displayValue = Math.floor(current).toLocaleString() + '+';
        } else {
            displayValue = Math.floor(current) + '%';
        }
        
        element.textContent = displayValue;
    }, 16);
}

// Intersection Observer for counter animation
function setupCounterAnimation() {
    const statsSection = document.getElementById('statsSection');
    if (!statsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    observer.observe(statsSection);
}

// Wishlist functionality
function toggleWishlist(button) {
    button.classList.toggle('active');
    const icon = button.querySelector('.icon');
    
    if (button.classList.contains('active')) {
        icon.style.color = '#ef4444';
        icon.style.fill = '#ef4444';
    } else {
        icon.style.color = '';
        icon.style.fill = '';
    }
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slider
    updateSlider();
    startAutoSlide();
    
    // Add event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => moveSlider(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveSlider(1));
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Touch events for slider
    const sliderContainer = document.getElementById('heroSlider');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        sliderContainer.addEventListener('touchend', handleTouchEnd);
        
        // Pause auto-slide on hover
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleWishlist(btn));
    });
    
    // Setup counter animation
    setupCounterAnimation();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateSlider();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveSlider(-1);
        } else if (e.key === 'ArrowRight') {
            moveSlider(1);
        }
    });
    
    console.log('PropertyHub website initialized successfully!');
});

// Form validation (if needed)
function validateSearchForm() {
    const location = document.getElementById('location').value.trim();
    
    if (location.length < 2) {
        alert('Please enter a valid location');
        return false;
    }
    
    return true;
}

// Export functions for external use if needed
window.PropertyHub = {
    moveSlider,
    handleSearch,
    filterProperties,
    toggleWishlist,
    validateSearchForm
};
