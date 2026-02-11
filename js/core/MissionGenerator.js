/**
 * Mission Generator - Creates variable practice missions and final challenges
 * Implements procedural generation to avoid repetition while testing same concepts
 */
class MissionGenerator {
    constructor() {
        this.templates = {
            // Accounting templates
            depreciation: {
                finalChallenge: this.createDepreciationChallenge,
                practiceQuestions: this.generateDepreciationPractice
            },
            // Math templates
            algebra: {
                finalChallenge: this.createAlgebraChallenge,
                practiceQuestions: this.generateAlgebraPractice
            },
            // Science templates
            physics: {
                finalChallenge: this.createPhysicsChallenge,
                practiceQuestions: this.generatePhysicsPractice
            }
        };
        
        this.variationStrategies = {
            numerical: this.generateNumericalVariations,
            contextual: this.generateContextualVariations,
            format: this.generateFormatVariations,
            constraint: this.generateConstraintVariations
        };
        
        this.realWorldContexts = {
            business: ['startup company', 'manufacturing business', 'retail store', 'consulting firm'],
            engineering: ['bridge construction', 'software development', 'automotive design', 'renewable energy'],
            healthcare: ['hospital management', 'pharmaceutical research', 'medical device design', 'patient care'],
            education: ['curriculum design', 'student assessment', 'resource allocation', 'performance analysis']
        };
    }
    
    /**
     * Create a final challenge for a given concept
     */
    async createFinalChallenge(concept) {
        const template = this.templates[concept.category];
        if (!template) {
            throw new Error(`No template found for concept: ${concept.category}`);
        }
        
        // Generate the challenge using the appropriate template
        const challenge = await template.finalChallenge.call(this, concept);
        
        // Add real-world context
        challenge.context = this.addRealWorldContext(challenge, concept);
        
        // Add success criteria
        challenge.successCriteria = this.defineChallengeSuccessCriteria(challenge);
        
        return challenge;
    }
    
    /**
     * Generate practice questions for a concept
     */
    async generatePracticeQuestions(concept, count = 5) {
        const template = this.templates[concept.category];
        if (!template) {
            throw new Error(`No template found for concept: ${concept.category}`);
        }
        
        const baseQuestions = await template.practiceQuestions.call(this, concept);
        const variations = [];
        
        // Generate variations of each base question
        for (const question of baseQuestions) {
            const questionVariations = this.generateQuestionVariations(question, concept);
            variations.push(...questionVariations);
        }
        
        // Randomize and return requested count
        return this.selectRandomQuestions(variations, count);
    }
    
    /**
     * Generate variations of a single question
     */
    generateQuestionVariations(baseQuestion, concept) {
        const variations = [baseQuestion]; // Include original
        
        // Apply each variation strategy
        Object.values(this.variationStrategies).forEach(strategy => {
            try {
                const variant = strategy.call(this, baseQuestion, concept);
                if (variant && this.isValidVariation(variant, baseQuestion)) {
                    variations.push(variant);
                }
            } catch (error) {
                console.warn('Variation generation failed:', error);
            }
        });
        
        return variations;
    }
    
    /**
     * DEPRECIATION TEMPLATES
     */
    createDepreciationChallenge(concept) {
        const scenarios = [
            {
                asset: 'Manufacturing Equipment',
                cost: this.randomBetween(50000, 200000),
                salvageValue: 5000,
                usefulLife: this.randomBetween(5, 10),
                method: 'straight-line'
            },
            {
                asset: 'Delivery Vehicle Fleet',
                cost: this.randomBetween(30000, 80000),
                salvageValue: this.randomBetween(3000, 8000),
                usefulLife: this.randomBetween(4, 8),
                method: 'double-declining-balance'
            },
            {
                asset: 'Computer Systems',
                cost: this.randomBetween(15000, 50000),
                salvageValue: 1000,
                usefulLife: this.randomBetween(3, 5),
                method: 'sum-of-years-digits'
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        return {
            title: `Depreciation Schedule Creation`,
            description: `You are the accounting manager for a ${this.getRandomContext('business')}. You need to create a complete depreciation schedule for recently purchased ${scenario.asset.toLowerCase()}.`,
            scenario: scenario,
            requirements: [
                'Calculate annual depreciation for each year of useful life',
                'Prepare a complete depreciation schedule table',
                'Show accumulated depreciation and book value for each year',
                'Justify your choice of depreciation method',
                'Consider tax implications of your calculations'
            ],
            deliverables: {
                schedule: 'Complete depreciation schedule table',
                explanation: 'Written explanation of method and calculations',
                recommendation: 'Business impact analysis'
            },
            constraints: {
                timeLimit: 45, // minutes
                resources: ['Calculator', 'Depreciation method reference'],
                format: 'Professional financial report format'
            }
        };
    }
    
    generateDepreciationPractice(concept) {
        return [
            {
                id: 'dep-basic-1',
                type: 'numerical',
                title: 'Straight-Line Depreciation',
                text: 'A machine costs $80,000 with a salvage value of $8,000 and useful life of 6 years. Calculate the annual depreciation using straight-line method.',
                correctAnswer: 12000,
                unit: '$',
                tolerance: 0.01,
                hint: 'Straight-line depreciation = (Cost - Salvage Value) ÷ Useful Life',
                explanation: 'Annual depreciation = ($80,000 - $8,000) ÷ 6 = $12,000',
                requiredConcepts: ['cost basis', 'salvage value', 'useful life']
            },
            {
                id: 'dep-scenario-1',
                type: 'multiple-choice',
                title: 'Depreciation Method Selection',
                text: 'Which depreciation method would be most appropriate for computer equipment that becomes obsolete quickly?',
                options: [
                    'Straight-line method',
                    'Double-declining-balance method',
                    'Sum-of-years-digits method',
                    'Units-of-production method'
                ],
                correctAnswer: 1,
                hint: 'Consider which method allocates more depreciation to earlier years',
                explanation: 'Double-declining-balance method is best for assets that lose value quickly due to obsolescence',
                requiredConcepts: ['accelerated depreciation', 'asset characteristics']
            },
            {
                id: 'dep-calculation-1',
                type: 'text',
                title: 'Double-Declining Balance',
                text: 'Explain the steps to calculate first-year depreciation using double-declining-balance method for an asset costing $50,000 with 5-year useful life.',
                correctAnswer: 'Double-declining rate = (2 ÷ 5) = 40%. First year depreciation = $50,000 × 40% = $20,000',
                hint: 'Remember to double the straight-line rate',
                explanation: 'Double-declining-balance uses twice the straight-line rate applied to book value',
                requiredConcepts: ['declining balance rate', 'book value']
            }
        ];
    }
    
    /**
     * ALGEBRA TEMPLATES
     */
    createAlgebraChallenge(concept) {
        const realWorldProblems = [
            {
                context: 'Business Optimization',
                problem: 'Maximizing profit for a product mix',
                variables: ['production quantity', 'selling price', 'material costs'],
                constraints: ['budget limits', 'production capacity', 'market demand']
            },
            {
                context: 'Engineering Design',
                problem: 'Optimizing structural efficiency',
                variables: ['material thickness', 'load capacity', 'safety factor'],
                constraints: ['weight limits', 'cost targets', 'safety standards']
            },
            {
                context: 'Resource Management',
                problem: 'Optimal resource allocation',
                variables: ['time allocation', 'resource distribution', 'output targets'],
                constraints: ['budget constraints', 'time limits', 'quality requirements']
            }
        ];
        
        const selectedProblem = realWorldProblems[Math.floor(Math.random() * realWorldProblems.length)];
        
        return {
            title: `${selectedProblem.context}: System of Equations`,
            description: `You are working on ${selectedProblem.problem.toLowerCase()} and need to solve a complex system of equations to find the optimal solution.`,
            scenario: this.generateAlgebraScenario(selectedProblem),
            requirements: [
                'Set up the system of equations based on given constraints',
                'Solve the system using appropriate algebraic methods',
                'Interpret the solution in the context of the problem',
                'Verify your solution satisfies all constraints',
                'Provide recommendations based on your findings'
            ],
            deliverables: {
                equations: 'Complete system of equations setup',
                solution: 'Step-by-step algebraic solution',
                interpretation: 'Real-world meaning of the mathematical solution'
            },
            constraints: {
                timeLimit: 40,
                allowedMethods: ['substitution', 'elimination', 'matrix methods'],
                verification: 'Must show verification of solution'
            }
        };
    }
    
    generateAlgebraPractice(concept) {
        return [
            {
                id: 'alg-linear-1',
                type: 'numerical',
                title: 'Linear Equation Solving',
                text: 'Solve for x: 3x + 7 = 22',
                correctAnswer: 5,
                tolerance: 0.01,
                hint: 'Isolate x by performing inverse operations',
                explanation: '3x + 7 = 22 → 3x = 15 → x = 5',
                requiredConcepts: ['inverse operations', 'equation solving']
            },
            {
                id: 'alg-system-1',
                type: 'ordering',
                title: 'System Solution Steps',
                text: 'Order the steps to solve the system: x + y = 5, 2x - y = 1',
                items: [
                    'Add the equations to eliminate y',
                    'Solve for x: 3x = 6',
                    'Substitute x = 2 into first equation',
                    'Solve for y: y = 3'
                ],
                correctOrder: [0, 1, 2, 3],
                hint: 'Elimination method eliminates one variable first',
                explanation: 'Systematic approach: eliminate, solve, substitute, solve',
                requiredConcepts: ['elimination method', 'substitution']
            }
        ];
    }
    
    /**
     * PHYSICS TEMPLATES
     */
    createPhysicsChallenge(concept) {
        const scenarios = [
            {
                context: 'Bridge Design',
                problem: 'Calculate forces in truss structure',
                variables: ['tension', 'compression', 'load distribution'],
                realWorld: 'Engineering safety analysis'
            },
            {
                context: 'Satellite Motion',
                problem: 'Determine orbital parameters',
                variables: ['velocity', 'gravitational force', 'orbital radius'],
                realWorld: 'Space mission planning'
            },
            {
                context: 'Energy Efficiency',
                problem: 'Optimize energy transfer system',
                variables: ['kinetic energy', 'potential energy', 'work done'],
                realWorld: 'Renewable energy systems'
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        return {
            title: `${scenario.context}: ${scenario.problem}`,
            description: `Apply physics principles to solve a real ${scenario.realWorld.toLowerCase()} problem.`,
            scenario: this.generatePhysicsScenario(scenario),
            requirements: [
                'Identify relevant physics principles and laws',
                'Set up equations based on physical relationships',
                'Solve for unknown quantities with proper units',
                'Analyze the physical meaning of your results',
                'Assess practical implications and limitations'
            ],
            deliverables: {
                analysis: 'Physics principle identification',
                calculation: 'Complete mathematical solution',
                evaluation: 'Physical interpretation and practical assessment'
            },
            constraints: {
                timeLimit: 35,
                precision: 'Three significant figures',
                units: 'Must include proper SI units throughout'
            }
        };
    }
    
    generatePhysicsPractice(concept) {
        return [
            {
                id: 'phy-force-1',
                type: 'numerical',
                title: 'Newton\'s Second Law',
                text: 'A 10 kg object experiences a net force of 50 N. Calculate its acceleration.',
                correctAnswer: 5,
                unit: 'm/s²',
                tolerance: 0.1,
                hint: 'Use F = ma, solve for a',
                explanation: 'a = F/m = 50 N / 10 kg = 5 m/s²',
                requiredConcepts: ['force', 'mass', 'acceleration']
            },
            {
                id: 'phy-energy-1',
                type: 'multiple-choice',
                title: 'Energy Conservation',
                text: 'A ball is dropped from height h. At what point is kinetic energy maximum?',
                options: [
                    'At the moment of release',
                    'Halfway down',
                    'Just before impact',
                    'At maximum compression'
                ],
                correctAnswer: 2,
                hint: 'Consider when potential energy is minimum',
                explanation: 'Maximum kinetic energy occurs when potential energy is minimum (just before impact)',
                requiredConcepts: ['kinetic energy', 'potential energy', 'conservation']
            }
        ];
    }
    
    /**
     * VARIATION GENERATION METHODS
     */
    generateNumericalVariations(baseQuestion, concept) {
        const variant = JSON.parse(JSON.stringify(baseQuestion));
        variant.id = baseQuestion.id + '-num-var';
        
        // Modify numerical values while maintaining relationships
        if (variant.type === 'numerical') {
            const scaleFactor = this.randomBetween(0.5, 2.0);
            
            // Scale numerical content in text
            variant.text = this.scaleNumbersInText(variant.text, scaleFactor);
            
            // Scale correct answer
            if (typeof variant.correctAnswer === 'number') {
                variant.correctAnswer *= scaleFactor;
            }
        }
        
        return variant;
    }
    
    generateContextualVariations(baseQuestion, concept) {
        const variant = JSON.parse(JSON.stringify(baseQuestion));
        variant.id = baseQuestion.id + '-ctx-var';
        
        // Change the context while keeping the mathematical relationship
        const contexts = this.realWorldContexts[concept.domain] || this.realWorldContexts.business;
        const newContext = contexts[Math.floor(Math.random() * contexts.length)];
        
        variant.text = this.replaceContextInText(variant.text, newContext);
        
        return variant;
    }
    
    generateFormatVariations(baseQuestion, concept) {
        const variant = JSON.parse(JSON.stringify(baseQuestion));
        variant.id = baseQuestion.id + '-fmt-var';
        
        // Change question format (e.g., multiple choice to numerical)
        if (baseQuestion.type === 'multiple-choice' && baseQuestion.correctAnswer === 1) {
            // Convert to numerical if the correct answer can be extracted
            variant.type = 'numerical';
            variant.correctAnswer = this.extractNumericalFromChoice(baseQuestion);
            delete variant.options;
        }
        
        return variant;
    }
    
    generateConstraintVariations(baseQuestion, concept) {
        const variant = JSON.parse(JSON.stringify(baseQuestion));
        variant.id = baseQuestion.id + '-con-var';
        
        // Add or modify constraints
        variant.constraints = {
            timeLimit: this.randomBetween(2, 8), // minutes
            attempts: this.randomBetween(2, 4),
            resources: this.selectRandomResources(concept)
        };
        
        // Modify difficulty by adding complexity
        variant.text += ' Show all steps and justify your approach.';
        
        return variant;
    }
    
    /**
     * UTILITY METHODS
     */
    getRandomContext(domain) {
        const contexts = this.realWorldContexts[domain];
        return contexts[Math.floor(Math.random() * contexts.length)];
    }
    
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    selectRandomQuestions(questions, count) {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    isValidVariation(variant, original) {
        // Ensure variation is meaningfully different but conceptually equivalent
        return variant.id !== original.id && 
               variant.requiredConcepts?.length > 0 &&
               variant.correctAnswer !== null;
    }
    
    scaleNumbersInText(text, factor) {
        return text.replace(/\$?(\d+(?:,\d{3})*(?:\.\d+)?)/g, (match, number) => {
            const num = parseFloat(number.replace(/,/g, ''));
            const scaled = Math.round(num * factor);
            return match.includes('$') ? `$${scaled.toLocaleString()}` : scaled.toString();
        });
    }
    
    replaceContextInText(text, newContext) {
        // Simple context replacement - could be made more sophisticated
        const contextPatterns = [
            /company|business|firm/gi,
            /machine|equipment|device/gi,
            /project|task|assignment/gi
        ];
        
        let modifiedText = text;
        contextPatterns.forEach(pattern => {
            modifiedText = modifiedText.replace(pattern, newContext);
        });
        
        return modifiedText;
    }
    
    generateAlgebraScenario(problem) {
        // Generate specific numerical scenario based on the problem template
        return {
            variables: problem.variables,
            constraints: problem.constraints,
            targetValues: this.generateRandomTargets(),
            equations: this.generateEquationSet(problem)
        };
    }
    
    generatePhysicsScenario(scenario) {
        // Generate specific physics problem with realistic values
        return {
            setup: scenario.context,
            variables: scenario.variables,
            givenValues: this.generatePhysicsValues(scenario),
            unknowns: this.selectUnknowns(scenario.variables)
        };
    }
    
    generateRandomTargets() {
        return {
            primary: this.randomBetween(100, 1000),
            secondary: this.randomBetween(50, 500),
            efficiency: this.randomBetween(70, 95) / 100
        };
    }
    
    generateEquationSet(problem) {
        // This would generate appropriate equation templates
        // Based on the problem type and variables
        return {
            equation1: 'Variable relationships',
            equation2: 'Constraint equations',
            equation3: 'Objective function'
        };
    }
    
    generatePhysicsValues(scenario) {
        // Generate realistic physics values based on scenario
        const values = {};
        
        switch (scenario.context) {
            case 'Bridge Design':
                values.load = this.randomBetween(10000, 50000); // Newtons
                values.length = this.randomBetween(20, 100); // meters
                values.material = 'steel';
                break;
                
            case 'Satellite Motion':
                values.mass = this.randomBetween(500, 2000); // kg
                values.altitude = this.randomBetween(200, 800); // km
                values.planet = 'Earth';
                break;
                
            case 'Energy Efficiency':
                values.mass = this.randomBetween(1, 50); // kg
                values.height = this.randomBetween(1, 20); // meters
                values.velocity = this.randomBetween(5, 30); // m/s
                break;
        }
        
        return values;
    }
    
    selectUnknowns(variables) {
        // Select 1-2 variables to solve for
        const shuffled = variables.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.random() > 0.5 ? 1 : 2);
    }
    
    selectRandomResources(concept) {
        const allResources = [
            'Calculator', 'Reference formulas', 'Unit conversion table',
            'Example problems', 'Concept definitions', 'Graph paper'
        ];
        
        return allResources.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    
    defineChallengeSuccessCriteria(challenge) {
        return {
            accuracy: {
                minimum: 85,
                description: 'Mathematical calculations must be at least 85% accurate'
            },
            completeness: {
                required: ['setup', 'solution', 'interpretation'],
                description: 'All deliverable sections must be completed'
            },
            reasoning: {
                quality: 'clear explanation of approach and methods',
                description: 'Solution method must be clearly explained and justified'
            },
            realWorld: {
                connection: 'practical implications discussed',
                description: 'Solution must be connected to real-world context'
            }
        };
    }
    
    addRealWorldContext(challenge, concept) {
        // Add authentic real-world context to make the challenge meaningful
        return {
            setting: this.getRandomContext(concept.domain),
            stakeholders: this.getStakeholders(concept.domain),
            constraints: this.getRealWorldConstraints(concept.domain),
            impact: this.getBusinessImpact(challenge, concept)
        };
    }
    
    getStakeholders(domain) {
        const stakeholderMap = {
            business: ['Management team', 'Investors', 'Customers', 'Employees'],
            engineering: ['Project manager', 'Safety inspector', 'Client', 'Regulatory bodies'],
            healthcare: ['Patients', 'Medical staff', 'Hospital administration', 'Insurance providers'],
            education: ['Students', 'Teachers', 'Parents', 'School administration']
        };
        
        return stakeholderMap[domain] || stakeholderMap.business;
    }
    
    getRealWorldConstraints(domain) {
        const constraintMap = {
            business: ['Budget limitations', 'Market conditions', 'Regulatory requirements'],
            engineering: ['Safety standards', 'Material availability', 'Environmental impact'],
            healthcare: ['Patient safety', 'Ethical guidelines', 'Resource allocation'],
            education: ['Learning objectives', 'Time constraints', 'Resource availability']
        };
        
        return constraintMap[domain] || constraintMap.business;
    }
    
    getBusinessImpact(challenge, concept) {
        // Define what the successful completion of this challenge means in practice
        return {
            immediate: 'Solves the specific problem presented',
            strategic: 'Demonstrates mastery of core concepts',
            practical: 'Builds skills applicable to real-world scenarios'
        };
    }
}
