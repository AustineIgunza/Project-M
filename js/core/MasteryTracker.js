/**
 * Mastery Tracker - Tracks learning progress and determines mastery
 * Implements progression gating - no advancement without demonstrated mastery
 */
class MasteryTracker {
    constructor() {
        this.masteryThresholds = {
            accuracy: 0.85,        // 85% accuracy required
            consistency: 0.80,     // 80% consistency over time
            reasoning: 0.75,       // 75% reasoning quality
            retention: 0.70,       // 70% retention over time
            application: 0.80      // 80% application in new contexts
        };
        
        this.masteryWeights = {
            accuracy: 0.30,
            consistency: 0.25,
            reasoning: 0.20,
            retention: 0.15,
            application: 0.10
        };
        
        this.conceptProgress = new Map(); // concept -> progress data
        this.attemptHistory = []; // all learning attempts
        this.masteryHistory = new Map(); // concept -> mastery timeline
        this.spacedRepetition = new Map(); // concept -> next review time
        
        this.difficultyLevels = {
            1: 'Recognition',
            2: 'Understanding', 
            3: 'Application',
            4: 'Analysis',
            5: 'Synthesis',
            6: 'Evaluation'
        };
        
        this.retentionIntervals = [1, 3, 7, 14, 30, 60]; // days
    }
    
    /**
     * Record a learning attempt
     */
    recordAttempt(concept, isCorrect, attempts, timeSpent, reasoningScore, context = 'practice') {
        const attempt = {
            id: Date.now() + Math.random(),
            timestamp: Date.now(),
            concept: concept,
            isCorrect: isCorrect,
            attempts: attempts,
            timeSpent: timeSpent,
            reasoningScore: reasoningScore,
            context: context, // 'practice', 'assessment', 'review'
            confidence: this.calculateConfidenceScore(isCorrect, attempts, reasoningScore)
        };
        
        this.attemptHistory.push(attempt);
        this.updateConceptProgress(concept, attempt);
        this.evaluateMastery(concept);
        this.scheduleSpacedRepetition(concept, isCorrect);
        
        return attempt;
    }
    
    /**
     * Update progress tracking for a concept
     */
    updateConceptProgress(concept, attempt) {
        if (!this.conceptProgress.has(concept)) {
            this.conceptProgress.set(concept, {
                concept: concept,
                totalAttempts: 0,
                correctAttempts: 0,
                averageAttempts: 0,
                averageTime: 0,
                reasoningScores: [],
                lastAttempt: null,
                difficultyLevel: 1,
                masteryLevel: 0,
                consistencyScore: 0,
                retentionScore: 0,
                applicationScore: 0,
                firstSeenDate: Date.now(),
                lastMasteryCheck: Date.now(),
                nextReviewDue: null
            });
        }
        
        const progress = this.conceptProgress.get(concept);
        
        // Update basic metrics
        progress.totalAttempts++;
        if (attempt.isCorrect) {
            progress.correctAttempts++;
        }
        
        // Update averages
        progress.averageAttempts = this.updateMovingAverage(
            progress.averageAttempts, 
            attempt.attempts, 
            progress.totalAttempts
        );
        
        progress.averageTime = this.updateMovingAverage(
            progress.averageTime,
            attempt.timeSpent,
            progress.totalAttempts
        );
        
        // Track reasoning scores
        progress.reasoningScores.push(attempt.reasoningScore);
        if (progress.reasoningScores.length > 10) {
            progress.reasoningScores.shift(); // Keep only recent scores
        }
        
        // Update last attempt
        progress.lastAttempt = attempt;
        progress.lastMasteryCheck = Date.now();
        
        // Calculate derived metrics
        this.calculateConsistencyScore(progress);
        this.calculateRetentionScore(progress);
        
        this.conceptProgress.set(concept, progress);
    }
    
    /**
     * Evaluate if mastery has been achieved for a concept
     */
    evaluateMastery(concept) {
        const progress = this.conceptProgress.get(concept);
        if (!progress || progress.totalAttempts < 3) {
            return false; // Need minimum attempts
        }
        
        const scores = this.calculateMasteryScores(progress);
        const overallMastery = this.calculateOverallMastery(scores);
        
        progress.masteryLevel = overallMastery;
        
        // Check if mastery threshold is met
        if (overallMastery >= this.masteryThresholds.accuracy && 
            this.allComponentsMeetThreshold(scores)) {
            
            this.recordMasteryAchievement(concept, scores, overallMastery);
            return true;
        }
        
        return false;
    }
    
    /**
     * Calculate mastery scores for all components
     */
    calculateMasteryScores(progress) {
        return {
            accuracy: this.calculateAccuracyScore(progress),
            consistency: progress.consistencyScore,
            reasoning: this.calculateReasoningScore(progress),
            retention: progress.retentionScore,
            application: this.calculateApplicationScore(progress)
        };
    }
    
    /**
     * Calculate accuracy score
     */
    calculateAccuracyScore(progress) {
        if (progress.totalAttempts === 0) return 0;
        
        // Give more weight to recent attempts
        const recentAttempts = this.getRecentAttempts(progress.concept, 5);
        if (recentAttempts.length === 0) return 0;
        
        const correctRecent = recentAttempts.filter(a => a.isCorrect).length;
        return correctRecent / recentAttempts.length;
    }
    
    /**
     * Calculate consistency score (performance stability over time)
     */
    calculateConsistencyScore(progress) {
        const recentAttempts = this.getRecentAttempts(progress.concept, 10);
        if (recentAttempts.length < 3) {
            progress.consistencyScore = 0;
            return 0;
        }
        
        // Calculate variance in performance
        const performances = recentAttempts.map(a => a.isCorrect ? 1 : 0);
        const mean = performances.reduce((a, b) => a + b) / performances.length;
        const variance = performances.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / performances.length;
        
        // Lower variance = higher consistency
        progress.consistencyScore = Math.max(0, 1 - variance * 2);
        return progress.consistencyScore;
    }
    
    /**
     * Calculate reasoning score quality
     */
    calculateReasoningScore(progress) {
        if (progress.reasoningScores.length === 0) return 0;
        
        // Average of recent reasoning scores
        const recent = progress.reasoningScores.slice(-5);
        return recent.reduce((a, b) => a + b) / recent.length;
    }
    
    /**
     * Calculate retention score (performance over time gaps)
     */
    calculateRetentionScore(progress) {
        const attempts = this.getAttemptsByTimeGaps(progress.concept);
        if (attempts.gaps.length < 2) {
            progress.retentionScore = 0.5; // Default for insufficient data
            return 0.5;
        }
        
        // Check performance after time gaps
        let retentionSum = 0;
        let gapCount = 0;
        
        attempts.gaps.forEach(gap => {
            if (gap.timeGap > 24 * 60 * 60 * 1000) { // More than 1 day
                const performance = gap.afterAttempts.filter(a => a.isCorrect).length / gap.afterAttempts.length;
                retentionSum += performance;
                gapCount++;
            }
        });
        
        progress.retentionScore = gapCount > 0 ? retentionSum / gapCount : 0.5;
        return progress.retentionScore;
    }
    
    /**
     * Calculate application score (performance in new contexts)
     */
    calculateApplicationScore(progress) {
        const applicationAttempts = this.attemptHistory.filter(a => 
            a.concept === progress.concept && a.context === 'assessment'
        );
        
        if (applicationAttempts.length === 0) return 0.5; // Default for no application data
        
        const correctApplications = applicationAttempts.filter(a => a.isCorrect).length;
        return correctApplications / applicationAttempts.length;
    }
    
    /**
     * Calculate overall mastery score
     */
    calculateOverallMastery(scores) {
        return Object.entries(this.masteryWeights).reduce((total, [component, weight]) => {
            return total + (scores[component] || 0) * weight;
        }, 0);
    }
    
    /**
     * Check if all mastery components meet minimum thresholds
     */
    allComponentsMeetThreshold(scores) {
        return Object.entries(this.masteryThresholds).every(([component, threshold]) => {
            return (scores[component] || 0) >= threshold;
        });
    }
    
    /**
     * Record mastery achievement
     */
    recordMasteryAchievement(concept, scores, overallScore) {
        if (!this.masteryHistory.has(concept)) {
            this.masteryHistory.set(concept, []);
        }
        
        const achievement = {
            timestamp: Date.now(),
            concept: concept,
            scores: scores,
            overallScore: overallScore,
            attemptsRequired: this.conceptProgress.get(concept)?.totalAttempts || 0,
            timeToMastery: Date.now() - this.conceptProgress.get(concept)?.firstSeenDate
        };
        
        this.masteryHistory.get(concept).push(achievement);
        
        // Schedule future review
        this.scheduleSpacedRepetition(concept, true, true);
    }
    
    /**
     * Check if learner can progress to next concept/level
     */
    canProgress(requiredConcepts = [], currentLevel = 1) {
        // Check if all required concepts are mastered
        const conceptsMastered = requiredConcepts.every(concept => {
            const progress = this.conceptProgress.get(concept);
            return progress && this.evaluateMastery(concept);
        });
        
        if (!conceptsMastered) {
            return {
                canProgress: false,
                reason: 'Required concepts not mastered',
                blockers: this.getUnmasteredConcepts(requiredConcepts),
                recommendations: this.getProgressionRecommendations(requiredConcepts)
            };
        }
        
        // Check minimum performance standards
        const recentPerformance = this.getRecentOverallPerformance();
        if (recentPerformance < this.masteryThresholds.accuracy) {
            return {
                canProgress: false,
                reason: 'Recent performance below threshold',
                currentPerformance: recentPerformance,
                requiredPerformance: this.masteryThresholds.accuracy,
                recommendations: ['Review weak concepts', 'Complete additional practice']
            };
        }
        
        return {
            canProgress: true,
            masteredConcepts: requiredConcepts.length,
            overallPerformance: recentPerformance,
            readinessScore: this.calculateReadinessScore(requiredConcepts)
        };
    }
    
    /**
     * Get concepts that need review based on spaced repetition
     */
    getConceptsDueForReview() {
        const now = Date.now();
        const dueForReview = [];
        
        this.spacedRepetition.forEach((nextReview, concept) => {
            if (nextReview && nextReview <= now) {
                const progress = this.conceptProgress.get(concept);
                if (progress) {
                    dueForReview.push({
                        concept: concept,
                        overdue: now - nextReview,
                        lastSeen: progress.lastAttempt?.timestamp,
                        masteryLevel: progress.masteryLevel,
                        priority: this.calculateReviewPriority(progress, now - nextReview)
                    });
                }
            }
        });
        
        // Sort by priority (highest first)
        return dueForReview.sort((a, b) => b.priority - a.priority);
    }
    
    /**
     * Schedule spaced repetition for a concept
     */
    scheduleSpacedRepetition(concept, wasCorrect, wasMastered = false) {
        const progress = this.conceptProgress.get(concept);
        if (!progress) return;
        
        let intervalIndex = 0;
        
        // Determine interval based on performance and mastery
        if (wasMastered) {
            intervalIndex = Math.min(this.retentionIntervals.length - 1, 4); // Long interval for mastered
        } else if (wasCorrect) {
            // Progressive intervals based on consistency
            intervalIndex = Math.min(
                Math.floor(progress.consistencyScore * this.retentionIntervals.length),
                this.retentionIntervals.length - 1
            );
        } else {
            intervalIndex = 0; // Review soon if incorrect
        }
        
        const intervalDays = this.retentionIntervals[intervalIndex];
        const nextReview = Date.now() + (intervalDays * 24 * 60 * 60 * 1000);
        
        this.spacedRepetition.set(concept, nextReview);
        
        // Update progress
        progress.nextReviewDue = nextReview;
    }
    
    /**
     * Get performance analytics for UI display
     */
    getPerformanceAnalytics() {
        const totalConcepts = this.conceptProgress.size;
        const masteredConcepts = Array.from(this.conceptProgress.values())
            .filter(p => this.evaluateMastery(p.concept)).length;
        
        const recentAttempts = this.attemptHistory.slice(-20);
        const recentAccuracy = recentAttempts.length > 0 ? 
            recentAttempts.filter(a => a.isCorrect).length / recentAttempts.length : 0;
        
        const averageAttemptsPerQuestion = recentAttempts.length > 0 ?
            recentAttempts.reduce((sum, a) => sum + a.attempts, 0) / recentAttempts.length : 0;
        
        return {
            overview: {
                totalConcepts,
                masteredConcepts,
                masteryPercentage: totalConcepts > 0 ? masteredConcepts / totalConcepts : 0,
                recentAccuracy,
                averageAttemptsPerQuestion
            },
            trends: this.calculatePerformanceTrends(),
            weakAreas: this.identifyWeakAreas(),
            strengths: this.identifyStrengths(),
            recommendations: this.generatePerformanceRecommendations()
        };
    }
    
    /**
     * UTILITY METHODS
     */
    updateMovingAverage(currentAverage, newValue, count) {
        if (count === 1) return newValue;
        return ((currentAverage * (count - 1)) + newValue) / count;
    }
    
    getRecentAttempts(concept, count = 5) {
        return this.attemptHistory
            .filter(a => a.concept === concept)
            .slice(-count);
    }
    
    getAttemptsByTimeGaps(concept) {
        const attempts = this.attemptHistory
            .filter(a => a.concept === concept)
            .sort((a, b) => a.timestamp - b.timestamp);
        
        const gaps = [];
        let currentGap = null;
        
        for (let i = 1; i < attempts.length; i++) {
            const timeGap = attempts[i].timestamp - attempts[i-1].timestamp;
            
            if (timeGap > 60 * 60 * 1000) { // More than 1 hour gap
                if (currentGap) {
                    gaps.push(currentGap);
                }
                currentGap = {
                    timeGap: timeGap,
                    beforeAttempts: [attempts[i-1]],
                    afterAttempts: [attempts[i]]
                };
            } else if (currentGap) {
                currentGap.afterAttempts.push(attempts[i]);
            }
        }
        
        if (currentGap) {
            gaps.push(currentGap);
        }
        
        return { attempts, gaps };
    }
    
    calculateConfidenceScore(isCorrect, attempts, reasoningScore) {
        // Combine correctness, efficiency, and reasoning quality
        const correctnessScore = isCorrect ? 1 : 0;
        const efficiencyScore = Math.max(0, (4 - attempts) / 3); // Better score for fewer attempts
        const reasoningQuality = reasoningScore;
        
        return (correctnessScore * 0.5) + (efficiencyScore * 0.3) + (reasoningQuality * 0.2);
    }
    
    getUnmasteredConcepts(concepts) {
        return concepts.filter(concept => {
            const progress = this.conceptProgress.get(concept);
            return !progress || !this.evaluateMastery(concept);
        });
    }
    
    getProgressionRecommendations(concepts) {
        const unmastered = this.getUnmasteredConcepts(concepts);
        const recommendations = [];
        
        unmastered.forEach(concept => {
            const progress = this.conceptProgress.get(concept);
            if (!progress) {
                recommendations.push(`Start learning: ${concept}`);
            } else {
                const scores = this.calculateMasteryScores(progress);
                const weakest = Object.entries(scores)
                    .sort(([,a], [,b]) => a - b)[0];
                
                recommendations.push(`Improve ${weakest[0]} for: ${concept}`);
            }
        });
        
        return recommendations;
    }
    
    getRecentOverallPerformance(days = 7) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const recentAttempts = this.attemptHistory.filter(a => a.timestamp >= cutoff);
        
        if (recentAttempts.length === 0) return 0;
        
        const correctCount = recentAttempts.filter(a => a.isCorrect).length;
        return correctCount / recentAttempts.length;
    }
    
    calculateReadinessScore(concepts) {
        if (concepts.length === 0) return 1;
        
        const scores = concepts.map(concept => {
            const progress = this.conceptProgress.get(concept);
            return progress ? progress.masteryLevel : 0;
        });
        
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
    
    calculateReviewPriority(progress, overdueAmount) {
        // Higher priority for:
        // - Lower mastery level
        // - Longer overdue time
        // - Important concepts (could be weighted by concept importance)
        
        const masteryFactor = 1 - progress.masteryLevel;
        const overdueFactor = Math.min(overdueAmount / (7 * 24 * 60 * 60 * 1000), 1); // Max 1 week
        const consistencyFactor = 1 - progress.consistencyScore;
        
        return (masteryFactor * 0.4) + (overdueFactor * 0.3) + (consistencyFactor * 0.3);
    }
    
    calculatePerformanceTrends() {
        // Calculate trends over time periods
        const now = Date.now();
        const periods = [7, 14, 30]; // days
        
        return periods.map(days => {
            const cutoff = now - (days * 24 * 60 * 60 * 1000);
            const periodAttempts = this.attemptHistory.filter(a => a.timestamp >= cutoff);
            
            const accuracy = periodAttempts.length > 0 ? 
                periodAttempts.filter(a => a.isCorrect).length / periodAttempts.length : 0;
            
            const avgTime = periodAttempts.length > 0 ?
                periodAttempts.reduce((sum, a) => sum + a.timeSpent, 0) / periodAttempts.length : 0;
            
            return {
                period: `${days} days`,
                accuracy,
                avgTime,
                attempts: periodAttempts.length
            };
        });
    }
    
    identifyWeakAreas() {
        const conceptScores = Array.from(this.conceptProgress.values())
            .map(progress => ({
                concept: progress.concept,
                masteryLevel: progress.masteryLevel,
                accuracy: this.calculateAccuracyScore(progress),
                consistency: progress.consistencyScore
            }))
            .sort((a, b) => a.masteryLevel - b.masteryLevel)
            .slice(0, 5); // Top 5 weak areas
        
        return conceptScores;
    }
    
    identifyStrengths() {
        const conceptScores = Array.from(this.conceptProgress.values())
            .filter(progress => progress.masteryLevel >= this.masteryThresholds.accuracy)
            .map(progress => ({
                concept: progress.concept,
                masteryLevel: progress.masteryLevel,
                consistency: progress.consistencyScore
            }))
            .sort((a, b) => b.masteryLevel - a.masteryLevel)
            .slice(0, 5); // Top 5 strengths
        
        return conceptScores;
    }
    
    generatePerformanceRecommendations() {
        const analytics = this.getPerformanceAnalytics();
        const recommendations = [];
        
        if (analytics.overview.recentAccuracy < 0.7) {
            recommendations.push('Focus on accuracy - review fundamental concepts');
        }
        
        if (analytics.overview.averageAttemptsPerQuestion > 2.5) {
            recommendations.push('Work on efficiency - practice quick problem recognition');
        }
        
        const weakAreas = this.identifyWeakAreas();
        if (weakAreas.length > 0) {
            recommendations.push(`Priority review needed: ${weakAreas[0].concept}`);
        }
        
        const dueReviews = this.getConceptsDueForReview();
        if (dueReviews.length > 0) {
            recommendations.push(`${dueReviews.length} concepts due for review`);
        }
        
        return recommendations;
    }
}
