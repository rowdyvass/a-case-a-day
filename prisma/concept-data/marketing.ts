// Marketing Concepts (10 total)

export const marketingConcepts = [
  {
    slug: 'marketing-mix-4ps',
    name: 'Marketing Mix (4Ps)',
    category: 'Marketing',
    description: 'Framework covering Product, Price, Place, and Promotion decisions',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'The Marketing Mix, commonly known as the 4Ps, is a foundational marketing framework developed by E. Jerome McCarthy. It describes the set of tactical marketing tools that a firm uses to produce the response it wants from its target market. The 4Ps are Product, Price, Place (distribution), and Promotion.',
      principles: [
        { title: 'Product', description: 'What you sell - features, quality, design, branding, packaging, services, warranties. Satisfies customer needs.' },
        { title: 'Price', description: 'What customers pay - list price, discounts, payment terms, credit. Reflects value and positioning.' },
        { title: 'Place', description: 'How product reaches customers - channels, coverage, locations, inventory, logistics. Accessibility matters.' },
        { title: 'Promotion', description: 'How you communicate - advertising, PR, sales promotion, direct marketing, digital. Creates awareness and desire.' }
      ],
      whenToUse: [
        'Developing marketing strategy',
        'Launching new products',
        'Analyzing competitor positioning',
        'Marketing plan development',
        'Troubleshooting marketing problems'
      ],
      examples: [
        { company: 'Apple iPhone', description: 'Product: Premium design, iOS ecosystem. Price: High/premium positioning. Place: Apple stores, carriers, authorized retailers. Promotion: Keynotes, minimal advertising, brand evangelism.' },
        { company: 'Dollar Shave Club', description: 'Product: Quality razors, simplified. Price: Low subscription model. Place: Direct-to-consumer online. Promotion: Viral video marketing, humor.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Product', color: '#3b82f6', questions: ['What does the customer want?', 'What features/benefits?', 'How differentiated?'] },
        { row: 0, col: 1, label: 'Price', color: '#22c55e', questions: ['What is the value to customer?', 'What are competitors charging?', 'What pricing strategy?'] },
        { row: 1, col: 0, label: 'Place', color: '#8b5cf6', questions: ['Where do customers look?', 'What channels work best?', 'How to reach them?'] },
        { row: 1, col: 1, label: 'Promotion', color: '#f97316', questions: ['How to communicate benefits?', 'When and where to promote?', 'What messages resonate?'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Categorize these marketing decisions into the correct P',
        items: [
          { text: 'Offering a 20% discount for first-time buyers', category: 'Price' },
          { text: 'Adding a new feature based on customer feedback', category: 'Product' },
          { text: 'Partnering with Amazon for distribution', category: 'Place' },
          { text: 'Running Instagram influencer campaigns', category: 'Promotion' },
          { text: 'Redesigning product packaging', category: 'Product' },
          { text: 'Opening flagship retail stores', category: 'Place' }
        ],
        categories: ['Product', 'Price', 'Place', 'Promotion']
      }
    ]),
    relatedIds: 'customer-segmentation,brand-positioning,pricing-strategies'
  },
  {
    slug: 'customer-segmentation',
    name: 'Customer Segmentation',
    category: 'Marketing',
    description: 'Dividing markets into distinct groups with common needs or characteristics',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Customer segmentation is the practice of dividing a customer base into groups of individuals that are similar in specific ways relevant to marketing. Segments can be based on demographics, behavior, geography, psychographics, or needs. Effective segmentation enables targeted, relevant marketing.',
      principles: [
        { title: 'Demographic Segmentation', description: 'Age, gender, income, education, occupation, family size. Easy to measure and access.' },
        { title: 'Geographic Segmentation', description: 'Location, climate, urban/rural, region. Important for local preferences and distribution.' },
        { title: 'Psychographic Segmentation', description: 'Lifestyle, values, personality, attitudes. Deeper understanding of motivations.' },
        { title: 'Behavioral Segmentation', description: 'Purchase behavior, usage rate, loyalty, benefits sought. Based on actual actions.' },
        { title: 'Effective Segments Are', description: 'Measurable, substantial, accessible, differentiable, and actionable.' }
      ],
      whenToUse: [
        'Developing targeted marketing campaigns',
        'Product development and positioning',
        'Resource allocation across markets',
        'Pricing strategy by segment',
        'Customer experience personalization'
      ],
      examples: [
        { company: 'Nike', description: 'Segments by sport (running, basketball, soccer), performance level (elite, casual), and lifestyle (athleisure). Different products and messaging for each.' },
        { company: 'Netflix', description: 'Behavioral segmentation based on viewing habits. Personalized recommendations and content development based on segment preferences.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'segmentationTypes',
      segments: [
        { type: 'Demographic', examples: ['Age 25-34', 'Income $75K+', 'College educated'], color: '#3b82f6' },
        { type: 'Geographic', examples: ['Urban', 'Northeast US', 'Warm climate'], color: '#22c55e' },
        { type: 'Psychographic', examples: ['Health-conscious', 'Early adopter', 'Status-seeking'], color: '#8b5cf6' },
        { type: 'Behavioral', examples: ['Heavy user', 'Brand loyal', 'Price sensitive'], color: '#f97316' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A luxury car brand wants to target "successful professionals who value status and achievement." What type of segmentation is this primarily?',
        options: ['Demographic', 'Geographic', 'Psychographic', 'Behavioral'],
        correctIndex: 2,
        explanation: 'This describes values, attitudes, and lifestyle - psychographic characteristics. Demographics might overlap but the core targeting is psychographic.'
      }
    ]),
    relatedIds: 'marketing-mix-4ps,brand-positioning,customer-lifetime-value,stp-marketing'
  },
  {
    slug: 'brand-positioning',
    name: 'Brand Positioning',
    category: 'Marketing',
    description: 'Creating a distinct image and identity in the minds of target customers',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Brand positioning is the process of positioning your brand in the mind of your customers. It is the act of designing the company\'s offering and image to occupy a distinctive place in the mind of the target market. A good position is clear, unique, and relevant to target customers.',
      principles: [
        { title: 'Target Audience', description: 'Who are you positioning for? Specific customer segment with clear needs.' },
        { title: 'Frame of Reference', description: 'What category do you compete in? Sets customer expectations.' },
        { title: 'Point of Difference', description: 'What unique benefits do you offer? Must be desirable, deliverable, differentiating.' },
        { title: 'Reasons to Believe', description: 'Evidence that supports your positioning claims.' },
        { title: 'Positioning Statement', description: 'For [target], [brand] is the [frame of reference] that [point of difference] because [reasons to believe].' }
      ],
      whenToUse: [
        'Brand strategy development',
        'New product launches',
        'Repositioning existing brands',
        'Competitive differentiation',
        'Marketing communications development'
      ],
      examples: [
        { company: 'Volvo', description: 'Positioned as the safest car brand. Every communication reinforces safety. Clear, consistent, and credible.' },
        { company: "M&M's", description: '"Melts in your mouth, not in your hands." Unique product benefit that differentiates from other chocolate.' },
        { company: 'BMW', description: '"The Ultimate Driving Machine." Performance and driving experience positioning vs. luxury comfort (Mercedes).' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'positioningMap',
      axes: { x: 'Price', y: 'Quality' },
      brands: [
        { name: 'Brand A', x: 80, y: 80, description: 'Premium' },
        { name: 'Brand B', x: 30, y: 70, description: 'Value leader' },
        { name: 'Brand C', x: 70, y: 40, description: 'Overpriced?' },
        { name: 'Opportunity', x: 50, y: 90, description: 'White space' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'A new electric vehicle startup is entering the market. Tesla owns "innovation/performance," Rivian owns "adventure/outdoors," and traditional brands are fighting for "practical/reliable."',
        question: 'Develop a positioning statement for the new brand targeting urban professionals who want sustainable luxury without the "tech bro" association.',
        framework: {
          target: 'Define the specific customer segment',
          frameOfReference: 'What category/competitive set?',
          pointOfDifference: 'What unique benefit/position?',
          reasonsToBelieve: 'Why should they believe you?'
        }
      }
    ]),
    relatedIds: 'customer-segmentation,marketing-mix-4ps,competitive-advantage,stp-marketing'
  },
  {
    slug: 'customer-lifetime-value',
    name: 'Customer Lifetime Value',
    category: 'Marketing',
    description: 'The total worth of a customer over the entire relationship',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Customer Lifetime Value (CLV or LTV) is a prediction of the net profit attributed to the entire future relationship with a customer. It helps businesses understand how much they can spend to acquire customers and which customer segments are most valuable.',
      principles: [
        { title: 'Basic Formula', description: 'CLV = (Average Purchase Value × Purchase Frequency × Customer Lifespan) - Acquisition Cost' },
        { title: 'Retention Impact', description: 'Small improvements in retention can dramatically increase CLV. 5% increase in retention can boost profits 25-95%.' },
        { title: 'Acquisition Economics', description: 'CLV should exceed Customer Acquisition Cost (CAC). Target CLV:CAC ratio of 3:1 or higher.' },
        { title: 'Segment Profitability', description: 'Not all customers are equally valuable. Focus resources on high-CLV segments.' },
        { title: 'Time Value of Money', description: 'Discount future profits to present value for accurate CLV calculation.' }
      ],
      whenToUse: [
        'Setting customer acquisition budgets',
        'Evaluating marketing channel effectiveness',
        'Customer segment prioritization',
        'Retention program investment decisions',
        'Business valuation'
      ],
      examples: [
        { company: 'Starbucks', description: 'Average customer worth $14,099 over lifetime. Justifies loyalty program investment and premium real estate.' },
        { company: 'SaaS Business', description: 'Monthly subscription $100, average customer stays 24 months, gross margin 80%. CLV = $100 × 24 × 0.8 = $1,920. Can spend up to $640 on acquisition for 3:1 ratio.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'clvFormula',
      components: [
        { name: 'Average Order Value', symbol: 'AOV' },
        { name: 'Purchase Frequency', symbol: 'F' },
        { name: 'Customer Lifespan', symbol: 'L' },
        { name: 'Profit Margin', symbol: 'M' }
      ],
      formula: 'CLV = AOV × F × L × M'
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A company has: Average Order Value $50, Purchase Frequency 4x/year, Average Customer Lifespan 3 years. What is the Customer Lifetime Value?',
        options: ['$150', '$200', '$600', '$1,200'],
        correctIndex: 2,
        explanation: 'CLV = AOV × Frequency × Lifespan = $50 × 4 × 3 = $600. This is the revenue; profit-based CLV would subtract costs.'
      }
    ]),
    relatedIds: 'customer-segmentation,net-promoter-score,marketing-mix-4ps'
  },
  {
    slug: 'stp-marketing',
    name: 'STP Marketing',
    category: 'Marketing',
    description: 'Segmentation, Targeting, and Positioning strategic framework',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'STP Marketing is a three-step strategic approach: Segmentation (dividing the market), Targeting (selecting segments to serve), and Positioning (creating a distinct offering for chosen segments). It is the foundation of modern marketing strategy.',
      principles: [
        { title: 'Segmentation', description: 'Divide the total market into distinct groups based on needs, characteristics, or behaviors.' },
        { title: 'Targeting', description: 'Evaluate segment attractiveness and select which segments to serve based on fit and opportunity.' },
        { title: 'Positioning', description: 'Develop a distinct value proposition and marketing mix for each target segment.' },
        { title: 'Targeting Strategies', description: 'Undifferentiated (mass), Differentiated (multiple segments), Concentrated (niche), Micromarketing (individual).' }
      ],
      whenToUse: [
        'Developing marketing strategy',
        'Entering new markets',
        'Launching new products',
        'Reallocating marketing resources',
        'Competitive repositioning'
      ],
      examples: [
        { company: 'Marriott Hotels', description: 'Segments: business travelers, families, luxury seekers, budget-conscious. Targets multiple segments with different brands: Ritz-Carlton, Marriott, Courtyard, Fairfield.' },
        { company: 'Coca-Cola', description: 'Segments market by usage occasion, age, lifestyle. Positions Diet Coke differently than Coca-Cola Classic or Coke Zero.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'stpProcess',
      steps: [
        { name: 'Segmentation', color: '#3b82f6', actions: ['Identify bases', 'Profile segments'] },
        { name: 'Targeting', color: '#8b5cf6', actions: ['Evaluate segments', 'Select targets'] },
        { name: 'Positioning', color: '#22c55e', actions: ['Develop positioning', 'Create marketing mix'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Place these activities in the correct STP stage',
        items: [
          { text: 'Dividing customers by age and income', category: 'Segmentation' },
          { text: 'Deciding to focus on millennials', category: 'Targeting' },
          { text: 'Creating a value proposition for young professionals', category: 'Positioning' },
          { text: 'Analyzing segment profitability and size', category: 'Targeting' },
          { text: 'Grouping customers by purchase behavior', category: 'Segmentation' },
          { text: 'Crafting unique brand messaging', category: 'Positioning' }
        ],
        categories: ['Segmentation', 'Targeting', 'Positioning']
      }
    ]),
    relatedIds: 'customer-segmentation,brand-positioning,marketing-mix-4ps'
  },
  {
    slug: 'jobs-to-be-done',
    name: 'Jobs to Be Done',
    category: 'Marketing',
    description: 'Framework focusing on the underlying jobs customers hire products to accomplish',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Jobs to Be Done (JTBD) is a theory developed by Clayton Christensen that suggests customers don't buy products—they \"hire\" them to accomplish specific jobs in their lives. Understanding the job, not just the customer, leads to better innovation and positioning.",
      principles: [
        { title: 'Focus on the Job', description: 'Customers have jobs they need to accomplish. Products are hired to do these jobs.' },
        { title: 'Functional, Social, Emotional', description: 'Jobs have functional aspects (practical tasks), social aspects (how others perceive), and emotional aspects (how it makes them feel).' },
        { title: 'Circumstances Matter', description: 'The same person may hire different products for the same job in different circumstances.' },
        { title: 'Competition Redefined', description: 'Competitors are any products hired for the same job, not just similar products.' },
        { title: 'Progress Over Products', description: 'Customers seek progress toward a goal, not products themselves.' }
      ],
      whenToUse: [
        'New product development',
        'Understanding true competition',
        'Innovation strategy',
        'Customer research design',
        'Marketing message development'
      ],
      examples: [
        { company: 'Milkshake Study', description: "Christensen's famous study found morning commuters \"hired\" milkshakes for entertainment during boring commutes, not hunger. Led to thicker, longer-lasting milkshakes." },
        { company: 'Snickers', description: '"You\'re not you when you\'re hungry" captures the job of quick energy and mood improvement, not just candy consumption.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'jtbdFramework',
      layers: [
        { name: 'Functional Job', description: 'What task needs to be done?', color: '#3b82f6' },
        { name: 'Emotional Job', description: 'How do they want to feel?', color: '#8b5cf6' },
        { name: 'Social Job', description: 'How do they want to be perceived?', color: '#22c55e' }
      ],
      center: 'The Job'
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'A drill bit company wants to understand its customers better. Traditional thinking: "Customers want drill bits." JTBD thinking goes deeper.',
        question: 'What are the different "jobs" that customers might be hiring a drill bit to do? Consider functional, emotional, and social dimensions.',
        hints: ['Think about the end goal, not the tool', 'Consider different contexts (professional vs DIY)', 'What progress are they trying to make?']
      }
    ]),
    relatedIds: 'customer-segmentation,brand-positioning,blue-ocean-strategy'
  },
  {
    slug: 'net-promoter-score',
    name: 'Net Promoter Score',
    category: 'Marketing',
    description: 'Metric measuring customer loyalty based on likelihood to recommend',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'Net Promoter Score (NPS) is a customer loyalty metric developed by Fred Reichheld. It measures the likelihood of customers to recommend a company to others on a 0-10 scale, categorizing respondents as Promoters (9-10), Passives (7-8), or Detractors (0-6). NPS = % Promoters - % Detractors.',
      principles: [
        { title: 'Promoters (9-10)', description: 'Loyal enthusiasts who will keep buying and refer others, fueling growth.' },
        { title: 'Passives (7-8)', description: 'Satisfied but unenthusiastic customers vulnerable to competitive offerings.' },
        { title: 'Detractors (0-6)', description: 'Unhappy customers who can damage brand through negative word-of-mouth.' },
        { title: 'The Ultimate Question', description: '"How likely are you to recommend [Company] to a friend or colleague?"' },
        { title: 'Score Interpretation', description: 'NPS ranges from -100 to +100. Above 0 is good, above 50 is excellent, above 70 is world-class.' }
      ],
      whenToUse: [
        'Tracking customer loyalty over time',
        'Benchmarking against competitors',
        'Identifying improvement areas',
        'Predicting growth potential',
        'Customer experience programs'
      ],
      examples: [
        { company: 'Apple', description: 'NPS of 72 - among highest in tech. Correlates with brand loyalty and premium pricing power.' },
        { company: 'Airlines', description: 'Industry average NPS around 35. Southwest at 62 vs. legacy carriers at 20-30, reflecting customer experience differences.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'npsScale',
      scale: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      categories: [
        { name: 'Detractors', range: [0, 6], color: '#ef4444' },
        { name: 'Passives', range: [7, 8], color: '#fbbf24' },
        { name: 'Promoters', range: [9, 10], color: '#22c55e' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A company surveys 100 customers: 40 are Promoters, 30 are Passives, 30 are Detractors. What is the NPS?',
        options: ['+10', '+40', '-10', '+70'],
        correctIndex: 0,
        explanation: 'NPS = % Promoters - % Detractors = 40% - 30% = +10. Passives are not included in the calculation.'
      }
    ]),
    relatedIds: 'customer-lifetime-value,customer-segmentation,brand-positioning'
  },
  {
    slug: 'pricing-strategies',
    name: 'Pricing Strategies',
    category: 'Marketing',
    description: 'Methods for setting prices based on costs, competition, and customer value',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Pricing strategy refers to the method companies use to price their products or services. The right pricing strategy maximizes profits and shareholder value while considering market conditions, competition, and customer willingness to pay.',
      principles: [
        { title: 'Cost-Plus Pricing', description: 'Add standard markup to product cost. Simple but ignores market conditions and customer value.' },
        { title: 'Value-Based Pricing', description: 'Price based on perceived customer value, not cost. Captures more value when differentiated.' },
        { title: 'Competitive Pricing', description: 'Set prices based on competitor prices. Common in commoditized markets.' },
        { title: 'Price Skimming', description: 'Start high, lower over time. Captures different willingness-to-pay segments sequentially.' },
        { title: 'Penetration Pricing', description: 'Start low to gain market share, raise prices later. Works with economies of scale.' },
        { title: 'Freemium', description: 'Free basic version, paid premium features. Common in software and digital services.' }
      ],
      whenToUse: [
        'New product pricing decisions',
        'Competitive response',
        'Margin improvement initiatives',
        'Market entry strategy',
        'Product line pricing'
      ],
      examples: [
        { company: 'Apple', description: 'Premium pricing and skimming. New iPhones at high prices, older models discounted. Captures maximum value across segments.' },
        { company: 'Spotify', description: 'Freemium model. Free ad-supported tier converts users to $10/month premium with better experience.' },
        { company: 'Costco', description: 'Cost-plus with minimal markup. Makes profit on membership fees, not product margins.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Penetration', color: '#3b82f6', description: 'Low price, gain share' },
        { row: 0, col: 1, label: 'Skimming', color: '#8b5cf6', description: 'High price, premium segment' },
        { row: 1, col: 0, label: 'Economy', color: '#6b7280', description: 'Low price, low quality' },
        { row: 1, col: 1, label: 'Premium', color: '#22c55e', description: 'High price, high quality' }
      ],
      axes: { x: { label: 'Price', positive: 'High', negative: 'Low' }, y: { label: 'Quality/Features', positive: 'High', negative: 'Low' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A new software startup with strong network effects should likely use which pricing strategy initially?',
        options: ['Price skimming', 'Cost-plus pricing', 'Penetration or freemium pricing', 'Premium pricing'],
        correctIndex: 2,
        explanation: 'Network effects make user base valuable. Low initial pricing or freemium accelerates adoption, making the platform more valuable as it scales.'
      }
    ]),
    relatedIds: 'marketing-mix-4ps,customer-lifetime-value,competitive-advantage'
  },
  {
    slug: 'digital-marketing-funnel',
    name: 'Digital Marketing Funnel',
    category: 'Marketing',
    description: 'Customer journey framework from awareness to purchase and loyalty',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'The digital marketing funnel is a model that represents the customer journey from first awareness of a brand to becoming a loyal customer. It helps marketers understand and optimize each stage of the buying process with appropriate tactics and metrics.',
      principles: [
        { title: 'Awareness (Top of Funnel)', description: 'Prospects learn you exist. Tactics: Content marketing, SEO, social media, display ads.' },
        { title: 'Interest/Consideration (Middle)', description: 'Prospects evaluate options. Tactics: Email nurturing, retargeting, case studies, webinars.' },
        { title: 'Decision/Conversion (Bottom)', description: 'Prospects become customers. Tactics: Demos, trials, discounts, testimonials.' },
        { title: 'Loyalty/Advocacy (Post-Purchase)', description: 'Customers become promoters. Tactics: Loyalty programs, referrals, community.' },
        { title: 'Funnel Metrics', description: 'Track conversion rates between stages to identify bottlenecks and optimize.' }
      ],
      whenToUse: [
        'Planning digital marketing strategy',
        'Diagnosing marketing performance issues',
        'Allocating budget across channels',
        'Designing marketing automation',
        'Creating customer journey maps'
      ],
      examples: [
        { company: 'B2B SaaS', description: 'Awareness: Blog content → Consideration: Whitepaper download → Decision: Free trial → Purchase: Sales demo → Loyalty: Customer success.' },
        { company: 'E-commerce', description: 'Awareness: Instagram ads → Consideration: Product reviews → Decision: Abandoned cart email → Purchase: Checkout → Loyalty: Post-purchase follow-up.' }
      ]
    }),
    diagramType: 'funnel',
    diagramData: JSON.stringify({
      stages: [
        { name: 'Awareness', width: 100, color: '#3b82f6', metrics: ['Impressions', 'Reach', 'Traffic'] },
        { name: 'Interest', width: 70, color: '#8b5cf6', metrics: ['Time on site', 'Pages/session', 'Email signups'] },
        { name: 'Consideration', width: 45, color: '#ec4899', metrics: ['Demo requests', 'Cart adds', 'Comparisons'] },
        { name: 'Conversion', width: 25, color: '#22c55e', metrics: ['Purchases', 'Conversion rate', 'CAC'] },
        { name: 'Loyalty', width: 15, color: '#f97316', metrics: ['Repeat rate', 'NPS', 'Referrals'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A company has high website traffic but very low email signups. Which funnel stage needs optimization?',
        options: ['Awareness', 'Interest/Consideration', 'Decision/Conversion', 'Loyalty'],
        correctIndex: 1,
        explanation: 'High traffic (awareness is working) but low signups indicates the Interest/Consideration stage needs work - visitors aren\'t engaging deeply enough.'
      }
    ]),
    relatedIds: 'customer-lifetime-value,customer-segmentation,net-promoter-score'
  },
  {
    slug: 'brand-equity',
    name: 'Brand Equity',
    category: 'Marketing',
    description: 'The commercial value derived from consumer perception of a brand',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Brand equity is the commercial value that derives from consumer perception of the brand name, rather than from the product or service itself. Strong brand equity allows companies to charge premium prices, launch extensions more easily, and withstand competitive pressures.",
      principles: [
        { title: 'Brand Awareness', description: 'Consumer ability to recognize and recall the brand. Foundation of brand equity.' },
        { title: 'Brand Associations', description: 'The thoughts, feelings, and perceptions linked to the brand in consumer minds.' },
        { title: 'Perceived Quality', description: 'Consumer perception of overall quality or superiority compared to alternatives.' },
        { title: 'Brand Loyalty', description: 'Consumer commitment to repurchase despite competitive alternatives.' },
        { title: 'Proprietary Assets', description: 'Patents, trademarks, channel relationships that protect the brand.' }
      ],
      whenToUse: [
        'Brand strategy development',
        'Brand portfolio management',
        'M&A brand valuation',
        'Marketing investment justification',
        'Brand health tracking'
      ],
      examples: [
        { company: 'Coca-Cola', description: "Brand valued at $90B+ - consumers pay premium over generic cola. The brand itself is the company's most valuable asset." },
        { company: 'Private Label Challenge', description: 'When store brands (Kirkland, Amazon Basics) succeed against national brands, they erode brand equity that justified premium pricing.' }
      ]
    }),
    diagramType: 'pyramid',
    diagramData: JSON.stringify({
      levels: [
        { label: 'Brand Awareness', description: 'Can recognize/recall', color: '#3b82f6' },
        { label: 'Brand Associations', description: 'Perceptions and feelings', color: '#8b5cf6' },
        { label: 'Perceived Quality', description: 'Superiority vs alternatives', color: '#ec4899' },
        { label: 'Brand Loyalty', description: 'Commitment to brand', color: '#22c55e' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A company can charge 30% more than competitors for an objectively similar product. This is primarily due to:',
        options: ['Superior supply chain', 'Brand equity', 'Lower costs', 'Government protection'],
        correctIndex: 1,
        explanation: "Price premium for similar products indicates strong brand equity - consumers value the brand itself beyond the product's functional attributes."
      }
    ]),
    relatedIds: 'brand-positioning,customer-lifetime-value,competitive-advantage'
  }
]


