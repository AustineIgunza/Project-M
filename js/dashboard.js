// Dashboard System - Learning Interface
class DashboardSystem {
    constructor() {
        this.currentView = 'dashboard';
        this.sessionManager = new SessionManager();
        this.learningEngine = null;
        this.init();
    }

    async init() {
        // Check authentication
        if (!this.sessionManager.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        this.loadUserData();
        this.setupNavigation();
        this.initializeLearningEngine();
        this.startProgressAnimations();
        
        // Show welcome transition
        this.showTransition('Loading your learning environment...', 2000);
        
        setTimeout(() => {
            this.hideTransition();
            this.animatePageLoad();
        }, 2000);
    }

    setupEventListeners() {
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link[data-view]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.closest('.nav-link').dataset.view;
                this.switchView(view);
            });
        });

        // User menu
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Learning path actions
        this.setupLearningPathActions();

        // Quick action buttons
        this.setupQuickActions();

        // Window resize for responsive updates
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupLearningPathActions() {
        const continueButtons = document.querySelectorAll('.btn-continue');
        continueButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const pathId = btn.dataset.pathId;
                this.continueLearningPath(pathId);
            });
        });

        const startButtons = document.querySelectorAll('.btn-start');
        startButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const pathId = btn.dataset.pathId;
                this.startLearningPath(pathId);
            });
        });
    }

    setupQuickActions() {
        const continueBtn = document.getElementById('continueCurrentPath');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.continueCurrentLearningSession();
            });
        }

        const exploreBtn = document.getElementById('explorePaths');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.switchView('paths');
            });
        }
    }

    loadUserData() {
        const session = this.sessionManager.getSession();
        if (session && session.user) {
            this.updateUserInterface(session.user);
            this.loadUserProgress(session.user);
        }
    }

    updateUserInterface(user) {
        // Update user name
        const userNameElements = document.querySelectorAll('[data-user="name"]');
        userNameElements.forEach(element => {
            element.textContent = user.name || user.email.split('@')[0];
        });

        // Update user avatar
        const userAvatarElements = document.querySelectorAll('[data-user="avatar"]');
        userAvatarElements.forEach(element => {
            if (user.avatar) {
                element.src = user.avatar;
            } else {
                // Generate avatar from initials
                const initials = (user.name || user.email).split(' ').map(n => n[0]).join('').toUpperCase();
                element.src = this.generateAvatarURL(initials);
            }
        });

        // Update greeting based on time of day
        this.updateTimeBasedGreeting();
    }

    generateAvatarURL(initials) {
        // Generate a simple avatar using a service like DiceBear or UI Avatars
        const colors = ['3b82f6', '1e40af', '06b6d4', '10b981', 'f59e0b'];
        const color = colors[initials.charCodeAt(0) % colors.length];
        return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=ffffff&size=128&font-size=0.6&bold=true`;
    }

    updateTimeBasedGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Welcome back';
        
        if (hour < 12) {
            greeting = 'Good morning';
        } else if (hour < 17) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }

        const greetingElements = document.querySelectorAll('[data-greeting]');
        greetingElements.forEach(element => {
            element.textContent = greeting;
        });
    }

    loadUserProgress(user) {
        // Load user's learning progress
        const progressData = this.getUserProgress(user);
        this.updateProgressDisplay(progressData);
    }

    getUserProgress(user) {
        // In a real app, this would come from an API
        return {
            totalLessons: 45,
            completedLessons: 28,
            currentStreak: 7,
            totalXP: 1240,
            level: 5,
            nextLevelXP: 1500,
            dailyGoalMinutes: 30,
            todayMinutes: 23,
            weeklyGoal: 210,
            weeklyMinutes: 156,
            achievements: [
                {
                    id: 'streak_7',
                    title: 'Week Warrior',
                    description: '7-day learning streak',
                    date: new Date().toISOString(),
                    icon: 'fas fa-fire'
                }
            ]
        };
    }

    updateProgressDisplay(progress) {
        // Update overall progress
        const overallProgress = Math.round((progress.completedLessons / progress.totalLessons) * 100);
        this.updateProgressCircle('.hero-progress', overallProgress);

        // Update stats
        this.updateStat('total-lessons', progress.totalLessons);
        this.updateStat('completed-lessons', progress.completedLessons);
        this.updateStat('current-streak', progress.currentStreak);
        this.updateStat('total-xp', progress.totalXP);

        // Update daily goal
        const dailyProgress = Math.round((progress.todayMinutes / progress.dailyGoalMinutes) * 100);
        this.updateProgressCircle('.daily-progress', dailyProgress);

        // Update progress bars
        this.updateProgressBar('.level-progress', (progress.totalXP - ((progress.level - 1) * 300)) / 300 * 100);
        this.updateProgressBar('.weekly-progress', (progress.weeklyMinutes / progress.weeklyGoal) * 100);

        // Update learning paths
        this.updateLearningPaths();
    }

    updateStat(statId, value) {
        const element = document.querySelector(`[data-stat="${statId}"]`);
        if (element) {
            this.animateCounter(element, parseInt(element.textContent) || 0, value);
        }
    }

    animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    updateProgressCircle(selector, percentage) {
        const circles = document.querySelectorAll(`${selector} .progress-ring-progress`);
        circles.forEach(circle => {
            const circumference = 2 * Math.PI * 90; // radius = 90
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        });

        const percentElements = document.querySelectorAll(`${selector} .progress-percent`);
        percentElements.forEach(element => {
            this.animateCounter(element, 0, percentage);
        });
    }

    updateProgressBar(selector, percentage) {
        const bars = document.querySelectorAll(`${selector} .progress-fill`);
        bars.forEach(bar => {
            bar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        });
    }

    updateLearningPaths() {
        // This would typically load from an API
        const paths = [
            {
                id: 'javascript-basics',
                title: 'JavaScript Fundamentals',
                description: 'Master the building blocks of modern web development',
                progress: 75,
                difficulty: 'beginner',
                icon: 'fab fa-js-square',
                isCurrent: true
            },
            {
                id: 'react-intro',
                title: 'React Introduction',
                description: 'Learn the popular frontend framework',
                progress: 0,
                difficulty: 'intermediate',
                icon: 'fab fa-react',
                isCurrent: false
            },
            {
                id: 'node-backend',
                title: 'Node.js Backend',
                description: 'Build scalable server-side applications',
                progress: 30,
                difficulty: 'intermediate',
                icon: 'fab fa-node-js',
                isCurrent: false
            }
        ];

        this.renderLearningPaths(paths);
    }

    renderLearningPaths(paths) {
        const container = document.querySelector('.learning-paths');
        if (!container) return;

        container.innerHTML = paths.map(path => `
            <div class="path-card ${path.isCurrent ? 'current-path' : ''}">
                <div class="path-header">
                    <div class="path-icon">
                        <i class="${path.icon}"></i>
                    </div>
                    <div class="path-info">
                        <h4>${path.title}</h4>
                        <p>${path.description}</p>
                        <div class="path-difficulty">
                            <span class="difficulty-badge ${path.difficulty}">${path.difficulty}</span>
                        </div>
                    </div>
                </div>
                <div class="path-progress">
                    <div class="progress-bar-custom">
                        <div class="progress-fill" style="width: ${path.progress}%"></div>
                    </div>
                    <span class="progress-text">${path.progress}%</span>
                </div>
                <div class="path-actions">
                    ${path.progress > 0 
                        ? `<button class="btn btn-primary-custom btn-sm btn-continue" data-path-id="${path.id}">
                             <i class="fas fa-play"></i> Continue
                           </button>`
                        : `<button class="btn btn-outline-custom btn-sm btn-start" data-path-id="${path.id}">
                             <i class="fas fa-rocket"></i> Start
                           </button>`
                    }
                </div>
            </div>
        `).join('');

        // Re-setup event listeners for new buttons
        this.setupLearningPathActions();
    }

    setupNavigation() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-link[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Hide current view
        const currentView = document.querySelector('.view-container:not(.hidden)');
        if (currentView) {
            currentView.classList.add('hidden');
        }

        // Show new view
        setTimeout(() => {
            const newView = document.querySelector(`[data-view-content="${viewName}"]`);
            if (newView) {
                newView.classList.remove('hidden');
                this.animateViewTransition(newView);
            }
        }, 300);

        this.currentView = viewName;

        // Handle specific view logic
        this.handleViewChange(viewName);
    }

    handleViewChange(viewName) {
        switch (viewName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'paths':
                this.loadLearningPaths();
                break;
            case 'progress':
                this.loadProgressData();
                break;
            case 'achievements':
                this.loadAchievements();
                break;
        }
    }

    animateViewTransition(element) {
        // Add entrance animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    animatePageLoad() {
        // Animate elements on page load
        const elements = document.querySelectorAll('.stat-item, .section-card, .path-card');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    startProgressAnimations() {
        // Start progress circle animations
        setTimeout(() => {
            this.updateProgressDisplay(this.getUserProgress());
        }, 1000);
    }

    async continueLearningPath(pathId) {
        this.showTransition('Preparing your learning session...', 1500);
        
        // Simulate loading
        await this.delay(1500);
        
        this.hideTransition();
        this.showAlert('success', 'Resuming your learning session!');
        
        // Here you would typically navigate to the learning interface
        console.log(`Continuing learning path: ${pathId}`);
    }

    async startLearningPath(pathId) {
        this.showTransition('Setting up your new learning path...', 2000);
        
        // Simulate setup
        await this.delay(2000);
        
        this.hideTransition();
        this.showAlert('success', 'Welcome to your new learning journey!');
        
        // Here you would typically navigate to the learning interface
        console.log(`Starting learning path: ${pathId}`);
    }

    continueCurrentLearningSession() {
        // Get current learning session
        const currentPath = 'javascript-basics'; // This would come from user data
        this.continueLearningPath(currentPath);
    }

    initializeLearningEngine() {
        // Initialize the adaptive learning engine
        // This would integrate with the original learning system components
        console.log('Initializing learning engine...');
    }

    handleLogout() {
        this.showTransition('Signing you out...', 1500);
        
        setTimeout(() => {
            this.sessionManager.clearSession();
            window.location.href = 'index.html';
        }, 1500);
    }

    handleResize() {
        // Handle responsive layout changes
        this.updateProgressDisplay(this.getUserProgress());
    }

    loadDashboardData() {
        // Load dashboard-specific data
        console.log('Loading dashboard data...');
    }

    loadLearningPaths() {
        // Load all available learning paths
        console.log('Loading learning paths...');
    }

    loadProgressData() {
        // Load detailed progress analytics
        console.log('Loading progress data...');
    }

    loadAchievements() {
        // Load user achievements
        console.log('Loading achievements...');
    }

    showTransition(message, duration = 2000) {
        const overlay = document.getElementById('transitionOverlay');
        const messageElement = document.getElementById('transitionMessage');
        
        if (overlay && messageElement) {
            messageElement.textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideTransition() {
        const overlay = document.getElementById('transitionOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    showAlert(type, message) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        
        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                max-width: 500px;
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
                border-radius: 12px;
                box-shadow: var(--shadow-lg);
                animation: slideInFromRight 0.3s ease;
            ">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <i class="${iconClass}" style="font-size: 1.2rem; color: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};"></i>
                    <span style="flex: 1; color: var(--text-primary);">${message}</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="filter: invert(1);"></button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHTML);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Learning Progress Tracker
class ProgressTracker {
    constructor() {
        this.sessionStart = Date.now();
        this.activities = [];
    }

    trackActivity(type, data) {
        const activity = {
            type,
            data,
            timestamp: Date.now(),
            duration: Date.now() - this.sessionStart
        };
        
        this.activities.push(activity);
        this.saveProgress();
    }

    saveProgress() {
        localStorage.setItem('learning_progress', JSON.stringify(this.activities));
    }

    getSessionStats() {
        const sessionDuration = Date.now() - this.sessionStart;
        const completedActivities = this.activities.filter(a => a.type === 'completed').length;
        
        return {
            duration: sessionDuration,
            activities: this.activities.length,
            completed: completedActivities
        };
    }
}

// Notification System
class NotificationSystem {
    static requestPermission() {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    static showNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    }

    static showLearningReminder() {
        this.showNotification('Time for learning! 📚', {
            body: 'Ready to continue your learning journey?',
            tag: 'learning-reminder'
        });
    }

    static showStreakNotification(days) {
        this.showNotification(`🔥 ${days} Day Streak!`, {
            body: 'Keep up the amazing work!',
            tag: 'streak-notification'
        });
    }
}

// Session Manager (if not already loaded from auth.js)
if (typeof SessionManager === 'undefined') {
    class SessionManager {
        constructor() {
            this.sessionKey = 'learning_session';
            this.tokenKey = 'auth_token';
        }
        
        getSession() {
            const sessionData = localStorage.getItem(this.sessionKey);
            if (!sessionData) return null;
            
            const session = JSON.parse(sessionData);
            
            // Check if session expired
            if (Date.now() > session.expiresAt) {
                this.clearSession();
                return null;
            }
            
            return session;
        }
        
        clearSession() {
            localStorage.removeItem(this.sessionKey);
            localStorage.removeItem(this.tokenKey);
        }
        
        isAuthenticated() {
            const session = this.getSession();
            return session !== null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardSystem = new DashboardSystem();
    window.progressTracker = new ProgressTracker();
    
    // Request notification permission
    NotificationSystem.requestPermission();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        DashboardSystem, 
        ProgressTracker, 
        NotificationSystem,
        SessionManager 
    };
}
