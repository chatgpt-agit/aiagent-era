// Presentation state
let currentSlide = 1;
const totalSlides = 14;

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
    updateSlideCounter();
    updateProgressBar();
    addKeyboardListeners();
    addTouchListeners();
    animateSlideElements();
});

// Change slide function
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const prevSlideIndex = currentSlide - 1;
    
    // Update current slide number
    currentSlide += direction;
    
    // Wrap around
    if (currentSlide > totalSlides) {
        currentSlide = 1;
    } else if (currentSlide < 1) {
        currentSlide = totalSlides;
    }
    
    // Remove active class from all slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index < currentSlide - 1) {
            slide.classList.add('prev');
        }
    });
    
    // Add active class to current slide
    slides[currentSlide - 1].classList.add('active');
    
    // Update UI
    updateSlideCounter();
    updateProgressBar();
    animateSlideElements();
}

// Update slide counter
function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlide;
    document.getElementById('total-slides').textContent = totalSlides;
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentSlide / totalSlides) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

// Keyboard navigation
function addKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                changeSlide(-1);
                break;
            case 'ArrowRight':
                changeSlide(1);
                break;
            case ' ':
                e.preventDefault();
                changeSlide(1);
                break;
            case 'Home':
                goToSlide(1);
                break;
            case 'End':
                goToSlide(totalSlides);
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
        }
    });
}

// Touch/swipe navigation
function addTouchListeners() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
}

// Go to specific slide
function goToSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    
    // Remove active class from all slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index < slideNumber - 1) {
            slide.classList.add('prev');
        }
    });
    
    // Update current slide and add active class
    currentSlide = slideNumber;
    slides[currentSlide - 1].classList.add('active');
    
    // Update UI
    updateSlideCounter();
    updateProgressBar();
    animateSlideElements();
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Animate slide elements
function animateSlideElements() {
    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;
    
    // Animate elements with delays
    const elements = activeSlide.querySelectorAll('h1, h2, h3, p, li, .model-card, .trend-item, .tool-card, .case-study, .role-card, .skill-item, .point-item, .timeline-item');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    // Animate progress bars if present
    const progressBars = activeSlide.querySelectorAll('.progress-bar-fill');
    progressBars.forEach((bar) => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.transition = 'width 1s ease';
            bar.style.width = width;
        }, 500);
    });
    
    // Animate stat numbers
    const statNumbers = activeSlide.querySelectorAll('.stat-number, .stat-value, .percentage');
    statNumbers.forEach((stat) => {
        animateNumber(stat);
    });
}

// Animate numbers
function animateNumber(element) {
    const targetText = element.textContent;
    const targetNumber = parseFloat(targetText.replace(/[^0-9.-]/g, ''));
    
    if (isNaN(targetNumber)) return;
    
    const duration = 1000;
    const start = 0;
    const increment = targetNumber / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        // Preserve original format
        if (targetText.includes('%')) {
            element.textContent = `${current.toFixed(1)}%`;
        } else if (targetText.includes('.')) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Add smooth scrolling for slides with overflow
document.querySelectorAll('.slide').forEach(slide => {
    let isScrolling = false;
    
    slide.addEventListener('wheel', (e) => {
        const isAtTop = slide.scrollTop === 0;
        const isAtBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 1;
        
        // If scrolling up at top or down at bottom, change slides
        if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
            if (!isScrolling) {
                e.preventDefault();
                isScrolling = true;
                changeSlide(e.deltaY > 0 ? 1 : -1);
                setTimeout(() => {
                    isScrolling = false;
                }, 500);
            }
        }
    });
});

// Presentation timer
let presentationTime = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        presentationTime++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const minutes = Math.floor(presentationTime / 60);
    const seconds = presentationTime % 60;
    // You can add a timer display element if needed
}

// Speaker notes (can be extended)
const speakerNotes = {
    1: "Welcome to the presentation on AI agents and the evolving role of developers",
    2: "AI is fundamentally changing how we approach software development",
    3: "Latest AI models show incredible capabilities",
    // Add more notes for each slide
};

// Presentation mode features
let presentationMode = false;

function togglePresentationMode() {
    presentationMode = !presentationMode;
    if (presentationMode) {
        document.body.classList.add('presentation-mode');
        startTimer();
    } else {
        document.body.classList.remove('presentation-mode');
        stopTimer();
    }
}