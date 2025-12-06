import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

interface ExhibitData {
  type: string
  title: string
  data: Record<string, unknown>
}

const caseExhibits: Record<string, ExhibitData[]> = {
  'openai-boardroom-coup-governance-crisis': [
    {
      type: 'enhanced_table',
      title: 'OpenAI Governance Structure Evolution',
      data: {
        headers: ['Period', 'Structure', 'Board Control', 'Investor Rights', 'Risk Level'],
        rows: [
          ['2015-2019', 'Pure Non-Profit', 'Full autonomy', { value: 'None', color: 'positive' }, { value: 'Low', color: 'positive' }],
          ['2019-2023', 'Capped-Profit Hybrid', 'Mission-first mandate', { value: 'Up to 100x returns', color: 'warning' }, { value: 'Medium', color: 'warning' }],
          ['Nov 2023', 'Crisis Period', { value: 'Board vs CEO', color: 'negative' }, { value: 'Uncertain', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['2024', 'Restructured', 'New board + investors', { value: 'Board seats', color: 'warning' }, { value: 'Medium', color: 'warning' }],
          ['2025+', 'Public Benefit Corp', 'Traditional governance', { value: 'Standard equity', color: 'neutral' }, { value: 'Standard', color: 'neutral' }]
        ],
        highlightHeader: true,
        striped: true
      }
    },
    {
      type: 'timeline',
      title: 'The Five-Day Crisis: Hour by Hour',
      data: {
        events: [
          { date: 'Fri 12:23 PM', title: 'Board fires Sam Altman', description: 'Terse announcement cites "loss of confidence" with no specifics', type: 'negative' },
          { date: 'Fri 2:00 PM', title: 'Greg Brockman resigns', description: 'President quits in solidarity after being removed from board', type: 'negative' },
          { date: 'Sat Morning', title: 'Investor revolt begins', description: 'Thrive, Tiger Global demand Altman reinstatement', type: 'neutral' },
          { date: 'Sun 9:00 PM', title: 'Microsoft offers lifeline', description: 'Satya Nadella tweets: Altman + team welcome at Microsoft', type: 'neutral' },
          { date: 'Mon 1:00 AM', title: 'Employee letter circulates', description: '505 of 770 employees threaten to quit', type: 'negative' },
          { date: 'Mon 2:30 PM', title: 'Sutskever reverses', description: '"I deeply regret my participation in the board\'s actions"', type: 'positive' },
          { date: 'Tue 11:00 PM', title: 'Altman reinstated', description: 'New board formed with Bret Taylor as chairman', type: 'positive' }
        ]
      }
    },
    {
      type: 'waterfall',
      title: 'Enterprise Value at Risk During Crisis ($B)',
      data: {
        steps: [
          { name: 'Pre-Crisis Value', value: 86, isTotal: true },
          { name: 'Initial Announcement', value: -15 },
          { name: 'Employee Exodus Risk', value: -25 },
          { name: 'Microsoft Alternative', value: -20 },
          { name: 'Potential Floor', value: 26, isTotal: true },
          { name: 'Resolution Rally', value: 60 },
          { name: 'Post-Crisis Value', value: 86, isTotal: true }
        ],
        unit: '$B'
      }
    },
    {
      type: 'positioning',
      title: 'AI Lab Governance Models',
      data: {
        xAxis: { label: 'Commercial Orientation', min: 0, max: 100 },
        yAxis: { label: 'Safety Focus', min: 0, max: 100 },
        quadrants: {
          topLeft: 'Safety-First Non-Profit',
          topRight: 'Balanced Hybrid',
          bottomLeft: 'Academic Research',
          bottomRight: 'Pure Commercial'
        },
        points: [
          { name: 'OpenAI (Pre-2019)', x: 20, y: 85 },
          { name: 'OpenAI (2023)', x: 75, y: 55, highlight: true },
          { name: 'Anthropic', x: 55, y: 80 },
          { name: 'DeepMind', x: 60, y: 70 },
          { name: 'Meta AI', x: 85, y: 35 },
          { name: 'xAI', x: 90, y: 25 }
        ]
      }
    },
    {
      type: 'quote',
      title: 'Employee Ultimatum',
      data: {
        text: 'Your actions have destabilized the company, undermined our ability to advance our mission, and threatened to destroy everything we have built. We cannot work for or with people that lack competence, judgment, and care for our mission and employees.',
        attribution: '505 OpenAI Employees',
        role: 'Open Letter, November 20, 2023'
      }
    }
  ],
  'nvidia-kingmaker-supply-chain-strategy': [
    {
      type: 'enhanced_table',
      title: 'Nvidia Financial Performance (FY2020-FY2024)',
      data: {
        headers: ['Metric', 'FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024'],
        rows: [
          ['Revenue ($B)', { value: '$10.9', sparkline: [10.9, 16.7, 26.9, 27.0, 60.9] }, { value: '$16.7', trend: 'up' }, { value: '$26.9', trend: 'up' }, { value: '$27.0', trend: 'neutral' }, { value: '$60.9', trend: 'up', color: 'positive' }],
          ['Data Center ($B)', { value: '$3.0' }, { value: '$6.7', trend: 'up' }, { value: '$10.6', trend: 'up' }, { value: '$15.0', trend: 'up' }, { value: '$47.5', trend: 'up', color: 'positive' }],
          ['Gross Margin', { value: '62%' }, { value: '64%', trend: 'up' }, { value: '65%', trend: 'up' }, { value: '57%', trend: 'down', color: 'warning' }, { value: '73%', trend: 'up', color: 'positive' }],
          ['Data Center %', { value: '28%' }, { value: '40%', trend: 'up' }, { value: '39%' }, { value: '56%', trend: 'up' }, { value: '78%', trend: 'up', color: 'positive', bold: true }],
          ['R&D ($B)', { value: '$2.8' }, { value: '$3.9', trend: 'up' }, { value: '$5.3', trend: 'up' }, { value: '$7.3', trend: 'up' }, { value: '$8.7', trend: 'up' }]
        ],
        highlightHeader: true,
        striped: true
      }
    },
    {
      type: 'radar',
      title: 'AI Chip Competitive Comparison (2024)',
      data: {
        dimensions: ['Performance', 'Software Ecosystem', 'Supply Availability', 'Price/Perf', 'Enterprise Support', 'Cloud Integration'],
        entities: [
          { name: 'Nvidia H100', values: [95, 98, 60, 50, 95, 95], color: '#76b900' },
          { name: 'AMD MI300X', values: [85, 55, 70, 75, 70, 65], color: '#ed1c24' },
          { name: 'Intel Gaudi 3', values: [65, 40, 80, 85, 75, 60], color: '#0071c5' },
          { name: 'Google TPU v5', values: [90, 30, 90, 70, 60, 95], color: '#4285f4' }
        ],
        maxValue: 100
      }
    },
    {
      type: 'waterfall',
      title: 'Nvidia Revenue Mix Transformation (FY20→FY24)',
      data: {
        steps: [
          { name: 'FY2020 Total', value: 10.9, isTotal: true },
          { name: 'Gaming Growth', value: 3.2 },
          { name: 'Data Center Explosion', value: 44.5 },
          { name: 'Pro Visualization', value: 0.8 },
          { name: 'Auto & Robotics', value: 1.5 },
          { name: 'FY2024 Total', value: 60.9, isTotal: true }
        ],
        unit: '$B'
      }
    },
    {
      type: 'positioning',
      title: 'Semiconductor Supply Chain Position',
      data: {
        xAxis: { label: 'Vertical Integration', min: 0, max: 100 },
        yAxis: { label: 'AI Market Control', min: 0, max: 100 },
        quadrants: {
          topLeft: 'Design-Led Dominance',
          topRight: 'Full Stack Control',
          bottomLeft: 'Commodity Supplier',
          bottomRight: 'Integrated Follower'
        },
        points: [
          { name: 'Nvidia', x: 25, y: 92, highlight: true },
          { name: 'AMD', x: 30, y: 35 },
          { name: 'Intel', x: 85, y: 20 },
          { name: 'TSMC', x: 95, y: 70 },
          { name: 'Broadcom', x: 45, y: 25 },
          { name: 'Qualcomm', x: 40, y: 15 }
        ]
      }
    },
    {
      type: 'quote',
      title: 'Jensen Huang on CUDA Moat',
      data: {
        text: 'Our CUDA installed base is our most important asset. There are 4 million CUDA developers. Every major AI framework runs on CUDA. This took us 20 years to build. It cannot be replicated in 20 months.',
        attribution: 'Jensen Huang',
        role: 'CEO, Nvidia (2024 Earnings Call)'
      }
    }
  ],
  'starbucks-back-to-basics-turnaround': [
    {
      type: 'enhanced_table',
      title: 'Starbucks Operational Metrics Decline',
      data: {
        headers: ['Metric', '2019', '2022', '2024', '5-Year Trend'],
        rows: [
          ['Same-Store Sales (US)', { value: '+5%', color: 'positive' }, { value: '+7%', color: 'positive' }, { value: '-3%', color: 'negative', trend: 'down' }, { value: '', sparkline: [5, 3, -8, 7, -3] }],
          ['Customer Satisfaction', { value: '82/100', color: 'positive' }, { value: '76/100', color: 'warning' }, { value: '71/100', color: 'negative', trend: 'down' }, { value: '', sparkline: [82, 79, 76, 73, 71] }],
          ['Mobile Order %', { value: '17%' }, { value: '26%', trend: 'up' }, { value: '31%', trend: 'up' }, { value: '', sparkline: [17, 22, 26, 29, 31] }],
          ['Avg. Wait Time (min)', { value: '3.2', color: 'positive' }, { value: '4.8', color: 'warning' }, { value: '6.1', color: 'negative', trend: 'down' }, { value: '', sparkline: [3.2, 4.1, 4.8, 5.5, 6.1] }],
          ['Barista Turnover', { value: '65%' }, { value: '78%', color: 'warning', trend: 'up' }, { value: '85%', color: 'negative', trend: 'up' }, { value: '', sparkline: [65, 71, 78, 82, 85] }]
        ],
        highlightHeader: true
      }
    },
    {
      type: 'waterfall',
      title: 'Starbucks Traffic Loss Analysis (2024 vs 2019)',
      data: {
        steps: [
          { name: '2019 Baseline', value: 100, isTotal: true },
          { name: 'COVID Impact (Lingering)', value: -8 },
          { name: 'Mobile Order Friction', value: -12 },
          { name: 'Price Sensitivity', value: -7 },
          { name: 'Competition (Local)', value: -6 },
          { name: 'Competition (Chains)', value: -5 },
          { name: '2024 Indexed', value: 62, isTotal: true }
        ],
        unit: '%'
      }
    },
    {
      type: 'positioning',
      title: 'Coffee Chain Positioning Map',
      data: {
        xAxis: { label: 'Price Point', min: 0, max: 100 },
        yAxis: { label: 'Experience Quality', min: 0, max: 100 },
        quadrants: {
          topLeft: 'Premium Local',
          topRight: 'Premium Chain',
          bottomLeft: 'Value Quick-Serve',
          bottomRight: 'Mid-Market Chain'
        },
        points: [
          { name: 'Starbucks (2019)', x: 75, y: 80 },
          { name: 'Starbucks (2024)', x: 80, y: 55, highlight: true },
          { name: 'Blue Bottle', x: 90, y: 92 },
          { name: 'Dutch Bros', x: 60, y: 75 },
          { name: 'Dunkin\'', x: 45, y: 45 },
          { name: 'McDonald\'s', x: 30, y: 35 },
          { name: 'Local Indie', x: 70, y: 88 }
        ]
      }
    },
    {
      type: 'timeline',
      title: 'Starbucks Leadership & Strategy Timeline',
      data: {
        events: [
          { date: 'Aug 2022', title: 'Howard Schultz returns (interim)', description: 'Third stint as CEO to stabilize operations', type: 'neutral' },
          { date: 'Mar 2023', title: 'Laxman Narasimhan takes over', description: 'Former Reckitt CEO brings CPG efficiency mindset', type: 'neutral' },
          { date: 'Oct 2023', title: 'Siren System rollout begins', description: 'New equipment promises faster drink production', type: 'positive' },
          { date: 'Q2 2024', title: 'Sales decline accelerates', description: 'Same-store sales fall 3%, stock drops 20%', type: 'negative' },
          { date: 'Aug 2024', title: 'Narasimhan ousted after 17 months', description: 'Board recruits Chipotle\'s Brian Niccol', type: 'negative' },
          { date: 'Sep 2024', title: 'Niccol announces "Back to Starbucks"', description: 'Menu simplification, experience focus', type: 'positive' }
        ]
      }
    },
    {
      type: 'quote',
      title: 'Brian Niccol\'s Turnaround Vision',
      data: {
        text: 'We\'re going to get back to Starbucks. The coffeehouse. A welcoming place where people can connect over great coffee. We have drifted from that. Mobile order has turned stores into transaction points. That stops now.',
        attribution: 'Brian Niccol',
        role: 'CEO, Starbucks (September 2024)'
      }
    }
  ],
  'crowdstrike-blue-screen-crisis': [
    {
      type: 'timeline',
      title: 'CrowdStrike Incident Timeline (July 19, 2024)',
      data: {
        events: [
          { date: '04:09 UTC', title: 'Faulty update deployed', description: 'Channel File 291 pushed to Falcon sensors globally', type: 'negative' },
          { date: '04:15 UTC', title: 'First crashes reported', description: 'Australian banks and airlines report Windows BSODs', type: 'negative' },
          { date: '05:00 UTC', title: 'Global cascade begins', description: 'Europe wakes to crashed systems—airports, hospitals, banks', type: 'negative' },
          { date: '05:27 UTC', title: 'Root cause identified', description: 'CrowdStrike engineers isolate problematic update', type: 'neutral' },
          { date: '05:47 UTC', title: 'Update reverted', description: 'New systems stop crashing, but 8.5M devices already affected', type: 'positive' },
          { date: '12:00 UTC', title: 'Recovery guidance issued', description: 'Manual fix requires Safe Mode boot on each device', type: 'neutral' },
          { date: '18:00 UTC', title: 'CEO statement released', description: 'George Kurtz apologizes, no "apology" in initial statement', type: 'negative' },
          { date: 'Day 2-5', title: 'Painful recovery', description: 'Delta cancels 5,000+ flights; hospitals on paper records', type: 'negative' }
        ]
      }
    },
    {
      type: 'enhanced_table',
      title: 'Sector Impact Assessment',
      data: {
        headers: ['Sector', 'Devices Affected', 'Recovery Time', 'Est. Financial Impact', 'Severity'],
        rows: [
          ['Airlines', '~150,000', '3-5 days', { value: '$1.5B+', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['Healthcare', '~500,000', '1-3 days', { value: 'Patient Risk', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['Financial Services', '~200,000', '12-48 hrs', { value: '$400M+', color: 'warning' }, { value: 'High', color: 'warning' }],
          ['Retail/POS', '~300,000', '24-72 hrs', { value: '$200M+', color: 'warning' }, { value: 'High', color: 'warning' }],
          ['Government', '~100,000', '2-5 days', { value: 'Unknown', color: 'neutral' }, { value: 'High', color: 'warning' }],
          ['Global Total', { value: '8.5M', bold: true }, { value: '1-7 days' }, { value: '$5.4B+', bold: true, color: 'negative' }, { value: '', color: 'negative' }]
        ],
        highlightHeader: true
      }
    },
    {
      type: 'waterfall',
      title: 'CrowdStrike Market Cap Impact ($B)',
      data: {
        steps: [
          { name: 'Pre-Incident (Jul 18)', value: 83.5, isTotal: true },
          { name: 'Day 1 Reaction', value: -9.2 },
          { name: 'Day 2-3 Analysis', value: -6.8 },
          { name: 'Week 1 Close', value: 67.5, isTotal: true },
          { name: 'Week 2-4 Recovery', value: 8.3 },
          { name: 'Month-End', value: 75.8, isTotal: true }
        ],
        unit: '$B'
      }
    },
    {
      type: 'sankey',
      title: 'Estimated Financial Impact Flow',
      data: {
        nodes: [
          { name: 'Total Impact' },
          { name: 'Airlines' },
          { name: 'Healthcare' },
          { name: 'Finance' },
          { name: 'Other' }
        ],
        links: [
          { source: 'Total Impact', target: 'Airlines', value: 1.5, color: '#ef4444' },
          { source: 'Total Impact', target: 'Healthcare', value: 1.2, color: '#f97316' },
          { source: 'Total Impact', target: 'Finance', value: 0.8, color: '#eab308' },
          { source: 'Total Impact', target: 'Other', value: 1.9, color: '#64748b' }
        ],
        unit: '$B'
      }
    },
    {
      type: 'quote',
      title: 'Delta CEO Response',
      data: {
        text: 'If you\'re going to be having access, priority access to the cockpit of our technology systems, you\'d better have the most reliable, resilient software on the planet. And they did not.',
        attribution: 'Ed Bastian',
        role: 'CEO, Delta Air Lines (CNBC Interview, July 2024)'
      }
    }
  ]
}

const caseExhibits2: Record<string, ExhibitData[]> = {
  'microsoft-copilot-vs-incumbents': [
    {
      type: 'enhanced_table',
      title: 'AI Feature Comparison: Copilot vs Specialists (2024)',
      data: {
        headers: ['Use Case', 'Microsoft Copilot', 'Best Specialist', 'Enterprise Verdict'],
        rows: [
          ['Email Writing', { value: 'Good', color: 'positive' }, { value: 'Superhuman', subtext: 'Better personalization' }, { value: 'Copilot wins (convenience)', color: 'positive' }],
          ['Document Creation', { value: 'Good', color: 'positive' }, { value: 'Notion AI', subtext: 'Better structure' }, { value: 'Depends on workflow', color: 'neutral' }],
          ['Data Analysis', { value: 'Excellent', color: 'positive' }, { value: 'Variable' }, { value: 'Copilot wins decisively', color: 'positive' }],
          ['Marketing Copy', { value: 'Basic', color: 'warning' }, { value: 'Jasper', subtext: 'Domain-trained' }, { value: 'Specialists win', color: 'negative' }],
          ['Code Assist', { value: 'Excellent', color: 'positive' }, { value: 'Cursor/Replit', subtext: 'Comparable' }, { value: 'Microsoft wins (GitHub)', color: 'positive' }],
          ['Design', { value: 'Poor', color: 'negative' }, { value: 'Figma AI', subtext: 'Purpose-built' }, { value: 'Specialists win', color: 'negative' }]
        ],
        highlightHeader: true
      }
    },
    {
      type: 'waterfall',
      title: 'Enterprise Productivity Spend Shift (2023→2025)',
      data: {
        steps: [
          { name: '2023 Total Spend', value: 100, isTotal: true },
          { name: 'M365 Copilot Adoption', value: 35 },
          { name: 'Standalone AI Tools', value: -15 },
          { name: 'Legacy Tool Cuts', value: -8 },
          { name: 'Net New AI Spend', value: 12 },
          { name: '2025 Total Spend', value: 124, isTotal: true }
        ],
        unit: '%'
      }
    },
    {
      type: 'positioning',
      title: 'AI Productivity Tool Market Map',
      data: {
        xAxis: { label: 'Specialization', min: 0, max: 100 },
        yAxis: { label: 'AI Sophistication', min: 0, max: 100 },
        quadrants: {
          topLeft: 'General AI Platforms',
          topRight: 'Specialized AI Leaders',
          bottomLeft: 'Legacy Productivity',
          bottomRight: 'Niche Tools'
        },
        points: [
          { name: 'Microsoft Copilot', x: 20, y: 75, highlight: true },
          { name: 'Google Duet', x: 25, y: 70 },
          { name: 'Notion AI', x: 55, y: 72 },
          { name: 'Jasper', x: 85, y: 80 },
          { name: 'Grammarly', x: 70, y: 65 },
          { name: 'Figma AI', x: 90, y: 78 },
          { name: 'Evernote', x: 40, y: 30 }
        ]
      }
    },
    {
      type: 'radar',
      title: 'Competitive Threat Assessment for Specialists',
      data: {
        dimensions: ['Distribution Power', 'AI Quality', 'Integration Depth', 'Price Pressure', 'Switching Costs', 'Brand Trust'],
        entities: [
          { name: 'Microsoft', values: [98, 75, 95, 90, 85, 88], color: '#00a4ef' },
          { name: 'Avg Specialist', values: [35, 85, 60, 50, 40, 65], color: '#8b5cf6' }
        ],
        maxValue: 100
      }
    },
    {
      type: 'quote',
      title: 'Notion CEO on Survival Strategy',
      data: {
        text: 'We don\'t fear Copilot. We fear becoming a feature. That\'s why we\'re betting everything on our unique document model—something Microsoft can\'t easily copy because it would break backward compatibility with decades of Word documents.',
        attribution: 'Ivan Zhao',
        role: 'CEO, Notion (TechCrunch Interview, 2024)'
      }
    }
  ],
  'nike-dtc-retreat': [
    {
      type: 'enhanced_table',
      title: 'Nike Channel Performance Analysis',
      data: {
        headers: ['Metric', 'FY2017', 'FY2021', 'FY2024', 'Change'],
        rows: [
          ['Nike Direct Revenue', { value: '$9.1B' }, { value: '$16.4B', trend: 'up' }, { value: '$21.5B', trend: 'up' }, { value: '+136%', color: 'positive' }],
          ['Wholesale Revenue', { value: '$23.4B' }, { value: '$25.0B' }, { value: '$23.1B', trend: 'down' }, { value: '-1%', color: 'negative' }],
          ['Direct % of Total', { value: '28%' }, { value: '39%', trend: 'up' }, { value: '48%', trend: 'up' }, { value: '+20pp', color: 'positive' }],
          ['US Footwear Share', { value: '35%' }, { value: '34%' }, { value: '30%', trend: 'down', color: 'negative' }, { value: '-5pp', color: 'negative' }],
          ['Wholesale Partners', { value: '~30,000' }, { value: '~22,000', trend: 'down' }, { value: '~25,000', trend: 'up' }, { value: '-17%', color: 'warning' }]
        ],
        highlightHeader: true,
        striped: true
      }
    },
    {
      type: 'waterfall',
      title: 'Nike US Market Share Loss Analysis (2019→2024)',
      data: {
        steps: [
          { name: '2019 Share', value: 35.0, isTotal: true },
          { name: 'Wholesale Exit Impact', value: -2.5 },
          { name: 'Hoka Growth', value: -1.8 },
          { name: 'On Running Growth', value: -1.2 },
          { name: 'New Balance Surge', value: -0.8 },
          { name: 'Other Competitors', value: -0.7 },
          { name: 'DTC Gains', value: 2.0 },
          { name: '2024 Share', value: 30.0, isTotal: true }
        ],
        unit: '%'
      }
    },
    {
      type: 'positioning',
      title: 'Running Shoe Competitive Landscape (2024)',
      data: {
        xAxis: { label: 'Performance Focus', min: 0, max: 100 },
        yAxis: { label: 'Style/Lifestyle', min: 0, max: 100 },
        quadrants: {
          topLeft: 'Lifestyle Icons',
          topRight: 'Premium All-Around',
          bottomLeft: 'Value Performance',
          bottomRight: 'Pure Performance'
        },
        points: [
          { name: 'Nike', x: 55, y: 80, highlight: true },
          { name: 'Hoka', x: 75, y: 50 },
          { name: 'On Running', x: 65, y: 70 },
          { name: 'New Balance', x: 50, y: 75 },
          { name: 'Adidas', x: 45, y: 65 },
          { name: 'Brooks', x: 85, y: 25 },
          { name: 'Asics', x: 80, y: 35 }
        ]
      }
    },
    {
      type: 'radar',
      title: 'Nike vs Emerging Competitors',
      data: {
        dimensions: ['Brand Heat', 'Running Cred', 'Retail Presence', 'Innovation Perception', 'Value Perception', 'Social Buzz'],
        entities: [
          { name: 'Nike', values: [75, 70, 65, 80, 45, 70], color: '#000000' },
          { name: 'Hoka', values: [85, 95, 80, 90, 60, 88], color: '#00a0dc' },
          { name: 'On Running', values: [80, 85, 75, 88, 55, 82], color: '#ff6b35' }
        ],
        maxValue: 100
      }
    },
    {
      type: 'quote',
      title: 'Industry Analyst Assessment',
      data: {
        text: 'Nike made a textbook strategic error: they assumed their brand was strong enough to pull customers to any channel. It wasn\'t. Brand strength creates preference; distribution creates sales. You need both.',
        attribution: 'Matt Powell',
        role: 'Senior Advisor, NPD Group (2024)'
      }
    }
  ],
  'ftx-failure-of-controls': [
    {
      type: 'sankey',
      title: 'FTX Customer Fund Misappropriation ($8B)',
      data: {
        nodes: [
          { name: 'Customer Deposits' },
          { name: 'Alameda Loans' },
          { name: 'Real Estate' },
          { name: 'Venture Investments' },
          { name: 'Political Donations' },
          { name: 'Unaccounted' }
        ],
        links: [
          { source: 'Customer Deposits', target: 'Alameda Loans', value: 4.1, color: '#ef4444' },
          { source: 'Customer Deposits', target: 'Real Estate', value: 0.3, color: '#f97316' },
          { source: 'Customer Deposits', target: 'Venture Investments', value: 2.1, color: '#eab308' },
          { source: 'Customer Deposits', target: 'Political Donations', value: 0.1, color: '#8b5cf6' },
          { source: 'Customer Deposits', target: 'Unaccounted', value: 1.4, color: '#64748b' }
        ],
        unit: '$B'
      }
    },
    {
      type: 'enhanced_table',
      title: 'FTX Governance Failures vs. Industry Standards',
      data: {
        headers: ['Control Area', 'Industry Standard', 'FTX Practice', 'Risk Level'],
        rows: [
          ['Board Independence', { value: 'Majority independent', color: 'positive' }, { value: 'Zero independent directors', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['Financial Audits', { value: 'Big 4 annual audit', color: 'positive' }, { value: 'No audited statements', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['Asset Segregation', { value: 'Customer funds isolated', color: 'positive' }, { value: 'Commingled with trading', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['CFO/Controller', { value: 'Dedicated finance team', color: 'positive' }, { value: 'No CFO; used QuickBooks', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['Document Retention', { value: '7+ year retention', color: 'positive' }, { value: 'Auto-delete messages', color: 'negative' }, { value: 'Critical', color: 'negative' }],
          ['Risk Management', { value: 'Dedicated risk function', color: 'positive' }, { value: 'None', color: 'negative' }, { value: 'Critical', color: 'negative' }]
        ],
        highlightHeader: true
      }
    },
    {
      type: 'timeline',
      title: 'FTX Collapse Timeline',
      data: {
        events: [
          { date: 'Nov 2, 2022', title: 'CoinDesk reveals Alameda balance sheet', description: 'Report shows $5.8B of $14.6B assets in FTT tokens', type: 'negative' },
          { date: 'Nov 6, 2022', title: 'Binance announces FTT liquidation', description: 'CZ tweets Binance will sell $500M+ in FTT holdings', type: 'negative' },
          { date: 'Nov 8, 2022', title: 'Bank run begins', description: '$6B withdrawal requests in 72 hours', type: 'negative' },
          { date: 'Nov 8, 2022', title: 'Binance offers to acquire', description: 'CZ announces non-binding acquisition agreement', type: 'neutral' },
          { date: 'Nov 9, 2022', title: 'Binance walks away', description: '"Issues beyond our control" cited after due diligence', type: 'negative' },
          { date: 'Nov 11, 2022', title: 'FTX files Chapter 11', description: '134 entities declare bankruptcy', type: 'negative' },
          { date: 'Nov 12, 2022', title: 'SBF arrested', description: 'Bahamian authorities take Bankman-Fried into custody', type: 'neutral' },
          { date: 'Nov 2023', title: 'SBF convicted', description: 'Found guilty on all 7 counts of fraud and conspiracy', type: 'neutral' }
        ]
      }
    },
    {
      type: 'waterfall',
      title: 'FTX Valuation Collapse',
      data: {
        steps: [
          { name: 'Peak Valuation (Jan 2022)', value: 32, isTotal: true },
          { name: 'Crypto Winter', value: -8 },
          { name: 'Pre-Collapse (Oct 2022)', value: 24, isTotal: true },
          { name: 'Bank Run Begins', value: -15 },
          { name: 'Binance Walks', value: -8 },
          { name: 'Bankruptcy Filing', value: -1 },
          { name: 'Final Value', value: 0, isTotal: true }
        ],
        unit: '$B'
      }
    },
    {
      type: 'quote',
      title: 'Bankruptcy CEO Assessment',
      data: {
        text: 'Never in my career have I seen such a complete failure of corporate controls and such a complete absence of trustworthy financial information as occurred here.',
        attribution: 'John J. Ray III',
        role: 'FTX Bankruptcy CEO (who also handled Enron)'
      }
    }
  ]
}

const caseExhibits3: Record<string, ExhibitData[]> = {
  'meta-ftc-antitrust-victory': [
    {
      type: 'enhanced_table',
      title: 'Market Definition Battle: Competing Views',
      data: {
        headers: ['Market Definition', 'Platforms Included', 'Meta Share', 'FTC Position', 'Court Finding'],
        rows: [
          ['Personal Social Networking', 'Facebook, Instagram, Snapchat', { value: '~75%', color: 'negative' }, { value: 'Monopoly', color: 'negative' }, { value: 'Rejected', color: 'positive' }],
          ['Social Media (Broad)', 'Above + TikTok, X, LinkedIn, Pinterest', { value: '~35%' }, { value: 'Not argued' }, { value: 'More appropriate', color: 'positive' }],
          ['Attention Economy', 'All digital entertainment', { value: '~15%', color: 'positive' }, { value: 'Too broad' }, { value: 'Considered', color: 'neutral' }],
          ['Digital Advertising', 'Google, Meta, Amazon, others', { value: '~22%' }, { value: 'Separate market' }, { value: 'Duopoly noted', color: 'warning' }]
        ],
        highlightHeader: true
      }
    },
    {
      type: 'positioning',
      title: 'Social Media Competitive Landscape (2025)',
      data: {
        xAxis: { label: 'Content Focus (Personal → Entertainment)', min: 0, max: 100 },
        yAxis: { label: 'User Engagement Depth', min: 0, max: 100 },
        quadrants: {
          topLeft: 'Deep Personal Networks',
          topRight: 'Engaged Entertainment',
          bottomLeft: 'Utility Messaging',
          bottomRight: 'Casual Entertainment'
        },
        points: [
          { name: 'Facebook', x: 30, y: 65, highlight: true },
          { name: 'Instagram', x: 55, y: 75, highlight: true },
          { name: 'TikTok', x: 85, y: 90 },
          { name: 'YouTube', x: 80, y: 85 },
          { name: 'Snapchat', x: 45, y: 55 },
          { name: 'X/Twitter', x: 60, y: 50 },
          { name: 'LinkedIn', x: 25, y: 45 },
          { name: 'WhatsApp', x: 15, y: 70 }
        ]
      }
    },
    {
      type: 'waterfall',
      title: 'User Time Spent Shift (2020→2024)',
      data: {
        steps: [
          { name: 'Meta Apps (2020)', value: 58, isTotal: true },
          { name: 'TikTok Surge', value: -18 },
          { name: 'YouTube Shorts', value: -5 },
          { name: 'Reels Response', value: 8 },
          { name: 'Meta Apps (2024)', value: 43, isTotal: true }
        ],
        unit: '%'
      }
    },
    {
      type: 'timeline',
      title: 'FTC vs. Meta Legal Timeline',
      data: {
        events: [
          { date: 'Dec 2020', title: 'FTC files initial complaint', description: 'Seeks to unwind Instagram and WhatsApp acquisitions', type: 'negative' },
          { date: 'Jun 2021', title: 'Case dismissed', description: 'Judge finds FTC failed to define market properly', type: 'positive' },
          { date: 'Aug 2021', title: 'FTC amends complaint', description: 'Adds market share data, narrows market definition', type: 'negative' },
          { date: 'Jan 2022', title: 'Case proceeds', description: 'Judge allows amended complaint to move forward', type: 'negative' },
          { date: '2023-2024', title: 'Discovery and trial prep', description: 'Both sides build economic and market analysis', type: 'neutral' },
          { date: 'Oct 2025', title: 'Court rules for Meta', description: 'Market definition too narrow; TikTok changes landscape', type: 'positive' }
        ]
      }
    },
    {
      type: 'quote',
      title: 'Court Opinion Excerpt',
      data: {
        text: 'The FTC asks this Court to unwind acquisitions completed over a decade ago, based on a market definition that ignores how dramatically the competitive landscape has changed. Whatever Facebook\'s intent in 2012, the company today faces competition that the Commission\'s theory does not adequately address.',
        attribution: 'Judge James Boasberg',
        role: 'U.S. District Court for D.C. (October 2025)'
      }
    }
  ],
  'spotify-year-of-efficiency': [
    {
      type: 'enhanced_table',
      title: 'Spotify Financial Transformation',
      data: {
        headers: ['Metric', '2021', '2022', '2023', '2024', 'Trend'],
        rows: [
          ['Revenue (€B)', { value: '€9.7' }, { value: '€11.7', trend: 'up' }, { value: '€13.2', trend: 'up' }, { value: '€15.7', trend: 'up' }, { value: '+62%', color: 'positive', sparkline: [9.7, 11.7, 13.2, 15.7] }],
          ['Gross Margin', { value: '26%', color: 'warning' }, { value: '25%', trend: 'down', color: 'warning' }, { value: '27%', trend: 'up' }, { value: '31%', trend: 'up', color: 'positive' }, { value: '+5pp', color: 'positive' }],
          ['Operating Income (€M)', { value: '-€293', color: 'negative' }, { value: '-€659', color: 'negative' }, { value: '€268', color: 'positive' }, { value: '€1,120', color: 'positive' }, { value: 'Profitable!', color: 'positive', bold: true }],
          ['Headcount', { value: '8,500' }, { value: '9,800', trend: 'up' }, { value: '8,200', trend: 'down' }, { value: '7,300', trend: 'down' }, { value: '-26%', color: 'warning' }],
          ['Podcast Investment (€M)', { value: '€400' }, { value: '€350' }, { value: '€200', trend: 'down' }, { value: '€50', trend: 'down' }, { value: '-88%', color: 'warning' }]
        ],
        highlightHeader: true,
        striped: true
      }
    },
    {
      type: 'waterfall',
      title: 'Spotify Path to Profitability (€M Operating Income)',
      data: {
        steps: [
          { name: '2022 Loss', value: -659, isTotal: true },
          { name: 'Price Increases', value: 450 },
          { name: 'Podcast Cost Cuts', value: 300 },
          { name: 'Headcount Reduction', value: 380 },
          { name: 'Marketing Efficiency', value: 180 },
          { name: 'Other OpEx Savings', value: 120 },
          { name: 'Revenue Growth Drop-through', value: 349 },
          { name: '2024 Profit', value: 1120, isTotal: true }
        ],
        unit: '€M'
      }
    },
    {
      type: 'radar',
      title: 'Spotify vs. Competitors (2024)',
      data: {
        dimensions: ['Catalog Size', 'Discovery/Algo', 'Podcast Library', 'Audio Quality', 'Price Value', 'Platform Reach'],
        entities: [
          { name: 'Spotify', values: [95, 92, 75, 70, 75, 95], color: '#1db954' },
          { name: 'Apple Music', values: [95, 70, 30, 90, 70, 85], color: '#fc3c44' },
          { name: 'YouTube Music', values: [98, 85, 95, 60, 85, 90], color: '#ff0000' },
          { name: 'Amazon Music', values: [90, 65, 40, 75, 95, 80], color: '#ff9900' }
        ],
        maxValue: 100
      }
    },
    {
      type: 'timeline',
      title: 'Spotify\'s Efficiency Journey',
      data: {
        events: [
          { date: 'Jan 2023', title: 'First layoffs announced', description: '6% workforce reduction (~600 employees)', type: 'negative' },
          { date: 'Jun 2023', title: 'Second wave', description: 'Additional 2% cut, podcast studios closed', type: 'negative' },
          { date: 'Jul 2023', title: 'First price increase', description: 'US Premium: $9.99 → $10.99', type: 'positive' },
          { date: 'Oct 2023', title: 'Rogan deal restructured', description: 'Exclusivity removed; show goes to YouTube', type: 'neutral' },
          { date: 'Dec 2023', title: 'Third layoff round', description: '17% cut (~1,500 employees)', type: 'negative' },
          { date: 'Q1 2024', title: 'Profitability achieved', description: 'First consistently profitable quarters', type: 'positive' },
          { date: 'Jul 2024', title: 'Second price increase', description: 'US Premium: $10.99 → $11.99', type: 'positive' }
        ]
      }
    },
    {
      type: 'quote',
      title: 'Daniel Ek on Strategic Shift',
      data: {
        text: 'We got too focused on doing everything well, instead of doing the right things well. Our podcast investments didn\'t generate the returns we expected. We\'re now maniacally focused on profitability, and that means saying no to things we used to say yes to.',
        attribution: 'Daniel Ek',
        role: 'CEO, Spotify (Earnings Call, 2024)'
      }
    }
  ],
  'privatbank-cloud-migration-under-fire': [
    {
      type: 'timeline',
      title: 'PrivatBank Emergency Migration Timeline',
      data: {
        events: [
          { date: 'Feb 24, 2022', title: 'Russia invades Ukraine', description: 'Full-scale invasion begins; bank activates crisis protocols', type: 'negative' },
          { date: 'Feb 24-25', title: 'Assessment complete', description: '48-hour audit identifies critical systems and migration priorities', type: 'neutral' },
          { date: 'Feb 26-28', title: 'AWS infrastructure provisioned', description: 'Frankfurt and other EU data centers activated', type: 'positive' },
          { date: 'Week 1', title: 'Core banking systems migrated', description: 'Transaction processing, account management moved to cloud', type: 'positive' },
          { date: 'Week 2-3', title: 'Customer-facing systems', description: 'Mobile app backend, web banking, ATM networks reconnected', type: 'positive' },
          { date: 'Week 4', title: 'Full operational capability', description: 'All critical systems running from EU cloud infrastructure', type: 'positive' },
          { date: 'Mar-Apr 2022', title: 'Transaction volume surges', description: 'Refugee support, wartime payments processed without interruption', type: 'positive' }
        ]
      }
    },
    {
      type: 'enhanced_table',
      title: 'Migration Timeline: Normal vs. Wartime',
      data: {
        headers: ['Phase', 'Normal Timeline', 'PrivatBank Execution', 'Key Challenge'],
        rows: [
          ['Assessment', { value: '3-6 months', color: 'neutral' }, { value: '48 hours', color: 'positive' }, 'No time for documentation'],
          ['Infrastructure Setup', { value: '2-3 months', color: 'neutral' }, { value: '1 week', color: 'positive' }, 'Expedited AWS provisioning'],
          ['Core Banking Migration', { value: '12-18 months', color: 'neutral' }, { value: '3 weeks', color: 'positive' }, 'Legacy system adaptation'],
          ['Testing & Validation', { value: '3-6 months', color: 'neutral' }, { value: 'Continuous', color: 'warning' }, 'Production testing only'],
          ['Full Cutover', { value: '1-2 months', color: 'neutral' }, { value: 'Rolling', color: 'positive' }, 'Phased by criticality'],
          ['Total Duration', { value: '24-36 months', bold: true }, { value: '~4 weeks', bold: true, color: 'positive' }, '']
        ],
        highlightHeader: true
      }
    },
    {
      type: 'waterfall',
      title: 'PrivatBank Transaction Volume (Indexed, Feb-Jun 2022)',
      data: {
        steps: [
          { name: 'Pre-War Baseline', value: 100, isTotal: true },
          { name: 'Invasion Week Drop', value: -35 },
          { name: 'Migration Stabilization', value: 15 },
          { name: 'Refugee Support Surge', value: 25 },
          { name: 'Government Payments', value: 20 },
          { name: 'Economic Recovery', value: 15 },
          { name: 'Jun 2022 Level', value: 140, isTotal: true }
        ],
        unit: '%'
      }
    },
    {
      type: 'radar',
      title: 'Resilience Capability Assessment',
      data: {
        dimensions: ['Cloud Readiness', 'Staff Agility', 'AWS Partnership', 'Regulatory Flexibility', 'Technical Debt', 'Leadership Decisiveness'],
        entities: [
          { name: 'PrivatBank (Pre-War)', values: [45, 60, 70, 50, 40, 75], color: '#64748b' },
          { name: 'PrivatBank (Post-Migration)', values: [95, 95, 95, 85, 70, 98], color: '#3b82f6' }
        ],
        maxValue: 100
      }
    },
    {
      type: 'quote',
      title: 'Technology Leadership Reflection',
      data: {
        text: 'We had two choices: migrate in weeks or cease to exist. Every process designed for normal operations became irrelevant. We made decisions in hours that would normally take months of committee review. We had to trust our engineers and accept that perfection was impossible—survival was the only metric.',
        attribution: 'PrivatBank Technology Leadership',
        role: 'Post-migration interview (paraphrased)'
      }
    }
  ]
}

async function updateExhibits() {
  console.log('🎨 Updating case exhibits with enhanced visualizations...')
  
  const allExhibits = { ...caseExhibits, ...caseExhibits2, ...caseExhibits3 }
  
  for (const [slug, exhibits] of Object.entries(allExhibits)) {
    const caseRecord = await prisma.case.findUnique({
      where: { slug }
    })
    
    if (!caseRecord) {
      console.log(`⏭️  Case not found: ${slug}`)
      continue
    }
    
    // Delete existing exhibits
    await prisma.exhibit.deleteMany({
      where: { caseId: caseRecord.id }
    })
    
    // Create new exhibits
    await prisma.exhibit.createMany({
      data: exhibits.map((exhibit, index) => ({
        caseId: caseRecord.id,
        type: exhibit.type,
        title: exhibit.title,
        data: JSON.stringify(exhibit.data),
        order: index
      }))
    })
    
    console.log(`✅ Updated ${exhibits.length} exhibits for: ${caseRecord.title}`)
  }
  
  console.log('🎉 Exhibit update complete!')
}

updateExhibits()
  .catch(console.error)
  .finally(() => prisma.$disconnect())


