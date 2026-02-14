// Learning Paths Page JavaScript

// Sample learning paths data
const learningPaths = [
    {
        id: 'advanced-math',
        name: 'Advanced Mathematics',
        category: 'mathematics',
        description: 'Master complex mathematical concepts including calculus, linear algebra, and differential equations.',
        difficulty: 'advanced',
        duration: 45,
        concepts: 12,
        enrolled: 2345,
        rating: 4.8,
        progress: 75,
        status: 'enrolled',
        icon: 'fa-calculator',
        objectives: [
            'Understand calculus fundamentals',
            'Master linear algebra concepts',
            'Apply differential equations',
            'Solve real-world problems'
        ],
        prerequisites: ['Basic Mathematics', 'Algebra Fundamentals'],
        conceptsList: [
            'Limits and Continuity',
            'Derivatives',
            'Integrals',
            'Series and Sequences',
            'Multivariable Calculus',
            'Linear Transformations',
            'Eigenvalues and Eigenvectors',
            'Differential Equations',
            'Partial Derivatives',
            'Vector Calculus',
            'Complex Analysis',
            'Numerical Methods'
        ]
    },
    {
        id: 'physics-101',
        name: 'Physics Fundamentals',
        category: 'physics',
        description: 'Explore the laws of motion, energy, and forces through interactive simulations and experiments.',
        difficulty: 'intermediate',
        duration: 35,
        concepts: 11,
        enrolled: 1876,
        rating: 4.7,
        progress: 45,
        status: 'enrolled',
        icon: 'fa-atom',
        objectives: [
            'Understand Newton\'s laws',
            'Master energy concepts',
            'Apply force calculations',
            'Analyze motion problems'
        ],
        prerequisites: ['Basic Mathematics'],
        conceptsList: [
            'Kinematics',
            'Newton\'s Laws',
            'Work and Energy',
            'Momentum and Collisions',
            'Circular Motion',
            'Gravitation',
            'Oscillations',
            'Waves',
            'Thermodynamics',
            'Electromagnetism',
            'Modern Physics'
        ]
    },
    {
        id: 'programming-101',
        name: 'Programming Fundamentals',
        category: 'programming',
        description: 'Learn the foundations of programming with hands-on projects and real-world applications.',
        difficulty: 'beginner',
        duration: 30,
        concepts: 10,
        enrolled: 3456,
        rating: 4.9,
        progress: 0,
        status: 'available',
        icon: 'fa-code',
        objectives: [
            'Learn programming basics',
            'Master control structures',
            'Build functions and modules',
            'Create real-world projects'
        ],
        prerequisites: [],
        conceptsList: [
            'Variables and Data Types',
            'Operators and Expressions',
            'Control Flow',
            'Functions',
            'Arrays and Lists',
            'Object-Oriented Programming',
            'Error Handling',
            'File I/O',
            'Debugging',
            'Best Practices'
        ]
    },
    {
        id: 'accounting-basics',
        name: 'Accounting Basics',
        category: 'accounting',
        description: 'Master fundamental accounting principles and practices for business management.',
        difficulty: 'beginner',
        duration: 25,
        concepts: 9,
        enrolled: 1234,
        rating: 4.6,
        progress: 0,
        status: 'available',
        icon: 'fa-chart-bar',
        objectives: [
            'Understand accounting principles',
            'Master journal entries',
            'Create financial statements',
            'Analyze financial data'
        ],
        prerequisites: [],
        conceptsList: [
            'Accounting Equation',
            'Journal Entries',
            'Ledger Accounts',
            'Trial Balance',
            'Financial Statements',
            'Depreciation Methods',
            'Inventory Valuation',
            'Ratio Analysis',
            'Cash Flow Analysis'
        ]
    },
    {
        id: 'chemistry-essentials',
        name: 'Chemistry Essentials',
        category: 'chemistry',
        description: 'Explore chemical reactions, atomic structure, and molecular bonding through interactive labs.',
        difficulty: 'intermediate',
        duration: 40,
        concepts: 13,
        enrolled: 1567,
        rating: 4.7,
        progress: 0,
        status: 'available',
        icon: 'fa-flask',
        objectives: [
            'Understand atomic structure',
            'Master chemical bonding',
            'Learn reaction mechanisms',
            'Apply stoichiometry'
        ],
        prerequisites: ['Basic Mathematics'],
        conceptsList: [
            'Atomic Structure',
            'Periodic Table',
            'Chemical Bonding',
            'Molecular Geometry',
            'States of Matter',
            'Thermochemistry',
            'Kinetics',
            'Equilibrium',
            'Acids and Bases',
            'Redox Reactions',
            'Organic Chemistry',
            'Polymers',
            'Biochemistry'
        ]
    },
    {
        id: 'data-science-101',
        name: 'Data Science Fundamentals',
        category: 'programming',
        description: 'Learn data analysis, visualization, and machine learning basics for real-world applications.',
        difficulty: 'intermediate',
        duration: 50,
        concepts: 14,
        enrolled: 2789,
        rating: 4.8,
        progress: 0,
        status: 'available',
        icon: 'fa-chart-line',
        objectives: [
            'Master data analysis',
            'Create visualizations',
            'Learn machine learning',
            'Build predictive models'
        ],
        prerequisites: ['Programming Fundamentals'],
        conceptsList: [
            'Data Collection',
            'Data Cleaning',
            'Exploratory Analysis',
            'Statistical Methods',
            'Data Visualization',
            'Probability',
            'Hypothesis Testing',
            'Regression Analysis',
            'Classification',
            'Clustering',
            'Neural Networks',
            'Deep Learning',
            'Model Evaluation',
            'Deployment'
        ]
    }
];

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    loadPaths();
    setupEventListeners();
});

/**
 * Load and display learning paths
 */
function loadPaths() {
    const pathsGrid = document.getElementById('pathsGrid');
    pathsGrid.innerHTML = '';

    learningPaths.forEach(path => {
        const pathCard = createPathCard(path);
        pathsGrid.appendChild(pathCard);
    });
}

/**
 * Create a path card element
 */
function createPathCard(path) {
    const card = document.createElement('div');
    card.className = `path-card ${path.status}`;
    card.dataset.pathId = path.id;
    card.dataset.category = path.category;
    card.dataset.difficulty = path.difficulty;
    card.dataset.duration = path.duration;
    card.dataset.status = path.status;

    const difficultyClass = `difficulty-${path.difficulty}`;
    const statusText = path.status === 'enrolled' ? 'Continue' : path.status === 'completed' ? 'Review' : 'Start';
    const progressHtml = path.progress > 0 ? `
        <div class="path-progress">
            <div class="progress-label">
                <span class="progress-label-text">Progress</span>
                <span class="progress-percentage">${path.progress}%</span>
            </div>
            <div class="progress-bar-custom">
                <div class="progress-fill" style="width: ${path.progress}%"></div>
            </div>
        </div>
    ` : '';

    card.innerHTML = `
        <div class="path-header">
            <div class="path-icon">
                <i class="fas ${path.icon}"></i>
            </div>
            <div>
                <div class="path-title">${path.name}</div>
                <div class="path-category">${path.category}</div>
            </div>
        </div>

        <div class="path-difficulty ${difficultyClass}">
            ${path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
        </div>

        <p class="path-description">${path.description}</p>

        <div class="path-meta">
            <div class="meta-item">
                <span class="meta-label">Duration</span>
                <span class="meta-value">${path.duration}h</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Concepts</span>
                <span class="meta-value">${path.concepts}</span>
            </div>
        </div>

        ${progressHtml}

        <div class="path-actions">
            <button class="btn btn-primary-custom" onclick="openPathDetails('${path.id}')">
                <i class="fas fa-info-circle"></i> Details
            </button>
            <button class="btn btn-outline-custom" onclick="enrollPath('${path.id}')">
                <i class="fas fa-play"></i> ${statusText}
            </button>
        </div>
    `;

    return card;
}

/**
 * Filter paths based on search and filters
 */
function filterPaths() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const difficulty = document.getElementById('difficultyFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const status = document.getElementById('statusFilter').value;

    const pathCards = document.querySelectorAll('.path-card');
    let visibleCount = 0;

    pathCards.forEach(card => {
        const pathId = card.dataset.pathId;
        const path = learningPaths.find(p => p.id === pathId);

        // Search filter
        const matchesSearch = path.name.toLowerCase().includes(searchTerm) ||
                            path.description.toLowerCase().includes(searchTerm) ||
                            path.category.toLowerCase().includes(searchTerm);

        // Difficulty filter
        const matchesDifficulty = !difficulty || path.difficulty === difficulty;

        // Category filter
        const matchesCategory = !category || path.category === category;

        // Duration filter
        let matchesDuration = true;
        if (duration === 'short') matchesDuration = path.duration < 5;
        else if (duration === 'medium') matchesDuration = path.duration >= 5 && path.duration <= 20;
        else if (duration === 'long') matchesDuration = path.duration > 20;

        // Status filter
        let matchesStatus = true;
        if (status === 'enrolled') matchesStatus = path.status === 'enrolled';
        else if (status === 'completed') matchesStatus = path.status === 'completed';
        else if (status === 'available') matchesStatus = path.status === 'available';

        const shouldShow = matchesSearch && matchesDifficulty && matchesCategory && matchesDuration && matchesStatus;

        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
    });

    // Show/hide no results message
    const noResults = document.getElementById('noResults');
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';

    // Update search clear button
    const searchClear = document.querySelector('.search-clear');
    if (searchClear) {
        searchClear.style.display = searchTerm ? 'block' : 'none';
    }
}

/**
 * Clear search input
 */
function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterPaths();
}

/**
 * Reset all filters
 */
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('difficultyFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('durationFilter').value = '';
    document.getElementById('statusFilter').value = '';
    filterPaths();
}

/**
 * Open path details modal
 */
function openPathDetails(pathId) {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return;

    // Populate modal
    document.getElementById('modalPathName').textContent = path.name;
    document.getElementById('modalPathDescription').textContent = path.description;
    document.getElementById('modalPathDifficulty').textContent = 
        path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1);
    document.getElementById('modalPathDuration').textContent = `${path.duration} hours`;
    document.getElementById('modalPathConcepts').textContent = path.concepts;
    document.getElementById('modalPathEnrolled').textContent = path.enrolled.toLocaleString();

    // Objectives
    const objectivesList = document.getElementById('modalPathObjectives');
    objectivesList.innerHTML = path.objectives.map(obj => `<li>${obj}</li>`).join('');

    // Prerequisites
    const prerequisitesList = document.getElementById('modalPathPrerequisites');
    if (path.prerequisites.length > 0) {
        prerequisitesList.innerHTML = path.prerequisites.map(prereq => `
            <div class="prerequisite-item">
                <i class="fas fa-check-circle"></i>
                <span>${prereq}</span>
            </div>
        `).join('');
    } else {
        prerequisitesList.innerHTML = '<div class="prerequisite-item"><i class="fas fa-check-circle"></i><span>No prerequisites</span></div>';
    }

    // Concepts
    const conceptsList = document.getElementById('modalPathConceptsList');
    conceptsList.innerHTML = path.conceptsList.map(concept => `
        <div class="concept-item">
            <i class="fas fa-book"></i>
            <span>${concept}</span>
        </div>
    `).join('');

    // Update enroll button
    const enrollButton = document.getElementById('enrollButton');
    const statusText = path.status === 'enrolled' ? 'Continue' : path.status === 'completed' ? 'Review' : 'Start Path';
    enrollButton.textContent = statusText;
    enrollButton.dataset.pathId = pathId;

    // Show modal
    document.getElementById('pathDetailsModal').classList.remove('hidden');
}

/**
 * Close path details modal
 */
function closePathModal() {
    document.getElementById('pathDetailsModal').classList.add('hidden');
}

/**
 * Confirm enrollment
 */
function confirmEnroll() {
    const pathId = document.getElementById('enrollButton').dataset.pathId;
    enrollPath(pathId);
    closePathModal();
}

/**
 * Enroll in a path
 */
function enrollPath(pathId) {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return;

    if (path.status === 'available') {
        // Enroll user
        path.status = 'enrolled';
        path.progress = 0;
        
        showNotification(`Successfully enrolled in ${path.name}!`, 'success');
        loadPaths();
        filterPaths();
    } else if (path.status === 'enrolled') {
        // Continue learning
        showNotification(`Continuing ${path.name}...`, 'info');
        // In production, navigate to learning page
        // window.location.href = `learning.html?path=${pathId}`;
    } else if (path.status === 'completed') {
        // Review path
        showNotification(`Reviewing ${path.name}...`, 'info');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('pathDetailsModal');
        if (e.target === modal.querySelector('.modal-overlay')) {
            closePathModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePathModal();
        }
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                backdrop-filter: blur(20px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: slideInRight 0.3s ease;
                z-index: 10000;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: var(--text-primary);
                font-weight: 500;
            }
            
            .notification-success {
                border-color: var(--success-color);
            }
            
            .notification-success .notification-content i {
                color: var(--success-color);
            }
            
            .notification-error {
                border-color: var(--error-color);
            }
            
            .notification-error .notification-content i {
                color: var(--error-color);
            }
            
            .notification-info {
                border-color: var(--primary-light);
            }
            
            .notification-info .notification-content i {
                color: var(--primary-light);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 1rem;
                padding: 0;
                transition: color 0.3s ease;
            }
            
            .notification-close:hover {
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    bottom: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadPaths,
        filterPaths,
        enrollPath,
        openPathDetails,
        closePathModal
    };
}
