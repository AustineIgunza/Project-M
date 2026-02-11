# Adaptive Learning Engine

## Overview

This is a sophisticated gamified e-learning system designed to ensure **measurable learning through self-discovery**, not entertainment. The system enforces an unavoidable learning flow and uses guided thinking mechanics to help learners acquire real knowledge through repeated application.

## Core Philosophy

> **"We are building a thinking engine that feels like a game, not a game that teaches."**

### Key Principles

1. **Measured Learning**: Every interaction tracks real understanding
2. **Self-Discovery**: Learners find answers through guided questioning, never direct revelation
3. **Strict Progression**: No advancement without demonstrated mastery
4. **Real-World Application**: All challenges reflect authentic conditions
5. **Thinking Over Consuming**: Active reasoning required, not passive content consumption

## System Architecture

### Core Learning Flow
Every learning unit follows this unavoidable sequence:
```
Introduce → Practice → Assess
```

### Component Structure

```
js/
├── core/
│   ├── LearningEngine.js      # Main orchestrator
│   ├── MissionGenerator.js    # Procedural content generation
│   └── MasteryTracker.js      # Progress and mastery evaluation
├── mechanics/
│   ├── SocraticEngine.js      # Guided questioning system
│   ├── JustificationValidator.js  # Reasoning quality validation
│   └── ProgressionGate.js     # Strict advancement control
└── data/
    └── ConceptDatabase.js     # Knowledge structure and relationships
```

## Key Features

### 1. Socratic Questioning System
- Never reveals direct answers
- Leads learners through guided discovery
- Adapts questions based on response quality
- Challenges assumptions and builds understanding

### 2. Procedural Mission Generation
- Creates variable practice problems
- Same concepts, different contexts
- Prevents memorization, enforces understanding
- Real-world scenario integration

### 3. Strict Progression Gating
- **No skipping allowed**
- **No manual overrides**
- Requires demonstrated mastery:
  - 85% accuracy minimum
  - Consistent performance over time
  - Quality reasoning validation
  - Retention testing
  - Application in new contexts

### 4. Comprehensive Mastery Tracking
- Multi-dimensional assessment
- Spaced repetition scheduling
- Learning analytics and insights
- Performance trend analysis

### 5. Active Learning Mechanics

#### Required Mechanics Implemented:
- **Socratic Questioning**: Sequential dependent questions
- **Forced Justification**: Every answer requires reasoning
- **Incomplete Information**: Learners must seek governing rules
- **Error Correction**: Identify and fix incorrect solutions
- **Reverse Problems**: Reconstruct steps from results
- **Constraint Challenges**: Limited time/resources/attempts
- **Teach the System**: Explain concepts in own words
- **Confidence Tagging**: Self-assess certainty levels
- **Retrieval Before Review**: Attempt before accessing notes
- **Progressive Hints**: Graduated assistance without answers

## Getting Started

### Installation
1. Extract files to your Apache web server directory
2. Ensure JavaScript is enabled in your browser
3. Open `index.html` in your web browser

### Development Setup
```bash
# If using a local development server
cd "Project M"
# Start your preferred local server (Apache, nginx, etc.)
```

### Initial Configuration
The system initializes with:
- Basic mathematical concepts
- Physics fundamentals
- Accounting principles
- Programming basics
- Chemistry foundations

## Usage

### For Learners
1. **Start**: Begin with challenge preview to understand the goal
2. **Learn**: Engage with Socratic questioning - provide reasoning for every answer
3. **Practice**: Work through varied problems testing the same concepts
4. **Assess**: Complete real-world application challenge
5. **Progress**: Advance only after demonstrating mastery

### For Educators/Administrators
The system provides:
- Detailed learning analytics
- Mastery progression reports
- Concept-level performance tracking
- Learning path recommendations
- Error pattern analysis

## Concept Management

### Adding New Concepts
```javascript
ConceptDatabase.addConcept('new-concept-id', {
    id: 'new-concept-id',
    name: 'Concept Name',
    domain: 'subject-area',
    level: 2,
    description: 'Detailed description',
    keywords: ['key1', 'key2', 'key3'],
    prerequisites: ['prerequisite-concept-id'],
    learningObjectives: [
        'Objective 1',
        'Objective 2'
    ],
    commonMisconceptions: [
        'Common error 1',
        'Common error 2'
    ],
    difficulty: 3,
    estimatedTimeMinutes: 45,
    category: 'concept-category'
});
```

### Creating Learning Paths
```javascript
ConceptDatabase.curriculum.set('custom-path', [
    'concept-1',
    'concept-2',
    'concept-3'
]);
```

## Assessment Criteria

### Mastery Requirements
- **Accuracy**: 85% minimum correctness
- **Consistency**: 80% stable performance over time
- **Reasoning**: 75% quality in explanations
- **Retention**: 70% performance after time gaps
- **Application**: 80% success in new contexts

### Evidence Requirements
- Minimum 3 attempts per concept
- Minimum 5 minutes engagement time
- Maximum 5 attempts per question
- Retention testing after time delays
- Application in varied contexts

## System Safeguards

### Progression Protection
- **No level skipping**: Must complete in sequence
- **No manual overrides**: System-controlled advancement only
- **Evidence required**: Comprehensive mastery proof needed
- **Multiple validations**: Cross-checks prevent false positives

### Learning Integrity
- **Reasoning required**: Cannot advance without explanations
- **Variable content**: Prevents memorization
- **Error learning**: Mistakes become learning opportunities
- **Confidence tracking**: Self-awareness development

## Debugging and Development

### Debug Console
Access development tools via:
```javascript
// Get current system state
window.debugLearningSystem.getEngine()

// View concept database
window.debugLearningSystem.getConcepts()

// Check learning progress
window.debugLearningSystem.getProgress()

// Reset all progress (development only)
window.debugLearningSystem.resetProgress()
```

### Performance Monitoring
The system includes:
- Load time measurement
- Performance observation
- Error tracking and reporting
- Analytics integration ready

## Accessibility Features

### Included Support
- Keyboard navigation (Ctrl+Enter to submit, H for hints, Esc to close)
- Screen reader compatibility
- Skip navigation links
- Semantic HTML structure
- ARIA labels and live regions
- High contrast theme option

### Internationalization
Base framework included for:
- Multi-language support
- RTL language compatibility
- Cultural adaptation capabilities

## Technical Requirements

### Browser Support
- Modern browsers with ES6+ support
- JavaScript enabled
- Local storage capability
- 1024x768 minimum resolution recommended

### Performance
- Optimized for educational institutions
- Offline capability (partial)
- Mobile-responsive design
- Touch-friendly interface

## Data Privacy

### Local Storage
- All learning data stored locally
- No external data transmission by default
- User control over data retention
- Optional cloud sync capability

### Analytics
- Anonymized learning patterns
- No personally identifiable information required
- Opt-in analytics reporting
- GDPR compliance ready

## Extending the System

### Adding New Learning Mechanics
1. Create mechanic in `js/mechanics/`
2. Register with `LearningEngine`
3. Update UI components as needed
4. Add validation rules

### Custom Assessment Methods
1. Extend `MasteryTracker` class
2. Define new criteria in `ProgressionGate`
3. Implement validation logic
4. Update progression requirements

### Integration APIs
Framework ready for:
- LMS integration
- Grade book connectivity
- Learning analytics platforms
- Content management systems

## Support and Development

### Getting Help
- Review console logs for debugging
- Check browser compatibility
- Verify JavaScript execution
- Examine network requests

### Contributing
When extending the system:
1. Maintain strict mastery requirements
2. Preserve Socratic questioning approach
3. Add comprehensive validation
4. Document new concepts thoroughly

### Best Practices
- **Never reveal answers directly**
- **Always require reasoning**
- **Validate understanding depth**
- **Maintain progression integrity**
- **Focus on thinking skills**

---

## License

This learning system is designed for educational institutions and researchers committed to evidence-based learning. The system enforces academic integrity and cannot be bypassed or gamified for entertainment purposes.

## Contact

For educational implementation support or system customization, please ensure alignment with the core philosophy of measured learning through guided discovery.

---

*"The goal is not to make learning fun, but to make thinking irresistible."*
