// Lessons Page JavaScript

// Lesson State Management
const lessonState = {
    currentStep: 0,
    totalSteps: 5,
    questionsAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
    xpEarned: 0,
    timeStarted: null,
    timeSpent: 0,
    isPaused: false,
    currentQuestion: 0,
    totalQuestions: 5,
    masteryLevel: 0.75,
    answers: []
};

// Sample lesson data
const lessonData = {
    id: 'linear-equations-101',
    pathId: 'advanced-math',
    pathName: 'Advanced Mathematics',
    conceptName: 'Linear Equations',
    difficulty: 'intermediate',
    estimatedTime: 15,
    totalQuestions: 5,
    description: 'Learn how to solve linear equations and apply them to real-world problems.',
    objectives: [
        'Understand what a linear equation is',
        'Learn how to solve linear equations',
        'Apply linear equations to real-world problems',
        'Verify solutions'
    ],
    questions: [
        {
            id: 1,
            text: 'Solve for x: 2x + 3 = 7',
            type: 'equation',
            correctAnswer: '2',
            explanation: 'Starting with: 2x + 3 = 7\nSubtract 3 from both sides: 2x = 4\nDivide both sides by 2: x = 2',
            hints: [
                'Think about what you need to do to isolate x on one side of the equation.',
                'Try subtracting 3 from both sides first.',
                'Then divide both sides by 2.'
            ]
        },
        {
            id: 2,
            text: 'Solve for x: 5x - 10 = 15',
            type: 'equation',
            correctAnswer: '5',
            explanation: 'Starting with: 5x - 10 = 15\nAdd 10 to both sides: 5x = 25\nDivide both sides by 5: x = 5',
            hints: [
                'What operation is the opposite of subtraction?',
                'Add 10 to both sides.',
                'Then divide by 5.'
            ]
        },
        {
            id: 3,
            text: 'Solve for x: 3x + 2 = 2x + 5',
            type: 'equation',
            correctAnswer: '3',
            explanation: 'Starting with: 3x + 2 = 2x + 5\nSubtract 2x from both sides: x + 2 = 5\nSubtract 2 from both sides: x = 3',
            hints: [
                'Get all x terms on one side.',
                'Subtract 2x from both sides.',
                'Then subtract 2 from both sides.'
            ]
        },
        {
            id: 4,
            text: 'Solve for x: (x + 4)/2 = 6',
            type: 'equation',
            correctAnswer: '8',
            explanation: 'Starting with: (x + 4)/2 = 6\nMultiply both sides by 2: x + 4 = 12\nSubtract 4 from both sides: x = 8',
            hints: [
                'What is the opposite of division?',
                'Multiply both sides by 2.',
                'Then subtract 4.'
            ]
        },
        {
            id: 5,
            text: 'Solve for x: 2(x - 3) = 10',
            type: 'equation',
            correctAnswer: '8',
            explanation: 'Starting with: 2(x - 3) = 10\nDivide both sides by 2: x - 3 = 5\nAdd 3 to both sides: x = 8',
            hints: [
                'Start by dividing both sides by 2.',
                'Then add 3 to both sides.',
                'Remember to distribute the 2 first if needed.'
            ]
        }
    ],
    relatedConcepts: [
        'Quadratic Equations',
        'Systems of Equations',
        'Graphing Lines'
    ]
};

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    loadLessonData();
    setupEventListeners();
    startTimer();
});

/**
 * Load lesson data into the page
 */
function loadLessonData() {
    document.getElementById('pathName').textContent = lessonData.pathName;
    document.getElementById('conceptName').textContent = lessonData.conceptName;
    document.getElementById('totalQuestions').textContent = lessonData.totalQuestions;
    
    // Load related concepts
    const relatedConceptsList = document.querySelector('.related-concepts');
    relatedConceptsList.innerHTML = lessonData.relatedConcepts.map(concept => `
        <a href="#" class="concept-link">
            <i class="fas fa-arrow-right"></i>
            <span>${concept}</span>
        </a>
    `).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('pauseModal');
        if (e.target === modal.querySelector('.modal-overlay')) {
            resumeLesson();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (!document.getElementById('pauseModal').classList.contains('hidden')) {
                resumeLesson();
            }
        }
        if (e.key === 'Enter' && !document.getElementById('questionSection').classList.contains('hidden')) {
            submitAnswer();
        }
    });
}

/**
 * Start the lesson
 */
function startLesson() {
    hideAllSections();
    document.getElementById('conceptSection').classList.remove('hidden');
    lessonState.currentStep = 1;
    updateProgress();
}

/**
 * Move to next step
 */
function nextStep() {
    if (lessonState.currentStep === 1) {
        // Concept explanation -> Question
        hideAllSections();
        document.getElementById('questionSection').classList.remove('hidden');
        lessonState.currentStep = 2;
        loadQuestion();
    }
}

/**
 * Move to previous step
 */
function previousStep() {
    if (lessonState.currentStep === 2) {
        // Question -> Concept explanation
        hideAllSections();
        document.getElementById('conceptSection').classList.remove('hidden');
        lessonState.currentStep = 1;
    }
}

/**
 * Load a question
 */
function loadQuestion() {
    const question = lessonData.questions[lessonState.currentQuestion];
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('answerInput').value = '';
    document.getElementById('justificationInput').value = '';
    document.getElementById('hintBox').style.display = 'none';
    updateProgress();
}

/**
 * Show hint
 */
function showHint() {
    const question = lessonData.questions[lessonState.currentQuestion];
    const hintIndex = Math.min(lessonState.answers[lessonState.currentQuestion]?.hints || 0, question.hints.length - 1);
    document.getElementById('hintContent').textContent = question.hints[hintIndex];
    document.getElementById('hintBox').style.display = 'block';
    
    // Track hint usage
    if (!lessonState.answers[lessonState.currentQuestion]) {
        lessonState.answers[lessonState.currentQuestion] = { hints: 0 };
    }
    lessonState.answers[lessonState.currentQuestion].hints++;
}

/**
 * Submit answer
 */
function submitAnswer() {
    const answer = document.getElementById('answerInput').value.trim();
    const justification = document.getElementById('justificationInput').value.trim();
    const question = lessonData.questions[lessonState.currentQuestion];

    // Validate inputs
    if (!answer) {
        showNotification('Please enter an answer', 'error');
        return;
    }

    if (!justification) {
        showNotification('Please explain your reasoning', 'error');
        return;
    }

    // Check answer
    const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
    
    // Store answer
    lessonState.answers[lessonState.currentQuestion] = {
        answer: answer,
        justification: justification,
        isCorrect: isCorrect,
        hints: lessonState.answers[lessonState.currentQuestion]?.hints || 0
    };

    lessonState.questionsAnswered++;
    if (isCorrect) {
        lessonState.correctAnswers++;
    }

    // Show feedback
    showFeedback(isCorrect, question);
}

/**
 * Show feedback
 */
function showFeedback(isCorrect, question) {
    hideAllSections();
    document.getElementById('feedbackSection').classList.remove('hidden');

    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const feedbackExplanation = document.getElementById('feedbackExplanation');

    if (isCorrect) {
        feedbackTitle.textContent = 'Excellent!';
        feedbackMessage.textContent = `Your answer is correct! You correctly identified that ${question.correctAnswer} is the solution.`;
        feedbackMessage.style.color = 'var(--success-color)';
    } else {
        feedbackTitle.textContent = 'Not Quite Right';
        feedbackMessage.textContent = `The correct answer is ${question.correctAnswer}. Let's review the steps.`;
        feedbackMessage.style.color = 'var(--error-color)';
    }

    feedbackExplanation.innerHTML = `
        <h5>Explanation:</h5>
        <p>${question.explanation.split('\n').join('</p><p>')}</p>
    `;

    updateProgress();
}

/**
 * Move to next question
 */
function nextQuestion() {
    lessonState.currentQuestion++;

    if (lessonState.currentQuestion < lessonData.totalQuestions) {
        hideAllSections();
        document.getElementById('questionSection').classList.remove('hidden');
        loadQuestion();
    } else {
        // Lesson complete
        completeLesson();
    }
}

/**
 * Review concept
 */
function reviewConcept() {
    hideAllSections();
    document.getElementById('conceptSection').classList.remove('hidden');
}

/**
 * Complete lesson
 */
function completeLesson() {
    // Calculate statistics
    lessonState.accuracy = Math.round((lessonState.correctAnswers / lessonState.questionsAnswered) * 100);
    lessonState.xpEarned = Math.round(150 * (lessonState.accuracy / 100));

    // Update mastery level
    if (lessonState.accuracy >= 90) {
        lessonState.masteryLevel = 0.9;
    } else if (lessonState.accuracy >= 75) {
        lessonState.masteryLevel = 0.75;
    } else if (lessonState.accuracy >= 60) {
        lessonState.masteryLevel = 0.6;
    } else {
        lessonState.masteryLevel = 0.4;
    }

    // Display completion screen
    hideAllSections();
    document.getElementById('completeSection').classList.remove('hidden');

    document.getElementById('questionsAnswered').textContent = lessonState.questionsAnswered;
    document.getElementById('accuracyScore').textContent = lessonState.accuracy + '%';
    document.getElementById('xpEarned').textContent = lessonState.xpEarned;

    const masteryFill = document.querySelector('#completeSection .mastery-fill');
    masteryFill.style.width = (lessonState.masteryLevel * 100) + '%';

    const masteryText = document.querySelector('#completeSection .mastery-text');
    const masteryLevels = ['Started', 'Familiar', 'Proficient', 'Fluent'];
    const levelIndex = Math.floor(lessonState.masteryLevel * 3);
    masteryText.textContent = masteryLevels[levelIndex] + ` (${Math.round(lessonState.masteryLevel * 100)}%)`;

    updateProgress();
    stopTimer();
    saveProgress();
}

/**
 * Review lesson
 */
function reviewLesson() {
    hideAllSections();
    document.getElementById('conceptSection').classList.remove('hidden');
    lessonState.currentStep = 1;
}

/**
 * Next lesson
 */
function nextLesson() {
    showNotification('Loading next lesson...', 'info');
    setTimeout(() => {
        window.location.href = 'lessons.html?lesson=2';
    }, 1500);
}

/**
 * Pause lesson
 */
function pauseLesson() {
    lessonState.isPaused = true;
    document.getElementById('pauseModal').classList.remove('hidden');
    document.getElementById('pauseQuestionsCompleted').textContent = 
        lessonState.questionsAnswered + '/' + lessonData.totalQuestions;
    document.getElementById('pauseTimeSpent').textContent = formatTime(lessonState.timeSpent);
}

/**
 * Resume lesson
 */
function resumeLesson() {
    lessonState.isPaused = false;
    document.getElementById('pauseModal').classList.add('hidden');
}

/**
 * Exit lesson
 */
function exitLesson() {
    if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
        saveProgress();
        window.location.href = 'learning-paths.html';
    }
}

/**
 * Hide all sections
 */
function hideAllSections() {
    document.querySelectorAll('.lesson-section').forEach(section => {
        section.classList.add('hidden');
    });
}

/**
 * Update progress bar
 */
function updateProgress() {
    const progress = Math.round((lessonState.currentQuestion / lessonData.totalQuestions) * 100);
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('lessonProgress').textContent = progress + '%';
}

/**
 * Start timer
 */
function startTimer() {
    lessonState.timeStarted = Date.now();
    setInterval(() => {
        if (!lessonState.isPaused) {
            lessonState.timeSpent = Math.floor((Date.now() - lessonState.timeStarted) / 1000);
        }
    }, 1000);
}

/**
 * Stop timer
 */
function stopTimer() {
    // Timer stopped
}

/**
 * Format time
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

/**
 * Save progress
 */
function saveProgress() {
    const progressData = {
        lessonId: lessonData.id,
        pathId: lessonData.pathId,
        questionsAnswered: lessonState.questionsAnswered,
        correctAnswers: lessonState.correctAnswers,
        accuracy: lessonState.accuracy,
        xpEarned: lessonState.xpEarned,
        timeSpent: lessonState.timeSpent,
        masteryLevel: lessonState.masteryLevel,
        answers: lessonState.answers,
        completedAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem(`lesson_${lessonData.id}`, JSON.stringify(progressData));

    // In production, send to backend API
    console.log('Progress saved:', progressData);
}

/**
 * Show notification
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
 * Get notification icon
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
 * Logout
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startLesson,
        submitAnswer,
        nextQuestion,
        completeLesson,
        pauseLesson,
        exitLesson
    };
}
