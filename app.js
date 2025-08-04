// Presentation Controller
class PresentationController {
    constructor() {
        this.currentSlideIndex = 1;
        this.totalSlides = 7;
        this.printMode = false;
        this.init();
    }

    init() {
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.bindKeyboardEvents();
        this.initializeInputs();
    }

    changeSlide(direction) {
        const newIndex = this.currentSlideIndex + direction;
        
        if (newIndex >= 1 && newIndex <= this.totalSlides) {
            // Hide current slide
            const currentSlide = document.getElementById(`slide${this.currentSlideIndex}`);
            currentSlide.classList.remove('active');
            
            // Show new slide
            this.currentSlideIndex = newIndex;
            const newSlide = document.getElementById(`slide${this.currentSlideIndex}`);
            newSlide.classList.add('active');
            
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
            // Scroll to top of new slide
            newSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            // Hide current slide
            const currentSlide = document.getElementById(`slide${this.currentSlideIndex}`);
            currentSlide.classList.remove('active');
            
            // Show target slide
            this.currentSlideIndex = slideNumber;
            const targetSlide = document.getElementById(`slide${this.currentSlideIndex}`);
            targetSlide.classList.add('active');
            
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
            // Scroll to top of target slide
            targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateSlideCounter() {
        const currentSlideSpan = document.getElementById('currentSlide');
        const totalSlidesSpan = document.getElementById('totalSlides');
        
        if (currentSlideSpan) {
            currentSlideSpan.textContent = this.currentSlideIndex;
        }
        if (totalSlidesSpan) {
            totalSlidesSpan.textContent = this.totalSlides;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlideIndex === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentSlideIndex === this.totalSlides;
        }
    }

    togglePrintMode() {
        this.printMode = !this.printMode;
        const container = document.querySelector('.presentation-container');
        const printBtn = document.getElementById('printBtn');
        
        if (this.printMode) {
            container.classList.add('print-mode');
            printBtn.textContent = 'Slide View';
            printBtn.classList.remove('btn--outline');
            printBtn.classList.add('btn--primary');
        } else {
            container.classList.remove('print-mode');
            printBtn.textContent = 'Print View';
            printBtn.classList.remove('btn--primary');
            printBtn.classList.add('btn--outline');
        }
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            // Prevent navigation when typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (event.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    event.preventDefault();
                    this.changeSlide(1);
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    event.preventDefault();
                    this.changeSlide(-1);
                    break;
                case 'Home':
                    event.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    event.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'p':
                case 'P':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.togglePrintMode();
                    }
                    break;
                case 'Escape':
                    if (this.printMode) {
                        this.togglePrintMode();
                    }
                    break;
            }
        });
    }

    initializeInputs() {
        // Auto-save input values to prevent loss on navigation
        const studentNameInput = document.getElementById('studentName');
        const collegeNameInput = document.getElementById('collegeName');
        
        if (studentNameInput) {
            studentNameInput.addEventListener('input', (e) => {
                // Store in session for the current session only
                sessionStorage.setItem('studentName', e.target.value);
            });
            
            // Restore saved value
            const savedName = sessionStorage.getItem('studentName');
            if (savedName) {
                studentNameInput.value = savedName;
            }
        }
        
        if (collegeNameInput) {
            collegeNameInput.addEventListener('input', (e) => {
                sessionStorage.setItem('collegeName', e.target.value);
            });
            
            // Restore saved value
            const savedCollege = sessionStorage.getItem('collegeName');
            if (savedCollege) {
                collegeNameInput.value = savedCollege;
            }
        }
    }

    // Additional utility methods
    getCurrentSlide() {
        return this.currentSlideIndex;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    isPrintMode() {
        return this.printMode;
    }
}

// Global presentation controller instance
let presentationController;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    presentationController = new PresentationController();
});

// Global functions for button onclick handlers
function changeSlide(direction) {
    if (presentationController) {
        presentationController.changeSlide(direction);
    }
}

function goToSlide(slideNumber) {
    if (presentationController) {
        presentationController.goToSlide(slideNumber);
    }
}

function togglePrintMode() {
    if (presentationController) {
        presentationController.togglePrintMode();
    }
}

// Additional interactive features
class SlideInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.addClickToHighlight();
        this.addHoverEffects();
        this.initializeChartInteractions();
    }

    addClickToHighlight() {
        // Add click-to-highlight functionality for important statistics
        const statsElements = document.querySelectorAll('.stats-list li strong, .bullet-list li strong');
        
        statsElements.forEach(element => {
            element.addEventListener('click', function() {
                // Remove existing highlights
                document.querySelectorAll('.highlighted').forEach(el => {
                    el.classList.remove('highlighted');
                });
                
                // Add highlight to clicked element
                this.classList.add('highlighted');
                
                // Add CSS for highlight effect
                if (!document.querySelector('#highlight-styles')) {
                    const style = document.createElement('style');
                    style.id = 'highlight-styles';
                    style.textContent = `
                        .highlighted {
                            background-color: var(--color-warning) !important;
                            color: var(--color-surface) !important;
                            padding: 2px 4px !important;
                            border-radius: 4px !important;
                            transition: all 0.3s ease !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    this.classList.remove('highlighted');
                }, 3000);
            });
        });
    }

    addHoverEffects() {
        // Add hover effects to content sections
        const contentSections = document.querySelectorAll('.content-section');
        
        contentSections.forEach(section => {
            section.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--color-bg-1)';
                this.style.borderRadius = 'var(--radius-md)';
                this.style.padding = 'var(--space-16)';
                this.style.transition = 'all 0.3s ease';
            });
            
            section.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
                this.style.padding = '';
            });
        });
    }

    initializeChartInteractions() {
        // Add click handlers for chart images to show larger view
        const chartImages = document.querySelectorAll('.chart-image');
        
        chartImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.title = 'Click to view larger';
            
            img.addEventListener('click', function() {
                this.showLargerChart(img);
            }.bind(this));
        });
    }

    showLargerChart(imgElement) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'chart-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            cursor: pointer;
        `;
        
        // Create enlarged image
        const enlargedImg = document.createElement('img');
        enlargedImg.src = imgElement.src;
        enlargedImg.alt = imgElement.alt;
        enlargedImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
        `;
        
        overlay.appendChild(enlargedImg);
        document.body.appendChild(overlay);
        
        // Close on click
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

// Initialize slide interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SlideInteractions();
});

// Performance optimization - Preload next slide images
function preloadImages() {
    const images = document.querySelectorAll('.chart-image');
    images.forEach(img => {
        const preloadImg = new Image();
        preloadImg.src = img.src;
    });
}

// Call preload after a short delay to not interfere with initial load
setTimeout(preloadImages, 1000);