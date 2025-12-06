// Finance Concepts (12 total)

export const financeConcepts = [
  {
    slug: 'dcf-valuation',
    name: 'DCF Valuation',
    category: 'Finance',
    description: 'Discounted Cash Flow analysis for determining intrinsic company value',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Discounted Cash Flow (DCF) valuation is a method of estimating the present value of an investment based on its expected future cash flows. It is one of the most widely used and academically rigorous valuation approaches, founded on the principle that the value of any asset is the present value of its future cash flows.',
      principles: [
        { title: 'Free Cash Flow Projection', description: 'Project future unlevered free cash flows (EBITDA - CapEx - Changes in Working Capital - Taxes) for 5-10 years.' },
        { title: 'Discount Rate (WACC)', description: 'Use Weighted Average Cost of Capital to discount future cash flows to present value.' },
        { title: 'Terminal Value', description: 'Calculate value beyond projection period using perpetuity growth or exit multiple method.' },
        { title: 'Enterprise Value', description: 'Sum of discounted FCFs plus discounted terminal value equals enterprise value.' },
        { title: 'Equity Value', description: 'Enterprise value minus net debt equals equity value (market cap).' }
      ],
      whenToUse: [
        'Valuing companies for M&A transactions',
        'Investment analysis and stock picking',
        'IPO pricing',
        'Private equity and venture capital',
        'Strategic planning and value creation'
      ],
      examples: [
        { company: 'Startup Valuation', description: 'Project 10 years of cash flows as company scales, use high WACC (15-20%) for risk, terminal value based on mature company metrics.' },
        { company: 'Mature Company', description: 'Stable cash flows, lower WACC (8-10%), terminal value represents 60-80% of total value.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'dcfFlow',
      steps: [
        { label: 'Project FCF', description: 'Years 1-5/10' },
        { label: 'Calculate WACC', description: 'Cost of capital' },
        { label: 'Discount FCFs', description: 'PV of cash flows' },
        { label: 'Terminal Value', description: 'Value beyond projection' },
        { label: 'Enterprise Value', description: 'Sum of PVs' },
        { label: 'Equity Value', description: 'EV - Net Debt' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'If a company has a WACC of 10% and you expect FCF to grow at 3% forever, what is the terminal value multiple applied to final year FCF?',
        options: ['7.7x', '10x', '14.3x', '33.3x'],
        correctIndex: 2,
        explanation: 'Terminal Value = FCF × (1+g) / (WACC-g) = FCF × 1.03 / 0.07 = FCF × 14.7x, or approximately 14.3x without the growth adjustment in numerator.'
      }
    ]),
    relatedIds: 'wacc,npv-irr,financial-ratios'
  },
  {
    slug: 'capital-structure',
    name: 'Capital Structure',
    category: 'Finance',
    description: 'The mix of debt and equity financing used by a company',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Capital structure refers to how a company finances its overall operations and growth through different sources of funds. It is typically a combination of long-term debt, short-term debt, common equity, and preferred equity. The optimal capital structure maximizes firm value by minimizing the weighted average cost of capital.",
      principles: [
        { title: 'Debt Financing', description: 'Borrowing money with contractual repayment obligations. Provides tax shield but increases financial risk.' },
        { title: 'Equity Financing', description: 'Selling ownership stakes. No repayment obligation but dilutes existing shareholders.' },
        { title: 'Trade-off Theory', description: 'Balance tax benefits of debt against costs of financial distress.' },
        { title: 'Pecking Order Theory', description: 'Companies prefer internal funds, then debt, then equity (in order of information asymmetry).' },
        { title: 'Leverage Ratios', description: 'Debt/Equity, Debt/EBITDA, Interest Coverage measure capital structure.' }
      ],
      whenToUse: [
        'Planning major financing decisions',
        'Evaluating optimal leverage levels',
        'M&A financing structure',
        'IPO and capital raising',
        'Credit analysis'
      ],
      examples: [
        { company: 'Apple', description: 'Despite $200B+ cash, uses debt financing for capital returns due to low interest rates and tax efficiency (repatriation).' },
        { company: 'Utilities', description: 'Highly levered (60-70% debt) due to stable cash flows, regulated returns, and substantial tax shields.' },
        { company: 'Tech Startups', description: 'Primarily equity financed due to negative cash flows and high growth/risk profile.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'capitalStructure',
      components: [
        { name: 'Senior Debt', position: 1, risk: 'Lowest', cost: 'Lowest', color: '#22c55e' },
        { name: 'Subordinated Debt', position: 2, risk: 'Low-Med', cost: 'Low-Med', color: '#84cc16' },
        { name: 'Preferred Equity', position: 3, risk: 'Medium', cost: 'Medium', color: '#fbbf24' },
        { name: 'Common Equity', position: 4, risk: 'Highest', cost: 'Highest', color: '#ef4444' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'All else equal, what happens to a firm\'s WACC as it adds more debt (up to a point)?',
        options: ['WACC increases', 'WACC decreases due to tax shield', 'WACC stays the same', 'Cannot determine'],
        correctIndex: 1,
        explanation: 'Debt is cheaper than equity and interest is tax-deductible. Adding moderate debt reduces WACC until financial distress costs outweigh benefits.'
      }
    ]),
    relatedIds: 'wacc,dcf-valuation,lbo-analysis'
  },
  {
    slug: 'working-capital-management',
    name: 'Working Capital Management',
    category: 'Finance',
    description: 'Managing short-term assets and liabilities for operational efficiency',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Working capital management involves managing the relationship between a firm's short-term assets and short-term liabilities to ensure sufficient liquidity for day-to-day operations. It focuses on inventory, accounts receivable, and accounts payable to optimize cash flow and operational efficiency.",
      principles: [
        { title: 'Working Capital = Current Assets - Current Liabilities', description: 'Measures short-term liquidity and operational capital needs.' },
        { title: 'Cash Conversion Cycle', description: 'Days Inventory Outstanding + Days Sales Outstanding - Days Payable Outstanding. Lower is better.' },
        { title: 'Inventory Management', description: 'Balance holding costs against stockout risks. Just-in-time vs. safety stock.' },
        { title: 'Receivables Management', description: 'Credit policy, collection efficiency, and factoring decisions.' },
        { title: 'Payables Management', description: 'Optimize payment timing to preserve cash while maintaining supplier relationships.' }
      ],
      whenToUse: [
        'Cash flow management and forecasting',
        'Operational efficiency improvement',
        'Supply chain financing decisions',
        'Seasonal business planning',
        'Financial distress prevention'
      ],
      examples: [
        { company: 'Amazon', description: 'Negative working capital model - collects from customers before paying suppliers. Cash conversion cycle of -30 days funds growth.' },
        { company: 'Dell (1990s-2000s)', description: 'Pioneered negative working capital in PC industry through direct sales model and supplier payment terms.' },
        { company: 'Traditional Retail', description: 'Positive working capital needs due to inventory investment before selling season.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'cashConversionCycle',
      components: [
        { name: 'Purchase Inventory', day: 0 },
        { name: 'Sell Inventory', day: 45, label: 'DIO: 45 days' },
        { name: 'Collect Cash', day: 75, label: 'DSO: 30 days' },
        { name: 'Pay Supplier', day: 60, label: 'DPO: 60 days' }
      ],
      ccc: '45 + 30 - 60 = 15 days'
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A company has DIO of 60 days, DSO of 45 days, and DPO of 30 days. What is its Cash Conversion Cycle?',
        options: ['15 days', '45 days', '75 days', '135 days'],
        correctIndex: 2,
        explanation: 'CCC = DIO + DSO - DPO = 60 + 45 - 30 = 75 days. The company needs to fund 75 days of operations.'
      }
    ]),
    relatedIds: 'financial-ratios,supply-chain-management,lean-operations'
  },
  {
    slug: 'mergers-acquisitions',
    name: 'Mergers & Acquisitions',
    category: 'Finance',
    description: 'Corporate transactions involving combining or acquiring companies',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Mergers and Acquisitions (M&A) refers to the consolidation of companies or assets through various types of financial transactions including mergers, acquisitions, consolidations, tender offers, purchase of assets, and management acquisitions.',
      principles: [
        { title: 'Synergy', description: 'Value created by combining companies: cost synergies (reduce expenses) and revenue synergies (grow sales).' },
        { title: 'Valuation', description: 'Determining fair price using DCF, comparable companies, and precedent transactions.' },
        { title: 'Deal Structure', description: 'Cash vs. stock consideration, asset vs. stock purchase, and financing arrangements.' },
        { title: 'Due Diligence', description: 'Comprehensive investigation of target company before finalizing transaction.' },
        { title: 'Integration', description: 'Post-merger combining of operations, cultures, and systems. Most value is created or destroyed here.' }
      ],
      whenToUse: [
        'Pursuing inorganic growth strategy',
        'Industry consolidation',
        'Acquiring capabilities or technology',
        'Entering new markets',
        'Creating economies of scale'
      ],
      examples: [
        { company: 'Disney + Pixar', description: 'Horizontal acquisition for creative talent and IP. $7.4B deal preserved Pixar culture while gaining distribution.' },
        { company: 'Amazon + Whole Foods', description: '$13.7B vertical integration into grocery. Physical retail presence and supply chain for Amazon.' },
        { company: 'AOL + Time Warner', description: 'Cautionary tale of failed merger integration and overvaluation during dot-com bubble.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'maProcess',
      phases: [
        { name: 'Strategy', items: ['Define objectives', 'Screen targets', 'Initial valuation'] },
        { name: 'Execution', items: ['Due diligence', 'Negotiation', 'Financing', 'Definitive agreement'] },
        { name: 'Integration', items: ['Day 1 planning', 'Synergy capture', 'Culture integration'] }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which type of synergy is generally easier to achieve and more certain?',
        options: ['Revenue synergies', 'Cost synergies', 'Both are equally achievable', 'Neither can be predicted'],
        correctIndex: 1,
        explanation: 'Cost synergies (eliminating duplicate functions, facilities) are more controllable than revenue synergies which depend on market response.'
      }
    ]),
    relatedIds: 'dcf-valuation,capital-structure,competitive-advantage'
  },
  {
    slug: 'npv-irr',
    name: 'NPV & IRR',
    category: 'Finance',
    description: 'Capital budgeting methods for evaluating investment decisions',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Net Present Value (NPV) and Internal Rate of Return (IRR) are capital budgeting techniques used to evaluate the profitability of investments or projects. NPV calculates the dollar value created; IRR calculates the percentage return.',
      principles: [
        { title: 'Net Present Value', description: 'Sum of present values of all cash flows. NPV > 0 means project creates value. Accept if positive.' },
        { title: 'Internal Rate of Return', description: 'Discount rate at which NPV equals zero. Accept if IRR > cost of capital.' },
        { title: 'Time Value of Money', description: 'A dollar today is worth more than a dollar tomorrow due to investment opportunity.' },
        { title: 'Discount Rate Selection', description: 'Use WACC or project-specific hurdle rate based on risk.' },
        { title: 'NPV vs IRR Conflicts', description: 'When projects have different scales or timing, NPV is more reliable.' }
      ],
      whenToUse: [
        'Evaluating capital investments',
        'Project selection and prioritization',
        'Make vs. buy decisions',
        'Expansion decisions',
        'Equipment replacement analysis'
      ],
      examples: [
        { company: 'Factory Expansion', description: 'Initial investment $10M, annual cash flows $3M for 5 years. At 10% discount rate, NPV = $1.37M (accept). IRR = 15.2% > 10% (accept).' },
        { company: 'R&D Project', description: 'Higher uncertainty requires higher discount rate (e.g., 20%), reducing NPV and raising acceptance threshold.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'npvIrr',
      formula: 'NPV = Σ [CFt / (1+r)^t] - Initial Investment',
      irrDefinition: 'IRR: Rate r where NPV = 0'
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Project A has NPV of $2M and IRR of 15%. Project B has NPV of $1.5M and IRR of 25%. If you can only choose one and they are mutually exclusive, which should you choose?',
        options: ['Project A (higher NPV)', 'Project B (higher IRR)', 'Need more information', 'Either is acceptable'],
        correctIndex: 0,
        explanation: 'For mutually exclusive projects, NPV is the correct decision rule as it measures absolute value creation. IRR can mislead with different project scales.'
      }
    ]),
    relatedIds: 'dcf-valuation,wacc,capital-structure'
  },
  {
    slug: 'wacc',
    name: 'WACC',
    category: 'Finance',
    description: 'Weighted Average Cost of Capital - the blended cost of financing',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: "WACC (Weighted Average Cost of Capital) represents a firm's average after-tax cost of capital from all sources, including common stock, preferred stock, bonds, and other forms of debt. It is used as a discount rate for evaluating investments and represents the minimum return a company must earn on its existing assets.",
      principles: [
        { title: 'Cost of Equity', description: 'Return required by equity investors. Calculated using CAPM: Rf + β(Rm - Rf).' },
        { title: 'Cost of Debt', description: 'Interest rate on debt, adjusted for tax benefit: Rd × (1 - Tax Rate).' },
        { title: 'Capital Weights', description: 'Proportion of each capital source based on market values, not book values.' },
        { title: 'Formula', description: 'WACC = (E/V × Re) + (D/V × Rd × (1-T)) where E=equity, D=debt, V=total value.' },
        { title: 'Hurdle Rate', description: 'WACC serves as minimum acceptable return for average-risk projects.' }
      ],
      whenToUse: [
        'DCF valuation discount rate',
        'Capital budgeting hurdle rates',
        'Evaluating capital structure decisions',
        'M&A and investment analysis',
        'Performance measurement (EVA)'
      ],
      examples: [
        { company: 'Typical Calculation', description: 'Cost of equity 12%, Cost of debt 6%, Tax rate 25%, D/E ratio 0.5. WACC = (67%×12%) + (33%×6%×75%) = 8% + 1.5% = 9.5%' },
        { company: 'By Industry', description: 'Utilities: 5-7% (low risk, high leverage). Tech: 10-15% (high risk, low leverage). Banks: 8-12%.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'waccFormula',
      components: [
        { name: 'Cost of Equity', formula: 'Re = Rf + β(Rm - Rf)', weight: 'E/V' },
        { name: 'After-tax Cost of Debt', formula: 'Rd × (1-T)', weight: 'D/V' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'If a company increases its proportion of debt financing, what typically happens to WACC (assuming moderate leverage)?',
        options: ['WACC increases', 'WACC decreases', 'WACC stays the same', 'Depends on interest rates'],
        correctIndex: 1,
        explanation: 'Debt is cheaper than equity due to tax deductibility of interest. Adding moderate debt typically reduces WACC until financial distress risk becomes significant.'
      }
    ]),
    relatedIds: 'dcf-valuation,capital-structure,npv-irr'
  },
  {
    slug: 'financial-ratios',
    name: 'Financial Ratios',
    category: 'Finance',
    description: 'Quantitative metrics for analyzing company performance and health',
    difficulty: 'beginner',
    content: JSON.stringify({
      definition: 'Financial ratios are quantitative measures derived from financial statements used to evaluate various aspects of a company including profitability, liquidity, solvency, efficiency, and valuation. They enable comparison across time periods, competitors, and industries.',
      principles: [
        { title: 'Profitability Ratios', description: 'Gross Margin, Operating Margin, Net Margin, ROE, ROA - measure profit generation.' },
        { title: 'Liquidity Ratios', description: 'Current Ratio, Quick Ratio - measure ability to meet short-term obligations.' },
        { title: 'Leverage Ratios', description: 'Debt/Equity, Debt/EBITDA, Interest Coverage - measure financial risk.' },
        { title: 'Efficiency Ratios', description: 'Asset Turnover, Inventory Turnover, Receivables Turnover - measure operational efficiency.' },
        { title: 'Valuation Ratios', description: 'P/E, EV/EBITDA, P/B - measure market pricing relative to fundamentals.' }
      ],
      whenToUse: [
        'Company financial analysis',
        'Credit analysis and lending decisions',
        'Investment research and stock selection',
        'Benchmarking against competitors',
        'Management performance evaluation'
      ],
      examples: [
        { company: 'DuPont Analysis', description: 'ROE = Net Margin × Asset Turnover × Equity Multiplier. Decomposes return on equity into profitability, efficiency, and leverage.' },
        { company: 'Industry Comparison', description: 'Retail: Low margins, high turnover. Luxury goods: High margins, low turnover. Software: High margins, asset-light.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'ratioCategories',
      categories: [
        { name: 'Profitability', ratios: ['Gross Margin', 'Operating Margin', 'ROE', 'ROA'], color: '#22c55e' },
        { name: 'Liquidity', ratios: ['Current Ratio', 'Quick Ratio', 'Cash Ratio'], color: '#3b82f6' },
        { name: 'Leverage', ratios: ['Debt/Equity', 'Interest Coverage', 'Debt/EBITDA'], color: '#f97316' },
        { name: 'Efficiency', ratios: ['Asset Turnover', 'Inventory Turnover', 'DSO'], color: '#8b5cf6' },
        { name: 'Valuation', ratios: ['P/E', 'EV/EBITDA', 'P/B', 'P/S'], color: '#ec4899' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A company has current assets of $100M and current liabilities of $80M. What is its current ratio and what does it indicate?',
        options: ['0.8x - potential liquidity issues', '1.25x - adequate short-term liquidity', '20% - strong profitability', '80% - high leverage'],
        correctIndex: 1,
        explanation: 'Current Ratio = Current Assets / Current Liabilities = $100M / $80M = 1.25x. Values above 1.0 indicate ability to cover short-term obligations.'
      }
    ]),
    relatedIds: 'working-capital-management,dcf-valuation,capital-structure'
  },
  {
    slug: 'lbo-analysis',
    name: 'LBO Analysis',
    category: 'Finance',
    description: 'Leveraged Buyout modeling for private equity transactions',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'A Leveraged Buyout (LBO) is the acquisition of a company using a significant amount of borrowed money (leverage) to meet the cost of acquisition. The assets of the company being acquired are often used as collateral for the loans. LBO analysis models the returns achievable by a financial sponsor.',
      principles: [
        { title: 'Use of Leverage', description: 'Typically 50-70% debt financing. Magnifies equity returns but increases risk.' },
        { title: 'Debt Paydown', description: 'Company cash flows used to pay down acquisition debt over holding period.' },
        { title: 'Multiple Expansion', description: 'Potential value creation if exit multiple exceeds entry multiple.' },
        { title: 'IRR Targeting', description: 'PE firms typically target 20-25%+ IRR over 3-7 year holding periods.' },
        { title: 'Good LBO Candidates', description: 'Stable cash flows, asset base for collateral, operational improvement potential, defensible market position.' }
      ],
      whenToUse: [
        'Private equity deal evaluation',
        'Understanding PE acquisition prices',
        'Evaluating take-private transactions',
        'Financing structure optimization',
        'Returns sensitivity analysis'
      ],
      examples: [
        { company: 'Typical LBO Structure', description: '$100M purchase. 40% equity ($40M), 60% debt ($60M). 5-year hold. Exit at same multiple. If debt paid to $30M, equity value = $70M. Return = 75% or ~12% IRR.' },
        { company: 'Famous LBOs', description: 'RJR Nabisco (1989): $25B. Hilton Hotels (2007): $26B. Dell (2013): $24B.' }
      ]
    }),
    diagramType: 'custom',
    diagramData: JSON.stringify({
      type: 'lboReturns',
      sources: ['Debt Paydown', 'EBITDA Growth', 'Multiple Expansion'],
      waterfall: [
        { name: 'Initial Equity', value: 40 },
        { name: 'Debt Paydown', value: 15, type: 'add' },
        { name: 'EBITDA Growth', value: 20, type: 'add' },
        { name: 'Multiple Expansion', value: 10, type: 'add' },
        { name: 'Exit Equity', value: 85 }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'In an LBO, which of these is NOT a typical source of equity returns?',
        options: ['Debt paydown from company cash flows', 'Multiple expansion at exit', 'Dividend payments from the PE firm', 'EBITDA growth from operational improvements'],
        correctIndex: 2,
        explanation: 'LBO returns come from debt paydown, multiple expansion, and EBITDA growth. Dividends flow TO the PE firm from the company, not from the firm.'
      }
    ]),
    relatedIds: 'capital-structure,dcf-valuation,mergers-acquisitions'
  },
  {
    slug: 'revenue-recognition',
    name: 'Revenue Recognition',
    category: 'Finance',
    description: 'Accounting principles for when and how revenue is recorded',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Revenue recognition is an accounting principle that determines when revenue should be recorded in financial statements. Under ASC 606 / IFRS 15, revenue is recognized when control of goods or services transfers to the customer in an amount that reflects expected consideration.',
      principles: [
        { title: 'Five-Step Model', description: '1) Identify contract 2) Identify performance obligations 3) Determine transaction price 4) Allocate price 5) Recognize when satisfied.' },
        { title: 'Performance Obligations', description: 'Promises to transfer distinct goods/services. Revenue recognized as each is satisfied.' },
        { title: 'Point in Time vs Over Time', description: 'Recognize at a point (product delivery) or over time (service contracts, construction).' },
        { title: 'Variable Consideration', description: 'Estimate and constrain variable amounts like bonuses, returns, discounts.' },
        { title: 'Contract Modifications', description: 'Changes in scope/price may require revised revenue allocation.' }
      ],
      whenToUse: [
        'Financial statement preparation',
        'Understanding SaaS/subscription metrics',
        'Analyzing reported vs. cash earnings',
        'Contract structuring',
        'Due diligence and auditing'
      ],
      examples: [
        { company: 'SaaS Company', description: 'Annual subscription $12,000 paid upfront. Recognized $1,000/month over 12 months as service is delivered. Deferred revenue = remaining obligation.' },
        { company: 'Construction Company', description: 'Percentage of completion method. 3-year project, 40% complete in Year 1 = recognize 40% of contract value as revenue.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'revenueRecognition',
      steps: [
        { step: 1, label: 'Identify Contract', description: 'Agreement with enforceable rights/obligations' },
        { step: 2, label: 'Identify Performance Obligations', description: 'Distinct promises in contract' },
        { step: 3, label: 'Determine Transaction Price', description: 'Amount expected to receive' },
        { step: 4, label: 'Allocate Price', description: 'To each performance obligation' },
        { step: 5, label: 'Recognize Revenue', description: 'When obligation is satisfied' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'A SaaS company receives $24,000 for a 2-year software subscription on January 1. How much revenue should be recognized in Year 1?',
        options: ['$24,000', '$12,000', '$0', '$6,000'],
        correctIndex: 1,
        explanation: 'Revenue is recognized ratably over the service period. $24,000 / 24 months = $1,000/month. Year 1 = $12,000.'
      }
    ]),
    relatedIds: 'financial-ratios,working-capital-management,dcf-valuation'
  },
  {
    slug: 'corporate-governance',
    name: 'Corporate Governance',
    category: 'Finance',
    description: 'Systems and processes for directing and controlling companies',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: 'Corporate governance refers to the system of rules, practices, and processes by which a company is directed and controlled. It involves balancing the interests of stakeholders including shareholders, management, customers, suppliers, financiers, government, and the community.',
      principles: [
        { title: 'Board of Directors', description: 'Elected by shareholders to oversee management. Mix of inside and independent directors.' },
        { title: 'Shareholder Rights', description: 'Voting rights, dividend rights, information access, and ability to influence decisions.' },
        { title: 'Executive Compensation', description: 'Aligning management incentives with shareholder interests through appropriate pay structures.' },
        { title: 'Transparency & Disclosure', description: 'Accurate, timely financial reporting and material information disclosure.' },
        { title: 'Internal Controls', description: 'Processes ensuring accurate reporting, compliance, and operational effectiveness.' }
      ],
      whenToUse: [
        'Evaluating investment risk',
        'Assessing management quality',
        'Understanding shareholder activism',
        'Regulatory compliance',
        'ESG (Environmental, Social, Governance) analysis'
      ],
      examples: [
        { company: 'Enron Scandal', description: 'Governance failures including board oversight, auditor independence, and executive integrity led to massive fraud and bankruptcy.' },
        { company: 'Activist Campaigns', description: 'Shareholders like Carl Icahn or Elliott Management push for governance changes, board seats, or strategic shifts.' }
      ]
    }),
    diagramType: 'pyramid',
    diagramData: JSON.stringify({
      levels: [
        { label: 'Shareholders', description: 'Owners who elect board', color: '#22c55e' },
        { label: 'Board of Directors', description: 'Oversees management', color: '#3b82f6' },
        { label: 'Executive Management', description: 'Runs day-to-day operations', color: '#8b5cf6' },
        { label: 'Employees & Operations', description: 'Execute strategy', color: '#f97316' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Which of these is considered a best practice in corporate governance?',
        options: ['CEO also serving as Board Chairman', 'Board composed entirely of inside directors', 'Independent audit committee', 'Executive compensation not disclosed'],
        correctIndex: 2,
        explanation: 'Independent audit committee oversight is a key governance best practice. Separation of CEO/Chairman and independent directors also improve governance.'
      }
    ]),
    relatedIds: 'stakeholder-management,financial-ratios,mergers-acquisitions'
  },
  {
    slug: 'real-options',
    name: 'Real Options',
    category: 'Finance',
    description: 'Valuing flexibility in investment decisions using options theory',
    difficulty: 'advanced',
    content: JSON.stringify({
      definition: 'Real options analysis applies financial options valuation techniques to capital budgeting decisions. It recognizes that management has flexibility to adapt and revise decisions as uncertainty resolves over time, which has value not captured by traditional NPV.',
      principles: [
        { title: 'Option to Expand', description: 'Right to increase investment/capacity if conditions are favorable.' },
        { title: 'Option to Abandon', description: 'Right to exit project and salvage value if conditions deteriorate.' },
        { title: 'Option to Defer', description: 'Right to wait and invest later when uncertainty is resolved.' },
        { title: 'Option to Switch', description: 'Flexibility to change inputs, outputs, or technology.' },
        { title: 'Staging Options', description: 'Breaking investment into phases, each contingent on prior success.' }
      ],
      whenToUse: [
        'High uncertainty projects',
        'R&D and pharmaceutical development',
        'Natural resource investments',
        'Strategic platform investments',
        'Venture capital staging'
      ],
      examples: [
        { company: 'Pharmaceutical R&D', description: 'Each clinical trial phase is an option. Company can abandon if results are poor, continue if promising. Stage-gate approach.' },
        { company: 'Oil Exploration', description: 'Option to develop discovered reserves. Wait for higher oil prices or abandon if uneconomic.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'decisionTree',
      nodes: [
        { id: 'invest', label: 'Initial Investment', type: 'decision' },
        { id: 'good', label: 'Good Outcome', type: 'chance', probability: '60%' },
        { id: 'bad', label: 'Bad Outcome', type: 'chance', probability: '40%' },
        { id: 'expand', label: 'Expand', type: 'option' },
        { id: 'abandon', label: 'Abandon', type: 'option' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'When is real options analysis most valuable compared to traditional NPV?',
        options: ['Low uncertainty, no flexibility', 'High uncertainty, management flexibility exists', 'Certain cash flows, no optionality', 'Short-term projects'],
        correctIndex: 1,
        explanation: 'Real options value comes from flexibility under uncertainty. When outcomes are certain or flexibility is limited, traditional NPV is sufficient.'
      }
    ]),
    relatedIds: 'npv-irr,dcf-valuation,scenario-planning'
  },
  {
    slug: 'dividend-policy',
    name: 'Dividend Policy',
    category: 'Finance',
    description: 'Corporate decisions on distributing profits to shareholders',
    difficulty: 'intermediate',
    content: JSON.stringify({
      definition: "Dividend policy refers to a company's approach to distributing profits to shareholders. It involves decisions about whether to pay dividends, how much to pay, and how to balance dividends against retained earnings for reinvestment.",
      principles: [
        { title: 'Dividend Irrelevance (M&M)', description: 'In perfect markets, dividend policy does not affect firm value. Investors can create "homemade dividends."' },
        { title: 'Bird in Hand Theory', description: 'Investors may prefer certain dividends over uncertain capital gains, supporting higher dividends.' },
        { title: 'Signaling Effect', description: 'Dividend changes signal management confidence. Cuts are particularly negative signals.' },
        { title: 'Clientele Effect', description: 'Different investor groups prefer different dividend policies based on tax situations and income needs.' },
        { title: 'Payout Alternatives', description: 'Share buybacks as alternative to dividends, often more tax-efficient.' }
      ],
      whenToUse: [
        'Corporate capital allocation decisions',
        'Understanding stock price reactions',
        'Investment analysis of income stocks',
        'Tax planning for investors',
        'Balancing growth vs. income'
      ],
      examples: [
        { company: 'Dividend Aristocrats', description: 'Companies like P&G, Coca-Cola that have increased dividends for 25+ consecutive years. Signal stability and commitment.' },
        { company: 'Tech Companies', description: 'Historically no dividends (reinvest all profits). Apple started dividends in 2012 as it matured and generated excess cash.' }
      ]
    }),
    diagramType: 'flow',
    diagramData: JSON.stringify({
      type: 'dividendDecision',
      factors: [
        { name: 'Investment Opportunities', influence: 'More opportunities → Lower dividend' },
        { name: 'Cash Flow Stability', influence: 'More stable → Higher dividend sustainable' },
        { name: 'Tax Considerations', influence: 'Lower div tax → Dividend preferred' },
        { name: 'Shareholder Preferences', influence: 'Income investors → Higher dividend' },
        { name: 'Debt Covenants', influence: 'Restrictions may limit dividends' }
      ]
    }),
    exercises: JSON.stringify([
      {
        type: 'quiz',
        question: 'Why might a company choose share buybacks over dividends?',
        options: ['Buybacks are mandatory while dividends are optional', 'Buybacks are typically more tax-efficient for shareholders', 'Buybacks always increase stock price more', 'Dividends require board approval while buybacks do not'],
        correctIndex: 1,
        explanation: 'Buybacks allow shareholders to defer capital gains taxes. Dividends are taxed immediately when paid.'
      }
    ]),
    relatedIds: 'capital-structure,corporate-governance,financial-ratios'
  }
]


