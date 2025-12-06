// Operations Concepts (10 total)

export const operationsConcepts = [
  {
    slug: 'supply-chain-management',
    name: 'Supply Chain Management',
    category: 'Operations',
    description: 'Managing the flow of goods, information, and finances from supplier to customer',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Supply Chain Management (SCM) is the coordination and management of all activities involved in sourcing, procurement, conversion, and logistics. It encompasses the planning and management of all activities from raw material suppliers through to the end customer, integrating supply and demand management.',
      principles: [
        { title: 'Supply Chain Integration', description: 'Coordinating and sharing information across suppliers, manufacturers, distributors, and retailers.' },
        { title: 'Demand Forecasting', description: 'Predicting customer demand to optimize inventory and production planning.' },
        { title: 'Inventory Management', description: 'Balancing carrying costs against stockout risks. Safety stock, reorder points, and EOQ.' },
        { title: 'Logistics Optimization', description: 'Efficient transportation, warehousing, and distribution network design.' },
        { title: 'Risk Management', description: 'Identifying and mitigating supply chain disruptions, supplier risks, and demand volatility.' }
      ],
      whenToUse: [
        'Reducing operational costs',
        'Improving delivery performance',
        'Managing supplier relationships',
        'Responding to demand changes',
        'Building supply chain resilience'
      ],
      examples: [
        { company: 'Walmart', description: 'Pioneer in SCM with cross-docking, RFID tracking, and vendor-managed inventory. Legendary efficiency and cost leadership.' },
        { company: 'Zara', description: 'Vertically integrated fast fashion with 2-week design-to-store cycle vs. industry 6-month standard.' },
        { company: 'Apple', description: 'Global supply chain with strategic supplier relationships, inventory velocity, and launch logistics.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'supplyChain',
      nodes: [
        { name: 'Raw Materials', type: 'supplier' },
        { name: 'Component Mfg', type: 'manufacturer' },
        { name: 'Assembly', type: 'manufacturer' },
        { name: 'Distribution', type: 'distributor' },
        { name: 'Retail', type: 'retailer' },
        { name: 'Customer', type: 'customer' }
      ],
      flows: ['Materials', 'Information', 'Finances']
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'The "bullwhip effect" in supply chains refers to:',
        options: ['Faster delivery times', 'Amplification of demand variability upstream', 'Reduced supplier relationships', 'Lower inventory costs'],
        correctIndex: 1,
        explanation: 'The bullwhip effect describes how small demand fluctuations at retail level become amplified as orders move upstream, causing inventory and production swings.'
      }
    ]),
    relatedIds: 'lean-operations,working-capital-management,capacity-planning'
  },
  {
    slug: 'lean-operations',
    name: 'Lean Operations',
    category: 'Operations',
    description: 'Systematic method for eliminating waste and maximizing value',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Lean Operations, derived from the Toyota Production System, is a systematic approach to identifying and eliminating waste (muda) through continuous improvement, pursuing perfection in production and service delivery. The goal is to create maximum value for customers with minimum resources.',
      principles: [
        { title: 'Seven Wastes (Muda)', description: 'Transport, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects. TIM WOOD.' },
        { title: 'Value Stream Mapping', description: 'Visualizing all steps in a process to identify value-adding vs. non-value-adding activities.' },
        { title: 'Pull System', description: 'Production triggered by actual demand, not forecasts. Reduces overproduction waste.' },
        { title: 'Continuous Flow', description: 'Moving items through production one at a time without stoppages.' },
        { title: 'Kaizen', description: 'Continuous improvement through small, incremental changes involving all employees.' }
      ],
      whenToUse: [
        'Reducing operational waste',
        'Improving process efficiency',
        'Manufacturing optimization',
        'Service process improvement',
        'Quality improvement initiatives'
      ],
      examples: [
        { company: 'Toyota', description: 'Origin of lean. Just-in-time production, continuous improvement culture, respect for people. Industry-leading quality and efficiency.' },
        { company: 'Healthcare', description: 'Virginia Mason Medical Center applied Toyota methods to reduce patient wait times, eliminate errors, and improve outcomes.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'sevenWastes',
      wastes: [
        { name: 'Transport', description: 'Unnecessary movement of products', icon: 'truck' },
        { name: 'Inventory', description: 'Excess products or materials', icon: 'box' },
        { name: 'Motion', description: 'Unnecessary movement of people', icon: 'move' },
        { name: 'Waiting', description: 'Time spent waiting', icon: 'clock' },
        { name: 'Overproduction', description: 'Making more than needed', icon: 'plus' },
        { name: 'Overprocessing', description: 'More work than required', icon: 'cog' },
        { name: 'Defects', description: 'Errors requiring rework', icon: 'x' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Classify these situations into the correct type of waste',
        items: [
          { text: 'Products waiting in queue between process steps', category: 'Waiting' },
          { text: 'Worker walking across factory to get tools', category: 'Motion' },
          { text: 'Building inventory "just in case"', category: 'Inventory' },
          { text: 'Parts shipped between buildings for processing', category: 'Transport' },
          { text: 'Reworking defective products', category: 'Defects' },
          { text: 'Making more units than ordered', category: 'Overproduction' }
        ],
        categories: ['Transport', 'Inventory', 'Motion', 'Waiting', 'Overproduction', 'Overprocessing', 'Defects']
      }
    ]),
    relatedIds: 'six-sigma,supply-chain-management,theory-of-constraints,kanban'
  },
  {
    slug: 'six-sigma',
    name: 'Six Sigma',
    category: 'Operations',
    description: 'Data-driven methodology to eliminate defects and reduce variation',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Six Sigma is a set of techniques and tools for process improvement, developed at Motorola in 1986. It seeks to improve quality by identifying and removing causes of defects and minimizing variability. The term refers to processes that produce fewer than 3.4 defects per million opportunities.',
      principles: [
        { title: 'DMAIC Methodology', description: 'Define, Measure, Analyze, Improve, Control - structured problem-solving for existing processes.' },
        { title: 'DMADV Methodology', description: 'Define, Measure, Analyze, Design, Verify - for new products/processes (Design for Six Sigma).' },
        { title: 'Statistical Analysis', description: 'Data-driven decision making using statistical tools to understand variation.' },
        { title: 'Process Capability', description: 'Measuring how well processes meet specifications (Cp, Cpk indices).' },
        { title: 'Belt System', description: 'Yellow, Green, Black, and Master Black Belts indicate training and project leadership levels.' }
      ],
      whenToUse: [
        'Quality improvement initiatives',
        'Reducing process variation',
        'Cost reduction through defect elimination',
        'Customer satisfaction improvement',
        'Manufacturing and service optimization'
      ],
      examples: [
        { company: 'Motorola', description: 'Originated Six Sigma. Saved $16B over 10 years through systematic quality improvement.' },
        { company: 'GE under Jack Welch', description: 'Company-wide Six Sigma implementation reported $12B in savings. Became model for corporate adoption.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'dmaic',
      phases: [
        { name: 'Define', description: 'Define problem, scope, goals', color: '#3b82f6', tools: ['Project Charter', 'SIPOC', 'Voice of Customer'] },
        { name: 'Measure', description: 'Measure current performance', color: '#8b5cf6', tools: ['Data Collection', 'Process Mapping', 'Measurement System Analysis'] },
        { name: 'Analyze', description: 'Analyze causes of defects', color: '#ec4899', tools: ['Root Cause Analysis', 'Statistical Analysis', 'Hypothesis Testing'] },
        { name: 'Improve', description: 'Implement solutions', color: '#22c55e', tools: ['DOE', 'Pilot Testing', 'Solution Selection'] },
        { name: 'Control', description: 'Sustain improvements', color: '#f97316', tools: ['Control Charts', 'Standard Work', 'Documentation'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'What does "Six Sigma" level of quality actually mean?',
        options: ['6% defect rate', '6 defects per hundred', '3.4 defects per million opportunities', 'Zero defects'],
        correctIndex: 2,
        explanation: 'Six Sigma quality means only 3.4 defects per million opportunities - essentially near-perfection in process performance.'
      }
    ]),
    relatedIds: 'lean-operations,total-quality-management,supply-chain-management'
  },
  {
    slug: 'capacity-planning',
    name: 'Capacity Planning',
    category: 'Operations',
    description: 'Matching production capability to demand requirements',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Capacity planning is the process of determining the production capacity needed by an organization to meet changing demands for its products or services. It involves balancing the costs of excess capacity against the costs of insufficient capacity.',
      principles: [
        { title: 'Design Capacity', description: 'Maximum theoretical output under ideal conditions.' },
        { title: 'Effective Capacity', description: 'Expected output considering maintenance, scheduling constraints, quality issues.' },
        { title: 'Utilization', description: 'Actual output / Design capacity. How much of potential is being used.' },
        { title: 'Efficiency', description: 'Actual output / Effective capacity. How well resources are being used.' },
        { title: 'Capacity Strategies', description: 'Lead (build ahead of demand), Lag (wait for demand), Match (incremental additions).' }
      ],
      whenToUse: [
        'Capital investment decisions',
        'Production planning',
        'Workforce planning',
        'Service capacity design',
        'Growth strategy planning'
      ],
      examples: [
        { company: 'Airlines', description: 'Capacity measured in Available Seat Miles. Revenue management optimizes load factor (utilization) vs. pricing.' },
        { company: 'Manufacturing', description: 'Adding production shifts or new facilities based on demand forecasts and lead times.' },
        { company: 'Cloud Computing', description: 'AWS auto-scaling adjusts capacity in real-time based on actual demand.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'capacityComparison',
      levels: [
        { name: 'Design Capacity', value: 100, color: '#3b82f6', description: 'Maximum possible' },
        { name: 'Effective Capacity', value: 85, color: '#8b5cf6', description: 'Realistic maximum' },
        { name: 'Actual Output', value: 70, color: '#22c55e', description: 'What we produce' }
      ],
      metrics: {
        utilization: 'Actual/Design = 70%',
        efficiency: 'Actual/Effective = 82%'
      }
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A factory has design capacity of 1000 units/day, effective capacity of 800 units/day, and actual output of 720 units/day. What is the efficiency?',
        options: ['72%', '80%', '90%', '111%'],
        correctIndex: 2,
        explanation: 'Efficiency = Actual Output / Effective Capacity = 720/800 = 90%. Utilization would be 720/1000 = 72%.'
      }
    ]),
    relatedIds: 'supply-chain-management,lean-operations,sales-operations-planning'
  },
  {
    slug: 'total-quality-management',
    name: 'Total Quality Management',
    category: 'Operations',
    description: 'Organization-wide approach to continuous quality improvement',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Total Quality Management (TQM) is a management approach centered on quality, based on participation of all members of an organization, and aimed at long-term success through customer satisfaction and benefits to organization members and society.',
      principles: [
        { title: 'Customer Focus', description: 'Quality is defined by customer requirements and expectations.' },
        { title: 'Total Employee Involvement', description: 'All employees participate in working toward common quality goals.' },
        { title: 'Process-Centered', description: 'Focus on processes as the route to quality improvement.' },
        { title: 'Integrated System', description: 'All functions work together in pursuit of quality.' },
        { title: 'Continuous Improvement', description: 'Ongoing effort to improve products, services, and processes.' },
        { title: 'Fact-Based Decision Making', description: 'Decisions based on data and analysis, not opinion.' }
      ],
      whenToUse: [
        'Organization-wide quality transformation',
        'Building quality culture',
        'Customer satisfaction improvement',
        'Cost of quality reduction',
        'Competitive differentiation through quality'
      ],
      examples: [
        { company: 'Deming and Japan', description: 'W. Edwards Deming taught TQM principles in post-war Japan, helping create world-leading quality in Japanese manufacturing.' },
        { company: 'Ritz-Carlton', description: 'Two-time Baldrige Award winner. Employee empowerment, service standards, and systematic quality improvement.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'pdcaCycle',
      phases: [
        { name: 'Plan', description: 'Identify opportunity, plan change', color: '#3b82f6' },
        { name: 'Do', description: 'Implement change on small scale', color: '#8b5cf6' },
        { name: 'Check', description: 'Analyze results, compare to expectations', color: '#ec4899' },
        { name: 'Act', description: 'Standardize or adjust based on learning', color: '#22c55e' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'In TQM, who is responsible for quality?',
        options: ['Quality assurance department', 'Senior management only', 'Everyone in the organization', 'External inspectors'],
        correctIndex: 2,
        explanation: 'TQM requires total employee involvement - quality is everyone\'s responsibility, not just a specialized department.'
      }
    ]),
    relatedIds: 'six-sigma,lean-operations,supply-chain-management'
  },
  {
    slug: 'theory-of-constraints',
    name: 'Theory of Constraints',
    category: 'Operations',
    description: 'Management philosophy focusing on system bottlenecks',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'The Theory of Constraints (TOC), developed by Eliyahu Goldratt, is a management paradigm that views any manageable system as limited by a very small number of constraints. The systematic process focuses on identifying and managing these constraints to achieve system goals.',
      principles: [
        { title: 'The Goal', description: 'The goal of a business is to make money. All decisions should support this.' },
        { title: 'System as a Chain', description: 'A system is only as strong as its weakest link (the constraint or bottleneck).' },
        { title: 'Five Focusing Steps', description: '1) Identify constraint 2) Exploit it 3) Subordinate everything else 4) Elevate constraint 5) Repeat.' },
        { title: 'Throughput Accounting', description: 'Focus on throughput, inventory, and operating expense rather than cost accounting.' },
        { title: 'Drum-Buffer-Rope', description: 'Production scheduling method where constraint sets pace (drum), buffers protect it, and rope controls release.' }
      ],
      whenToUse: [
        'Identifying system bottlenecks',
        'Production scheduling',
        'Project management',
        'Process improvement prioritization',
        'Strategic resource allocation'
      ],
      examples: [
        { company: 'Manufacturing Plant', description: 'If one machine is the bottleneck, maximize its utilization, schedule around it, and consider adding capacity there first.' },
        { company: 'Hospital Emergency Room', description: 'If doctor availability is the constraint, ensure doctors are never waiting for patients, information, or resources.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'fiveSteps',
      steps: [
        { step: 1, name: 'Identify', description: 'Find the constraint', color: '#3b82f6' },
        { step: 2, name: 'Exploit', description: 'Get the most out of it', color: '#8b5cf6' },
        { step: 3, name: 'Subordinate', description: 'Align everything else', color: '#ec4899' },
        { step: 4, name: 'Elevate', description: 'Increase constraint capacity', color: '#22c55e' },
        { step: 5, name: 'Repeat', description: 'Find new constraint', color: '#f97316' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'A factory has three workstations in sequence. Station A can process 100 units/hour, Station B can process 60 units/hour, Station C can process 90 units/hour.',
        question: 'Apply the Theory of Constraints: 1) What is the constraint? 2) What is the maximum system throughput? 3) What should be the focus of improvement efforts?',
        hints: ['The system can only produce as fast as its slowest step', 'Improving non-constraints won\'t increase total output']
      }
    ]),
    relatedIds: 'lean-operations,six-sigma,capacity-planning'
  },
  {
    slug: 'kanban',
    name: 'Kanban',
    category: 'Operations',
    description: 'Visual workflow management system using cards to signal work',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'Kanban is a visual workflow management method that uses cards (kanban means "signboard" in Japanese) to signal work and limit work in progress. Originally developed at Toyota, it is now widely used in manufacturing and knowledge work, especially software development.',
      principles: [
        { title: 'Visualize Work', description: 'Make work visible on a board with columns representing workflow stages.' },
        { title: 'Limit Work in Progress (WIP)', description: 'Set maximum items allowed in each stage to prevent overload and improve flow.' },
        { title: 'Focus on Flow', description: 'Optimize for smooth, continuous flow rather than individual task speed.' },
        { title: 'Make Policies Explicit', description: 'Define clear rules for how work moves through the system.' },
        { title: 'Continuous Improvement', description: 'Regularly reflect on and improve the process.' }
      ],
      whenToUse: [
        'Visual work management',
        'Software development (Agile)',
        'Manufacturing production control',
        'Team workflow optimization',
        'Personal productivity'
      ],
      examples: [
        { company: 'Toyota', description: 'Original kanban system used cards to signal when parts needed replenishment, implementing pull-based production.' },
        { company: 'Software Teams', description: 'Digital kanban boards (Trello, Jira) with columns like Backlog, In Progress, Review, Done. WIP limits prevent multitasking.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'kanbanBoard',
      columns: [
        { name: 'Backlog', wipLimit: null, items: ['Task A', 'Task B', 'Task C'] },
        { name: 'In Progress', wipLimit: 3, items: ['Task D', 'Task E'] },
        { name: 'Review', wipLimit: 2, items: ['Task F'] },
        { name: 'Done', wipLimit: null, items: ['Task G', 'Task H'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Why are WIP (Work in Progress) limits important in Kanban?',
        options: ['To ensure workers are always busy', 'To reduce context switching and improve flow', 'To increase the number of tasks started', 'To eliminate the need for a backlog'],
        correctIndex: 1,
        explanation: 'WIP limits prevent overload, reduce context switching, and surface bottlenecks. Finishing work is more important than starting new work.'
      }
    ]),
    relatedIds: 'lean-operations,theory-of-constraints,supply-chain-management'
  },
  {
    slug: 'sales-operations-planning',
    name: 'S&OP (Sales & Operations Planning)',
    category: 'Operations',
    description: 'Cross-functional process aligning demand and supply plans',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Sales and Operations Planning (S&OP) is an integrated business management process through which executive leadership continually achieves focus, alignment, and synchronization among all functions of the organization. It balances demand and supply at an aggregate level.',
      principles: [
        { title: 'Demand Planning', description: 'Forecasting customer demand across products, markets, and time horizons.' },
        { title: 'Supply Planning', description: 'Determining how to meet demand through production, inventory, and sourcing.' },
        { title: 'Cross-Functional Integration', description: 'Aligning sales, marketing, operations, finance, and executive teams.' },
        { title: 'Rolling Time Horizon', description: 'Monthly process looking 12-24 months ahead, updating plans continuously.' },
        { title: 'Executive Review', description: 'Senior leadership makes decisions to resolve conflicts and set direction.' }
      ],
      whenToUse: [
        'Balancing demand and supply',
        'Improving forecast accuracy',
        'Cross-functional alignment',
        'Inventory optimization',
        'Capacity and resource planning'
      ],
      examples: [
        { company: 'Consumer Products', description: 'Monthly S&OP aligns marketing promotions with production capacity and inventory levels to prevent stockouts and overstock.' },
        { company: 'Industrial Manufacturing', description: 'S&OP coordinates long lead-time components with sales forecasts and capacity investments.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'sopProcess',
      phases: [
        { name: 'Data Gathering', week: 1, participants: ['All functions'] },
        { name: 'Demand Planning', week: 2, participants: ['Sales', 'Marketing'] },
        { name: 'Supply Planning', week: 3, participants: ['Operations', 'Supply Chain'] },
        { name: 'Pre-S&OP', week: 4, participants: ['Cross-functional team'] },
        { name: 'Executive S&OP', week: 4, participants: ['Senior leadership'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'What is the primary purpose of S&OP?',
        options: ['Reduce headcount', 'Align demand and supply plans across the organization', 'Eliminate forecasting', 'Automate production'],
        correctIndex: 1,
        explanation: 'S&OP integrates demand plans (what customers want) with supply plans (what we can deliver), ensuring cross-functional alignment.'
      }
    ]),
    relatedIds: 'capacity-planning,supply-chain-management,demand-forecasting'
  },
  {
    slug: 'process-reengineering',
    name: 'Business Process Reengineering',
    category: 'Operations',
    description: 'Radical redesign of processes for dramatic improvement',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Business Process Reengineering (BPR) is the fundamental rethinking and radical redesign of business processes to achieve dramatic improvements in critical measures of performance such as cost, quality, service, and speed. Unlike incremental improvement, BPR challenges assumptions and redesigns from scratch.',
      principles: [
        { title: 'Fundamental Rethinking', description: 'Ask "why do we do what we do?" and "why do we do it the way we do?"' },
        { title: 'Radical Redesign', description: 'Reinvent processes, not just improve them. "Don\'t automate, obliterate."' },
        { title: 'Dramatic Improvement', description: 'Target order-of-magnitude improvements (10x), not marginal (10%).' },
        { title: 'Process Focus', description: 'Organize around outcomes and processes, not functions and tasks.' },
        { title: 'Technology Enablement', description: 'Use technology to enable new ways of working, not just speed up old ways.' }
      ],
      whenToUse: [
        'Dramatic performance improvement needed',
        'Processes are fundamentally broken',
        'Major technology implementation',
        'Industry disruption response',
        'Mergers and transformations'
      ],
      examples: [
        { company: 'Ford Accounts Payable', description: 'Reduced headcount from 500 to 125 by eliminating invoices and matching through integrated systems.' },
        { company: 'Insurance Claims', description: 'Progressive Insurance reengineered claims to settle within hours vs. weeks through mobile assessors.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'beforeAfter',
      before: { label: 'Traditional Process', steps: 8, departments: 5, time: '15 days' },
      after: { label: 'Reengineered Process', steps: 3, departments: 1, time: '2 days' },
      improvement: '85% reduction in cycle time'
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'How does BPR differ from continuous improvement (Kaizen)?',
        options: ['BPR is faster to implement', 'BPR makes incremental changes; Kaizen is radical', 'BPR redesigns from scratch; Kaizen makes incremental improvements', 'There is no difference'],
        correctIndex: 2,
        explanation: 'BPR involves fundamental, radical redesign for dramatic improvement. Kaizen focuses on continuous, incremental improvements to existing processes.'
      }
    ]),
    relatedIds: 'lean-operations,change-management,value-chain-analysis'
  },
  {
    slug: 'outsourcing-decisions',
    name: 'Outsourcing Decisions',
    category: 'Operations',
    description: 'Make vs. buy decisions for activities and processes',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Outsourcing decisions involve determining whether to perform activities internally (make) or purchase them from external providers (buy). These decisions are strategic, affecting costs, quality, flexibility, and competitive position.',
      principles: [
        { title: 'Core vs. Non-Core', description: 'Keep core competencies in-house; consider outsourcing non-core activities.' },
        { title: 'Total Cost of Ownership', description: 'Consider all costs: transaction, coordination, quality, risk - not just price.' },
        { title: 'Capability and Quality', description: 'Can external providers deliver better quality or capability?' },
        { title: 'Flexibility and Control', description: 'Outsourcing may reduce control but increase flexibility.' },
        { title: 'Risk Assessment', description: 'Evaluate dependency risk, IP protection, and supply continuity.' }
      ],
      whenToUse: [
        'Cost reduction initiatives',
        'Capacity constraints',
        'Accessing specialized capabilities',
        'Focus on core competencies',
        'Strategic restructuring'
      ],
      examples: [
        { company: 'Apple', description: 'Outsources manufacturing to Foxconn while keeping design, software, and marketing in-house. Clear core/non-core distinction.' },
        { company: 'Boeing 787', description: 'Extensive outsourcing led to quality problems and delays. Cautionary tale of over-outsourcing complex systems.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Keep In-House', color: '#22c55e', description: 'Strategic, high performance' },
        { row: 0, col: 1, label: 'Acquire Capability', color: '#3b82f6', description: 'Strategic, low performance' },
        { row: 1, col: 0, label: 'Alliance/Partner', color: '#8b5cf6', description: 'Non-strategic, high performance' },
        { row: 1, col: 1, label: 'Outsource', color: '#f97316', description: 'Non-strategic, low performance' }
      ],
      axes: { x: { label: 'Current Performance', positive: 'High', negative: 'Low' }, y: { label: 'Strategic Importance', positive: 'High', negative: 'Low' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which factor is MOST important in deciding whether to outsource?',
        options: ['Lowest cost provider', 'Strategic importance and core competency fit', 'Geographic location of provider', 'Size of provider company'],
        correctIndex: 1,
        explanation: 'Strategic importance and alignment with core competencies should drive make vs. buy decisions. Cost is important but not the only factor.'
      }
    ]),
    relatedIds: 'core-competencies,supply-chain-management,value-chain-analysis'
  }
]


