// Economics Concepts (8 total)

export const economicsConcepts = [
  {
    slug: 'market-structure',
    name: 'Market Structure',
    category: 'Economics',
    description: 'Characteristics determining competition levels and firm behavior in markets',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Market structure refers to the organizational and other characteristics of a market that determine the nature of competition and pricing. The four main types are perfect competition, monopolistic competition, oligopoly, and monopoly, each with distinct implications for strategy.',
      principles: [
        { title: 'Perfect Competition', description: 'Many small firms, homogeneous products, free entry/exit. Firms are price-takers. Economic profit goes to zero.' },
        { title: 'Monopolistic Competition', description: 'Many firms, differentiated products, some pricing power. Common in consumer goods and services.' },
        { title: 'Oligopoly', description: 'Few large firms, interdependent decisions, barriers to entry. Strategic interaction matters.' },
        { title: 'Monopoly', description: 'Single firm, unique product, high barriers. Maximum pricing power but often regulated.' },
        { title: 'Strategic Implications', description: 'Market structure determines appropriate competitive strategy, pricing power, and profit potential.' }
      ],
      whenToUse: [
        'Industry analysis',
        'Competitive strategy development',
        'Market entry decisions',
        'Pricing strategy',
        'Understanding profit potential'
      ],
      examples: [
        { company: 'Agriculture (Perfect Competition)', description: 'Many farmers, commodity products, price-takers. Individual farmers have no pricing power.' },
        { company: 'Smartphones (Oligopoly)', description: 'Apple and Samsung dominate. Strategic interdependence: price changes prompt competitive response.' },
        { company: 'Utilities (Monopoly/Regulated)', description: 'Natural monopolies due to infrastructure costs. Pricing regulated to protect consumers.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'marketStructureSpectrum',
      structures: [
        { name: 'Perfect Competition', firms: 'Many', product: 'Identical', barriers: 'None', pricing: 'None', examples: ['Agriculture', 'Forex'] },
        { name: 'Monopolistic Competition', firms: 'Many', product: 'Differentiated', barriers: 'Low', pricing: 'Some', examples: ['Restaurants', 'Clothing'] },
        { name: 'Oligopoly', firms: 'Few', product: 'Similar/Different', barriers: 'High', pricing: 'Significant', examples: ['Airlines', 'Telecom'] },
        { name: 'Monopoly', firms: 'One', product: 'Unique', barriers: 'Very High', pricing: 'Maximum', examples: ['Utilities', 'Patents'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which market structure has the highest barriers to entry and maximum pricing power?',
        options: ['Perfect Competition', 'Monopolistic Competition', 'Oligopoly', 'Monopoly'],
        correctIndex: 3,
        explanation: 'Monopoly has the highest barriers (often legal or natural) and maximum pricing power since there are no direct competitors.'
      }
    ]),
    relatedIds: 'porters-five-forces,competitive-advantage,network-effects'
  },
  {
    slug: 'network-effects',
    name: 'Network Effects',
    category: 'Economics',
    description: 'Phenomenon where product value increases as more people use it',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Network effects occur when a product or service becomes more valuable as more people use it. This creates powerful competitive moats and often leads to winner-take-all or winner-take-most market dynamics. They are fundamental to platform businesses.",
      principles: [
        { title: 'Direct Network Effects', description: 'Value increases from more users of the same product (e.g., phone networks, social media).' },
        { title: 'Indirect Network Effects', description: 'Value increases from complementary products/users (e.g., platforms, operating systems).' },
        { title: 'Critical Mass', description: 'Minimum number of users needed for the network to become self-sustaining.' },
        { title: 'Winner-Take-All', description: 'Network effects often lead to market concentration and dominant players.' },
        { title: 'Chicken-and-Egg Problem', description: 'Platforms must attract both sides simultaneously. Solving this is key to platform strategy.' }
      ],
      whenToUse: [
        'Platform business strategy',
        'Technology market analysis',
        'Startup strategy and moat building',
        'Competitive analysis in tech',
        'Valuation of network businesses'
      ],
      examples: [
        { company: 'Facebook/Meta', description: 'Classic direct network effect: each new user makes the platform more valuable for existing users.' },
        { company: 'Uber', description: 'Indirect network effect: more drivers attract more riders; more riders attract more drivers.' },
        { company: 'Microsoft Windows', description: 'Developers write apps for Windows because users are there; users choose Windows because apps are there.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'networkEffectCurve',
      phases: [
        { name: 'Early', users: 'Few', value: 'Low', growth: 'Slow' },
        { name: 'Critical Mass', users: 'Threshold', value: 'Inflection', growth: 'Accelerating' },
        { name: 'Growth', users: 'Many', value: 'High', growth: 'Rapid' },
        { name: 'Maturity', users: 'Saturated', value: 'Maximum', growth: 'Slowing' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which of these exhibits indirect (two-sided) network effects?',
        options: ['A phone network', 'A social media platform like Twitter', 'A marketplace like eBay', 'A messaging app like WhatsApp'],
        correctIndex: 2,
        explanation: 'eBay has indirect network effects between buyers and sellers - more sellers attract buyers, more buyers attract sellers. Direct network effects are within one user group.'
      }
    ]),
    relatedIds: 'economies-of-scale,market-structure,platform-strategy'
  },
  {
    slug: 'economies-of-scale',
    name: 'Economies of Scale',
    category: 'Economics',
    description: 'Cost advantages from increased production volume',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'Economies of scale are cost advantages that enterprises obtain due to their scale of operation, with cost per unit of output decreasing as scale increases. They arise from spreading fixed costs, operational efficiencies, and purchasing power.',
      principles: [
        { title: 'Fixed Cost Spreading', description: 'Higher volume spreads fixed costs (R&D, factories, management) across more units.' },
        { title: 'Operational Efficiencies', description: 'Specialization, automation, and learning curve effects improve with scale.' },
        { title: 'Purchasing Power', description: 'Bulk buying reduces input costs through negotiating leverage.' },
        { title: 'Minimum Efficient Scale', description: 'The smallest output where long-run average cost is minimized.' },
        { title: 'Diseconomies of Scale', description: 'At some point, costs can rise with size due to coordination complexity, bureaucracy.' }
      ],
      whenToUse: [
        'Competitive strategy in scale industries',
        'Make vs. buy decisions',
        'Capacity planning',
        'Industry analysis',
        'Pricing strategy'
      ],
      examples: [
        { company: 'Walmart', description: 'Scale enables lowest prices through purchasing power, distribution efficiency, and fixed cost leverage.' },
        { company: 'Intel', description: 'Semiconductor fabs cost billions. Higher volume spreads costs, enabling competitive pricing.' },
        { company: 'Software/Digital', description: 'Near-zero marginal cost means massive economies of scale. First-copy costs are high; replication is nearly free.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'costCurve',
      curve: [
        { volume: 'Low', unitCost: 'High', label: 'Small scale' },
        { volume: 'Medium', unitCost: 'Medium', label: 'Growing scale' },
        { volume: 'Optimal', unitCost: 'Minimum', label: 'MES' },
        { volume: 'Very High', unitCost: 'Rising', label: 'Diseconomies' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A software company has $10M in development costs and zero marginal cost. If they sell to 1M users, unit cost is $10. If they sell to 10M users, unit cost is:',
        options: ['$10', '$1', '$100', '$0.10'],
        correctIndex: 1,
        explanation: 'With zero marginal cost, unit cost = Fixed costs / Volume = $10M / 10M = $1. This illustrates extreme economies of scale in digital products.'
      }
    ]),
    relatedIds: 'competitive-advantage,market-structure,network-effects'
  },
  {
    slug: 'game-theory',
    name: 'Game Theory',
    category: 'Economics',
    description: 'Strategic decision-making when outcomes depend on others choices',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: "Game theory is the study of strategic interaction among rational decision-makers. It analyzes situations where one party's optimal strategy depends on what others do. Essential for understanding competitive dynamics, negotiations, and strategic moves.",
      principles: [
        { title: 'Nash Equilibrium', description: 'State where no player can improve by unilaterally changing strategy. Stable outcome.' },
        { title: "Prisoner's Dilemma", description: 'Individual rationality leads to collective suboptimality. Cooperation challenges.' },
        { title: 'Dominant Strategy', description: 'Best response regardless of what competitors do.' },
        { title: 'Sequential Games', description: 'Games where moves happen in order. First-mover advantage or disadvantage.' },
        { title: 'Commitment and Credibility', description: 'Ability to credibly commit to a strategy can change game outcomes.' }
      ],
      whenToUse: [
        'Competitive strategy analysis',
        'Pricing decisions in oligopolies',
        'Negotiation strategy',
        'Auction design',
        'Understanding market dynamics'
      ],
      examples: [
        { company: 'Airline Pricing', description: "Price wars represent prisoner's dilemma. Both airlines would benefit from high prices, but each has incentive to undercut." },
        { company: 'Tech Standards', description: 'VHS vs. Betamax, Blu-ray vs. HD-DVD. Network effects create coordination games with winner-take-all outcomes.' },
        { company: 'Capacity Investment', description: 'Committing to new capacity can deter competitors (credible commitment), but risks oversupply.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      player1: 'Firm A',
      player2: 'Firm B',
      rowStrategies: ['High Price', 'Low Price'],
      colStrategies: ['High Price', 'Low Price'],
      payoffs: [
        { row: 0, col: 0, p1: 10, p2: 10, label: 'Both profit' },
        { row: 0, col: 1, p1: 2, p2: 15, label: 'A loses share' },
        { row: 1, col: 0, p1: 15, p2: 2, label: 'B loses share' },
        { row: 1, col: 1, p1: 5, p2: 5, label: 'Price war' }
      ],
      equilibrium: { row: 1, col: 1, explanation: "Both choose Low Price (Nash Equilibrium) despite Both High being better for all" }
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: "In a prisoner's dilemma, why do both parties often end up with suboptimal outcomes?",
        options: ['They are irrational', 'Individual rationality conflicts with collective rationality', 'They cannot communicate', 'The game is unfair'],
        correctIndex: 1,
        explanation: "In prisoner's dilemma, each party's dominant strategy leads to a worse collective outcome. Individual rationality leads to defection even though mutual cooperation would be better."
      }
    ]),
    relatedIds: 'market-structure,competitive-advantage,negotiation-principles'
  },
  {
    slug: 'behavioral-economics',
    name: 'Behavioral Economics',
    category: 'Economics',
    description: 'Psychology-informed economics studying actual human decision-making',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Behavioral economics combines insights from psychology with economics to study how people actually make decisions, which often deviates from the rational actor model of traditional economics. Understanding biases and heuristics helps predict behavior and design better choices.',
      principles: [
        { title: 'Loss Aversion', description: 'Losses hurt more than equivalent gains feel good. People are risk-averse for gains, risk-seeking to avoid losses.' },
        { title: 'Anchoring', description: 'First information encountered disproportionately influences judgment.' },
        { title: 'Present Bias', description: 'People overweight immediate rewards vs. future rewards (hyperbolic discounting).' },
        { title: 'Default Effect', description: 'People tend to stick with default options. Choice architecture matters.' },
        { title: 'Framing', description: 'How choices are presented affects decisions. Same information, different frames, different choices.' }
      ],
      whenToUse: [
        'Product and pricing design',
        'Marketing and communication',
        'Policy design (nudges)',
        'Understanding customer behavior',
        'Investment decision analysis'
      ],
      examples: [
        { company: 'Retirement Savings', description: 'Auto-enrollment in 401(k) dramatically increases participation (default effect). Opt-out vs. opt-in.' },
        { company: 'Netflix', description: 'Free trial leverages loss aversion - once you have it, you don\'t want to lose it.' },
        { company: 'Pricing', description: '$99 vs. $100 (anchoring). "Was $200, now $150" (framing). Limited time offers (scarcity).' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'biasCategories',
      categories: [
        { name: 'Cognitive Biases', biases: ['Anchoring', 'Availability', 'Confirmation'], color: '#3b82f6' },
        { name: 'Emotional Biases', biases: ['Loss Aversion', 'Overconfidence', 'Regret Aversion'], color: '#8b5cf6' },
        { name: 'Social Biases', biases: ['Herding', 'Social Proof', 'Authority'], color: '#22c55e' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A gym offers two framing options: "Save $100 with annual membership" vs. "Lose $100 by paying monthly." Which is likely more effective and why?',
        options: ['Save framing - people like savings', 'Loss framing - loss aversion makes losses feel bigger', 'Both are equally effective', 'Neither is effective'],
        correctIndex: 1,
        explanation: 'Loss aversion means the loss framing ("lose $100") will feel more impactful. Losses are felt about 2x as strongly as equivalent gains.'
      }
    ]),
    relatedIds: 'pricing-strategies,customer-segmentation,decision-making-frameworks'
  },
  {
    slug: 'supply-demand-dynamics',
    name: 'Supply & Demand Dynamics',
    category: 'Economics',
    description: 'Fundamental forces determining market prices and quantities',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'Supply and demand are the fundamental market forces that determine prices and quantities in a market economy. Demand represents buyer behavior; supply represents seller behavior. Market equilibrium occurs where they intersect.',
      principles: [
        { title: 'Law of Demand', description: 'As price increases, quantity demanded decreases (inverse relationship), ceteris paribus.' },
        { title: 'Law of Supply', description: 'As price increases, quantity supplied increases (direct relationship), ceteris paribus.' },
        { title: 'Market Equilibrium', description: 'Price where quantity supplied equals quantity demanded. No pressure for change.' },
        { title: 'Shifts vs. Movements', description: 'Price changes cause movements along curves; other factors shift entire curves.' },
        { title: 'Elasticity', description: 'Responsiveness of quantity to price changes. Affects pricing power and revenue.' }
      ],
      whenToUse: [
        'Pricing decisions',
        'Understanding market dynamics',
        'Forecasting price movements',
        'Policy analysis',
        'Competitive analysis'
      ],
      examples: [
        { company: 'Oil Markets', description: 'OPEC supply decisions, demand shifts from economic growth, and price adjustments illustrate supply-demand dynamics.' },
        { company: 'Real Estate', description: 'Limited supply (zoning) + high demand (population growth) = rising prices. Supply-demand fundamentals.' },
        { company: 'COVID Masks', description: 'Sudden demand spike + fixed short-term supply = price increases until supply adjusted.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'supplyDemand',
      curves: [
        { name: 'Demand', slope: 'negative', color: '#3b82f6' },
        { name: 'Supply', slope: 'positive', color: '#22c55e' }
      ],
      equilibrium: { price: 'P*', quantity: 'Q*', label: 'Market Equilibrium' }
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'If a new technology reduces production costs, what happens to market equilibrium?',
        options: ['Price rises, quantity falls', 'Price falls, quantity rises', 'Both price and quantity fall', 'No change'],
        correctIndex: 1,
        explanation: 'Lower production costs shift the supply curve right (more supply at each price). This leads to lower equilibrium price and higher equilibrium quantity.'
      }
    ]),
    relatedIds: 'market-structure,pricing-strategies,economies-of-scale'
  },
  {
    slug: 'platform-economics',
    name: 'Platform Economics',
    category: 'Economics',
    description: 'Economic principles governing multi-sided platform businesses',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Platform economics studies businesses that create value primarily by facilitating interactions between two or more distinct user groups. Platforms differ from traditional businesses in how they create value, compete, and scale.',
      principles: [
        { title: 'Multi-Sided Markets', description: 'Platforms serve multiple distinct user groups who provide each other with network benefits.' },
        { title: 'Cross-Side Network Effects', description: 'More users on one side attracts more users on the other side.' },
        { title: 'Pricing Structure', description: 'Often subsidize one side (money side vs. subsidy side) to grow both sides.' },
        { title: 'Winner-Take-Most', description: 'Network effects create concentration and barriers, often leading to dominant platforms.' },
        { title: 'Platform Governance', description: 'Rules and algorithms that manage participant behavior and quality.' }
      ],
      whenToUse: [
        'Platform business model design',
        'Marketplace strategy',
        'Understanding tech industry dynamics',
        'Investment analysis of platform companies',
        'Regulatory analysis'
      ],
      examples: [
        { company: 'Google', description: 'Connects searchers (free) with advertisers (paid). Searchers subsidized; advertisers pay.' },
        { company: 'Airbnb', description: 'Connects travelers with hosts. Both sides pay but travelers drive demand.' },
        { company: 'App Stores', description: 'Connect app developers with device users. Apple/Google take 15-30% of transactions.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'platform',
      sides: [
        { name: 'Users/Consumers', role: 'Demand side', icon: 'users' },
        { name: 'Providers/Sellers', role: 'Supply side', icon: 'store' }
      ],
      platform: { name: 'Platform', functions: ['Match-making', 'Trust/Safety', 'Payment', 'Communication'] },
      flows: ['Services/Products', 'Payment', 'Data', 'Reviews/Reputation']
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'You\'re launching a new food delivery platform. You need both restaurants and hungry customers. Restaurants are harder to acquire and more valuable per user.',
        question: 'How should you price each side? What\'s your strategy to solve the chicken-and-egg problem?',
        hints: ['Consider which side is more price-sensitive', 'Think about which side brings more value per user', 'Consider subsidizing one side to bootstrap the other']
      }
    ]),
    relatedIds: 'network-effects,market-structure,competitive-advantage'
  },
  {
    slug: 'opportunity-cost',
    name: 'Opportunity Cost',
    category: 'Economics',
    description: 'The value of the next best alternative forgone',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'Opportunity cost is the value of the next-best alternative that must be given up when making a choice. It represents the benefits you could have received by taking an alternative action. Every choice has an opportunity cost.',
      principles: [
        { title: 'Trade-offs', description: 'Resources are scarce. Choosing one option means giving up others.' },
        { title: 'Explicit vs. Implicit Costs', description: 'Explicit costs involve money. Implicit costs include time, foregone alternatives.' },
        { title: 'Sunk Costs Are Irrelevant', description: 'Past costs should not affect future decisions. Only opportunity costs matter.' },
        { title: 'Comparative Advantage', description: 'Focus on activities where your opportunity cost is lowest relative to others.' },
        { title: 'Time Value', description: 'Time spent has opportunity cost - what else could you accomplish?' }
      ],
      whenToUse: [
        'Capital allocation decisions',
        'Resource prioritization',
        'Personal and professional choices',
        'Investment decisions',
        'Strategic planning'
      ],
      examples: [
        { company: 'MBA Opportunity Cost', description: 'Cost includes not just tuition but 2 years of foregone salary - often $200-400K total opportunity cost.' },
        { company: 'Corporate Capital Allocation', description: 'Investing $1B in Project A means not investing in Project B. The opportunity cost is Project B\'s expected return.' },
        { company: 'Holding Cash', description: 'Keeping cash has opportunity cost - the returns you could earn if invested.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'opportunityCost',
      decision: 'Choice',
      options: [
        { name: 'Option A (Chosen)', value: 'Value received' },
        { name: 'Option B (Foregone)', value: 'Opportunity cost' }
      ],
      principle: 'True cost = Explicit cost + Opportunity cost'
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'An executive earns $300K/year and is considering getting an MBA ($150K tuition) that requires 2 years full-time. What is the opportunity cost?',
        options: ['$150K (tuition only)', '$450K (tuition + 1 year salary)', '$750K (tuition + 2 years salary)', '$600K (2 years salary only)'],
        correctIndex: 2,
        explanation: 'Opportunity cost = $150K tuition + $600K foregone salary (2 years × $300K) = $750K. This is the true cost of the MBA.'
      }
    ]),
    relatedIds: 'decision-making-frameworks,npv-irr,capital-structure'
  }
]


