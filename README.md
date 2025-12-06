# A Case A Day

Transform current business events into publication-quality MBA case studies within hours.

## Product Requirements Document

### Vision
Transform current business events into publication-quality MBA case studies within hours, delivering daily learning opportunities that keep business education relevant, engaging, and accessible.

### Core Features (MVP - Phase 1)

#### Operator Portal
- **Simplified Case Creation**: Just paste a link or article - AI auto-detects company, industry, and concepts
- **Case Categories** (NEW): Classify cases as "Daily" (news-driven) or "Canonical" (classic comprehensive)
  - Daily cases: Set featured date for "Today's Case" hero
  - Canonical cases: Assign track, skills, and difficulty level
  - Category filtering in case management view
- **Bulk Case Generation**: AI researches and suggests 10+ case ideas based on company, concept, path, or year
- **Concurrent Generation**: Generate multiple cases simultaneously with real-time progress tracking
- AI-powered research engine for company/market data collection
- Case generation with exhibits and questions
- Preview and editing workflow before publication
- Simple concept tracking dashboard
- **Prompt Registry**: Version-controlled prompts with A/B testing support

#### Student Experience
- Publication-quality case studies at HBS standards
- Rich visual exhibits (financial tables, charts, diagrams)
- **Case Categories** (NEW):
  - **Daily Cases**: News-driven cases reflecting recent business events with "Today's Case" hero section
  - **Canonical Cases**: Classic, comprehensive case studies with track, skill, and difficulty metadata
  - Redesigned browse experience with Recent Daily Cases carousel and Classic Cases Library
  - Enhanced filtering by track, skill, difficulty, industry, and concept
- **Interactive Graded Questions**:
  - Multiple choice with instant auto-grading
  - Free text with AI-powered grading and feedback
  - Ranking/ordering with drag-and-drop
  - Framework application (Porter's Five Forces, SWOT, etc.)
  - Progress tracking and score display
  - Exemplary answers revealed after submission
- Mobile-responsive design
- Filtering and search by industry/concept

#### Concept Library (NEW)
- Interactive learning pages for 60 MBA concepts
- Visual framework diagrams (matrices, flows, pyramids, funnels)
- Hands-on exercises (quizzes, drag-drop, scenario analysis)
- Cross-linked to related case studies
- Organized by 6 categories: Strategy, Finance, Marketing, Operations, Leadership, Economics

## Tech Stack

- **Framework**: Next.js 14+ with App Router and TypeScript
- **Database**: PostgreSQL with Prisma ORM (Neon for production)
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI (GPT-4) and Anthropic (Claude)
- **Styling**: Tailwind CSS
- **Charts**: Recharts with custom editorial styling
- **Animations**: Framer Motion
- **Color System**: chroma-js for dynamic palette generation

## Exhibit Design System (v2.0)

The exhibit system has been redesigned with publication-quality aesthetics inspired by The Economist and NY Times.

### Key Features

#### Dynamic Brand Color Palette
- Each case study derives its color palette from the company's brand color
- AI extracts brand colors during case generation
- Color theory-based palette generation (complementary, split-complementary)
- Semantic colors (positive/negative/neutral) remain consistent for data meaning

#### Editorial Design Language
- Consistent typography using Source Serif for labels, system sans for values
- Generous whitespace and refined visual hierarchy
- Subtle animations via Framer Motion
- Print-inspired decorative elements

#### NYT-Inspired Custom Exhibits
- Decision Simulator with branching outcomes
- Reveal Cards with 3D flip animations
- Comparative Ranker with drag-and-drop
- Scenario Builder with constraint visualization
- What-If Calculator with live number morphing

### Color Palette Structure

```typescript
interface ColorPalette {
  primary: string        // Brand color
  secondary: string      // Complementary color
  accent: string         // Split-complementary highlight
  scale: string[]        // 8 harmonious chart colors
  positive: string       // Green (always #059669)
  negative: string       // Red (always #dc2626)
  neutral: string        // Amber (always #d97706)
}
```

### Usage

Brand color is automatically passed to exhibits:

```tsx
<ExhibitRenderer 
  exhibit={exhibit} 
  index={1} 
  brandColor={caseData.brandColor} 
  companyName={caseData.company} 
/>
```

All chart components access the palette via the `useExhibitPalette()` hook.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository and navigate to the project:
```bash
cd a-case-a-day
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create a `.env` file):
```bash
# Database (use SQLite locally, PostgreSQL in production)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="generate-a-random-secret-at-least-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# AI Providers (at least one required)
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Google AI (for illustrations)
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Tavily (for web research - optional)
TAVILY_API_KEY="your-tavily-api-key"
```

4. Initialize the database:
```bash
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Default Credentials

Operator portal login:
- Email: `operator@acaseaday.com`
- Password: `operator123`

Student login (for testing interactive questions):
- Email: `student@acaseaday.com`
- Password: `student123`

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Student-facing routes
│   │   ├── cases/          # Case archive and viewer
│   │   └── concepts/       # Concept library
│   │       └── [slug]/     # Individual concept pages
│   ├── (operator)/         # Protected operator routes
│   │   └── operator/
│   │       ├── dashboard/  # Analytics dashboard
│   │       └── cases/      # Case management
│   │           ├── new/    # Simplified single case creation
│   │           └── bulk/   # Bulk case generation
│   ├── api/                # API routes
│   │   ├── cases/
│   │   │   ├── analyze/    # Auto-detect company, industry, concepts
│   │   │   ├── generate/   # Generate case with auto-detection
│   │   │   ├── jobs/       # Generation job tracking
│   │   │   └── research-ideas/  # Bulk case research
│   │   └── concepts/       # Fetch all concepts
│   └── login/              # Authentication
├── components/
│   ├── case/               # Case display components
│   ├── concept/            # Concept library components (NEW)
│   │   ├── diagrams/       # Visual framework components
│   │   └── exercises/      # Interactive exercise components
│   ├── operator/           # Operator portal components
│   └── ui/                 # Shared UI primitives
├── lib/
│   ├── ai/                 # AI provider abstraction
│   │   ├── providers/      # OpenAI & Anthropic implementations
│   │   └── prompts/        # Prompt templates (incl. protagonist.ts)
│   ├── auth/               # Authentication config
│   └── db/                 # Prisma client
└── prisma/
    └── concept-data/       # MBA concept seed data (NEW)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with concepts and test user
- `npm run db:seed-concepts` - Seed all 60 MBA concepts with rich content
- `npm run db:seed-cases` - Seed all 10 case studies with enhanced exhibits
- `npm run db:studio` - Open Prisma Studio

## Setup After Schema Changes

If you've pulled updates with new database schema:

```bash
# Push schema changes to database
npm run db:push

# If you want to seed default prompt versions
npx tsx -e "import { seedDefaultPrompts } from './src/lib/prompts/registry'; seedDefaultPrompts()"
```

## Exhibit Types Library (30+ Types)

The platform includes an extensive library of exhibit types. The AI intelligently selects the best visualization based on the case content.

### Charts (19 types)
| Type | Best For |
|------|----------|
| **chart** | Auto-selects bar/line/pie based on data |
| **area_chart** | Cumulative values, volume trends |
| **stacked_bar** | Part-to-whole, segment breakdown |
| **waterfall** | Bridge analysis, variance decomposition |
| **funnel** | Conversion funnels, process attrition |
| **treemap** | Hierarchical composition, portfolios |
| **heatmap** | Correlation matrices, comparison grids |
| **radar** | Multi-attribute comparison (5-8 dims) |
| **positioning** | 2x2 strategic positioning maps |
| **bubble** | Three-variable scatter analysis |
| **combo** | Dual-axis bar + line charts |
| **slope** | Period-to-period ranking changes |
| **lollipop** | Clean ranking comparisons |
| **donut** | Part-to-whole with center metric |
| **histogram** | Statistical distribution |
| **candlestick** | Financial OHLC data |
| **dumbbell** | Before/after comparisons |
| **gauge** | Single KPI with target |
| **bullet** | Multiple KPIs vs targets |

### Tables (4 types)
| Type | Best For |
|------|----------|
| **table** | Basic data display |
| **enhanced_table** | Financial statements with formatting, trends, colors |
| **data_table** | Large sortable/filterable/exportable datasets |
| **comparison_grid** | Multi-entity competitive analysis |

### Flow & Process (4 types)
| Type | Best For |
|------|----------|
| **timeline** | Chronological events with status |
| **sankey** | Value flows between nodes |
| **process_flow** | Step-by-step processes |
| **drilldown** | Hierarchical click-to-explore |

### Text & Narrative (6 types)
| Type | Best For |
|------|----------|
| **quote** | Key stakeholder statements |
| **quote_comparison** | Contrasting viewpoints |
| **callout** | Key insights, warnings |
| **stat_highlight** | Big impact numbers |
| **source_excerpt** | Document extracts with highlights |
| **pro_con** | Trade-off analysis |

### Interactive (4 types)
| Type | Best For |
|------|----------|
| **metric_card** | Single KPI with sparkline |
| **metric_grid** | Dashboard of KPIs |
| **scenario_calculator** | What-if sensitivity analysis |
| **diagram** | Simple concept illustrations |

All library exhibits support hover interactivity and are optimized for both screen and print.

## Interactive Questions System

The platform features a comprehensive interactive questions system that transforms static discussion questions into graded, interactive assessments.

### Question Types

| Type | Auto-Grade | Features |
|------|------------|----------|
| **Multiple Choice** | Yes | 4 options, instant feedback, visual correct/incorrect indicators |
| **Free Text** | AI | Rubric-based grading, detailed feedback on strengths/weaknesses |
| **Ranking** | Yes | Drag-and-drop ordering, partial credit scoring |
| **Framework Application** | AI | Apply specific MBA frameworks (Porter's Five Forces, SWOT, etc.) |

### Grading System

- **Auto-Graded Questions**: Multiple choice and ranking questions are graded instantly
- **AI-Graded Questions**: Free text and framework questions use AI to evaluate against rubrics
- **Score Scale**: 1-10 with descriptive labels (Excellent, Good, Satisfactory, etc.)
- **Feedback**: All questions provide feedback on submission

### Exemplary Answers

Every question includes a model answer that is revealed:
- After the student submits their response
- On demand via "Show Exemplary Answer" button
- To help students learn from comparison with expert analysis

### Progress Tracking

- User responses are persisted across sessions
- Progress bar shows completion status per case
- Average score displayed for completed questions
- Requires authentication to save progress

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/questions/[id]/submit` | POST | Submit and grade a response |
| `/api/questions/[id]/response` | GET | Get user's existing response |
| `/api/questions/[id]/response` | DELETE | Clear response to retry |
| `/api/cases/[id]/responses` | GET | Get all responses for a case |

### Database Schema

```prisma
model Question {
  type            String    // multiple_choice, free_text, ranking, framework_application
  options         String?   // JSON array for MC/ranking
  correctAnswer   String?   // JSON for auto-graded questions
  exemplaryAnswer String?   // Model answer
  rubric          String?   // JSON grading criteria
  frameworkType   String?   // MBA framework for framework_application
  responses       QuestionResponse[]
}

model QuestionResponse {
  questionId String
  userId     String
  response   String    // JSON of user's answer
  score      Int?      // 1-10 score
  feedback   String?   // AI-generated feedback
  gradedAt   DateTime?
}
```

### Question Generation

AI generates a mix of question types for each case:
- At least 1 multiple choice question (factual understanding)
- At least 1 free text question (deeper analysis)
- At least 1 ranking OR framework application question
- Mix of difficulties: 1-2 easy, 2-3 medium, 1-2 hard

### Migration Script

To update existing questions to the new format:
```bash
npx tsx prisma/migrate-questions.ts
```

### Exhibit Variety System

The platform ensures variety in exhibit types both within a single case and across multiple cases over time. This prevents the AI from repeatedly using the same exhibit types and keeps the case library fresh and engaging.

#### Within-Case Variety
- Minimum 4 different exhibit types per case
- At least 3 different categories covered (chart, table, text, flow, interactive)
- No more than 2 exhibits of the same type per case

#### Cross-Case Variety
The system analyzes the last 5 published cases and:
- Identifies **overused types** (used 3+ times recently) to avoid
- Highlights **fresh types** (not used recently) to prefer
- Provides guidance to the AI while allowing flexibility when a specific type is truly the best fit

#### Variety Scoring
Each generated exhibit set receives a variety score (0-100) based on:
- Unique types used (30%)
- Category spread (30%)
- Fresh choices (20%)
- Avoiding overused types (20%)

#### Philosophy
**Quality trumps variety for specialized use cases.** If a candlestick chart is genuinely the best visualization for stock data, the system allows it even if candlestick was recently used. The system guides toward variety but doesn't force suboptimal choices.

## Case Categories System

The platform distinguishes between two types of cases to serve different learning needs:

### Daily Cases
- **Purpose**: News-driven cases reflecting recent business events
- **Scheduling**: Each daily case has a `publishedDate` when it becomes "Today's Case"
- **Display**: Featured prominently in a hero section on the cases page
- **Recent Cases**: Past 14 days shown in a horizontal carousel
- **Ideal for**: Current events discussion, staying up-to-date with business news

### Canonical Cases (Classic Cases Library)
- **Purpose**: Comprehensive, timeless case studies for deep learning
- **Metadata**:
  - **Track**: Core, Finance, Marketing, Strategy, Operations, Leadership
  - **Skills**: Quantitative Analysis, Strategic Thinking, Communication, Leadership, Problem Solving, etc.
  - **Difficulty**: Beginner, Intermediate, Advanced
- **Display**: Filterable grid with robust search and filtering
- **Ideal for**: Structured curriculum, exam prep, focused skill development

### Database Schema

```prisma
model Case {
  // ... existing fields ...
  
  // Case categorization
  category      String   @default("daily")       // "daily" or "canonical"
  publishedDate DateTime?                        // Featured date for daily cases
  
  // Canonical case metadata
  track         String?                          // Core, Finance, Marketing, etc.
  skill         String?                          // Comma-separated skills
  difficulty    String   @default("intermediate") // beginner, intermediate, advanced
}
```

### Public Cases Page Layout

1. **Today's Case Hero**: Full-width featured section for the daily case
2. **Recent Daily Cases**: Horizontal scroll of past 14 days
3. **Classic Cases Library**: Filterable grid with enhanced filters (track, skill, difficulty, industry, concept)

When filters are active, the daily sections are hidden to focus on search results.

---

### Custom Interactive Exhibits (5 templates)

In addition to the 30+ library exhibit types, the AI generates 1-2 **custom interactive exhibits** per case using a simple template-based system.

| Template | Best For | Example |
|----------|----------|---------|
| **decision_simulator** | Crisis decisions, leadership dilemmas | Walk through key decisions with branching outcomes |
| **scenario_builder** | Strategy formulation, turnaround planning | Select initiatives across categories to build a plan |
| **reveal_cards** | Stakeholder perspectives, hidden information | Click to reveal each stakeholder's viewpoint |
| **comparative_ranker** | Strategic prioritization, option evaluation | Rank items and compare to expert/actual ranking |
| **what_if_calculator** | Financial sensitivity, pricing decisions | Adjust sliders to explore different scenarios |

### Template System Design

The simplified template system ensures reliability and maintainability:

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| **Simple Data Structures** | AI only provides content, templates handle rendering | No complex nested logic required from AI |
| **Pre-built Interactivity** | React components handle all state/interaction | Consistent, tested interactive behavior |
| **Content Validation** | TypeScript types + runtime checks | Reject malformed data before rendering |
| **Graceful Fallbacks** | Error messages for invalid templates | Never breaks the page |

### Files Involved
- `src/lib/exhibits/custom-templates-simple.ts` - Template definitions, types, and validation
- `src/lib/ai/prompts/exhibits.ts` - AI prompt with template examples
- `src/components/case/charts/SimpleCustomExhibit.tsx` - React renderer for all 5 templates

### How It Works
1. AI generates 4-6 library exhibits + 1-2 custom template exhibits
2. Custom exhibits use `type: "custom_template"` with a `templateType` field
3. `SimpleCustomExhibit` component validates and renders the appropriate template
4. Each template handles its own state and interactivity

## Creating a Case Study

### Content Formatting Guidelines

All AI-generated content follows these formatting rules:
- **No em dashes (—)**: Never use em dashes. Use regular hyphens (-), commas, colons, or rewrite sentences instead.
- Consistent typography and punctuation across all case content, questions, and exhibits.

### Protagonist-Centered Case Design

All cases are now written in the style of top business schools (HBS, INSEAD, IMD, Darden, Stanford, Case Centre) but with a modern, engaging approach:

- **Fictional Protagonist**: Each case centers on a fictional character who faces the business challenge. The company and situation are real, but the protagonist is a composite character that students can relate to.
- **Tension-Forward**: Cases open in media res with the protagonist facing a critical decision, not with dry company history.
- **Named Stakeholders**: 3-5 named characters with distinct perspectives and direct quotes throughout the case.
- **Personal Stakes**: The protagonist has professional and personal stakes that make the decision meaningful.
- **Modern Voice**: Engaging, practical writing style - think Malcolm Gladwell meets Harvard Business Review.

### Protagonist Name Collision Prevention

To ensure each case feels unique and avoid reader confusion, the system tracks all protagonist and supporting character names:

- **Name Tracking**: Every protagonist and their key relationship character are stored in the `ProtagonistName` table
- **First Name Uniqueness**: The AI is instructed to never reuse any first name that has appeared in previous cases
- **Full Name Tracking**: Both full names and extracted first names are tracked to catch variations (e.g., "Marcus Chen" and "Marcus Williams")
- **Permanent Avoidance**: Names are never reused - with millions of possible name combinations, there's no reason to repeat

**Database Schema:**
```prisma
model ProtagonistName {
  id            String   @id
  name          String   // Full name (e.g., "Marcus Chen")
  firstName     String   // Extracted first name for matching
  caseId        String   // Reference to the case
  isProtagonist Boolean  // true = protagonist, false = supporting character
  publishedDate DateTime // When the case was published
}
```

**Backfill Existing Cases:**
```bash
npx tsx prisma/backfill-protagonist-names.ts
```

### Single Case Creation (Simplified)
The new streamlined case creation requires only a source article:

1. Log in to the Operator Portal
2. Click "New Case"
3. Input source article (URL, paste text, or upload file)
4. **Auto-Detection**: The AI automatically:
   - Identifies the company name
   - Determines the industry
   - Recommends 3-5 relevant MBA concepts from the 60+ available
   - Suggests learning objectives
5. **Protagonist Generation**: AI creates a compelling fictional protagonist appropriate for the decision at hand
6. Preview the detected metadata (with confidence indicators)
7. Click "Generate Case" - watch real-time progress indicators
8. Multiple cases can be generated concurrently

### Bulk Case Creation
Generate multiple cases at once with AI-powered research:

1. Navigate to "Bulk Add" in the operator portal
2. Set your criteria:
   - Company name (e.g., "Apple", "Netflix")
   - MBA Concept (from 60+ options)
   - Career Path (Consulting, Marketing, Finance, Operations, Strategy)
   - Year (filter by time period)
3. AI researches and suggests 10 case ideas based on real business events
4. Preview each case idea with:
   - Title and company
   - Description of the business situation
   - Recommended concepts
   - Suggested research sources
5. Select which cases to generate
6. Click "Generate Selected" - all cases queue concurrently

### Case Generation Progress Tracking
- Real-time progress indicator showing current step:
  - Analyzing article
  - Researching company
  - Creating protagonist
  - Writing protagonist-centered case narrative
  - Creating exhibits
  - Generating questions
- Queue displays all active generations
- Cancel any in-progress job
- View completed cases directly from queue

## MBA Concept Library

The platform includes a comprehensive interactive concept library with **60 MBA concepts** across 6 categories. Each concept page features:
- Clear definition and key principles
- Visual framework diagrams
- Real-world examples
- Interactive exercises (quizzes, drag-drop, scenario analysis)
- Links to related cases and concepts

### Concepts by Category

| Category | Count | Key Concepts |
|----------|-------|--------------|
| **Strategy** | 12 | Porter's Five Forces, SWOT, Blue Ocean, BCG Matrix, GE-McKinsey Matrix, Ansoff Matrix, Value Chain, PESTLE, Scenario Planning, Core Competencies, Competitive Advantage, Balanced Scorecard |
| **Finance** | 12 | DCF Valuation, WACC, NPV & IRR, Capital Structure, M&A, LBO Analysis, Working Capital, Financial Ratios, Revenue Recognition, Corporate Governance, Real Options, Dividend Policy |
| **Marketing** | 10 | Marketing Mix (4Ps), STP Marketing, Customer Segmentation, Brand Positioning, CLV, Net Promoter Score, Jobs to Be Done, Pricing Strategies, Digital Marketing Funnel, Brand Equity |
| **Operations** | 10 | Supply Chain, Lean Operations, Six Sigma, Capacity Planning, Kanban, Theory of Constraints, TQM, S&OP, Business Process Reengineering, Outsourcing Decisions |
| **Leadership** | 8 | Change Management, Organizational Culture, Stakeholder Management, Servant Leadership, Emotional Intelligence, Decision-Making Frameworks, Transformational Leadership, Negotiation Principles |
| **Economics** | 8 | Market Structure, Network Effects, Economies of Scale, Game Theory, Behavioral Economics, Supply & Demand, Platform Economics, Opportunity Cost |

Visit `/concepts` to explore the full interactive library.

## Research Sufficiency, Prompt Registry & Case Grading (v2.1)

### Feature 1: Research Sufficiency Check

**Problem:** Before spending tokens on protagonist and narrative generation, we need to verify that we have enough enrichment data to produce a credible case.

**Solution:** After Phase 3 (Research Enrichment), the system evaluates data sufficiency:

| Data Category | Minimum Required | Action if Missing |
|---------------|-----------------|-------------------|
| Financial figures | 2+ data points | Attempt additional searches |
| Executive quotes | 1+ attributed quote | Search earnings calls, interviews |
| Competitor info | 1+ competitor insight | Expand competitor list search |
| Overall sufficiency | 60% threshold | Adjust case scope or warn operator |

**Scope Adjustment Options:**
- **Full enriched case**: All data categories met → Proceed with full enrichment
- **Partial enriched case**: Some categories met → Generate with available data, flag gaps
- **Basic case**: Minimal data → Fall back to LLM-generated research only

**Implementation:**
- New `sufficiency.ts` prompt file for evaluating data quality
- `checkResearchSufficiency()` function returns score and recommendations
- Generation continues but adjusts expectations based on available data

---

### Feature 2: Prompt Version Registry

**Problem:** When iterating on prompts, we need to trace which version produced which case for debugging and A/B testing.

**Solution:** Version-controlled prompt system with operator UI.

**Database Schema:**
```prisma
model PromptVersion {
  id          String   @id @default(cuid())
  promptType  String   // analyze, research, protagonist, case, exhibits, questions, validation, grading, sufficiency
  version     String   // Semantic version: 1.0.0, 1.0.1, etc.
  content     String   // The full prompt text
  isActive    Boolean  @default(false)
  description String?  // What changed in this version
  createdAt   DateTime @default(now())
  createdBy   String?  // User who created this version
  cases       Case[]   @relation("CasePromptVersion")
}
```

**Case Tracking:**
- Each case stores the prompt version IDs used during generation
- Case model extended with `promptVersions` JSON field

**Operator UI (`/operator/prompts`):**
- View all prompt types with active versions
- Edit prompts with syntax highlighting
- Create new versions (auto-increment version number)
- Activate/deactivate versions
- View which cases used which prompt versions
- Compare versions side-by-side

**A/B Testing Support:**
- Set multiple versions as "candidates"
- Random selection during generation
- Analytics on case quality by prompt version

---

### Feature 3: Case Quality Grading

**Problem:** Need to ensure generated cases meet HBS publication quality standards.

**Solution:** AP English teacher-style grading with iterative improvement.

**Grading Criteria (100 points total):**

| Category | Weight | Criteria |
|----------|--------|----------|
| **Narrative Quality** | 25pts | Opening hook, tension, pacing, voice |
| **Protagonist Depth** | 15pts | Believability, stakes, constraints, personality |
| **Business Rigor** | 20pts | Accurate data, logical analysis, real-world grounding |
| **Exhibit Integration** | 15pts | Relevance, variety, supports narrative |
| **Question Quality** | 15pts | Difficulty progression, concept coverage, rubric clarity |
| **Cohesion** | 10pts | All elements work together, no contradictions |

**Letter Grade Mapping:**
| Score | Grade | Action |
|-------|-------|--------|
| 93-100 | A | Publish-ready |
| 90-92 | A- | Acceptable minimum |
| 87-89 | B+ | Improve weak areas |
| 83-86 | B | Significant revision needed |
| 80-82 | B- | Major revision needed |
| < 80 | C or below | Regenerate |

**Iterative Improvement Loop:**
1. Generate case → Grade → If < A- (90):
2. Identify weakest category
3. Regenerate that component with targeted feedback
4. Re-grade → Repeat until A- or max 3 iterations
5. If still < A- after 3 iterations, flag for human review

**Implementation:**
- New `grading.ts` prompt for comprehensive case evaluation
- `improvementSuggestions` returned with specific fixes
- `regenerateComponent()` function for targeted regeneration
- Final grade stored on case record

---

## Future Phases

### Phase 2 (Months 4-6)
- Interactive exhibit capabilities
- User accounts and engagement tracking
- Mobile optimization
- Instructor tools

### Phase 3 (Months 7-12)
- Subscription and payment infrastructure
- Institutional features
- Advanced analytics
- Community features
- LMS integrations

## License

Proprietary - All rights reserved
