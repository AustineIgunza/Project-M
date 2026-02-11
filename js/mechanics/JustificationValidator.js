/**
 * Justification Validator - Validates the quality of learner reasoning
 * Ensures learners develop proper thinking patterns, not just correct answers
 */
class JustificationValidator {
    constructor() {
        this.validationCriteria = {
            clarity: 0.7,
            logic: 0.8,
            evidence: 0.6,
            completeness: 0.7,
            relevance: 0.8
        };
        
        this.reasoningPatterns = {
            causal: ['because', 'due to', 'caused by', 'results in', 'leads to'],
            evidence: ['shows', 'demonstrates', 'proves', 'indicates', 'supports'],
            logical: ['therefore', 'thus', 'consequently', 'hence', 'so'],
            conditional: ['if', 'when', 'unless', 'provided that', 'assuming'],
            comparison: ['similar to', 'different from', 'unlike', 'whereas', 'compared to']
        };
        
        this.qualityIndicators = {
            depth: ['analyze', 'examine', 'consider', 'evaluate', 'interpret'],
            precision: ['specifically', 'precisely', 'exactly', 'particular', 'distinct'],
            connection: ['relates to', 'connects with', 'builds on', 'extends', 'applies']
        };
        
        this.commonFlaws = {
            circular: /\b(\w+).*\bbecause.*\1\b/i,
            unsupported: /\b(always|never|all|none)\b/i,
            emotional: /\b(obviously|clearly|definitely)\b.*\bwithout\b.*\brevidence\b/i,
            informal: /\b(like|kinda|sorta|whatever)\b/i
        };
        
        this.conceptDatabase = new Map();
        this.loadConceptValidationRules();
    }
    
    /**
     * Validate reasoning quality for a given response
     */
    async validate(reasoning, question, answer, isCorrect) {
        if (!reasoning || reasoning.trim().length < 5) {
            return {
                isValid: false,
                score: 0,
                feedback: 'Please provide a more detailed explanation of your reasoning.',
                areas: ['completeness'],
                suggestions: ['Explain your thought process step by step.']
            };
        }
        
        // Multi-faceted analysis
        const analysis = {
            clarity: this.assessClarity(reasoning),
            logic: this.assessLogicalStructure(reasoning, question),
            evidence: this.assessEvidence(reasoning, question),
            completeness: this.assessCompleteness(reasoning, question),
            relevance: this.assessRelevance(reasoning, question, answer),
            consistency: this.assessConsistency(reasoning, answer, isCorrect)
        };
        
        // Calculate overall score
        const overallScore = this.calculateOverallScore(analysis);
        
        // Check if validation passes
        const isValid = this.meetsValidationThreshold(analysis);
        
        // Generate feedback
        const feedback = this.generateDetailedFeedback(analysis, reasoning, isCorrect);
        
        return {
            isValid,
            score: overallScore,
            feedback: feedback.message,
            areas: feedback.improvementAreas,
            suggestions: feedback.suggestions,
            strengths: feedback.strengths,
            analysis: analysis
        };
    }
    
    /**
     * Assess clarity of reasoning
     */
    assessClarity(reasoning) {
        const text = reasoning.toLowerCase();
        let score = 0.5; // Base score
        
        // Check sentence structure
        const sentences = reasoning.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 1) score += 0.1; // Multiple sentences show structure
        
        // Check for clear language
        const clarityIndicators = ['first', 'next', 'then', 'finally', 'in summary'];
        clarityIndicators.forEach(indicator => {
            if (text.includes(indicator)) score += 0.05;
        });
        
        // Penalize unclear language
        const unclearPhrases = ['this thing', 'that stuff', 'it', 'something'];
        unclearPhrases.forEach(phrase => {
            if (text.includes(phrase)) score -= 0.05;
        });
        
        // Check word count - too short or too long can indicate unclear thinking
        const wordCount = text.split(' ').length;
        if (wordCount >= 15 && wordCount <= 100) {
            score += 0.1;
        } else if (wordCount < 10) {
            score -= 0.2;
        } else if (wordCount > 150) {
            score -= 0.1;
        }
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * Assess logical structure of reasoning
     */
    assessLogicalStructure(reasoning, question) {
        const text = reasoning.toLowerCase();
        let score = 0.3; // Base score
        
        // Check for logical connectors
        Object.entries(this.reasoningPatterns).forEach(([type, patterns]) => {
            const foundPatterns = patterns.filter(pattern => 
                text.includes(pattern.toLowerCase())
            ).length;
            score += Math.min(foundPatterns * 0.1, 0.3);
        });
        
        // Check for premise-conclusion structure
        if (this.hasValidPremiseConclusion(reasoning)) {
            score += 0.2;
        }
        
        // Check for step-by-step reasoning
        if (this.hasSequentialReasoning(reasoning)) {
            score += 0.15;
        }
        
        // Detect and penalize logical fallacies
        const fallacies = this.detectLogicalFallacies(reasoning);
        score -= fallacies.length * 0.1;
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * Assess use of evidence and support
     */
    assessEvidence(reasoning, question) {
        const text = reasoning.toLowerCase();
        let score = 0.3; // Base score
        
        // Check for evidence indicators
        this.reasoningPatterns.evidence.forEach(indicator => {
            if (text.includes(indicator)) score += 0.1;
        });
        
        // Check for specific examples
        const exampleIndicators = ['example', 'instance', 'case', 'such as'];
        exampleIndicators.forEach(indicator => {
            if (text.includes(indicator)) score += 0.1;
        });
        
        // Check for quantitative evidence
        const numberPattern = /\d+/g;
        const numbers = text.match(numberPattern);
        if (numbers && numbers.length > 0) {
            score += 0.1;
        }
        
        // Check for reference to relevant concepts
        const conceptsUsed = this.identifyRelevantConcepts(reasoning, question);
        score += Math.min(conceptsUsed.length * 0.05, 0.2);
        
        // Penalize unsupported claims
        const unsupportedClaims = this.detectUnsupportedClaims(reasoning);
        score -= unsupportedClaims.length * 0.05;
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * Assess completeness of reasoning
     */
    assessCompleteness(reasoning, question) {
        let score = 0.4; // Base score
        
        // Check if key aspects of the question are addressed
        const requiredElements = this.getRequiredReasoningElements(question);
        const addressedElements = this.findAddressedElements(reasoning, requiredElements);
        
        if (requiredElements.length > 0) {
            score += (addressedElements.length / requiredElements.length) * 0.4;
        }
        
        // Check reasoning depth
        const depth = this.assessReasoningDepth(reasoning);
        score += depth * 0.2;
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * Assess relevance to the question and answer
     */
    assessRelevance(reasoning, question, answer) {
        let score = 0.5; // Base score
        
        // Check if reasoning relates to the question
        const questionKeywords = this.extractKeywords(question.text || '');
        const reasoningKeywords = this.extractKeywords(reasoning);
        
        const overlap = this.calculateKeywordOverlap(questionKeywords, reasoningKeywords);
        score += overlap * 0.3;
        
        // Check if reasoning supports the given answer
        const answerSupport = this.assessAnswerSupport(reasoning, answer);
        score += answerSupport * 0.2;
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * Assess consistency between reasoning and answer
     */
    assessConsistency(reasoning, answer, isCorrect) {
        let score = 0.6; // Base score
        
        // Check logical consistency
        const contradictions = this.detectContradictions(reasoning);
        score -= contradictions.length * 0.1;
        
        // Check if reasoning matches answer correctness
        const reasoningQuality = this.assessInherentQuality(reasoning);
        
        if (isCorrect && reasoningQuality > 0.7) {
            score += 0.2; // Good reasoning with correct answer
        } else if (!isCorrect && reasoningQuality < 0.4) {
            score += 0.1; // Poor reasoning with incorrect answer (consistent)
        } else if (isCorrect && reasoningQuality < 0.4) {
            score -= 0.3; // Correct answer with poor reasoning (concerning)
        } else if (!isCorrect && reasoningQuality > 0.7) {
            score += 0.15; // Good reasoning with wrong answer (learning opportunity)
        }
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * Calculate overall reasoning score
     */
    calculateOverallScore(analysis) {
        const weights = {
            clarity: 0.20,
            logic: 0.25,
            evidence: 0.20,
            completeness: 0.15,
            relevance: 0.10,
            consistency: 0.10
        };
        
        return Object.entries(weights).reduce((total, [aspect, weight]) => {
            return total + (analysis[aspect] || 0) * weight;
        }, 0);
    }
    
    /**
     * Check if reasoning meets validation threshold
     */
    meetsValidationThreshold(analysis) {
        // All criteria must meet minimum thresholds
        return Object.entries(this.validationCriteria).every(([criterion, threshold]) => {
            return (analysis[criterion] || 0) >= threshold;
        });
    }
    
    /**
     * Generate detailed feedback for improvement
     */
    generateDetailedFeedback(analysis, reasoning, isCorrect) {
        const feedback = {
            message: '',
            improvementAreas: [],
            suggestions: [],
            strengths: []
        };
        
        // Identify strengths
        Object.entries(analysis).forEach(([aspect, score]) => {
            if (score >= 0.8) {
                feedback.strengths.push(this.getStrengthMessage(aspect, score));
            }
        });
        
        // Identify improvement areas
        Object.entries(this.validationCriteria).forEach(([criterion, threshold]) => {
            const score = analysis[criterion] || 0;
            if (score < threshold) {
                feedback.improvementAreas.push(criterion);
                feedback.suggestions.push(this.getImprovementSuggestion(criterion, score));
            }
        });
        
        // Generate main feedback message
        if (feedback.strengths.length > 0 && feedback.improvementAreas.length === 0) {
            feedback.message = 'Excellent reasoning! ' + feedback.strengths[0];
        } else if (feedback.improvementAreas.length === 0) {
            feedback.message = 'Good reasoning overall. Your explanation demonstrates solid understanding.';
        } else if (feedback.improvementAreas.length === 1) {
            feedback.message = `Your reasoning shows understanding, but could be improved by focusing on ${feedback.improvementAreas[0]}.`;
        } else {
            feedback.message = `Your reasoning needs improvement in several areas: ${feedback.improvementAreas.join(', ')}.`;
        }
        
        // Add context-specific feedback
        if (isCorrect && analysis.logic < 0.6) {
            feedback.message += ' While your answer is correct, strengthening your logical explanation will help you tackle harder problems.';
        } else if (!isCorrect && analysis.logic > 0.8) {
            feedback.message += ' Your reasoning process is strong - check your calculation or reconsider your assumptions.';
        }
        
        return feedback;
    }
    
    /**
     * Get specific improvement suggestions
     */
    getImprovementSuggestion(criterion, score) {
        const suggestions = {
            clarity: [
                'Use clearer language and avoid vague terms like "this" or "it"',
                'Organize your thoughts into clear sentences',
                'Define technical terms when you use them'
            ],
            logic: [
                'Use logical connectors like "because", "therefore", "since"',
                'Present your ideas in a step-by-step sequence',
                'Make sure each point follows from the previous one'
            ],
            evidence: [
                'Support your claims with specific examples or data',
                'Reference relevant concepts or principles',
                'Explain how your evidence leads to your conclusion'
            ],
            completeness: [
                'Address all parts of the question',
                'Explain each step of your reasoning',
                'Consider alternative explanations or approaches'
            ],
            relevance: [
                'Focus on aspects directly related to the question',
                'Connect your reasoning to the specific problem context',
                'Avoid tangential or unrelated information'
            ],
            consistency: [
                'Check that all parts of your explanation agree with each other',
                'Ensure your reasoning supports your final answer',
                'Avoid contradictory statements'
            ]
        };
        
        const criterionSuggestions = suggestions[criterion] || [];
        const index = Math.min(Math.floor((1 - score) * criterionSuggestions.length), criterionSuggestions.length - 1);
        return criterionSuggestions[index] || 'Try to improve this aspect of your reasoning.';
    }
    
    /**
     * Get strength acknowledgment messages
     */
    getStrengthMessage(aspect, score) {
        const messages = {
            clarity: 'Your explanation is clear and easy to follow.',
            logic: 'Your logical structure is excellent.',
            evidence: 'You provide strong evidence for your reasoning.',
            completeness: 'You address all important aspects thoroughly.',
            relevance: 'Your reasoning directly addresses the question.',
            consistency: 'Your explanation is internally consistent.'
        };
        
        return messages[aspect] || 'This aspect of your reasoning is strong.';
    }
    
    /**
     * UTILITY METHODS
     */
    hasValidPremiseConclusion(reasoning) {
        const text = reasoning.toLowerCase();
        const premiseIndicators = ['given', 'since', 'because', 'assuming'];
        const conclusionIndicators = ['therefore', 'thus', 'so', 'hence', 'consequently'];
        
        const hasPremise = premiseIndicators.some(indicator => text.includes(indicator));
        const hasConclusion = conclusionIndicators.some(indicator => text.includes(indicator));
        
        return hasPremise && hasConclusion;
    }
    
    hasSequentialReasoning(reasoning) {
        const text = reasoning.toLowerCase();
        const sequenceIndicators = ['first', 'next', 'then', 'finally', 'step'];
        
        return sequenceIndicators.filter(indicator => text.includes(indicator)).length >= 2;
    }
    
    detectLogicalFallacies(reasoning) {
        const fallacies = [];
        const text = reasoning.toLowerCase();
        
        // Detect common fallacies
        Object.entries(this.commonFlaws).forEach(([flaw, pattern]) => {
            if (pattern.test(text)) {
                fallacies.push(flaw);
            }
        });
        
        // Straw man fallacy
        if (text.includes('people say') || text.includes('everyone thinks')) {
            fallacies.push('straw-man');
        }
        
        // False dichotomy
        if (text.includes('either') && text.includes('or') && !text.includes('could be')) {
            fallacies.push('false-dichotomy');
        }
        
        return fallacies;
    }
    
    identifyRelevantConcepts(reasoning, question) {
        // This would integrate with the concept database
        const questionConcepts = question.requiredConcepts || [];
        const mentionedConcepts = [];
        
        questionConcepts.forEach(concept => {
            if (reasoning.toLowerCase().includes(concept.toLowerCase())) {
                mentionedConcepts.push(concept);
            }
        });
        
        return mentionedConcepts;
    }
    
    detectUnsupportedClaims(reasoning) {
        const claims = [];
        const text = reasoning.toLowerCase();
        
        // Absolute statements without support
        if (text.includes('always') && !text.includes('because')) {
            claims.push('absolute-claim-always');
        }
        
        if (text.includes('never') && !text.includes('because')) {
            claims.push('absolute-claim-never');
        }
        
        return claims;
    }
    
    getRequiredReasoningElements(question) {
        // Based on question type, determine what elements should be addressed
        const elements = [];
        
        if (question.type === 'problem-solving') {
            elements.push('method-selection', 'step-explanation', 'answer-verification');
        } else if (question.type === 'concept-explanation') {
            elements.push('definition', 'examples', 'applications');
        } else if (question.type === 'analysis') {
            elements.push('evidence-evaluation', 'conclusion-drawing', 'alternative-consideration');
        }
        
        return elements;
    }
    
    findAddressedElements(reasoning, requiredElements) {
        const addressed = [];
        const text = reasoning.toLowerCase();
        
        requiredElements.forEach(element => {
            const keywords = this.getElementKeywords(element);
            if (keywords.some(keyword => text.includes(keyword))) {
                addressed.push(element);
            }
        });
        
        return addressed;
    }
    
    getElementKeywords(element) {
        const keywordMap = {
            'method-selection': ['method', 'approach', 'way', 'technique'],
            'step-explanation': ['first', 'next', 'then', 'step'],
            'answer-verification': ['check', 'verify', 'confirm', 'test'],
            'definition': ['means', 'is', 'defined as', 'refers to'],
            'examples': ['example', 'instance', 'case', 'such as'],
            'applications': ['used', 'applied', 'applies to', 'useful'],
            'evidence-evaluation': ['evidence', 'shows', 'proves', 'indicates'],
            'conclusion-drawing': ['conclude', 'therefore', 'thus', 'result'],
            'alternative-consideration': ['alternatively', 'could be', 'might', 'possible']
        };
        
        return keywordMap[element] || [];
    }
    
    assessReasoningDepth(reasoning) {
        // Measure depth by looking for analysis, synthesis, evaluation
        const text = reasoning.toLowerCase();
        let depth = 0;
        
        this.qualityIndicators.depth.forEach(indicator => {
            if (text.includes(indicator)) depth += 0.2;
        });
        
        // Look for causal reasoning
        if (text.includes('because') && text.includes('therefore')) depth += 0.1;
        
        // Look for comparative analysis
        if (text.includes('compared to') || text.includes('different from')) depth += 0.1;
        
        return Math.min(1, depth);
    }
    
    extractKeywords(text) {
        // Simple keyword extraction - would be enhanced with NLP
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but'];
        return words.filter(word => word.length > 3 && !stopWords.includes(word));
    }
    
    calculateKeywordOverlap(keywords1, keywords2) {
        const overlap = keywords1.filter(keyword => keywords2.includes(keyword));
        const total = Math.max(keywords1.length, keywords2.length);
        return total > 0 ? overlap.length / total : 0;
    }
    
    assessAnswerSupport(reasoning, answer) {
        // Check if reasoning logically supports the given answer
        // This is a simplified version - would need more sophisticated analysis
        const text = reasoning.toLowerCase();
        
        if (typeof answer === 'number') {
            // Check if numerical reasoning is present
            const hasNumbers = /\d+/.test(text);
            const hasCalculation = /calculate|compute|multiply|divide|add|subtract/.test(text);
            return (hasNumbers ? 0.5 : 0) + (hasCalculation ? 0.5 : 0);
        }
        
        return 0.5; // Default for non-numerical answers
    }
    
    assessInherentQuality(reasoning) {
        // Assess the inherent quality regardless of correctness
        const clarity = this.assessClarity(reasoning);
        const structure = this.hasValidPremiseConclusion(reasoning) ? 0.3 : 0;
        const depth = this.assessReasoningDepth(reasoning);
        
        return (clarity * 0.5) + structure + (depth * 0.2);
    }
    
    detectContradictions(reasoning) {
        // Simple contradiction detection - would be enhanced with NLP
        const contradictions = [];
        const text = reasoning.toLowerCase();
        
        // Look for obvious contradictions
        if (text.includes('but') || text.includes('however')) {
            // Check if statements actually contradict
            const parts = text.split(/but|however/);
            if (parts.length > 1) {
                // This is simplified - real implementation would analyze semantic contradiction
                contradictions.push('explicit-contradiction');
            }
        }
        
        return contradictions;
    }
    
    loadConceptValidationRules() {
        // Load validation rules specific to different concepts
        // This would integrate with the main concept database
        this.conceptDatabase.set('physics-force', {
            requiredConcepts: ['mass', 'acceleration', 'Newton\'s second law'],
            commonMisconceptions: ['force causes motion', 'heavier objects fall faster'],
            validationKeywords: ['F=ma', 'net force', 'acceleration']
        });
        
        this.conceptDatabase.set('algebra-equation', {
            requiredConcepts: ['variable', 'equation', 'solve'],
            commonMisconceptions: ['equation equals formula'],
            validationKeywords: ['isolate', 'substitute', 'simplify']
        });
    }
}
