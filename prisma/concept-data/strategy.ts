// Strategy Concepts (12 total)

export const strategyConcepts = [
  {
    slug: 'porters-five-forces',
    name: "Porter's Five Forces",
    category: 'Strategy',
    description: 'Framework for analyzing competitive forces that shape industry profitability',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Porter's Five Forces is a framework developed by Harvard Business School professor Michael Porter that identifies and analyzes five competitive forces shaping every industry. It helps determine an industry's weaknesses and strengths, and is used to guide corporate strategy.",
      principles: [
        { title: 'Threat of New Entrants', description: 'How easy or difficult it is for new competitors to enter the market. High barriers protect existing players.' },
        { title: 'Bargaining Power of Suppliers', description: 'The power suppliers have to drive up input costs. Fewer suppliers mean more power.' },
        { title: 'Bargaining Power of Buyers', description: 'The power customers have to drive prices down. Concentrated buyers have more leverage.' },
        { title: 'Threat of Substitutes', description: 'The likelihood of customers finding alternative products or services.' },
        { title: 'Industry Rivalry', description: 'The intensity of competition among existing competitors in the industry.' }
      ],
      whenToUse: [
        'Evaluating whether to enter a new industry',
        'Assessing current competitive position',
        'Identifying strategic opportunities and threats',
        'Understanding profit potential of an industry',
        'Developing competitive strategy'
      ],
      examples: [
        { company: 'Airlines Industry', description: 'High rivalry, low barriers to substitutes (trains, cars), powerful suppliers (Boeing, Airbus), moderate buyer power. Result: notoriously low profitability.' },
        { company: 'Pharmaceutical Industry', description: 'High barriers to entry (patents, R&D), weak buyer power (patients need medication), few substitutes. Result: historically high margins.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      centerNode: { label: 'Industry Rivalry', color: '#8b5cf6' },
      surroundingNodes: [
        { label: 'New Entrants', position: 'top', color: '#3b82f6', arrow: 'to-center' },
        { label: 'Suppliers', position: 'left', color: '#f97316', arrow: 'to-center' },
        { label: 'Buyers', position: 'right', color: '#14b8a6', arrow: 'to-center' },
        { label: 'Substitutes', position: 'bottom', color: '#ec4899', arrow: 'to-center' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which force would be MOST affected if a key patent expires in the pharmaceutical industry?',
        options: ['Threat of New Entrants', 'Bargaining Power of Suppliers', 'Bargaining Power of Buyers', 'Industry Rivalry'],
        correctIndex: 0,
        explanation: 'Patent expiration lowers barriers to entry, allowing generic manufacturers to compete.'
      },
      {
        type: 'scenario',
        scenario: 'You are analyzing the streaming video industry. Netflix faces competition from Disney+, HBO Max, and Amazon Prime.',
        question: 'Which of the five forces poses the greatest threat to Netflix profitability?',
        considerations: ['Industry Rivalry is intense with well-funded competitors', 'Low switching costs increase buyer power', 'Content creators gaining leverage as suppliers']
      }
    ]),
    relatedIds: 'swot-analysis,competitive-advantage,value-chain-analysis'
  },
  {
    slug: 'swot-analysis',
    name: 'SWOT Analysis',
    category: 'Strategy',
    description: 'Strategic planning tool examining Strengths, Weaknesses, Opportunities, and Threats',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'SWOT Analysis is a strategic planning framework used to evaluate the Strengths, Weaknesses, Opportunities, and Threats involved in a project or business venture. It involves specifying the objective and identifying internal and external factors favorable and unfavorable to achieving that objective.',
      principles: [
        { title: 'Strengths (Internal)', description: 'Characteristics of the business that give it an advantage over others. What does the organization do well?' },
        { title: 'Weaknesses (Internal)', description: 'Characteristics that place the business at a disadvantage. What could be improved?' },
        { title: 'Opportunities (External)', description: 'Elements in the environment that the business could exploit to its advantage.' },
        { title: 'Threats (External)', description: 'Elements in the environment that could cause trouble for the business.' }
      ],
      whenToUse: [
        'Starting strategic planning processes',
        'Evaluating new initiatives or projects',
        'Assessing organizational position before major decisions',
        'Identifying areas for improvement',
        'Competitive analysis and positioning'
      ],
      examples: [
        { company: 'Tesla', description: 'Strengths: Brand recognition, technology leadership. Weaknesses: Production scalability, service network. Opportunities: EV market growth, energy storage. Threats: Traditional automaker competition, supply chain risks.' },
        { company: 'Starbucks', description: 'Strengths: Global brand, loyal customers, real estate locations. Weaknesses: Premium pricing, US market saturation. Opportunities: International expansion, digital innovation. Threats: Local coffee shops, economic downturns.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Strengths', subtitle: 'Internal', color: '#22c55e', icon: 'plus' },
        { row: 0, col: 1, label: 'Weaknesses', subtitle: 'Internal', color: '#ef4444', icon: 'minus' },
        { row: 1, col: 0, label: 'Opportunities', subtitle: 'External', color: '#3b82f6', icon: 'trending-up' },
        { row: 1, col: 1, label: 'Threats', subtitle: 'External', color: '#f97316', icon: 'alert' }
      ],
      axes: { x: { positive: 'Helpful', negative: 'Harmful' }, y: { positive: 'Internal', negative: 'External' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Categorize these factors for a traditional bookstore',
        items: [
          { text: 'Knowledgeable staff', category: 'Strengths' },
          { text: 'Limited inventory space', category: 'Weaknesses' },
          { text: 'Growing audiobook market', category: 'Opportunities' },
          { text: 'Amazon competition', category: 'Threats' },
          { text: 'Community events space', category: 'Strengths' },
          { text: 'Higher prices than online', category: 'Weaknesses' }
        ],
        categories: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats']
      }
    ]),
    relatedIds: 'porters-five-forces,pestle-analysis,competitive-advantage'
  },
  {
    slug: 'bcg-matrix',
    name: 'BCG Matrix',
    category: 'Strategy',
    description: 'Portfolio planning model based on market growth rate and relative market share',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'The BCG Matrix (Boston Consulting Group Matrix) is a portfolio management tool that helps companies decide which business units or products to invest in based on market growth rate and relative market share. It classifies products into four categories: Stars, Cash Cows, Question Marks, and Dogs.',
      principles: [
        { title: 'Stars', description: 'High market share in high-growth markets. Require heavy investment but generate substantial revenue. Goal: Maintain leadership.' },
        { title: 'Cash Cows', description: 'High market share in low-growth markets. Generate more cash than needed to maintain share. Goal: Harvest profits.' },
        { title: 'Question Marks', description: 'Low market share in high-growth markets. Require investment to grow share. Goal: Decide to invest heavily or divest.' },
        { title: 'Dogs', description: 'Low market share in low-growth markets. May generate enough cash to sustain themselves. Goal: Consider divestiture.' }
      ],
      whenToUse: [
        'Allocating resources across business portfolio',
        'Making investment/divestment decisions',
        'Strategic planning for multi-product companies',
        'Identifying which products need more support',
        'Balancing short-term and long-term profits'
      ],
      examples: [
        { company: 'Apple Portfolio', description: 'iPhone (Cash Cow) - dominant share, mature market. Apple Watch (Star) - leading share, growing market. Apple TV+ (Question Mark) - small share, growing streaming market.' },
        { company: 'Coca-Cola', description: 'Classic Coke (Cash Cow), Energy drinks (Question Marks), Some regional beverages (Dogs)' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Question Marks', subtitle: '?', color: '#f97316', description: 'Invest or Divest' },
        { row: 0, col: 1, label: 'Stars', subtitle: '★', color: '#8b5cf6', description: 'Invest to Grow' },
        { row: 1, col: 0, label: 'Dogs', subtitle: '🐕', color: '#6b7280', description: 'Divest' },
        { row: 1, col: 1, label: 'Cash Cows', subtitle: '🐄', color: '#22c55e', description: 'Milk' }
      ],
      axes: { x: { label: 'Relative Market Share', positive: 'High', negative: 'Low' }, y: { label: 'Market Growth Rate', positive: 'High', negative: 'Low' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'matrixBuilder',
        instruction: 'Place these products in the correct BCG quadrant',
        items: [
          { name: 'Legacy mainframe computers', hint: 'Declining market, limited share' },
          { name: 'Cloud computing services', hint: 'Fast-growing market, gaining share' },
          { name: 'Enterprise software suite', hint: 'Mature market, dominant position' },
          { name: 'New AI product line', hint: 'Explosive growth, small share so far' }
        ]
      }
    ]),
    relatedIds: 'ge-mckinsey-matrix,ansoff-matrix,value-chain-analysis'
  },
  {
    slug: 'blue-ocean-strategy',
    name: 'Blue Ocean Strategy',
    category: 'Strategy',
    description: 'Creating uncontested market space rather than competing in existing markets',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Blue Ocean Strategy, developed by W. Chan Kim and Renée Mauborgne, is a business theory that suggests companies are better off searching for ways to gain "uncontested market space" (blue oceans) than competing with similar businesses in an existing industry (red oceans).',
      principles: [
        { title: 'Value Innovation', description: 'Simultaneously pursue differentiation AND low cost. Break the value-cost trade-off.' },
        { title: 'Four Actions Framework', description: 'Eliminate, Reduce, Raise, Create - restructure industry boundaries.' },
        { title: 'Focus on Non-Customers', description: 'Look at why people are NOT buying, not just current customers.' },
        { title: 'Strategy Canvas', description: 'Visual tool comparing your offering against competitors across key factors.' },
        { title: 'Six Paths Framework', description: 'Look across alternative industries, strategic groups, buyer groups, complementary offerings, functional-emotional appeal, and time.' }
      ],
      whenToUse: [
        'Industry is highly competitive with shrinking margins',
        'Looking for breakthrough growth opportunities',
        'Current differentiation strategies are not working',
        'Seeking to redefine industry boundaries',
        'Planning major strategic transformation'
      ],
      examples: [
        { company: 'Cirque du Soleil', description: 'Combined circus arts with theater, eliminating animals and star performers while raising artistic production value. Created new market space between circus and theater.' },
        { company: 'Nintendo Wii', description: 'Instead of competing on graphics with PlayStation and Xbox, created motion-controlled gaming for casual/family players who were non-customers of traditional gaming.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'strategyCanvas',
      factors: ['Price', 'Technology', 'Variety', 'Convenience', 'Experience', 'Accessibility'],
      competitors: [
        { name: 'Traditional Industry', values: [3, 4, 4, 2, 2, 2], color: '#ef4444' },
        { name: 'Blue Ocean Player', values: [4, 3, 2, 5, 5, 5], color: '#3b82f6' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'A traditional gym chain is struggling with declining membership and intense competition from budget gyms and boutique fitness studios.',
        question: 'Using the Four Actions Framework, what could they Eliminate, Reduce, Raise, and Create to find blue ocean space?',
        framework: {
          eliminate: 'What factors the industry takes for granted should be eliminated?',
          reduce: 'What factors should be reduced well below industry standard?',
          raise: 'What factors should be raised well above industry standard?',
          create: 'What factors should be created that the industry has never offered?'
        }
      }
    ]),
    relatedIds: 'competitive-advantage,value-chain-analysis,ansoff-matrix'
  },
  {
    slug: 'value-chain-analysis',
    name: 'Value Chain Analysis',
    category: 'Strategy',
    description: 'Identifying activities that create value and competitive advantage',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Value Chain Analysis is a strategic tool used to analyze internal firm activities to understand which activities create value and which do not. Developed by Michael Porter, it breaks down a company's activities into strategically relevant categories to understand the behavior of costs and potential sources of differentiation.",
      principles: [
        { title: 'Primary Activities', description: 'Directly involved in creating/delivering product: Inbound Logistics, Operations, Outbound Logistics, Marketing & Sales, Service.' },
        { title: 'Support Activities', description: 'Help primary activities: Firm Infrastructure, HR Management, Technology Development, Procurement.' },
        { title: 'Margin', description: 'The difference between total value and the collective cost of performing value activities.' },
        { title: 'Linkages', description: 'Relationships between activities that can optimize or coordinate to create value.' }
      ],
      whenToUse: [
        'Identifying sources of competitive advantage',
        'Understanding cost structure',
        'Finding opportunities for differentiation',
        'Deciding which activities to outsource',
        'Strategic cost management'
      ],
      examples: [
        { company: 'Amazon', description: 'Competitive advantage through superior Inbound/Outbound Logistics (fulfillment centers, delivery network), Technology Development (recommendation algorithms, AWS), and Operations efficiency.' },
        { company: 'IKEA', description: 'Value creation through unique Operations (flat-pack design), Outbound Logistics (customer self-transport), and reduced Service (customer assembly).' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'valueChain',
      primaryActivities: [
        { name: 'Inbound Logistics', color: '#3b82f6' },
        { name: 'Operations', color: '#8b5cf6' },
        { name: 'Outbound Logistics', color: '#ec4899' },
        { name: 'Marketing & Sales', color: '#f97316' },
        { name: 'Service', color: '#14b8a6' }
      ],
      supportActivities: [
        { name: 'Firm Infrastructure' },
        { name: 'Human Resource Management' },
        { name: 'Technology Development' },
        { name: 'Procurement' }
      ],
      margin: 'Margin'
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Categorize these activities as Primary or Support',
        items: [
          { text: 'Quality control on production line', category: 'Primary - Operations' },
          { text: 'Employee training programs', category: 'Support - HR' },
          { text: 'Delivery to retail stores', category: 'Primary - Outbound Logistics' },
          { text: 'R&D for new products', category: 'Support - Technology' },
          { text: 'Customer support hotline', category: 'Primary - Service' },
          { text: 'Negotiating with suppliers', category: 'Support - Procurement' }
        ],
        categories: ['Primary - Inbound Logistics', 'Primary - Operations', 'Primary - Outbound Logistics', 'Primary - Marketing & Sales', 'Primary - Service', 'Support - Infrastructure', 'Support - HR', 'Support - Technology', 'Support - Procurement']
      }
    ]),
    relatedIds: 'porters-five-forces,competitive-advantage,core-competencies'
  },
  {
    slug: 'competitive-advantage',
    name: 'Competitive Advantage',
    category: 'Strategy',
    description: 'Attributes that allow an organization to outperform competitors',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Competitive advantage refers to factors that allow a company to produce goods or services better or more cheaply than rivals. These factors enable the productive entity to generate more sales or superior margins compared to market rivals, creating value for the firm and its shareholders.',
      principles: [
        { title: 'Cost Leadership', description: 'Being the lowest cost producer in the industry while maintaining acceptable quality levels.' },
        { title: 'Differentiation', description: 'Offering unique products/services that customers value and are willing to pay premium for.' },
        { title: 'Focus/Niche', description: 'Concentrating on a narrow market segment with either cost or differentiation advantage.' },
        { title: 'Sustainability', description: 'Advantages must be difficult to imitate, substitute, or erode over time.' }
      ],
      whenToUse: [
        'Developing corporate or business unit strategy',
        'Evaluating strategic options',
        'Understanding why some competitors succeed',
        'Building long-term strategic plans',
        'Assessing sustainability of market position'
      ],
      examples: [
        { company: 'Walmart', description: 'Cost leadership through massive scale, efficient supply chain, and bargaining power with suppliers.' },
        { company: 'Apple', description: 'Differentiation through design excellence, ecosystem integration, and brand prestige.' },
        { company: 'Rolex', description: 'Focused differentiation in luxury watches with heritage, craftsmanship, and status signaling.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Cost Leadership', color: '#3b82f6', examples: ['Walmart', 'Southwest Airlines'] },
        { row: 0, col: 1, label: 'Differentiation', color: '#8b5cf6', examples: ['Apple', 'BMW'] },
        { row: 1, col: 0, label: 'Cost Focus', color: '#14b8a6', examples: ['IKEA', 'Aldi'] },
        { row: 1, col: 1, label: 'Differentiation Focus', color: '#ec4899', examples: ['Rolex', 'Ferrari'] }
      ],
      axes: { x: { label: 'Competitive Advantage', positive: 'Differentiation', negative: 'Low Cost' }, y: { label: 'Scope', positive: 'Broad', negative: 'Narrow' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which type of competitive advantage does Southwest Airlines primarily pursue?',
        options: ['Differentiation', 'Cost Leadership', 'Differentiation Focus', 'Best Cost Provider'],
        correctIndex: 1,
        explanation: 'Southwest competes primarily on low cost through operational efficiency, point-to-point routes, and standardized fleet.'
      }
    ]),
    relatedIds: 'porters-five-forces,value-chain-analysis,blue-ocean-strategy'
  },
  {
    slug: 'ansoff-matrix',
    name: 'Ansoff Matrix',
    category: 'Strategy',
    description: 'Framework for analyzing growth strategies based on market and product dimensions',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'The Ansoff Matrix, also known as the Product/Market Expansion Grid, is a strategic planning tool that provides a framework to help executives, senior managers, and marketers devise strategies for future growth. It was created by Igor Ansoff and first published in 1957.',
      principles: [
        { title: 'Market Penetration', description: 'Grow with existing products in existing markets. Lowest risk. Increase market share through pricing, promotion, or distribution.' },
        { title: 'Market Development', description: 'Enter new markets with existing products. New geographies, segments, or channels. Moderate risk.' },
        { title: 'Product Development', description: 'Develop new products for existing markets. Leverage customer relationships and market knowledge. Moderate-high risk.' },
        { title: 'Diversification', description: 'New products in new markets. Highest risk but potentially highest reward. Can be related or unrelated diversification.' }
      ],
      whenToUse: [
        'Planning growth strategy',
        'Evaluating expansion opportunities',
        'Assessing risk of strategic options',
        'Portfolio planning and resource allocation',
        'Strategic planning workshops'
      ],
      examples: [
        { company: 'Coca-Cola', description: 'Market Penetration: More distribution points. Market Development: Entering emerging markets. Product Development: Zero Sugar variants. Diversification: Costa Coffee acquisition.' },
        { company: 'Amazon', description: 'Started with books (penetration), added product categories (development), created Kindle/Echo (product development), entered cloud computing with AWS (diversification).' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 2,
      cols: 2,
      cells: [
        { row: 0, col: 0, label: 'Market Penetration', color: '#22c55e', risk: 'Low', description: 'Existing Products + Existing Markets' },
        { row: 0, col: 1, label: 'Product Development', color: '#f97316', risk: 'Medium-High', description: 'New Products + Existing Markets' },
        { row: 1, col: 0, label: 'Market Development', color: '#3b82f6', risk: 'Medium', description: 'Existing Products + New Markets' },
        { row: 1, col: 1, label: 'Diversification', color: '#ef4444', risk: 'High', description: 'New Products + New Markets' }
      ],
      axes: { x: { label: 'Products', positive: 'New', negative: 'Existing' }, y: { label: 'Markets', positive: 'Existing', negative: 'New' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Classify these strategic moves using the Ansoff Matrix',
        items: [
          { text: 'Netflix expanding to India', category: 'Market Development' },
          { text: 'Apple launching Apple Watch', category: 'Product Development' },
          { text: 'Starbucks opening more stores in existing cities', category: 'Market Penetration' },
          { text: 'Google acquiring YouTube', category: 'Diversification' }
        ],
        categories: ['Market Penetration', 'Market Development', 'Product Development', 'Diversification']
      }
    ]),
    relatedIds: 'bcg-matrix,blue-ocean-strategy,competitive-advantage'
  },
  {
    slug: 'ge-mckinsey-matrix',
    name: 'GE-McKinsey Matrix',
    category: 'Strategy',
    description: 'Nine-cell portfolio planning tool based on industry attractiveness and competitive strength',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'The GE-McKinsey Matrix is a portfolio analysis tool used in corporate strategy to evaluate business units or product lines based on two dimensions: Industry Attractiveness and Competitive Strength/Business Unit Strength. It was developed by McKinsey & Company for General Electric.',
      principles: [
        { title: 'Industry Attractiveness', description: 'Composite measure including market size, growth rate, profitability, competition intensity, technology requirements, and environmental factors.' },
        { title: 'Competitive Strength', description: 'Composite measure including market share, brand strength, production capacity, profit margins, technological capability, and management quality.' },
        { title: 'Nine-Cell Framework', description: 'Creates three strategic zones: Invest/Grow (green), Selectivity/Earnings (yellow), Harvest/Divest (red).' },
        { title: 'Weighted Scoring', description: 'Each factor is weighted by importance and scored, providing more nuanced analysis than BCG Matrix.' }
      ],
      whenToUse: [
        'Multi-business corporate portfolio decisions',
        'Resource allocation across business units',
        'More nuanced analysis than BCG Matrix',
        'When industry attractiveness varies significantly',
        'Strategic planning for conglomerates'
      ],
      examples: [
        { company: 'General Electric', description: 'Used to decide which business units to invest in (aviation, healthcare), maintain selectively (power), or divest (appliances, lighting).' },
        { company: 'Unilever', description: 'Evaluating product categories across food, home care, and personal care based on market attractiveness and competitive position.' }
      ]
    }),
    diagramType: 'matrix',
    diagramData: JSON.stringify({
      rows: 3,
      cols: 3,
      cells: [
        { row: 0, col: 0, label: 'Selectivity', color: '#fbbf24', strategy: 'Invest selectively' },
        { row: 0, col: 1, label: 'Invest/Grow', color: '#22c55e', strategy: 'Invest for growth' },
        { row: 0, col: 2, label: 'Invest/Grow', color: '#22c55e', strategy: 'Protect position' },
        { row: 1, col: 0, label: 'Harvest', color: '#f97316', strategy: 'Limited expansion' },
        { row: 1, col: 1, label: 'Selectivity', color: '#fbbf24', strategy: 'Manage for earnings' },
        { row: 1, col: 2, label: 'Invest/Grow', color: '#22c55e', strategy: 'Build selectively' },
        { row: 2, col: 0, label: 'Divest', color: '#ef4444', strategy: 'Divest' },
        { row: 2, col: 1, label: 'Harvest', color: '#f97316', strategy: 'Harvest' },
        { row: 2, col: 2, label: 'Selectivity', color: '#fbbf24', strategy: 'Protect & refocus' }
      ],
      axes: { x: { label: 'Competitive Strength', positive: 'Strong', negative: 'Weak' }, y: { label: 'Industry Attractiveness', positive: 'High', negative: 'Low' } }
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Compared to the BCG Matrix, what is the main advantage of the GE-McKinsey Matrix?',
        options: ['It is simpler to use', 'It uses weighted multi-factor analysis rather than single measures', 'It has fewer strategic recommendations', 'It is better for startups'],
        correctIndex: 1,
        explanation: 'The GE-McKinsey Matrix uses multiple weighted factors for each dimension, providing more nuanced analysis than the single-factor approach of BCG.'
      }
    ]),
    relatedIds: 'bcg-matrix,competitive-advantage,ansoff-matrix'
  },
  {
    slug: 'pestle-analysis',
    name: 'PESTLE Analysis',
    category: 'Strategy',
    description: 'Framework for analyzing macro-environmental factors affecting an organization',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'PESTLE Analysis is a framework used to analyze and monitor macro-environmental factors that may impact an organization. It stands for Political, Economic, Social, Technological, Legal, and Environmental factors. It helps organizations understand the external environment and adapt strategies accordingly.',
      principles: [
        { title: 'Political', description: 'Government policy, political stability, taxation, trade regulations, and government involvement in industry.' },
        { title: 'Economic', description: 'Economic growth, interest rates, exchange rates, inflation, disposable income, and economic cycles.' },
        { title: 'Social', description: 'Demographics, cultural attitudes, lifestyle changes, education, health consciousness, and population growth.' },
        { title: 'Technological', description: 'R&D activity, automation, technology incentives, rate of technological change, and digital infrastructure.' },
        { title: 'Legal', description: 'Employment law, consumer protection, health and safety, antitrust laws, and intellectual property.' },
        { title: 'Environmental', description: 'Climate change, sustainability pressures, carbon footprint regulations, and environmental policies.' }
      ],
      whenToUse: [
        'Strategic planning and environmental scanning',
        'Entering new markets or geographies',
        'Identifying external opportunities and threats',
        'Risk assessment and scenario planning',
        'Understanding industry context'
      ],
      examples: [
        { company: 'Electric Vehicle Industry', description: 'Political: EV subsidies and mandates. Economic: Battery costs declining. Social: Environmental awareness. Tech: Battery and charging innovation. Legal: Emissions regulations. Environmental: Carbon reduction pressure.' },
        { company: 'Fast Food Industry', description: 'Political: Minimum wage laws. Economic: Disposable income levels. Social: Health consciousness trend. Tech: Delivery apps. Legal: Nutritional labeling. Environmental: Packaging regulations.' }
      ]
    }),
    diagramType: 'radar',
    diagramData: JSON.stringify({
      factors: ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'],
      colors: ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6']
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Categorize these factors into the correct PESTLE category',
        items: [
          { text: 'Rising interest rates', category: 'Economic' },
          { text: 'New data privacy laws (GDPR)', category: 'Legal' },
          { text: 'Aging population demographics', category: 'Social' },
          { text: 'Government trade tariffs', category: 'Political' },
          { text: 'AI and automation adoption', category: 'Technological' },
          { text: 'Carbon emission targets', category: 'Environmental' }
        ],
        categories: ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental']
      }
    ]),
    relatedIds: 'swot-analysis,porters-five-forces,scenario-planning'
  },
  {
    slug: 'scenario-planning',
    name: 'Scenario Planning',
    category: 'Strategy',
    description: 'Strategic method for making flexible long-term plans under uncertainty',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Scenario Planning is a strategic planning method that organizations use to make flexible long-term plans. It involves creating multiple plausible future scenarios based on key uncertainties and developing strategies that would be robust across different outcomes.',
      principles: [
        { title: 'Identify Key Uncertainties', description: 'Determine the most impactful and uncertain factors that could shape the future.' },
        { title: 'Develop Multiple Scenarios', description: 'Create 3-4 distinct, plausible future scenarios (not predictions) based on different combinations of uncertainties.' },
        { title: 'Assess Implications', description: 'For each scenario, analyze what it would mean for your organization and industry.' },
        { title: 'Identify Robust Strategies', description: 'Find strategies that work across multiple scenarios or develop contingency plans.' },
        { title: 'Monitor Early Warnings', description: 'Identify indicators that suggest which scenario is becoming reality.' }
      ],
      whenToUse: [
        'Long-term strategic planning (5-20 years)',
        'High uncertainty environments',
        'Major capital investment decisions',
        'Industry transformation situations',
        'Government and public sector planning'
      ],
      examples: [
        { company: 'Shell Oil', description: 'Pioneer of scenario planning since 1970s. Developed scenarios around oil prices, geopolitics, and energy transition that helped navigate oil crises and plan for alternative energy.' },
        { company: 'Healthcare Industry', description: 'Scenarios around telemedicine adoption, regulatory changes, demographic shifts, and pandemic preparedness.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'scenarioMatrix',
      axes: [
        { name: 'Technology Disruption', high: 'Rapid AI adoption', low: 'Incremental change' },
        { name: 'Regulation', high: 'Heavy regulation', low: 'Light regulation' }
      ],
      scenarios: [
        { name: 'Regulated Innovation', position: 'top-left', color: '#3b82f6' },
        { name: 'Tech Wild West', position: 'top-right', color: '#22c55e' },
        { name: 'Status Quo', position: 'bottom-left', color: '#6b7280' },
        { name: 'Controlled Stability', position: 'bottom-right', color: '#f97316' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'scenario',
        scenario: 'You are a retail executive planning for the next 10 years. Key uncertainties include: (1) Consumer shopping behavior (physical vs. digital), (2) Economic conditions (growth vs. recession).',
        question: 'Develop four distinct scenarios based on these two uncertainties and identify one strategic action that would be valuable in at least three of the four scenarios.',
        framework: {
          scenario1: 'Digital Boom + Economic Growth',
          scenario2: 'Digital Boom + Recession',
          scenario3: 'Physical Resilience + Economic Growth',
          scenario4: 'Physical Resilience + Recession'
        }
      }
    ]),
    relatedIds: 'pestle-analysis,swot-analysis,competitive-advantage'
  },
  {
    slug: 'core-competencies',
    name: 'Core Competencies',
    category: 'Strategy',
    description: 'Unique capabilities that provide competitive advantage and enable diversification',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Core Competencies, a concept developed by C.K. Prahalad and Gary Hamel, are the collective learning and coordination skills underlying a firm's product lines. They are the fundamental capabilities that enable a company to deliver unique value to customers and differentiate from competitors.",
      principles: [
        { title: 'Customer Value', description: 'Core competencies must contribute significantly to customer-perceived value of the end product.' },
        { title: 'Competitor Differentiation', description: 'Must be unique or superior to competitors - difficult to imitate.' },
        { title: 'Extendability', description: 'Should provide access to a wide variety of markets and products.' },
        { title: 'Collective Learning', description: 'Emerges from integration of multiple skills and technology streams.' }
      ],
      whenToUse: [
        'Identifying sources of sustainable advantage',
        'Deciding which activities to keep in-house vs. outsource',
        'Planning diversification strategies',
        'Resource allocation decisions',
        'Organizational capability development'
      ],
      examples: [
        { company: 'Honda', description: 'Core competence in small engine design and manufacturing. Enables success across motorcycles, cars, lawn mowers, and generators.' },
        { company: 'Amazon', description: 'Core competencies in logistics/fulfillment, cloud computing infrastructure, and data-driven personalization. Each enables multiple business lines.' },
        { company: '3M', description: 'Core competence in adhesives technology and substrates. Enables 60,000+ products from Post-it Notes to industrial tapes.' }
      ]
    }),
    diagramType: 'pyramid',
    diagramData: JSON.stringify({
      levels: [
        { label: 'End Products', description: 'Final products customers buy', color: '#22c55e' },
        { label: 'Business Units', description: 'Organizational structure', color: '#3b82f6' },
        { label: 'Core Products', description: 'Components that embody competencies', color: '#8b5cf6' },
        { label: 'Core Competencies', description: 'Fundamental capabilities', color: '#f97316' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: "According to Prahalad and Hamel, which of these is NOT a characteristic of a core competence?",
        options: ['Provides access to multiple markets', 'Is easily copied by competitors', 'Contributes to customer value', 'Difficult for competitors to imitate'],
        correctIndex: 1,
        explanation: 'Core competencies must be difficult to imitate. Easy-to-copy capabilities cannot provide sustainable competitive advantage.'
      }
    ]),
    relatedIds: 'value-chain-analysis,competitive-advantage,bcg-matrix'
  },
  {
    slug: 'balanced-scorecard',
    name: 'Balanced Scorecard',
    category: 'Strategy',
    description: 'Strategic management framework linking strategy to operational metrics across four perspectives',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'The Balanced Scorecard, developed by Robert Kaplan and David Norton, is a strategic planning and management system that organizations use to communicate strategy, align day-to-day work to strategy, prioritize projects, and measure progress. It balances financial measures with three other perspectives.',
      principles: [
        { title: 'Financial Perspective', description: 'Traditional measures of financial performance: revenue growth, profitability, cost reduction, asset utilization.' },
        { title: 'Customer Perspective', description: 'How customers see us: satisfaction, retention, acquisition, market share, customer value proposition.' },
        { title: 'Internal Process Perspective', description: 'What we must excel at: operational excellence, customer management, innovation, regulatory/social processes.' },
        { title: 'Learning & Growth Perspective', description: 'How we continue to improve: employee capabilities, information systems, organizational culture and alignment.' }
      ],
      whenToUse: [
        'Translating strategy into operational terms',
        'Aligning organization around strategy',
        'Making strategy a continual process',
        'Performance management systems',
        'Strategic communication'
      ],
      examples: [
        { company: 'Kaplan & Norton Example', description: 'Financial: 10% revenue growth. Customer: 90% satisfaction score. Process: Reduce cycle time 20%. Learning: 40 training hours per employee.' },
        { company: 'Retail Bank', description: 'Financial: ROE. Customer: Customer retention rate. Process: Cross-selling ratio. Learning: Employee satisfaction.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'balancedScorecard',
      perspectives: [
        { name: 'Financial', question: 'How do we look to shareholders?', color: '#22c55e', position: 'top' },
        { name: 'Customer', question: 'How do customers see us?', color: '#3b82f6', position: 'left' },
        { name: 'Internal Process', question: 'What must we excel at?', color: '#8b5cf6', position: 'right' },
        { name: 'Learning & Growth', question: 'How can we continue to improve?', color: '#f97316', position: 'bottom' }
      ],
      center: 'Vision & Strategy'
    }),
    exercises: JSON.stringify([
      {
        type: 'dragdrop',
        instruction: 'Classify these metrics into the correct Balanced Scorecard perspective',
        items: [
          { text: 'Net Promoter Score', category: 'Customer' },
          { text: 'Return on Assets', category: 'Financial' },
          { text: 'Employee turnover rate', category: 'Learning & Growth' },
          { text: 'Order fulfillment time', category: 'Internal Process' },
          { text: 'Revenue per customer', category: 'Financial' },
          { text: 'Training hours per employee', category: 'Learning & Growth' }
        ],
        categories: ['Financial', 'Customer', 'Internal Process', 'Learning & Growth']
      }
    ]),
    relatedIds: 'value-chain-analysis,core-competencies,competitive-advantage'
  }
]


