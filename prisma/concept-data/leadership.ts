// Leadership Concepts (8 total)

export const leadershipConcepts = [
  {
    slug: 'change-management',
    name: 'Change Management',
    category: 'Leadership',
    description: 'Guiding organizations through transformation and adoption of new ways of working',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Change management is a systematic approach to dealing with the transition or transformation of organizational goals, processes, or technologies. The purpose is to implement strategies for effecting change, controlling change, and helping people adapt to change.',
      principles: [
        { title: "Kotter's 8 Steps", description: 'Create urgency, form coalition, create vision, communicate, empower, quick wins, build on change, anchor in culture.' },
        { title: 'People Side of Change', description: 'Change is ultimately about people adopting new behaviors. Resistance is natural and must be addressed.' },
        { title: 'Stakeholder Analysis', description: 'Understand who is affected, their concerns, and how to engage them.' },
        { title: 'Communication', description: 'Consistent, clear messaging about why, what, and how is essential.' },
        { title: 'Reinforcement', description: 'Sustain change through incentives, celebration, and cultural embedding.' }
      ],
      whenToUse: [
        'Organizational restructuring',
        'Technology implementations',
        'Mergers and acquisitions',
        'Process transformations',
        'Cultural change initiatives'
      ],
      examples: [
        { company: 'Microsoft under Nadella', description: 'Cultural transformation from "know-it-all" to "learn-it-all." Cloud-first strategy required mindset change across 100K+ employees.' },
        { company: 'IBM', description: 'Multiple reinventions from hardware to services to cloud/AI. Successful change management in large, established organization.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'kotterSteps',
      steps: [
        { step: 1, name: 'Create Urgency', phase: 'Create Climate' },
        { step: 2, name: 'Form Coalition', phase: 'Create Climate' },
        { step: 3, name: 'Create Vision', phase: 'Create Climate' },
        { step: 4, name: 'Communicate Vision', phase: 'Engage Organization' },
        { step: 5, name: 'Empower Action', phase: 'Engage Organization' },
        { step: 6, name: 'Quick Wins', phase: 'Engage Organization' },
        { step: 7, name: 'Build on Change', phase: 'Sustain' },
        { step: 8, name: 'Anchor in Culture', phase: 'Sustain' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: "According to Kotter, what is the first step in successful change management?",
        options: ['Create a detailed implementation plan', 'Create a sense of urgency', 'Form a powerful coalition', 'Communicate the vision'],
        correctIndex: 1,
        explanation: 'Creating urgency helps people understand why change is necessary and motivates them to move. Without urgency, complacency blocks change.'
      }
    ]),
    relatedIds: 'organizational-culture,stakeholder-management,emotional-intelligence'
  },
  {
    slug: 'organizational-culture',
    name: 'Organizational Culture',
    category: 'Leadership',
    description: 'Shared values, beliefs, and practices that shape organizational behavior',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Organizational culture refers to the underlying beliefs, assumptions, values, and ways of interacting that contribute to the unique social and psychological environment of an organization. It shapes how employees think, feel, and behave, often described as 'how things are done around here.'",
      principles: [
        { title: 'Culture Levels (Schein)', description: 'Artifacts (visible), Espoused Values (stated), Basic Assumptions (unconscious, taken-for-granted beliefs).' },
        { title: 'Culture Types', description: 'Clan (collaborative), Adhocracy (creative), Market (competitive), Hierarchy (controlling). Different types suit different strategies.' },
        { title: 'Culture Fit', description: 'Alignment between culture and strategy is crucial for performance.' },
        { title: 'Founder Influence', description: 'Founders imprint lasting cultural DNA. Early decisions become embedded assumptions.' },
        { title: 'Culture Change', description: 'Difficult but possible. Requires sustained leadership, systems alignment, and time.' }
      ],
      whenToUse: [
        'Diagnosing organizational issues',
        'M&A cultural due diligence',
        'Transformation planning',
        'Hiring and talent decisions',
        'Strategy-culture alignment'
      ],
      examples: [
        { company: 'Netflix', description: 'Famous culture deck. High performance, radical candor, freedom and responsibility. Culture as competitive advantage.' },
        { company: 'Zappos', description: 'Customer-centric culture. Offers new hires $2,000 to quit to ensure cultural fit. Unusual policies reinforce values.' }
      ]
    }),
    diagramType: 'pyramid',
    diagramData: JSON.stringify({
      levels: [
        { label: 'Artifacts', description: 'Visible structures, processes, behaviors', color: '#3b82f6' },
        { label: 'Espoused Values', description: 'Stated strategies, goals, philosophies', color: '#8b5cf6' },
        { label: 'Basic Assumptions', description: 'Unconscious, taken-for-granted beliefs', color: '#22c55e' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Classify these cultural elements into Schein\'s levels',
        items: [
          { text: 'Company mission statement', category: 'Espoused Values' },
          { text: 'Open office layout', category: 'Artifacts' },
          { text: 'Belief that "customers always come first"', category: 'Basic Assumptions' },
          { text: 'Annual award ceremony', category: 'Artifacts' },
          { text: 'Published code of ethics', category: 'Espoused Values' },
          { text: 'Unconscious assumption that conflict is bad', category: 'Basic Assumptions' }
        ],
        categories: ['Artifacts', 'Espoused Values', 'Basic Assumptions']
      }
    ]),
    relatedIds: 'change-management,stakeholder-management,servant-leadership'
  },
  {
    slug: 'stakeholder-management',
    name: 'Stakeholder Management',
    category: 'Leadership',
    description: 'Identifying and addressing the needs of all parties with interest in the organization',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Stakeholder management is the process of managing the expectations and needs of all parties who have an interest in or influence over a project or organization. It involves identifying stakeholders, understanding their interests, and developing strategies to engage them appropriately.',
      principles: [
        { title: 'Stakeholder Identification', description: 'Who is affected by or can affect outcomes? Internal and external parties.' },
        { title: 'Power-Interest Matrix', description: 'Classify stakeholders by power (influence) and interest (concern). Different strategies for each quadrant.' },
        { title: 'Engagement Strategies', description: 'Manage closely (high power, high interest), Keep satisfied (high power, low interest), Keep informed (low power, high interest), Monitor (low power, low interest).' },
        { title: 'Stakeholder vs. Shareholder', description: 'Broader view beyond just shareholders to all affected parties: employees, customers, communities, suppliers.' },
        { title: 'Competing Interests', description: 'Stakeholder interests often conflict. Leaders must balance and make trade-offs.' }
      ],
      whenToUse: [
        'Project planning and management',
        'Strategic decision-making',
        'Change initiatives',
        'Corporate governance',
        'ESG and sustainability planning'
      ],
      examples: [
        { company: 'ESG Movement', description: 'Shift from shareholder primacy to stakeholder capitalism. Companies increasingly accountable to employees, communities, environment.' },
        { company: 'Project Management', description: 'Identifying and engaging project stakeholders prevents surprises and builds support.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Keep Satisfied', color: '#3b82f6', strategy: 'Meet their needs, don\'t bore with details' },
        { row: 0, col: 1, label: 'Manage Closely', color: '#ef4444', strategy: 'Fully engage, partner with them' },
        { row: 1, col: 0, label: 'Monitor', color: '#6b7280', strategy: 'Minimal effort, keep watching' },
        { row: 1, col: 1, label: 'Keep Informed', color: '#22c55e', strategy: 'Adequate communication, address concerns' }
      ],
      axes: { x: { label: 'Interest', positive: 'High', negative: 'Low' }, y: { label: 'Power', positive: 'High', negative: 'Low' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'You are leading a factory automation project. Key stakeholders include: CEO (supportive, busy), factory workers (worried about jobs), union leaders (concerned), IT team (excited about technology), customers (want better quality).',
        question: 'Using the power-interest matrix, classify each stakeholder and determine appropriate engagement strategy.',
        framework: { axes: ['Power (influence over project)', 'Interest (concern about project)'] }
      }
    ]),
    relatedIds: 'change-management,corporate-governance,organizational-culture'
  },
  {
    slug: 'servant-leadership',
    name: 'Servant Leadership',
    category: 'Leadership',
    description: 'Leadership philosophy focused on serving others and developing people',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: "Servant leadership is a philosophy where the main goal of the leader is to serve. This is different from traditional leadership where the leader's main focus is the thriving of their company. Servant leaders share power, put the needs of employees first, and help people develop and perform as highly as possible.",
      principles: [
        { title: 'Service First', description: 'Leader exists to serve followers, not the other way around.' },
        { title: 'Empowerment', description: 'Developing others, sharing authority, and building capability.' },
        { title: 'Listening', description: 'Deep commitment to listening and understanding others.' },
        { title: 'Empathy', description: 'Understanding and accepting others, recognizing their unique spirits.' },
        { title: 'Stewardship', description: 'Holding the organization in trust for the greater good.' }
      ],
      whenToUse: [
        'Building high-trust cultures',
        'Developing team capability',
        'Long-term organizational health',
        'Knowledge worker environments',
        'Purpose-driven organizations'
      ],
      examples: [
        { company: 'Southwest Airlines (Herb Kelleher)', description: 'Put employees first, believing they would then put customers first. Created unique culture and sustained profitability.' },
        { company: 'Starbucks (Howard Schultz)', description: 'Employee benefits like healthcare and stock ownership. Called employees "partners" and invested in their development.' }
      ]
    }),
    diagramType: 'pyramid',
    diagramData: JSON.stringify({
      levels: [
        { label: 'Employees/Team', description: 'Top priority', color: '#22c55e' },
        { label: 'Customers', description: 'Served by empowered employees', color: '#3b82f6' },
        { label: 'Leader', description: 'Serves and supports others', color: '#8b5cf6' }
      ],
      inverted: true
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'What is the primary measure of success for a servant leader?',
        options: ['Personal power and authority', 'Growth and success of those they serve', 'Profit maximization', 'Speed of decision-making'],
        correctIndex: 1,
        explanation: 'Servant leadership measures success by the growth, development, and well-being of the people being led.'
      }
    ]),
    relatedIds: 'organizational-culture,emotional-intelligence,change-management'
  },
  {
    slug: 'emotional-intelligence',
    name: 'Emotional Intelligence',
    category: 'Leadership',
    description: 'Ability to recognize, understand, and manage emotions in self and others',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: "Emotional Intelligence (EI or EQ) is the ability to recognize, understand, manage, and effectively use emotions in oneself and others. Daniel Goleman's research showed EI is often more important than IQ for leadership effectiveness.",
      principles: [
        { title: 'Self-Awareness', description: 'Recognizing your own emotions, strengths, weaknesses, values, and impact on others.' },
        { title: 'Self-Regulation', description: 'Managing disruptive emotions and impulses. Thinking before acting.' },
        { title: 'Motivation', description: 'Inner drive to pursue goals with energy and persistence.' },
        { title: 'Empathy', description: 'Understanding the emotional makeup of other people. Treating people according to their emotional reactions.' },
        { title: 'Social Skills', description: 'Proficiency in managing relationships and building networks.' }
      ],
      whenToUse: [
        'Leadership development',
        'Team building and collaboration',
        'Conflict resolution',
        'Negotiation and influence',
        'Customer relationships'
      ],
      examples: [
        { company: 'Leadership Selection', description: 'Many companies now assess EQ alongside IQ in leadership hiring and promotion decisions.' },
        { company: 'High-Pressure Situations', description: 'Leaders with high EI navigate crises better, maintaining calm and helping teams perform under stress.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'eqFramework',
      components: [
        { name: 'Self-Awareness', category: 'Self', color: '#3b82f6' },
        { name: 'Self-Regulation', category: 'Self', color: '#8b5cf6' },
        { name: 'Motivation', category: 'Self', color: '#ec4899' },
        { name: 'Empathy', category: 'Others', color: '#22c55e' },
        { name: 'Social Skills', category: 'Others', color: '#f97316' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'According to Goleman, which EI component involves recognizing emotions in others?',
        options: ['Self-awareness', 'Self-regulation', 'Empathy', 'Social skills'],
        correctIndex: 2,
        explanation: 'Empathy is the ability to understand the emotional makeup of others and treat people according to their emotional reactions.'
      }
    ]),
    relatedIds: 'servant-leadership,change-management,stakeholder-management'
  },
  {
    slug: 'decision-making-frameworks',
    name: 'Decision-Making Frameworks',
    category: 'Leadership',
    description: 'Structured approaches to making better business decisions',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Decision-making frameworks are structured approaches that help leaders and teams make better decisions by providing a systematic process for evaluating options, considering trade-offs, and reducing cognitive biases.',
      principles: [
        { title: 'RAPID Framework', description: 'Recommend, Agree, Perform, Input, Decide - clarifies decision roles and responsibilities.' },
        { title: 'Decision Matrix', description: 'Weight criteria, score options, calculate weighted scores to compare alternatives.' },
        { title: 'Pre-Mortem', description: 'Imagine the decision has failed. What went wrong? Surfaces risks not otherwise considered.' },
        { title: 'Reversibility Test', description: 'One-way vs. two-way doors. Two-way (reversible) decisions can be made faster.' },
        { title: 'Second-Order Thinking', description: 'Consider consequences of consequences. "And then what?"' }
      ],
      whenToUse: [
        'High-stakes decisions',
        'Complex choices with multiple criteria',
        'Group decision-making',
        'Reducing bias in decisions',
        'Improving decision quality systematically'
      ],
      examples: [
        { company: 'Amazon (Bezos)', description: 'Type 1 (irreversible) vs Type 2 (reversible) decisions. Type 2 can be made quickly by individuals. Type 1 requires careful analysis.' },
        { company: 'Intel (Grove)', description: 'Constructive confrontation. Debate ideas vigorously, then commit fully to the decision made.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'decisionProcess',
      steps: [
        { name: 'Frame', description: 'Define the decision clearly' },
        { name: 'Gather', description: 'Collect relevant information' },
        { name: 'Generate', description: 'Create multiple options' },
        { name: 'Evaluate', description: 'Assess against criteria' },
        { name: 'Decide', description: 'Make the call' },
        { name: 'Learn', description: 'Review outcomes' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'Your team needs to decide whether to: A) Build a feature in-house (6 months, certain), B) Buy a startup that has it (2 months, expensive, integration risk), or C) Partner with vendor (3 months, ongoing dependency).',
        question: 'Create a decision matrix with criteria (time, cost, risk, control, quality) and weight them. Which option scores highest?',
        framework: { criteria: ['Time to market', 'Total cost', 'Risk level', 'Control/ownership', 'Quality/fit'] }
      }
    ]),
    relatedIds: 'stakeholder-management,scenario-planning,emotional-intelligence'
  },
  {
    slug: 'transformational-leadership',
    name: 'Transformational Leadership',
    category: 'Leadership',
    description: 'Leadership style that inspires followers to exceed expectations',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Transformational leadership is a leadership style where leaders work with teams to identify needed change, create a vision to guide the change through inspiration, and execute the change together. It enhances motivation, morale, and performance through various mechanisms.',
      principles: [
        { title: 'Idealized Influence', description: 'Leaders serve as role models. They are admired, respected, and trusted.' },
        { title: 'Inspirational Motivation', description: 'Leaders articulate a compelling vision of the future and motivate others to achieve it.' },
        { title: 'Intellectual Stimulation', description: 'Leaders challenge assumptions, take risks, and solicit followers\' ideas.' },
        { title: 'Individualized Consideration', description: 'Leaders attend to each follower\'s needs, acting as coach or mentor.' },
        { title: 'Beyond Transactional', description: 'Moves beyond exchange-based leadership to inspire intrinsic motivation.' }
      ],
      whenToUse: [
        'Major organizational change',
        'Building vision and strategy',
        'Developing future leaders',
        'Turnaround situations',
        'Creating new organizational direction'
      ],
      examples: [
        { company: 'Apple (Steve Jobs)', description: 'Iconic example of inspirational vision, high standards (idealized influence), and pushing people to achieve the "impossible."' },
        { company: 'Nelson Mandela', description: 'Transformed South Africa through moral authority, vision of reconciliation, and individual attention to followers.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'fourIs',
      components: [
        { name: 'Idealized Influence', description: 'Be a role model', icon: 'star' },
        { name: 'Inspirational Motivation', description: 'Articulate vision', icon: 'lightbulb' },
        { name: 'Intellectual Stimulation', description: 'Challenge thinking', icon: 'brain' },
        { name: 'Individualized Consideration', description: 'Coach and mentor', icon: 'users' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which of the "Four I\'s" of transformational leadership involves challenging assumptions and encouraging innovation?',
        options: ['Idealized Influence', 'Inspirational Motivation', 'Intellectual Stimulation', 'Individualized Consideration'],
        correctIndex: 2,
        explanation: 'Intellectual Stimulation involves questioning assumptions, reframing problems, and encouraging creativity and innovation.'
      }
    ]),
    relatedIds: 'change-management,servant-leadership,organizational-culture'
  },
  {
    slug: 'negotiation-principles',
    name: 'Negotiation Principles',
    category: 'Leadership',
    description: 'Strategies and tactics for reaching mutually beneficial agreements',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Negotiation is a dialogue between two or more parties to reach a beneficial outcome. Effective negotiation requires preparation, understanding interests (not just positions), and creative problem-solving to find mutually beneficial solutions.',
      principles: [
        { title: 'BATNA', description: 'Best Alternative To Negotiated Agreement. Your power comes from your alternatives.' },
        { title: 'Interests vs. Positions', description: 'Focus on underlying interests (why), not stated positions (what). Multiple positions can satisfy same interests.' },
        { title: 'Separate People from Problem', description: 'Attack the problem, not the person. Manage emotions and relationships.' },
        { title: 'Create Value Before Claiming', description: 'Expand the pie through creative options before dividing it.' },
        { title: 'Use Objective Criteria', description: 'Base agreements on fair standards: market value, precedent, expert opinion.' }
      ],
      whenToUse: [
        'Business deals and contracts',
        'Salary and employment negotiations',
        'Conflict resolution',
        'Partnerships and alliances',
        'Internal resource allocation'
      ],
      examples: [
        { company: 'Getting to Yes (Fisher & Ury)', description: 'Classic principled negotiation framework from Harvard Negotiation Project. Focus on interests, not positions.' },
        { company: 'Hostage Negotiation', description: 'FBI techniques emphasize listening, empathy, and building rapport - applicable to business negotiations.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'negotiationFramework',
      elements: [
        { name: 'BATNA', description: 'Know your alternatives', color: '#3b82f6' },
        { name: 'Interests', description: 'Understand underlying needs', color: '#8b5cf6' },
        { name: 'Options', description: 'Generate creative solutions', color: '#22c55e' },
        { name: 'Criteria', description: 'Use fair standards', color: '#f97316' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'You are negotiating a job offer. The company offered $90K salary. You wanted $100K. Your current job pays $85K. A competitor offered you $95K.',
        question: 'What is your BATNA? How might you focus on interests rather than positions? What objective criteria could you use?',
        hints: ['BATNA = your best option if this negotiation fails', 'Interests = why you want $100K (cost of living, skills value, market rate)', 'Criteria = comparable salaries in the market']
      }
    ]),
    relatedIds: 'stakeholder-management,emotional-intelligence,decision-making-frameworks'
  }
]


