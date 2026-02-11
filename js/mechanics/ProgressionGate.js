/**
 * Progression Gate - Implements strict progression control
 * No skipping, no manual overrides - mastery required for advancement
 */
class ProgressionGate {
    constructor() {
        this.gateRules = {
            // Minimum requirements for progression
            mastery: {
                accuracy: 0.85,
                consistency: 0.80,
                retention: 0.75,
                application: 0.80,
                reasoning: 0.75
            },
            
            // Required evidence
            evidence: {
                minAttempts: 3,
                minTimeSpent: 300000, // 5 minutes minimum engagement
                maxAttemptsPerQuestion: 5,
                retentionTestRequired: true
            },
            
            // Progression paths
            levelRequirements: new Map(),
            
            // Override protections
            protections: {
                noSkipping: true,
                noManualOverride: true,
                requiresEvidence: true,
                mustDemonstrateMastery: true
            }
        };
        
        this.progressionHistory = new Map(); // Track all progression decisions
        this.blockedAttempts = new Map(); // Track blocked progression attempts
        this.masteryEvidence = new Map(); // Comprehensive mastery evidence
        
        this.initializeLevelRequirements();
    }
    
    /**
     * Evaluate if learner can progress to next level/concept
     */
    evaluateProgression(learnerProfile, targetLevel, masteryTracker) {
        const evaluation = {
            canProgress: false,
            reason: '',
            requirements: [],
            evidence: {},
            recommendations: [],
            blockers: [],
            timeline: null
        };
        
        try {
            // Step 1: Check basic eligibility
            const eligibilityCheck = this.checkBasicEligibility(learnerProfile, targetLevel);
            if (!eligibilityCheck.eligible) {
                evaluation.reason = eligibilityCheck.reason;
                evaluation.blockers = eligibilityCheck.blockers;
                return this.recordProgressionDecision(learnerProfile, targetLevel, evaluation);
            }
            
            // Step 2: Verify mastery evidence
            const masteryCheck = this.verifyMasteryEvidence(learnerProfile, targetLevel, masteryTracker);
            if (!masteryCheck.sufficient) {
                evaluation.reason = 'Insufficient mastery evidence';
                evaluation.requirements = masteryCheck.missingRequirements;
                evaluation.recommendations = masteryCheck.recommendations;
                return this.recordProgressionDecision(learnerProfile, targetLevel, evaluation);
            }
            
            // Step 3: Check retention and application
            const retentionCheck = this.checkRetentionAndApplication(learnerProfile, masteryTracker);
            if (!retentionCheck.passed) {
                evaluation.reason = 'Retention or application requirements not met';
                evaluation.blockers = retentionCheck.blockers;
                evaluation.timeline = retentionCheck.recommendedTimeline;
                return this.recordProgressionDecision(learnerProfile, targetLevel, evaluation);
            }
            
            // Step 4: Final gate evaluation
            const gateEvaluation = this.performFinalGateEvaluation(learnerProfile, targetLevel, masteryTracker);
            if (!gateEvaluation.passed) {
                evaluation.reason = gateEvaluation.reason;
                evaluation.requirements = gateEvaluation.requirements;
                return this.recordProgressionDecision(learnerProfile, targetLevel, evaluation);
            }
            
            // All checks passed
            evaluation.canProgress = true;
            evaluation.reason = 'All mastery requirements met';
            evaluation.evidence = this.compileProgressionEvidence(learnerProfile, targetLevel, masteryTracker);
            
            return this.recordProgressionDecision(learnerProfile, targetLevel, evaluation);
            
        } catch (error) {
            console.error('Progression evaluation error:', error);
            evaluation.reason = 'Evaluation system error - progression blocked for safety';
            return this.recordProgressionDecision(learnerProfile, targetLevel, evaluation);
        }
    }
    
    /**
     * Check basic eligibility requirements
     */
    checkBasicEligibility(learnerProfile, targetLevel) {
        const result = {
            eligible: true,
            reason: '',
            blockers: []
        };
        
        // Check level sequence
        if (targetLevel > learnerProfile.level + 1) {
            result.eligible = false;
            result.reason = 'Cannot skip levels';
            result.blockers.push({
                type: 'level-sequence',
                current: learnerProfile.level,
                target: targetLevel,
                required: learnerProfile.level + 1
            });
        }
        
        // Check if already at or above target level
        if (targetLevel <= learnerProfile.level) {
            result.eligible = false;
            result.reason = 'Already at or above target level';
            result.blockers.push({
                type: 'already-achieved',
                current: learnerProfile.level,
                target: targetLevel
            });
        }
        
        // Check for any active restrictions
        const restrictions = this.checkActiveRestrictions(learnerProfile);
        if (restrictions.length > 0) {
            result.eligible = false;
            result.reason = 'Active learning restrictions in place';
            result.blockers.push(...restrictions);
        }
        
        return result;
    }
    
    /**
     * Verify comprehensive mastery evidence
     */
    verifyMasteryEvidence(learnerProfile, targetLevel, masteryTracker) {
        const requirements = this.getLevelRequirements(targetLevel);
        const result = {
            sufficient: true,
            missingRequirements: [],
            recommendations: []
        };
        
        // Check each required concept
        requirements.requiredConcepts.forEach(concept => {
            const masteryStatus = masteryTracker.evaluateMastery(concept);
            if (!masteryStatus) {
                result.sufficient = false;
                result.missingRequirements.push({
                    type: 'concept-mastery',
                    concept: concept,
                    status: masteryTracker.getMasteryStatus(concept)
                });
                result.recommendations.push(`Complete mastery of: ${concept}`);
            }
        });
        
        // Check performance standards
        const performance = masteryTracker.getRecentOverallPerformance();
        if (performance < this.gateRules.mastery.accuracy) {
            result.sufficient = false;
            result.missingRequirements.push({
                type: 'performance-standard',
                current: performance,
                required: this.gateRules.mastery.accuracy
            });
            result.recommendations.push('Improve overall accuracy through additional practice');
        }
        
        // Check consistency requirements
        const consistency = this.calculateOverallConsistency(learnerProfile, masteryTracker);
        if (consistency < this.gateRules.mastery.consistency) {
            result.sufficient = false;
            result.missingRequirements.push({
                type: 'consistency-standard',
                current: consistency,
                required: this.gateRules.mastery.consistency
            });
            result.recommendations.push('Demonstrate more consistent performance over time');
        }
        
        return result;
    }
    
    /**
     * Check retention and application requirements
     */
    checkRetentionAndApplication(learnerProfile, masteryTracker) {
        const result = {
            passed: true,
            blockers: [],
            recommendedTimeline: null
        };
        
        // Check if enough time has passed for retention testing
        const lastMajorLearning = this.getLastMajorLearningTime(learnerProfile);
        const timeSincelearning = Date.now() - lastMajorLearning;
        const minimumRetentionPeriod = 24 * 60 * 60 * 1000; // 24 hours minimum
        
        if (timeSincelearning < minimumRetentionPeriod) {
            result.passed = false;
            result.blockers.push({
                type: 'retention-period',
                timeSince: timeSincelearning,
                required: minimumRetentionPeriod,
                remaining: minimumRetentionPeriod - timeSincelearning
            });
            result.recommendedTimeline = new Date(Date.now() + (minimumRetentionPeriod - timeSincelearning));
        }
        
        // Check for successful application in new contexts
        const applicationSuccess = this.checkApplicationSuccess(learnerProfile, masteryTracker);
        if (!applicationSuccess.sufficient) {
            result.passed = false;
            result.blockers.push({
                type: 'application-requirement',
                current: applicationSuccess.score,
                required: this.gateRules.mastery.application,
                contexts: applicationSuccess.testedContexts
            });
        }
        
        // Check spaced repetition performance
        const spacedRepetitionResults = masteryTracker.getConceptsDueForReview();
        const overdueReviews = spacedRepetitionResults.filter(review => review.overdue > 0);
        
        if (overdueReviews.length > 0) {
            result.passed = false;
            result.blockers.push({
                type: 'overdue-reviews',
                count: overdueReviews.length,
                concepts: overdueReviews.map(r => r.concept)
            });
        }
        
        return result;
    }
    
    /**
     * Perform final comprehensive gate evaluation
     */
    performFinalGateEvaluation(learnerProfile, targetLevel, masteryTracker) {
        const result = {
            passed: false,
            reason: '',
            requirements: []
        };
        
        // Compile all evidence
        const evidence = this.compileComprehensiveEvidence(learnerProfile, targetLevel, masteryTracker);
        
        // Apply strict evaluation criteria
        const evaluationResult = this.applyStrictCriteria(evidence);
        
        if (evaluationResult.passed) {
            // Double-check with challenge assessment
            const challengeResult = this.performChallengeAssessment(learnerProfile, targetLevel);
            
            if (challengeResult.passed) {
                result.passed = true;
                result.reason = 'All requirements met with demonstrated mastery';
            } else {
                result.reason = 'Challenge assessment failed';
                result.requirements = challengeResult.failedAreas;
            }
        } else {
            result.reason = evaluationResult.reason;
            result.requirements = evaluationResult.missingRequirements;
        }
        
        return result;
    }
    
    /**
     * Apply strict progression criteria
     */
    applyStrictCriteria(evidence) {
        const result = {
            passed: true,
            reason: '',
            missingRequirements: []
        };
        
        // Check each mastery dimension against strict thresholds
        Object.entries(this.gateRules.mastery).forEach(([dimension, threshold]) => {
            const score = evidence[dimension] || 0;
            if (score < threshold) {
                result.passed = false;
                result.missingRequirements.push({
                    dimension: dimension,
                    current: score,
                    required: threshold,
                    gap: threshold - score
                });
            }
        });
        
        // Check evidence quantity
        if (evidence.totalAttempts < this.gateRules.evidence.minAttempts) {
            result.passed = false;
            result.missingRequirements.push({
                type: 'insufficient-attempts',
                current: evidence.totalAttempts,
                required: this.gateRules.evidence.minAttempts
            });
        }
        
        // Check time investment
        if (evidence.totalTimeSpent < this.gateRules.evidence.minTimeSpent) {
            result.passed = false;
            result.missingRequirements.push({
                type: 'insufficient-time',
                current: evidence.totalTimeSpent,
                required: this.gateRules.evidence.minTimeSpent
            });
        }
        
        if (!result.passed) {
            result.reason = 'Strict mastery criteria not met';
        }
        
        return result;
    }
    
    /**
     * Perform challenge assessment for final verification
     */
    performChallengeAssessment(learnerProfile, targetLevel) {
        // This would trigger a final challenge that tests integrated understanding
        // For now, simulate based on historical performance
        
        const simulatedChallenge = {
            accuracy: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
            reasoning: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
            application: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
            timeEfficiency: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
        };
        
        const result = {
            passed: true,
            failedAreas: []
        };
        
        Object.entries(this.gateRules.mastery).forEach(([area, threshold]) => {
            if (simulatedChallenge[area] && simulatedChallenge[area] < threshold) {
                result.passed = false;
                result.failedAreas.push(area);
            }
        });
        
        return result;
    }
    
    /**
     * Record progression decision for audit trail
     */
    recordProgressionDecision(learnerProfile, targetLevel, evaluation) {
        const decision = {
            timestamp: Date.now(),
            learnerProfile: {
                id: learnerProfile.id || 'anonymous',
                level: learnerProfile.level,
                experience: learnerProfile.experience
            },
            targetLevel: targetLevel,
            decision: evaluation.canProgress ? 'ALLOW' : 'BLOCK',
            reason: evaluation.reason,
            evidence: evaluation.evidence || {},
            requirements: evaluation.requirements || [],
            systemVersion: '1.0'
        };
        
        // Store decision
        if (!this.progressionHistory.has(learnerProfile.id)) {
            this.progressionHistory.set(learnerProfile.id, []);
        }
        this.progressionHistory.get(learnerProfile.id).push(decision);
        
        // Track blocked attempts for analysis
        if (!evaluation.canProgress) {
            this.recordBlockedAttempt(learnerProfile, targetLevel, evaluation.reason);
        }
        
        return evaluation;
    }
    
    /**
     * Record blocked progression attempts
     */
    recordBlockedAttempt(learnerProfile, targetLevel, reason) {
        const attempt = {
            timestamp: Date.now(),
            learnerId: learnerProfile.id,
            targetLevel: targetLevel,
            reason: reason,
            attempts: 1
        };
        
        const key = `${learnerProfile.id}-${targetLevel}`;
        if (this.blockedAttempts.has(key)) {
            const existing = this.blockedAttempts.get(key);
            existing.attempts++;
            existing.lastAttempt = Date.now();
        } else {
            this.blockedAttempts.set(key, attempt);
        }
    }
    
    /**
     * Get personalized recommendations for progression
     */
    getProgressionRecommendations(learnerProfile, targetLevel, masteryTracker) {
        const evaluation = this.evaluateProgression(learnerProfile, targetLevel, masteryTracker);
        
        if (evaluation.canProgress) {
            return {
                type: 'ready',
                message: 'You\'re ready to advance!',
                actions: ['Take the advancement assessment'],
                timeline: 'Now'
            };
        }
        
        const recommendations = {
            type: 'blocked',
            message: evaluation.reason,
            actions: [],
            timeline: 'Variable',
            priorities: []
        };
        
        // Generate specific action items based on blockers
        evaluation.requirements?.forEach(req => {
            switch (req.type) {
                case 'concept-mastery':
                    recommendations.actions.push(`Master concept: ${req.concept}`);
                    recommendations.priorities.push('high');
                    break;
                    
                case 'performance-standard':
                    recommendations.actions.push(`Improve accuracy from ${(req.current*100).toFixed(0)}% to ${(req.required*100).toFixed(0)}%`);
                    recommendations.priorities.push('high');
                    break;
                    
                case 'consistency-standard':
                    recommendations.actions.push('Demonstrate more consistent performance over multiple sessions');
                    recommendations.priorities.push('medium');
                    break;
                    
                case 'retention-period':
                    const hours = Math.ceil(req.remaining / (60 * 60 * 1000));
                    recommendations.actions.push(`Wait ${hours} hours for retention testing`);
                    recommendations.timeline = `${hours} hours`;
                    recommendations.priorities.push('low');
                    break;
            }
        });
        
        evaluation.blockers?.forEach(blocker => {
            if (blocker.type === 'overdue-reviews') {
                recommendations.actions.push(`Complete ${blocker.count} overdue reviews`);
                recommendations.priorities.push('high');
            }
        });
        
        return recommendations;
    }
    
    /**
     * Initialize level progression requirements
     */
    initializeLevelRequirements() {
        // Level 1 to 2: Basic comprehension
        this.gateRules.levelRequirements.set(2, {
            requiredConcepts: ['basic-arithmetic', 'reading-comprehension'],
            masteryThreshold: 0.80,
            minTimeSpent: 180000, // 3 minutes
            retentionTestRequired: false
        });
        
        // Level 2 to 3: Applied understanding
        this.gateRules.levelRequirements.set(3, {
            requiredConcepts: ['problem-solving-basics', 'logical-reasoning'],
            masteryThreshold: 0.85,
            minTimeSpent: 300000, // 5 minutes
            retentionTestRequired: true
        });
        
        // Level 3 to 4: Analysis and synthesis
        this.gateRules.levelRequirements.set(4, {
            requiredConcepts: ['analytical-thinking', 'pattern-recognition', 'concept-application'],
            masteryThreshold: 0.87,
            minTimeSpent: 450000, // 7.5 minutes
            retentionTestRequired: true
        });
        
        // Level 4 to 5: Advanced application
        this.gateRules.levelRequirements.set(5, {
            requiredConcepts: ['advanced-problem-solving', 'creative-application', 'knowledge-transfer'],
            masteryThreshold: 0.90,
            minTimeSpent: 600000, // 10 minutes
            retentionTestRequired: true
        });
    }
    
    /**
     * UTILITY METHODS
     */
    getLevelRequirements(level) {
        return this.gateRules.levelRequirements.get(level) || {
            requiredConcepts: [],
            masteryThreshold: 0.85,
            minTimeSpent: 300000,
            retentionTestRequired: true
        };
    }
    
    checkActiveRestrictions(learnerProfile) {
        const restrictions = [];
        
        // Check for temporary blocks (cooling off periods)
        const recentBlockedAttempts = this.getRecentBlockedAttempts(learnerProfile.id);
        if (recentBlockedAttempts.length > 3) {
            restrictions.push({
                type: 'cooling-period',
                reason: 'Too many recent failed progression attempts',
                duration: 60 * 60 * 1000 // 1 hour
            });
        }
        
        // Check for system-wide restrictions
        // (Could include maintenance, content updates, etc.)
        
        return restrictions;
    }
    
    calculateOverallConsistency(learnerProfile, masteryTracker) {
        // Calculate consistency across all concepts
        const analytics = masteryTracker.getPerformanceAnalytics();
        return analytics.overview.recentAccuracy || 0;
    }
    
    getLastMajorLearningTime(learnerProfile) {
        // Find when the learner last completed a significant learning unit
        return learnerProfile.lastLearningSession || Date.now() - (24 * 60 * 60 * 1000);
    }
    
    checkApplicationSuccess(learnerProfile, masteryTracker) {
        // Check success rate in application contexts
        const analytics = masteryTracker.getPerformanceAnalytics();
        
        return {
            sufficient: true, // Simplified for now
            score: 0.85,
            testedContexts: ['practice', 'assessment']
        };
    }
    
    compileComprehensiveEvidence(learnerProfile, targetLevel, masteryTracker) {
        const analytics = masteryTracker.getPerformanceAnalytics();
        
        return {
            accuracy: analytics.overview.recentAccuracy || 0,
            consistency: analytics.overview.recentAccuracy || 0,
            retention: 0.85, // Simplified
            application: 0.80, // Simplified
            reasoning: 0.85, // Simplified
            totalAttempts: 10, // Simplified
            totalTimeSpent: 600000 // Simplified
        };
    }
    
    compileProgressionEvidence(learnerProfile, targetLevel, masteryTracker) {
        return this.compileComprehensiveEvidence(learnerProfile, targetLevel, masteryTracker);
    }
    
    getRecentBlockedAttempts(learnerId, hours = 24) {
        const cutoff = Date.now() - (hours * 60 * 60 * 1000);
        const attempts = [];
        
        this.blockedAttempts.forEach((attempt, key) => {
            if (attempt.learnerId === learnerId && attempt.timestamp >= cutoff) {
                attempts.push(attempt);
            }
        });
        
        return attempts;
    }
}
