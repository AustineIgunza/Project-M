/**
 * Concept Database - Manages learning concepts and their relationships
 * Provides the knowledge structure that drives the learning engine
 */
class ConceptDatabase {
    static concepts = new Map();
    static relationships = new Map();
    static curriculum = new Map();
    static prerequisites = new Map();
    
    static {
        this.initializeDatabase();
    }
    
    /**
     * Initialize the concept database with learning concepts
     */
    static initializeDatabase() {
        // MATHEMATICS CONCEPTS
        this.addConcept('basic-arithmetic', {
            id: 'basic-arithmetic',
            name: 'Basic Arithmetic',
            domain: 'mathematics',
            level: 1,
            description: 'Addition, subtraction, multiplication, and division operations',
            keywords: ['add', 'subtract', 'multiply', 'divide', 'calculate'],
            prerequisites: [],
            learningObjectives: [
                'Perform basic arithmetic operations',
                'Understand number relationships',
                'Apply order of operations'
            ],
            commonMisconceptions: [
                'Order of operations confusion',
                'Sign errors in calculations',
                'Fraction vs decimal confusion'
            ],
            difficulty: 1,
            estimatedTimeMinutes: 30,
            category: 'foundational'
        });
        
        this.addConcept('algebra-basics', {
            id: 'algebra-basics',
            name: 'Basic Algebra',
            domain: 'mathematics',
            level: 2,
            description: 'Variables, expressions, and simple equation solving',
            keywords: ['variable', 'equation', 'solve', 'expression', 'isolate'],
            prerequisites: ['basic-arithmetic'],
            learningObjectives: [
                'Understand variables and expressions',
                'Solve linear equations',
                'Manipulate algebraic expressions'
            ],
            commonMisconceptions: [
                'Variables represent single numbers',
                'Equation solving without justification',
                'Sign errors in algebraic manipulation'
            ],
            difficulty: 3,
            estimatedTimeMinutes: 60,
            category: 'algebraic-thinking'
        });
        
        this.addConcept('systems-of-equations', {
            id: 'systems-of-equations',
            name: 'Systems of Equations',
            domain: 'mathematics',
            level: 3,
            description: 'Solving systems of linear equations using various methods',
            keywords: ['system', 'elimination', 'substitution', 'multiple equations'],
            prerequisites: ['algebra-basics'],
            learningObjectives: [
                'Solve systems using elimination',
                'Solve systems using substitution',
                'Interpret solutions in context'
            ],
            commonMisconceptions: [
                'Confusing elimination steps',
                'Not checking solutions',
                'Misinterpreting no solution vs infinite solutions'
            ],
            difficulty: 4,
            estimatedTimeMinutes: 90,
            category: 'algebraic-thinking'
        });
        
        // PHYSICS CONCEPTS
        this.addConcept('force-and-motion', {
            id: 'force-and-motion',
            name: 'Force and Motion',
            domain: 'physics',
            level: 2,
            description: 'Newton\'s laws of motion and force analysis',
            keywords: ['force', 'acceleration', 'Newton', 'F=ma', 'motion'],
            prerequisites: ['basic-arithmetic'],
            learningObjectives: [
                'Apply Newton\'s second law',
                'Analyze forces in static situations',
                'Predict motion from force analysis'
            ],
            commonMisconceptions: [
                'Force causes motion directly',
                'Heavier objects fall faster',
                'Force and acceleration are the same'
            ],
            difficulty: 4,
            estimatedTimeMinutes: 75,
            category: 'physics-mechanics'
        });
        
        this.addConcept('energy-conservation', {
            id: 'energy-conservation',
            name: 'Energy Conservation',
            domain: 'physics',
            level: 3,
            description: 'Kinetic energy, potential energy, and conservation principles',
            keywords: ['energy', 'kinetic', 'potential', 'conservation', 'work'],
            prerequisites: ['force-and-motion'],
            learningObjectives: [
                'Calculate kinetic and potential energy',
                'Apply conservation of energy',
                'Analyze energy transformations'
            ],
            commonMisconceptions: [
                'Energy can be created or destroyed',
                'Kinetic energy depends on direction',
                'Potential energy is always gravitational'
            ],
            difficulty: 5,
            estimatedTimeMinutes: 100,
            category: 'physics-energy'
        });
        
        // ACCOUNTING CONCEPTS
        this.addConcept('depreciation-straight-line', {
            id: 'depreciation-straight-line',
            name: 'Straight-Line Depreciation',
            domain: 'accounting',
            level: 2,
            description: 'Calculate depreciation using the straight-line method',
            keywords: ['depreciation', 'straight-line', 'asset', 'salvage value', 'useful life'],
            prerequisites: ['basic-arithmetic'],
            learningObjectives: [
                'Calculate annual depreciation expense',
                'Understand asset cost basis',
                'Prepare depreciation schedules'
            ],
            commonMisconceptions: [
                'Depreciation is cash flow',
                'All assets depreciate equally',
                'Salvage value is always zero'
            ],
            difficulty: 3,
            estimatedTimeMinutes: 45,
            category: 'accounting-assets'
        });
        
        this.addConcept('depreciation-accelerated', {
            id: 'depreciation-accelerated',
            name: 'Accelerated Depreciation',
            domain: 'accounting',
            level: 3,
            description: 'Double-declining balance and sum-of-years digits methods',
            keywords: ['double-declining', 'accelerated', 'sum-of-years', 'depreciation rate'],
            prerequisites: ['depreciation-straight-line'],
            learningObjectives: [
                'Calculate double-declining balance depreciation',
                'Apply sum-of-years digits method',
                'Compare depreciation methods'
            ],
            commonMisconceptions: [
                'Accelerated methods are always better',
                'Book value can go below salvage value',
                'All accelerated methods are the same'
            ],
            difficulty: 5,
            estimatedTimeMinutes: 80,
            category: 'accounting-assets'
        });
        
        // PROGRAMMING CONCEPTS
        this.addConcept('variables-and-data-types', {
            id: 'variables-and-data-types',
            name: 'Variables and Data Types',
            domain: 'programming',
            level: 1,
            description: 'Understanding variables, data types, and memory storage',
            keywords: ['variable', 'data type', 'integer', 'string', 'boolean'],
            prerequisites: [],
            learningObjectives: [
                'Declare and initialize variables',
                'Understand different data types',
                'Choose appropriate data types for tasks'
            ],
            commonMisconceptions: [
                'Variables and values are the same',
                'All numbers are the same type',
                'Strings and numbers can always be mixed'
            ],
            difficulty: 2,
            estimatedTimeMinutes: 40,
            category: 'programming-fundamentals'
        });
        
        this.addConcept('control-flow', {
            id: 'control-flow',
            name: 'Control Flow',
            domain: 'programming',
            level: 2,
            description: 'Conditional statements and loops',
            keywords: ['if', 'else', 'loop', 'condition', 'iteration'],
            prerequisites: ['variables-and-data-types'],
            learningObjectives: [
                'Write conditional statements',
                'Implement different types of loops',
                'Control program execution flow'
            ],
            commonMisconceptions: [
                'Conditions are always true/false',
                'Loops always run a fixed number of times',
                'If-else chains are the same as switch statements'
            ],
            difficulty: 4,
            estimatedTimeMinutes: 70,
            category: 'programming-logic'
        });
        
        // CHEMISTRY CONCEPTS
        this.addConcept('atomic-structure', {
            id: 'atomic-structure',
            name: 'Atomic Structure',
            domain: 'chemistry',
            level: 2,
            description: 'Protons, neutrons, electrons, and atomic organization',
            keywords: ['atom', 'proton', 'neutron', 'electron', 'nucleus'],
            prerequisites: ['basic-arithmetic'],
            learningObjectives: [
                'Describe atomic structure',
                'Calculate atomic mass and number',
                'Understand electron configuration basics'
            ],
            commonMisconceptions: [
                'Electrons orbit like planets',
                'All atoms of an element are identical',
                'Atomic mass equals atomic number'
            ],
            difficulty: 3,
            estimatedTimeMinutes: 55,
            category: 'chemistry-fundamentals'
        });
        
        this.addConcept('chemical-bonding', {
            id: 'chemical-bonding',
            name: 'Chemical Bonding',
            domain: 'chemistry',
            level: 3,
            description: 'Ionic and covalent bonds, molecular structure',
            keywords: ['ionic', 'covalent', 'bond', 'molecule', 'electron sharing'],
            prerequisites: ['atomic-structure'],
            learningObjectives: [
                'Distinguish ionic and covalent bonds',
                'Predict bonding patterns',
                'Draw molecular structures'
            ],
            commonMisconceptions: [
                'All bonds are either fully ionic or covalent',
                'Molecules are just collections of atoms',
                'Bond strength determines bond length'
            ],
            difficulty: 5,
            estimatedTimeMinutes: 85,
            category: 'chemistry-bonding'
        });
        
        // Initialize curriculum paths
        this.initializeCurriculumPaths();
        
        // Set up concept relationships
        this.initializeConceptRelationships();
    }
    
    /**
     * Add a concept to the database
     */
    static addConcept(id, conceptData) {
        this.concepts.set(id, {
            ...conceptData,
            addedDate: Date.now(),
            version: 1
        });
        
        // Register prerequisites
        if (conceptData.prerequisites && conceptData.prerequisites.length > 0) {
            this.prerequisites.set(id, conceptData.prerequisites);
        }
    }
    
    /**
     * Get concept by ID
     */
    static getConcept(id) {
        return this.concepts.get(id);
    }
    
    /**
     * Get concepts by domain
     */
    static getConceptsByDomain(domain) {
        const domainConcepts = [];
        this.concepts.forEach(concept => {
            if (concept.domain === domain) {
                domainConcepts.push(concept);
            }
        });
        return domainConcepts.sort((a, b) => a.level - b.level);
    }
    
    /**
     * Get concepts by level
     */
    static getConceptsByLevel(level) {
        const levelConcepts = [];
        this.concepts.forEach(concept => {
            if (concept.level === level) {
                levelConcepts.push(concept);
            }
        });
        return levelConcepts;
    }
    
    /**
     * Get next concept for learner based on mastered concepts
     */
    static getNextConcept(currentLevel, masteredConcepts) {
        // Find concepts at current or next level that have prerequisites met
        const availableLevels = [currentLevel, currentLevel + 1];
        
        for (const level of availableLevels) {
            const levelConcepts = this.getConceptsByLevel(level);
            
            for (const concept of levelConcepts) {
                if (!masteredConcepts.has(concept.id) && 
                    this.arePrerequisitesMet(concept.id, masteredConcepts)) {
                    return concept;
                }
            }
        }
        
        // If no concepts available at current/next level, return null
        return null;
    }
    
    /**
     * Check if prerequisites are met for a concept
     */
    static arePrerequisitesMet(conceptId, masteredConcepts) {
        const prerequisites = this.prerequisites.get(conceptId) || [];
        return prerequisites.every(prereq => masteredConcepts.has(prereq));
    }
    
    /**
     * Get learning path recommendations
     */
    static getLearningPath(targetConcept, masteredConcepts) {
        const path = [];
        const toProcess = [targetConcept];
        const processed = new Set();
        
        while (toProcess.length > 0) {
            const conceptId = toProcess.shift();
            
            if (processed.has(conceptId) || masteredConcepts.has(conceptId)) {
                continue;
            }
            
            const concept = this.getConcept(conceptId);
            if (!concept) continue;
            
            // Add prerequisites to process first
            const prereqs = this.prerequisites.get(conceptId) || [];
            prereqs.forEach(prereq => {
                if (!processed.has(prereq) && !masteredConcepts.has(prereq)) {
                    toProcess.unshift(prereq);
                }
            });
            
            // Add current concept to path if prerequisites are met
            if (this.arePrerequisitesMet(conceptId, masteredConcepts)) {
                path.push(concept);
                masteredConcepts = new Set([...masteredConcepts, conceptId]); // Simulate mastery for path building
            }
            
            processed.add(conceptId);
        }
        
        return path;
    }
    
    /**
     * Get concept difficulty progression
     */
    static getDifficultyProgression(domain) {
        const domainConcepts = this.getConceptsByDomain(domain);
        return domainConcepts.sort((a, b) => {
            if (a.level !== b.level) return a.level - b.level;
            return a.difficulty - b.difficulty;
        });
    }
    
    /**
     * Find related concepts
     */
    static getRelatedConcepts(conceptId, maxResults = 5) {
        const concept = this.getConcept(conceptId);
        if (!concept) return [];
        
        const related = [];
        
        // Find concepts in same domain and level range
        this.concepts.forEach(otherConcept => {
            if (otherConcept.id === conceptId) return;
            
            let relatedness = 0;
            
            // Same domain
            if (otherConcept.domain === concept.domain) {
                relatedness += 0.5;
            }
            
            // Similar level
            const levelDiff = Math.abs(otherConcept.level - concept.level);
            if (levelDiff <= 1) {
                relatedness += 0.3 - (levelDiff * 0.1);
            }
            
            // Similar category
            if (otherConcept.category === concept.category) {
                relatedness += 0.4;
            }
            
            // Keyword overlap
            const keywordOverlap = this.calculateKeywordOverlap(concept.keywords, otherConcept.keywords);
            relatedness += keywordOverlap * 0.2;
            
            // Prerequisites relationship
            if (concept.prerequisites?.includes(otherConcept.id)) {
                relatedness += 0.6;
            }
            if (otherConcept.prerequisites?.includes(conceptId)) {
                relatedness += 0.4;
            }
            
            if (relatedness > 0.3) {
                related.push({
                    concept: otherConcept,
                    relatedness: relatedness
                });
            }
        });
        
        return related
            .sort((a, b) => b.relatedness - a.relatedness)
            .slice(0, maxResults)
            .map(item => item.concept);
    }
    
    /**
     * Get concept statistics
     */
    static getConceptStatistics() {
        const stats = {
            totalConcepts: this.concepts.size,
            byDomain: {},
            byLevel: {},
            byDifficulty: {},
            averageDifficulty: 0,
            averageTimeMinutes: 0
        };
        
        let totalDifficulty = 0;
        let totalTime = 0;
        
        this.concepts.forEach(concept => {
            // By domain
            stats.byDomain[concept.domain] = (stats.byDomain[concept.domain] || 0) + 1;
            
            // By level
            stats.byLevel[concept.level] = (stats.byLevel[concept.level] || 0) + 1;
            
            // By difficulty
            stats.byDifficulty[concept.difficulty] = (stats.byDifficulty[concept.difficulty] || 0) + 1;
            
            totalDifficulty += concept.difficulty;
            totalTime += concept.estimatedTimeMinutes;
        });
        
        stats.averageDifficulty = totalDifficulty / this.concepts.size;
        stats.averageTimeMinutes = totalTime / this.concepts.size;
        
        return stats;
    }
    
    /**
     * Search concepts by keyword
     */
    static searchConcepts(query, maxResults = 10) {
        const searchTerms = query.toLowerCase().split(' ');
        const results = [];
        
        this.concepts.forEach(concept => {
            let score = 0;
            
            // Check name match
            if (concept.name.toLowerCase().includes(query.toLowerCase())) {
                score += 2;
            }
            
            // Check keyword matches
            concept.keywords.forEach(keyword => {
                if (searchTerms.some(term => keyword.toLowerCase().includes(term))) {
                    score += 1;
                }
            });
            
            // Check description match
            if (concept.description.toLowerCase().includes(query.toLowerCase())) {
                score += 0.5;
            }
            
            if (score > 0) {
                results.push({
                    concept: concept,
                    relevance: score
                });
            }
        });
        
        return results
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, maxResults)
            .map(item => item.concept);
    }
    
    /**
     * Initialize curriculum learning paths
     */
    static initializeCurriculumPaths() {
        // Mathematics curriculum
        this.curriculum.set('mathematics-basic', [
            'basic-arithmetic',
            'algebra-basics',
            'systems-of-equations'
        ]);
        
        // Physics curriculum
        this.curriculum.set('physics-mechanics', [
            'force-and-motion',
            'energy-conservation'
        ]);
        
        // Accounting curriculum
        this.curriculum.set('accounting-assets', [
            'depreciation-straight-line',
            'depreciation-accelerated'
        ]);
        
        // Programming curriculum
        this.curriculum.set('programming-fundamentals', [
            'variables-and-data-types',
            'control-flow'
        ]);
        
        // Chemistry curriculum
        this.curriculum.set('chemistry-basic', [
            'atomic-structure',
            'chemical-bonding'
        ]);
    }
    
    /**
     * Initialize concept relationships
     */
    static initializeConceptRelationships() {
        // Mathematics relationships
        this.addRelationship('algebra-basics', 'systems-of-equations', 'prerequisite', 1.0);
        this.addRelationship('basic-arithmetic', 'algebra-basics', 'prerequisite', 1.0);
        
        // Physics relationships
        this.addRelationship('force-and-motion', 'energy-conservation', 'prerequisite', 0.8);
        this.addRelationship('basic-arithmetic', 'force-and-motion', 'prerequisite', 0.6);
        
        // Cross-domain relationships
        this.addRelationship('algebra-basics', 'force-and-motion', 'supportive', 0.4);
        this.addRelationship('basic-arithmetic', 'depreciation-straight-line', 'prerequisite', 0.9);
        
        // Programming relationships
        this.addRelationship('variables-and-data-types', 'control-flow', 'prerequisite', 1.0);
        
        // Chemistry relationships
        this.addRelationship('atomic-structure', 'chemical-bonding', 'prerequisite', 1.0);
        this.addRelationship('basic-arithmetic', 'atomic-structure', 'prerequisite', 0.5);
    }
    
    /**
     * Add relationship between concepts
     */
    static addRelationship(fromConcept, toConcept, type, strength) {
        if (!this.relationships.has(fromConcept)) {
            this.relationships.set(fromConcept, []);
        }
        
        this.relationships.get(fromConcept).push({
            target: toConcept,
            type: type, // 'prerequisite', 'supportive', 'related', 'conflicting'
            strength: strength // 0.0 to 1.0
        });
    }
    
    /**
     * Get curriculum path
     */
    static getCurriculumPath(curriculumId) {
        return this.curriculum.get(curriculumId) || [];
    }
    
    /**
     * UTILITY METHODS
     */
    static calculateKeywordOverlap(keywords1, keywords2) {
        const overlap = keywords1.filter(keyword => 
            keywords2.some(k => k.toLowerCase() === keyword.toLowerCase())
        );
        const total = Math.max(keywords1.length, keywords2.length);
        return total > 0 ? overlap.length / total : 0;
    }
    
    /**
     * Validate concept data structure
     */
    static validateConcept(conceptData) {
        const required = ['id', 'name', 'domain', 'level', 'description', 'keywords'];
        const missing = required.filter(field => !(field in conceptData));
        
        if (missing.length > 0) {
            throw new Error(`Missing required concept fields: ${missing.join(', ')}`);
        }
        
        if (typeof conceptData.level !== 'number' || conceptData.level < 1) {
            throw new Error('Concept level must be a positive number');
        }
        
        if (!Array.isArray(conceptData.keywords) || conceptData.keywords.length === 0) {
            throw new Error('Concept must have at least one keyword');
        }
        
        return true;
    }
    
    /**
     * Export concept data for external use
     */
    static exportConcepts() {
        const exported = {
            concepts: Array.from(this.concepts.entries()),
            relationships: Array.from(this.relationships.entries()),
            curriculum: Array.from(this.curriculum.entries()),
            prerequisites: Array.from(this.prerequisites.entries()),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        return exported;
    }
    
    /**
     * Import concept data
     */
    static importConcepts(data) {
        if (data.concepts) {
            data.concepts.forEach(([id, concept]) => {
                this.concepts.set(id, concept);
            });
        }
        
        if (data.relationships) {
            this.relationships = new Map(data.relationships);
        }
        
        if (data.curriculum) {
            this.curriculum = new Map(data.curriculum);
        }
        
        if (data.prerequisites) {
            this.prerequisites = new Map(data.prerequisites);
        }
    }
}
