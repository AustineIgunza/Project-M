/**
 * Core Learning Engine - Main orchestrator for the adaptive learning system
 * Implements the unavoidable flow: Introduce -> Practice -> Assess
 */
class LearningEngine {
    constructor() {
        this.currentPhase = 'introduction';
        this.currentUnit = null;
        this.userProfile = {
            level: 1,
            experience: 0,
            streak: 0,
            masteredConcepts: new Set(),
            weakConcepts: new Set(),
            learningStyle: null
        };
        
        this.phases = {
            introduction: 'introduction-phase',
            learning: 'learning-phase', 
            assessment: 'assessment-phase',
            results: 'results-phase'
        };
        
        this.missionGenerator = new MissionGenerator();
        this.masteryTracker = new MasteryTracker();
        this.socraticEngine = new SocraticEngine();
        this.justificationValidator = new JustificationValidator();
        this.progressionGate = new ProgressionGate();
        
        this.currentAttempts = 0;
        this.maxAttempts = 3;
        this.hintsUsed = 0;
        this.startTime = null;
        
        this.initializeEngine();
    }
    
    /**
     * Initialize the learning engine and load user data
     */
    async initializeEngine() {
        try {
            await this.loadUserProfile();
            await this.loadCurrentUnit();
            this.initializeUI();
            this.startLearningSession();
        } catch (error) {
            console.error('Failed to initialize learning engine:', error);
            this.showError('System initialization failed. Please refresh the page.');
        }
    }
    
    /**
     * Load user profile from storage or create new profile
     */
    async loadUserProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
            this.userProfile.masteredConcepts = new Set(this.userProfile.masteredConcepts);
            this.userProfile.weakConcepts = new Set(this.userProfile.weakConcepts);
        }
        this.updateUIProgress();
    }
    
    /**
     * Save user profile to storage
     */
    saveUserProfile() {
        const profileToSave = {
            ...this.userProfile,
            masteredConcepts: Array.from(this.userProfile.masteredConcepts),
            weakConcepts: Array.from(this.userProfile.weakConcepts)
        };
        localStorage.setItem('userProfile', JSON.stringify(profileToSave));
    }
    
    /**
     * Load or generate the current learning unit
     */
    async loadCurrentUnit() {
        // Check for saved progress
        const savedUnit = sessionStorage.getItem('currentUnit');
        if (savedUnit) {
            this.currentUnit = JSON.parse(savedUnit);
            return;
        }
        
        // Generate new unit based on user's current level and weak concepts
        this.currentUnit = await this.generateNewUnit();
        this.saveCurrentUnit();
    }
    
    /**
     * Generate a new learning unit based on user profile
     */
    async generateNewUnit() {
        const conceptToLearn = this.selectNextConcept();
        const finalChallenge = await this.missionGenerator.createFinalChallenge(conceptToLearn);
        
        return {
            id: Date.now(),
            concept: conceptToLearn,
            finalChallenge: finalChallenge,
            practiceQuestions: await this.missionGenerator.generatePracticeQuestions(conceptToLearn),
            currentQuestionIndex: 0,
            phase: 'introduction',
            attempts: 0,
            startTime: Date.now(),
            masteryScore: 0
        };
    }
    
    /**
     * Select the next concept to learn based on user progress
     */
    selectNextConcept() {
        // Prioritize weak concepts that need reinforcement
        if (this.userProfile.weakConcepts.size > 0) {
            const weakConcepts = Array.from(this.userProfile.weakConcepts);
            return weakConcepts[Math.floor(Math.random() * weakConcepts.length)];
        }
        
        // Otherwise, select next concept in curriculum
        return ConceptDatabase.getNextConcept(this.userProfile.level, this.userProfile.masteredConcepts);
    }
    
    /**
     * Save current unit progress
     */
    saveCurrentUnit() {
        sessionStorage.setItem('currentUnit', JSON.stringify(this.currentUnit));
    }
    
    /**
     * Initialize UI components and event listeners
     */
    initializeUI() {
        // Set up phase containers
        Object.values(this.phases).forEach(phaseId => {
            const element = document.getElementById(phaseId);
            if (element) element.classList.add('hidden');
        });
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize progress indicators
        this.updateUIProgress();
    }
    
    /**
     * Set up all UI event listeners
     */
    setupEventListeners() {
        // Submit response button
        const submitBtn = document.getElementById('submit-response');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleResponse());
        }
        
        // Hint button
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        
        // Feedback continue button
        const continueBtn = document.getElementById('feedback-continue');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.hideFeedback());
        }
        
        // Enter key submission
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.ctrlKey) {
                this.handleResponse();
            }
        });
        
        // Real-time validation
        const reasoningInput = document.getElementById('reasoning-input');
        if (reasoningInput) {
            reasoningInput.addEventListener('input', () => this.validateJustification());
        }
    }
    
    /**
     * Start a new learning session
     */
    startLearningSession() {
        this.startTime = Date.now();
        this.currentAttempts = 0;
        this.hintsUsed = 0;
        
        // Always start with introduction phase
        this.transitionToPhase('introduction');
    }
    
    /**
     * Transition between learning phases
     */
    transitionToPhase(newPhase) {
        // Hide current phase
        const currentElement = document.getElementById(this.phases[this.currentPhase]);
        if (currentElement) {
            currentElement.classList.add('hidden');
        }
        
        // Update current phase
        this.currentPhase = newPhase;
        this.currentUnit.phase = newPhase;
        
        // Show new phase
        const newElement = document.getElementById(this.phases[newPhase]);
        if (newElement) {
            newElement.classList.remove('hidden');
            newElement.classList.add('fade-in');
        }
        
        // Initialize phase-specific content
        this.initializePhase(newPhase);
        
        // Save progress
        this.saveCurrentUnit();
    }
    
    /**
     * Initialize content for a specific phase
     */
    initializePhase(phase) {
        switch (phase) {
            case 'introduction':
                this.showFinalChallengePreview();
                break;
            case 'learning':
                this.startActivelearning();
                break;
            case 'assessment':
                this.startFinalAssessment();
                break;
            case 'results':
                this.showResults();
                break;
        }
    }
    
    /**
     * Show preview of the final challenge to set context
     */
    showFinalChallengePreview() {
        const previewContainer = document.getElementById('final-challenge-preview');
        if (!previewContainer) return;
        
        const challenge = this.currentUnit.finalChallenge;
        previewContainer.innerHTML = `
            <h3>${challenge.title}</h3>
            <p class="challenge-description">${challenge.description}</p>
            <div class="challenge-context">
                <h4>You will need to:</h4>
                <ul>
                    ${challenge.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
            <div class="challenge-actions">
                <button onclick="learningEngine.transitionToPhase('learning')" class="submit-btn">
                    Begin Learning Journey
                </button>
            </div>
        `;
    }
    
    /**
     * Start the active learning phase with Socratic questioning
     */
    startActivelearning() {
        // Unlock notes after first attempt is made
        this.lockNotes();
        
        // Get current question
        const questionIndex = this.currentUnit.currentQuestionIndex;
        const question = this.currentUnit.practiceQuestions[questionIndex];
        
        if (!question) {
            // No more practice questions, move to assessment
            this.transitionToPhase('assessment');
            return;
        }
        
        // Generate Socratic question sequence
        const socraticSequence = this.socraticEngine.generateSequence(question);
        this.displayQuestion(socraticSequence.currentQuestion);
    }
    
    /**
     * Display a question in the learning interface
     */
    displayQuestion(questionData) {
        const questionContainer = document.getElementById('question-content');
        const inputArea = document.getElementById('input-area');
        
        if (!questionContainer || !inputArea) return;
        
        // Display question text
        questionContainer.innerHTML = `
            <h3>${questionData.title}</h3>
            <div class="question-text">${questionData.text}</div>
            ${questionData.context ? `<div class="question-context">${questionData.context}</div>` : ''}
        `;
        
        // Generate appropriate input based on question type
        this.generateQuestionInput(questionData, inputArea);
        
        // Reset response area
        this.clearResponseArea();
        
        // Update hints availability
        this.updateHintsAvailability(questionData);
    }
    
    /**
     * Generate appropriate input interface for question type
     */
    generateQuestionInput(questionData, container) {
        let inputHTML = '';
        
        switch (questionData.type) {
            case 'multiple-choice':
                inputHTML = `
                    <div class="multiple-choice">
                        ${questionData.options.map((option, index) => `
                            <label class="choice-option">
                                <input type="radio" name="answer" value="${index}">
                                <span>${option}</span>
                            </label>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'numerical':
                inputHTML = `
                    <div class="numerical-input">
                        <input type="number" id="numerical-answer" placeholder="Enter your answer" step="any">
                        ${questionData.unit ? `<span class="unit">${questionData.unit}</span>` : ''}
                    </div>
                `;
                break;
                
            case 'text':
                inputHTML = `
                    <div class="text-input">
                        <textarea id="text-answer" placeholder="Enter your answer here..." rows="4"></textarea>
                    </div>
                `;
                break;
                
            case 'ordering':
                inputHTML = `
                    <div class="ordering-container">
                        <div class="ordering-items" id="ordering-items">
                            ${questionData.items.map((item, index) => `
                                <div class="ordering-item" draggable="true" data-index="${index}">
                                    ${item}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                this.initializeDragAndDrop();
                break;
                
            case 'matching':
                inputHTML = `
                    <div class="matching-container">
                        <div class="matching-left">
                            ${questionData.leftItems.map((item, index) => `
                                <div class="matching-item" data-left="${index}">${item}</div>
                            `).join('')}
                        </div>
                        <div class="matching-right">
                            ${questionData.rightItems.map((item, index) => `
                                <div class="matching-item" data-right="${index}">${item}</div>
                            `).join('')}
                        </div>
                    </div>
                `;
                this.initializeMatching();
                break;
        }
        
        container.innerHTML = inputHTML;
    }
    
    /**
     * Handle user response submission
     */
    async handleResponse() {
        const userAnswer = this.extractUserAnswer();
        const reasoning = document.getElementById('reasoning-input')?.value || '';
        const confidence = document.getElementById('confidence-slider')?.value || 3;
        
        // Validate that user provided both answer and reasoning
        if (!userAnswer || !reasoning.trim()) {
            this.showFeedback('Please provide both an answer and your reasoning.', 'error');
            return;
        }
        
        // Increment attempts
        this.currentAttempts++;
        
        // Validate the response
        const validation = await this.validateResponse(userAnswer, reasoning, confidence);
        
        // Process the validation result
        this.processValidationResult(validation);
    }
    
    /**
     * Extract user answer from current input
     */
    extractUserAnswer() {
        const questionIndex = this.currentUnit.currentQuestionIndex;
        const question = this.currentUnit.practiceQuestions[questionIndex];
        
        switch (question.type) {
            case 'multiple-choice':
                const selected = document.querySelector('input[name="answer"]:checked');
                return selected ? parseInt(selected.value) : null;
                
            case 'numerical':
                const numInput = document.getElementById('numerical-answer');
                return numInput ? parseFloat(numInput.value) : null;
                
            case 'text':
                const textInput = document.getElementById('text-answer');
                return textInput ? textInput.value.trim() : null;
                
            case 'ordering':
                const items = document.querySelectorAll('#ordering-items .ordering-item');
                return Array.from(items).map(item => parseInt(item.dataset.index));
                
            case 'matching':
                const matches = document.querySelectorAll('.matched-pair');
                return Array.from(matches).map(pair => ({
                    left: parseInt(pair.dataset.left),
                    right: parseInt(pair.dataset.right)
                }));
                
            default:
                return null;
        }
    }
    
    /**
     * Validate user response using multiple validation strategies
     */
    async validateResponse(answer, reasoning, confidence) {
        const questionIndex = this.currentUnit.currentQuestionIndex;
        const question = this.currentUnit.practiceQuestions[questionIndex];
        
        // Check answer correctness
        const isCorrect = this.checkAnswerCorrectness(answer, question);
        
        // Validate reasoning quality
        const reasoningValidation = await this.justificationValidator.validate(
            reasoning, 
            question, 
            answer, 
            isCorrect
        );
        
        // Consider confidence in evaluation
        const confidenceScore = this.evaluateConfidence(confidence, isCorrect);
        
        return {
            isCorrect,
            reasoning: reasoningValidation,
            confidence: confidenceScore,
            answer,
            attempts: this.currentAttempts,
            hintsUsed: this.hintsUsed,
            timeSpent: Date.now() - this.startTime
        };
    }
    
    /**
     * Check if the answer is correct
     */
    checkAnswerCorrectness(answer, question) {
        if (!answer || answer === null || answer === undefined) return false;
        
        switch (question.type) {
            case 'multiple-choice':
                return answer === question.correctAnswer;
                
            case 'numerical':
                const tolerance = question.tolerance || 0.01;
                return Math.abs(answer - question.correctAnswer) <= tolerance;
                
            case 'text':
                return this.compareTextAnswers(answer, question.correctAnswer);
                
            case 'ordering':
                return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
                
            case 'matching':
                return this.validateMatching(answer, question.correctMatches);
                
            default:
                return false;
        }
    }
    
    /**
     * Process validation result and provide appropriate feedback
     */
    processValidationResult(validation) {
        // Update mastery tracking
        this.masteryTracker.recordAttempt(
            this.currentUnit.concept,
            validation.isCorrect,
            validation.attempts,
            validation.timeSpent,
            validation.reasoning.score
        );
        
        if (validation.isCorrect && validation.reasoning.isValid) {
            this.handleCorrectResponse(validation);
        } else {
            this.handleIncorrectResponse(validation);
        }
        
        // Save progress
        this.saveCurrentUnit();
        this.saveUserProfile();
    }
    
    /**
     * Handle correct response
     */
    handleCorrectResponse(validation) {
        // Provide positive feedback
        let feedbackMessage = 'Excellent! ';
        
        if (validation.confidence >= 4 && validation.attempts === 1) {
            feedbackMessage += 'You demonstrated strong understanding and confidence.';
            this.updateStreak(true);
            this.awardExperience(100);
        } else if (validation.attempts === 1) {
            feedbackMessage += 'Great reasoning, even with some uncertainty.';
            this.updateStreak(true);
            this.awardExperience(80);
        } else {
            feedbackMessage += 'Good persistence in working through the problem.';
            this.awardExperience(60);
        }
        
        // Add reasoning feedback
        feedbackMessage += `\n\n${validation.reasoning.feedback}`;
        
        // Show success feedback
        this.showFeedback(feedbackMessage, 'success');
        
        // Move to next question or assessment
        this.advanceToNextQuestion();
    }
    
    /**
     * Handle incorrect response
     */
    handleIncorrectResponse(validation) {
        let feedbackMessage = '';
        
        if (!validation.isCorrect && !validation.reasoning.isValid) {
            feedbackMessage = 'Not quite right, and your reasoning needs improvement. ';
        } else if (!validation.isCorrect) {
            feedbackMessage = 'Your reasoning is sound, but check your answer. ';
        } else {
            feedbackMessage = 'Your answer is correct, but your reasoning needs clarity. ';
        }
        
        // Add specific feedback
        feedbackMessage += validation.reasoning.feedback;
        
        // Check if maximum attempts reached
        if (this.currentAttempts >= this.maxAttempts) {
            feedbackMessage += '\n\nDon\'t worry - let\'s move on and come back to this concept later.';
            this.markConceptAsWeak();
            this.advanceToNextQuestion();
        } else {
            feedbackMessage += `\n\nYou have ${this.maxAttempts - this.currentAttempts} more attempts. Think through the problem step by step.`;
            
            // Unlock a hint if available
            this.unlockNextHint();
        }
        
        // Update streak
        this.updateStreak(false);
        
        // Show feedback
        this.showFeedback(feedbackMessage, 'error');
    }
    
    /**
     * Update UI progress indicators
     */
    updateUIProgress() {
        // Update level indicator
        const levelElement = document.getElementById('user-level');
        if (levelElement) {
            levelElement.textContent = `Level ${this.userProfile.level}`;
        }
        
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const progress = (this.userProfile.experience % 1000) / 10; // Progress within current level
            progressFill.style.width = `${progress}%`;
        }
        
        // Update streak counter
        const streakCounter = document.getElementById('streak-counter');
        if (streakCounter) {
            streakCounter.textContent = `🔥 ${this.userProfile.streak}`;
        }
        
        // Update mastery indicators
        this.updateMasteryIndicators();
    }
    
    /**
     * Show feedback overlay with message
     */
    showFeedback(message, type = 'info') {
        const overlay = document.getElementById('feedback-overlay');
        const messageElement = document.getElementById('feedback-message');
        
        if (overlay && messageElement) {
            messageElement.innerHTML = message.replace(/\n/g, '<br>');
            messageElement.className = `feedback-${type}`;
            overlay.classList.remove('hidden');
        }
    }
    
    /**
     * Hide feedback overlay
     */
    hideFeedback() {
        const overlay = document.getElementById('feedback-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.showFeedback(message, 'error');
    }
    
    // Additional methods for progression, mastery tracking, etc. will be implemented
    // in the remaining files...
}
