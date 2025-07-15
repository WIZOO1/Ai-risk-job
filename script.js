// Main Application Script
class AIReplacementApp {
    constructor() {
        this.currentPage = 'landing';
        this.assessment = null;
        
        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    initializeApp() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    }

    /**
     * Setup the application components
     */
    setup() {
        try {
            // Validate dependencies
            this.validateDependencies();

            // Initialize components
            this.initializeComponents();

            // Setup global event listeners
            this.setupGlobalEventListeners();

            // Initialize icons
            this.initializeIcons();

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            // Setup error handling
            this.setupErrorHandling();

            console.log('AI Replacement App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showErrorMessage('Failed to initialize the application. Please refresh the page.');
        }
    }

    /**
     * Validate required dependencies
     */
    validateDependencies() {
        const requiredDependencies = [
            'jobsDatabase',
            'FuzzyMatcher',
            'LandingPage',
            'ResultPage',
            'ShareUtils'
        ];

        const missingDependencies = requiredDependencies.filter(dep => !window[dep]);
        
        if (missingDependencies.length > 0) {
            throw new Error(`Missing dependencies: ${missingDependencies.join(', ')}`);
        }

        // Validate jobs database
        if (!window.jobsDatabase || !Array.isArray(window.jobsDatabase) || window.jobsDatabase.length === 0) {
            throw new Error('Jobs database is invalid or empty');
        }

        console.log('All dependencies validated successfully');
    }

    /**
     * Initialize application components
     */
    initializeComponents() {
        // Initialize landing page
        window.landingPage = new LandingPage();
        
        // Initialize results page
        window.resultPage = new ResultPage();

        // Store reference to app instance
        window.app = this;

        console.log('Components initialized successfully');
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle browser back/forward navigation
        window.addEventListener('popstate', (e) => {
            this.handleBrowserNavigation(e);
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Handle visibility change (tab focus/blur)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle network status changes
        window.addEventListener('online', () => {
            this.handleNetworkChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleNetworkChange(false);
        });
    }

    /**
     * Initialize Feather icons
     */
    initializeIcons() {
        try {
            if (window.feather && typeof window.feather.replace === 'function') {
                feather.replace();
            } else {
                console.warn('Feather icons not available or not properly loaded');
            }
        } catch (error) {
            console.warn('Failed to initialize Feather icons:', error);
        }
    }

    /**
     * Setup performance monitoring and optimization
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                // Initialize lazy loading after page load
                this.initializeLazyLoading();
            }
        });

        // Monitor memory usage (if available)
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                const memory = window.performance.memory;
                if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
                    console.warn('High memory usage detected:', memory.usedJSHeapSize / 1024 / 1024, 'MB');
                }
            }, 30000); // Check every 30 seconds
        }
        
        // Monitor First Contentful Paint
        if (window.PerformanceObserver) {
            try {
                const observer = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        if (entry.name === 'first-contentful-paint') {
                            console.log(`First Contentful Paint: ${entry.startTime}ms`);
                        }
                    });
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (error) {
                console.warn('Performance observer not supported:', error);
            }
        }
    }
    
    /**
     * Initialize lazy loading for optimal performance
     */
    initializeLazyLoading() {
        // Modern browsers support loading="lazy" natively
        if ('loading' in HTMLImageElement.prototype) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                img.classList.add('lazy-load');
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            });
        } else {
            // Fallback for older browsers using Intersection Observer
            const lazyImages = document.querySelectorAll('.lazy-load');
            
            if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                            }
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        // Handle JavaScript errors
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            this.handleError(e.error, 'JavaScript Error');
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleError(e.reason, 'Promise Rejection');
        });
    }

    /**
     * Handle browser navigation
     */
    handleBrowserNavigation(event) {
        // Implement browser navigation handling if needed
        console.log('Browser navigation event:', event);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Escape key - close modals
        if (event.key === 'Escape') {
            this.closeAllModals();
        }

        // Ctrl/Cmd + Enter - trigger main action
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            if (this.currentPage === 'landing') {
                const checkButton = document.getElementById('check-risk-btn');
                if (checkButton && !checkButton.disabled) {
                    checkButton.click();
                }
            }
        }

        // Ctrl/Cmd + S - share results
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            if (this.currentPage === 'results') {
                const shareButton = document.getElementById('share-btn');
                if (shareButton) {
                    shareButton.click();
                }
            }
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Update any size-dependent components
            this.updateResponsiveComponents();
        }, 250);
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause any animations or timers
            this.pauseAnimations();
        } else {
            // Page is visible - resume animations
            this.resumeAnimations();
        }
    }

    /**
     * Handle network status changes
     */
    handleNetworkChange(isOnline) {
        if (isOnline) {
            console.log('Connection restored');
            this.hideNetworkWarning();
        } else {
            console.log('Connection lost');
            this.showNetworkWarning();
        }
    }

    /**
     * Handle application errors
     */
    handleError(error, type = 'Unknown Error') {
        console.error(`${type}:`, error);
        
        // Show user-friendly error message
        this.showErrorMessage(`An error occurred. Please try again or refresh the page.`);
        
        // You could also send error reports to a logging service here
        // this.reportError(error, type);
    }

    /**
     * Close all open modals
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }

    /**
     * Update responsive components
     */
    updateResponsiveComponents() {
        // Update any components that need to respond to window size changes
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Adjust text sizes for very small screens
        if (viewport.width < 320) {
            document.body.classList.add('tiny-screen');
        } else {
            document.body.classList.remove('tiny-screen');
        }

        // Update ad positions for different screen sizes
        this.updateAdPositions();
    }

    /**
     * Update ad positions based on screen size and viewport for maximum revenue
     */
    updateAdPositions() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const sideAd = document.querySelector('.ad-banner.ad-side');
        const topAd = document.querySelector('.ad-banner.ad-top');
        const bottomAd = document.querySelector('.ad-banner.ad-bottom');
        const inlineAd = document.querySelector('.ad-banner.ad-inline');
        
        // Side ad optimization for desktop only
        if (screenWidth >= 1200 && screenHeight >= 700) {
            if (sideAd) sideAd.style.display = 'flex';
        } else {
            if (sideAd) sideAd.style.display = 'none';
        }
        
        // Optimize ad sizes for different viewports to maximize revenue
        if (screenWidth >= 1200) {
            // Large desktop - use largest ad formats
            if (topAd) topAd.style.maxWidth = '970px';
            if (bottomAd) bottomAd.style.maxWidth = '970px';
            if (inlineAd) inlineAd.style.maxWidth = '336px';
        } else if (screenWidth >= 768) {
            // Tablet - standard leaderboard
            if (topAd) topAd.style.maxWidth = '728px';
            if (bottomAd) bottomAd.style.maxWidth = '728px';
            if (inlineAd) inlineAd.style.maxWidth = '300px';
        } else {
            // Mobile - optimized banner sizes
            if (topAd) topAd.style.maxWidth = '320px';
            if (bottomAd) bottomAd.style.maxWidth = '320px';
            if (inlineAd) inlineAd.style.maxWidth = '300px';
        }
        
        // Ensure ads are always visible and properly positioned
        document.querySelectorAll('.ad-banner').forEach(ad => {
            if (ad.style.display !== 'none') {
                ad.style.visibility = 'visible';
                ad.style.margin = 'auto';
            }
        });
    }

    /**
     * Pause animations when page is hidden
     */
    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }

    /**
     * Resume animations when page is visible
     */
    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }

    /**
     * Show network warning
     */
    showNetworkWarning() {
        let warning = document.getElementById('network-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'network-warning';
            warning.className = 'network-warning';
            warning.innerHTML = `
                <i data-feather="wifi-off"></i>
                <span>No internet connection</span>
            `;
            document.body.appendChild(warning);
            
            try {
                if (window.feather && typeof window.feather.replace === 'function') {
                    feather.replace();
                }
            } catch (error) {
                console.warn('Failed to replace feather icons:', error);
            }
        }
        warning.classList.add('show');
    }

    /**
     * Hide network warning
     */
    hideNetworkWarning() {
        const warning = document.getElementById('network-warning');
        if (warning) {
            warning.classList.remove('show');
            setTimeout(() => {
                warning.remove();
            }, 300);
        }
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        // Remove any existing error messages
        const existingError = document.getElementById('global-error');
        if (existingError) {
            existingError.remove();
        }

        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.id = 'global-error';
        errorDiv.className = 'global-error';
        errorDiv.innerHTML = `
            <i data-feather="alert-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i data-feather="x"></i>
            </button>
        `;
        
        document.body.appendChild(errorDiv);
        
        try {
            if (window.feather && typeof window.feather.replace === 'function') {
                feather.replace();
            }
        } catch (error) {
            console.warn('Failed to replace feather icons:', error);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Get current assessment data
     */
    getCurrentAssessment() {
        return window.currentAssessment || null;
    }

    /**
     * Set current page
     */
    setCurrentPage(page) {
        this.currentPage = page;
    }

    /**
     * Get application statistics
     */
    getStats() {
        return {
            totalJobs: window.jobsDatabase ? window.jobsDatabase.length : 0,
            currentPage: this.currentPage,
            hasAssessment: !!window.currentAssessment,
            browserSupport: {
                webShare: !!navigator.share,
                clipboard: !!navigator.clipboard,
                localStorage: !!window.localStorage
            }
        };
    }
}

// CSS for global components
const globalStyles = `
    .network-warning {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 64, 0.9);
        color: white;
        padding: 12px 16px;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    }

    .network-warning.show {
        transform: translateX(0);
    }

    .global-error {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 64, 0.9);
        color: white;
        padding: 12px 16px;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        max-width: 90%;
        font-size: 14px;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    }

    .global-error button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s ease;
    }

    .global-error button:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    .tiny-screen {
        font-size: 14px;
    }

    .tiny-screen .glitch-text {
        font-size: 2rem;
    }

    .tiny-screen .subtitle {
        font-size: 1rem;
    }

    .animations-paused * {
        animation-play-state: paused !important;
    }

    @media (max-width: 480px) {
        .network-warning,
        .global-error {
            font-size: 12px;
            padding: 8px 12px;
        }
    }
`;

// Inject global styles
const globalStyleSheet = document.createElement('style');
globalStyleSheet.textContent = globalStyles;
document.head.appendChild(globalStyleSheet);

// Initialize the application
const app = new AIReplacementApp();

// Make app available globally for debugging
window.aiApp = app;

// Page Navigation System
function showPage(pageId) {
    // Hide all pages and content pages
    const allPages = document.querySelectorAll('.page, .content-page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the requested page
    if (pageId === 'home') {
        document.getElementById('landing-page').classList.add('active');
    } else if (pageId === 'results') {
        document.getElementById('results-page').classList.add('active');
    } else {
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    // Update page title
    updatePageTitle(pageId);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Initialize feather icons for new page
    if (window.feather && typeof window.feather.replace === 'function') {
        setTimeout(() => {
            feather.replace();
        }, 100);
    }
}

// Update page title based on current page
function updatePageTitle(pageId) {
    const titles = {
        'home': 'AI Will Replace You? - Check Your Job\'s AI Replacement Risk',
        'results': 'AI Assessment Results - AI Will Replace You?',
        'about': 'About Us - AI Will Replace You?',
        'privacy': 'Privacy Policy - AI Will Replace You?',
        'terms': 'Terms of Service - AI Will Replace You?',
        'contact': 'Contact Us - AI Will Replace You?',
        'faq': 'FAQ - AI Will Replace You?',
        'blog': 'Career Blog - AI Will Replace You?',
        'disclaimer': 'Disclaimer - AI Will Replace You?'
    };
    
    document.title = titles[pageId] || 'AI Will Replace You?';
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }
});

function handleContactForm() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Show success message
        showFormSuccess();
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i data-feather="check-circle"></i>
            <span>Thank you! Your message has been sent successfully.</span>
        </div>
    `;
    
    const contactForm = document.querySelector('.contact-form');
    contactForm.appendChild(successMessage);
    
    // Initialize feather icons
    if (window.feather && typeof window.feather.replace === 'function') {
        feather.replace();
    }
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Make functions available globally
window.showPage = showPage;
window.updatePageTitle = updatePageTitle;

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can register a service worker here for offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // Implement analytics tracking here (Google Analytics, etc.)
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIReplacementApp;
}
