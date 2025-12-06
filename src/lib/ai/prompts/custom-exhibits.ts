/**
 * Custom Exhibits AI Prompt
 * 
 * This module provides AI guidance for creating custom interactive exhibits
 * using the template-based system. The AI selects from predefined templates
 * and populates them with case-specific content.
 */

export const CUSTOM_EXHIBITS_SYSTEM_PROMPT = `## Custom Interactive Exhibits

In addition to standard visualizations, create 1-2 CUSTOM interactive exhibits that provide unique, engaging learning experiences tailored specifically to this case. These should be the most memorable parts of the case study.

### Available Custom Templates

**custom_decision_simulator** - Decision Simulator
Put students in the role of a key decision-maker and let them navigate choices with consequences.
- Best for: Strategic decisions, leadership dilemmas, crisis management, ethical choices
- Max: 10 decision nodes
- Data format:
  {
    "type": "custom_decision_simulator",
    "title": "The CEO's Dilemma",
  "data": {
      "scenario": "It's March 2023. The board is pressuring you to...",
      "role": "CEO of Acme Corp",
      "startNodeId": "start",
      "nodes": [
        {
          "id": "start",
          "question": "The activist investor demands a response within 48 hours. What do you do?",
          "context": "Your stock has dropped 15% and the board is divided.",
          "options": [
            {
              "id": "fight",
              "label": "Fight the activist publicly",
              "description": "Issue a press release defending current strategy",
              "nextNodeId": "fight_result"
            },
            {
              "id": "negotiate",
              "label": "Open negotiations privately",
              "description": "Reach out through intermediaries",
              "outcome": {
                "title": "Successful Compromise",
                "description": "After intense negotiations, you reach a settlement...",
                "impact": "mixed",
                "metrics": [
                  { "label": "Board Seats Given", "value": "2", "change": "up" },
                  { "label": "Stock Price", "value": "+8%", "change": "up" }
                ],
                "realWorldNote": "This is similar to what happened at Company X in 2022."
              }
            }
          ]
        }
      ],
      "showRealOutcome": true,
      "realOutcome": "In reality, the CEO chose to negotiate and the company..."
    }
  }

**custom_data_explorer** - Data Explorer
Let students interactively filter, sort, and compare case data to draw their own conclusions.
- Best for: Financial analysis, competitive comparison, market segmentation, benchmarking
- Max: 50 rows, 10 columns
- Data format:
  {
    "type": "custom_data_explorer",
    "title": "Acquisition Target Comparison",
    "data": {
      "columns": [
        { "key": "company", "label": "Company", "type": "text" },
        { "key": "revenue", "label": "Revenue", "type": "currency", "sortable": true },
        { "key": "growth", "label": "Growth", "type": "percentage", "sortable": true, "highlight": "high" },
        { "key": "margin", "label": "Margin", "type": "percentage", "sortable": true }
      ],
      "rows": [
        { "id": "a", "company": "Target A", "revenue": 500000000, "growth": 25, "margin": 12 },
        { "id": "b", "company": "Target B", "revenue": 750000000, "growth": 10, "margin": 18 }
      ],
      "filters": [
        { "key": "growth", "label": "Growth Rate", "type": "range", "range": { "min": 0, "max": 50 } }
      ],
      "compareMode": true,
      "insights": [
        { "text": "Target A has the highest growth but lowest margins", "highlightRows": ["a"] }
      ]
    }
  }

**custom_reveal_cards** - Reveal Cards
Progressive disclosure of stakeholder perspectives, hidden information, or risk factors.
- Best for: Multiple viewpoints, stakeholder analysis, risk exploration, hidden information
- Max: 8 cards
- Data format:
  {
    "type": "custom_reveal_cards",
    "title": "Board Perspectives on the Merger",
    "data": {
      "prompt": "Click each card to reveal what each board member thought before the vote",
      "cards": [
        {
          "id": "ceo",
          "frontTitle": "CEO",
          "frontSubtitle": "John Smith",
          "frontIcon": "person",
          "backTitle": "Strongly in Favor",
          "backContent": "The CEO saw this as his legacy project and pushed hard for approval.",
          "backQuote": {
            "text": "This merger will define the next decade of our company.",
            "attribution": "John Smith, CEO"
          },
          "sentiment": "positive",
          "tags": ["Leadership", "Vision"]
        }
      ],
      "layout": "grid",
      "revealAll": true,
      "discussionPrompt": "Given these perspectives, whose concerns should have been given more weight?"
    }
  }

**custom_scenario_builder** - Scenario Builder
Let students construct their own strategy by selecting options within constraints.
- Best for: Strategy formulation, resource allocation, turnaround planning, portfolio optimization
- Max: 15 options
- Data format:
  {
    "type": "custom_scenario_builder",
    "title": "Design Your Turnaround Strategy",
    "data": {
      "prompt": "Select initiatives to execute within a $100M budget over 24 months",
      "categories": ["Cost Reduction", "Revenue Growth", "Operational"],
      "options": [
        {
          "id": "layoffs",
          "label": "Workforce Reduction",
          "description": "Reduce headcount by 15%",
          "category": "Cost Reduction",
          "cost": "$10M",
          "timeframe": "6 months",
          "risk": "medium",
          "impact": "high"
        }
      ],
      "constraints": [
        { "type": "budget", "label": "Budget", "maxValue": 100, "unit": "M" }
      ],
      "minSelections": 3,
      "maxSelections": 6,
      "feedback": [
        {
          "condition": { "type": "includes", "optionIds": ["layoffs", "expansion"] },
          "message": "Combining layoffs with expansion can send mixed signals to employees and investors.",
          "type": "warning"
        }
      ]
    }
  }

**custom_interactive_timeline** - Interactive Timeline
Explorable chronological events with expandable details and decision points.
- Best for: Crisis evolution, company history, M&A processes, market entry journeys
- Max: 15 events
- Data format:
  {
    "type": "custom_interactive_timeline",
    "title": "72 Hours That Changed Everything",
    "data": {
      "description": "Navigate through the crisis hour by hour",
      "events": [
        {
          "id": "e1",
          "date": "March 15, 9:00 AM",
          "title": "First Warning Signs",
          "description": "The CFO notices unusual patterns in customer withdrawals.",
          "type": "crisis",
          "details": [
            { "label": "Withdrawals", "value": "$50M above normal" },
            { "label": "Stock", "value": "Down 3%" }
          ],
          "decision": {
            "question": "What should leadership do?",
            "options": ["Investigate quietly", "Alert the board immediately", "Issue public statement"],
            "actualChoice": "Investigate quietly",
            "reasoning": "Leadership chose to gather facts before escalating."
          }
        }
      ],
      "layout": "vertical",
      "highlightDecisions": true,
      "showAlternatives": true
    }
  }

**custom_comparative_ranker** - Comparative Ranker
Students rank options and compare their reasoning against expert analysis.
- Best for: Strategic option evaluation, priority setting, investment decisions, risk assessment
- Max: 8 items
- Data format:
  {
    "type": "custom_comparative_ranker",
    "title": "Rank the Market Entry Strategies",
    "data": {
      "prompt": "Rank these market entry options from best to worst for Company X",
      "criteria": ["Speed to market", "Capital requirements", "Risk level", "Control"],
      "items": [
        {
          "id": "jv",
          "title": "Joint Venture",
          "description": "Partner with local firm to share risk and gain market knowledge",
          "pros": ["Lower capital requirement", "Local expertise"],
          "cons": ["Shared control", "Potential conflicts"],
          "metrics": [
            { "label": "Est. Investment", "value": "$50M" },
            { "label": "Time to Market", "value": "12 months" }
          ],
          "expertRank": 2,
          "expertReasoning": "Strong option given the regulatory complexity, but control issues make it second choice."
        }
      ],
      "showExpertRanking": true,
      "showReasoning": true
    }
  }

### Selection Guidelines for Custom Exhibits

Choose templates that will CREATE THE MOST ENGAGEMENT for this specific case:

1. **Decision Simulator**: When the case centers on a pivotal strategic decision with multiple viable paths. Great for CEO perspective-taking.

2. **Data Explorer**: When there's rich quantitative data students should analyze themselves rather than being told the answer.

3. **Reveal Cards**: When understanding multiple stakeholder perspectives is crucial to the case discussion.

4. **Scenario Builder**: When students should construct their own strategy rather than analyze an existing one.

5. **Interactive Timeline**: When chronology and the sequence of decisions/events matters significantly.

6. **Comparative Ranker**: When evaluating and prioritizing strategic options is the core learning objective.

### Quality Guidelines

1. **Be case-specific**: Content should feel uniquely designed for THIS case
2. **Create real engagement**: These should be the most memorable parts of the case
3. **Support learning objectives**: Each exhibit should reinforce key MBA concepts
4. **Provide meaningful feedback**: Let students see consequences of their choices
5. **Include expert perspective**: Where appropriate, show what actually happened or what experts recommend
6. **No em dashes**: NEVER use em dashes (—). Use regular hyphens (-), commas, colons, or rewrite sentences instead`
