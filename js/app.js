/**
 * Main Application - Initializes and coordinates the learning system
 */

// Global learning engine instance
let learningEngine;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', async function() {
    try {
        showLoadingOverlay('Initializing learning system...');
        
        // Initialize the main learning engine
        learningEngine = new LearningEngine();
        
        // Wait for engine initialization
        await waitForEngineReady();
        
        hideLoadingOverlay();
        
        console.log('Learning system initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize learning system:', error);
        showError('System initialization failed. Please refresh the page and try again.');
    }
});

/**
 * Wait for engine to be ready
 */
function waitForEngineReady() {
    return new Promise((resolve) => {
        const checkReady = () => {
            if (learningEngine && learningEngine.currentUnit) {
                resolve();
            } else {
                setTimeout(checkReady, 100);
            }
        };
        checkReady();
    });
}

/**
 * Show loading overlay
 */
function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    const messageElement = overlay?.querySelector('p');
    
    if (overlay) {
        if (messageElement) {
            messageElement.textContent = message;
        }
        overlay.classList.remove('hidden');
    }
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

/**
 * Show error message
 */
function showError(message) {
    const overlay = document.getElementById('feedback-overlay');
    const messageElement = document.getElementById('feedback-message');
    
    if (overlay && messageElement) {
        messageElement.innerHTML = `<div class="error-message">${message}</div>`;
        overlay.classList.remove('hidden');
    }
}

/**
 * Global keyboard shortcuts
 */
document.addEventListener('keydown', function(event) {
    // Ctrl+Enter to submit response
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        if (learningEngine && typeof learningEngine.handleResponse === 'function') {
            learningEngine.handleResponse();
        }
    }
    
    // Escape to close overlays
    if (event.key === 'Escape') {
        const overlays = document.querySelectorAll('.overlay:not(.hidden)');
        overlays.forEach(overlay => overlay.classList.add('hidden'));
    }
    
    // H for hint (when available)
    if (event.key === 'h' || event.key === 'H') {
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn && !hintBtn.disabled) {
            event.preventDefault();
            hintBtn.click();
        }
    }
});

/**
 * Handle browser visibility changes to pause/resume learning
 */
document.addEventListener('visibilitychange', function() {
    if (learningEngine) {
        if (document.hidden) {
            // Browser tab became hidden - pause timers if any
            learningEngine.pauseSession?.();
        } else {
            // Browser tab became visible - resume
            learningEngine.resumeSession?.();
        }
    }
});

/**
 * Handle window unload to save progress
 */
window.addEventListener('beforeunload', function(event) {
    if (learningEngine) {
        // Save current progress
        learningEngine.saveCurrentUnit();
        learningEngine.saveUserProfile();
        
        // Check if there's unsaved work
        if (learningEngine.hasUnsavedWork?.()) {
            event.preventDefault();
            event.returnValue = 'You have unsaved progress. Are you sure you want to leave?';
            return event.returnValue;
        }
    }
});

/**
 * Service worker registration for offline functionality
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

/**
 * Development and debugging utilities
 */
window.debugLearningSystem = {
    getEngine: () => learningEngine,
    getConcepts: () => ConceptDatabase.concepts,
    getProgress: () => learningEngine?.masteryTracker?.getPerformanceAnalytics(),
    resetProgress: () => {
        if (confirm('This will reset all learning progress. Are you sure?')) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
    },
    simulateCorrectAnswer: () => {
        if (learningEngine && learningEngine.currentPhase === 'learning') {
            // Simulate a correct response for testing
            learningEngine.processValidationResult({
                isCorrect: true,
                reasoning: { isValid: true, score: 0.9, feedback: 'Simulated correct answer' },
                confidence: 0.8,
                attempts: 1,
                hintsUsed: 0,
                timeSpent: 30000
            });
        }
    },
    getCurrentUnit: () => learningEngine?.currentUnit,
    skipToAssessment: () => {
        if (learningEngine && confirm('Skip to final assessment?')) {
            learningEngine.transitionToPhase('assessment');
        }
    }
};

/**
 * Analytics and error reporting
 */
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    
    // Could send to analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': event.error?.message || 'Unknown error',
            'fatal': false
        });
    }
});

/**
 * Performance monitoring
 */
window.addEventListener('load', function() {
    // Measure page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Monitor for performance issues
    const observer = new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
            if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
                console.log(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
});

/**
 * Touch and mobile support
 */
if ('ontouchstart' in window) {
    // Add touch-friendly classes
    document.body.classList.add('touch-device');
    
    // Prevent zoom on double tap for buttons
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
                event.preventDefault();
            }
        }
        lastTouchEnd = now;
    }, false);
}

/**
 * Accessibility enhancements
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add skip navigation
    const skipNav = document.createElement('a');
    skipNav.href = '#main-content';
    skipNav.className = 'skip-nav';
    skipNav.textContent = 'Skip to main content';
    skipNav.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
    `;
    
    skipNav.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipNav.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipNav, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap;
        border: 0;
    `;
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
});

/**
 * Internationalization support
 */
const i18n = {
    currentLanguage: 'en',
    translations: {
        en: {
            loading: 'Loading...',
            error: 'Error',
            continue: 'Continue',
            submit: 'Submit',
            hint: 'Hint',
            excellent: 'Excellent!',
            goodJob: 'Good job!',
            tryAgain: 'Try again',
            levelUp: 'Level up!'
        }
        // Additional languages would be added here
    },
    
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    },
    
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.updateUI();
        }
    },
    
    updateUI() {
        // Update UI text elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
    }
};

// Export for global use
window.i18n = i18n;

/**
 * Theme and customization support
 */
const themeManager = {
    currentTheme: 'default',
    
    themes: {
        default: {
            name: 'Default',
            primary: '#667eea',
            secondary: '#764ba2'
        },
        dark: {
            name: 'Dark Mode',
            primary: '#4a5568',
            secondary: '#2d3748'
        },
        accessible: {
            name: 'High Contrast',
            primary: '#000000',
            secondary: '#ffffff'
        }
    },
    
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            const theme = this.themes[themeName];
            
            document.documentElement.style.setProperty('--primary-color', theme.primary);
            document.documentElement.style.setProperty('--secondary-color', theme.secondary);
            
            localStorage.setItem('selectedTheme', themeName);
        }
    },
    
    loadSavedTheme() {
        const saved = localStorage.getItem('selectedTheme');
        if (saved && this.themes[saved]) {
            this.setTheme(saved);
        }
    }
};

// Load saved theme on startup
document.addEventListener('DOMContentLoaded', function() {
    themeManager.loadSavedTheme();
});

window.themeManager = themeManager;

/**
 * Offline support and data synchronization
 */
const offlineManager = {
    isOnline: navigator.onLine,
    pendingSync: [],
    
    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    },
    
    addToSyncQueue(data) {
        this.pendingSync.push({
            data: data,
            timestamp: Date.now()
        });
        
        if (this.isOnline) {
            this.syncPendingData();
        }
    },
    
    async syncPendingData() {
        if (this.pendingSync.length === 0) return;
        
        try {
            // Simulate sync - would integrate with actual backend
            console.log(`Syncing ${this.pendingSync.length} items...`);
            
            // Clear sync queue on success
            this.pendingSync = [];
            
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }
};

offlineManager.init();
window.offlineManager = offlineManager;

console.log('Learning system core loaded successfully');
