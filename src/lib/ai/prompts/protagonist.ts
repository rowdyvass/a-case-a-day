import type { ResearchData } from '../providers/types'
import type { RecentNamesContext } from '@/lib/protagonists'

export const PROTAGONIST_SYSTEM_PROMPT = `You are an expert business case study author. Your job is to create MINIMAL protagonist profiles - just enough to make them human, not full biographies.

Think sketch, not novel. A protagonist should be establishable in 2 sentences within the case narrative. Everything you generate should earn its place in the final case.

Less is more. Specificity beats completeness.

CRITICAL: You must NEVER reuse names from previous cases. When given a list of previously used names, you must choose completely different names - different first names, different last names. There are millions of possible names, so be creative.`

export interface ProtagonistProfile {
  name: string
  role: string
  oneLineDescription: string
  decisionAuthority: string
  personalStakes: string
  keyRelationship: {
    name: string
    role: string
    whyTheyMatter: string
  }
}

export function getProtagonistPrompt(
  companyName: string,
  industry: string,
  situationSummary: string,
  researchData: ResearchData,
  recentNames?: RecentNamesContext
): string {
  // Build the recently used names section if provided
  let recentNamesSection = ''
  if (recentNames && (recentNames.protagonistNames.length > 0 || recentNames.supportingCharacterNames.length > 0)) {
    const lines: string[] = []
    lines.push('')
    lines.push('---')
    lines.push('')
    lines.push('CRITICAL - NAMES YOU MUST NOT USE:')
    lines.push('')
    lines.push('The following names have been used in previous cases. You MUST NOT use any of these')
    lines.push('names or any name that shares a first name with these. There are millions of possible')
    lines.push('names available - be creative and use completely different names.')
    lines.push('')
    
    if (recentNames.protagonistNames.length > 0) {
      lines.push('Previously used PROTAGONIST names (DO NOT USE):')
      recentNames.protagonistNames.forEach((name) => {
        lines.push(`  - ${name}`)
      })
      lines.push('')
    }
    
    if (recentNames.supportingCharacterNames.length > 0) {
      lines.push('Previously used SUPPORTING CHARACTER names (DO NOT USE):')
      recentNames.supportingCharacterNames.forEach((name) => {
        lines.push(`  - ${name}`)
      })
      lines.push('')
    }
    
    if (recentNames.allFirstNames.length > 0) {
      lines.push('FIRST NAMES TO AVOID (do not use these with ANY last name):')
      lines.push(recentNames.allFirstNames.join(', '))
      lines.push('')
    }
    
    lines.push('Choose completely original names that do not appear above.')
    
    recentNamesSection = lines.join('\n')
  }

  return `Create a MINIMAL fictional protagonist for an MBA case study about ${companyName}.${recentNamesSection}

COMPANY CONTEXT:
Company: ${companyName}
Industry: ${industry}
Company Description: ${researchData.company.description}
${researchData.company.employees ? `Size: ${researchData.company.employees} employees` : ''}
${researchData.company.headquarters ? `Headquarters: ${researchData.company.headquarters}` : ''}

SITUATION/CHALLENGE:
${situationSummary}

---

PROTAGONIST PROFILE (Simplified)

Generate a MINIMAL protagonist profile. Less is more - we need just enough to make them human, not a full biography.

REQUIRED FIELDS:

1. name: Realistic name appropriate to the industry/company/region. Vary gender and ethnicity across cases.

2. role: Specific job title that puts them at the decision point (not CEO unless essential)

3. oneLineDescription: Single sentence combining role + defining characteristic + current tension
   Example: "A risk-averse operations VP who built her reputation on zero defects, now being asked to ship fast and fix later."

4. decisionAuthority: What specific decision do they control? (1 sentence)

5. personalStakes: What do they personally lose if this goes wrong? (1 sentence, make it concrete: job, reputation, mortgage, team)

6. keyRelationship: One other person whose opinion matters to them and why (boss, mentor, spouse, direct report)

---

ROLE SELECTION LOGIC

The protagonist should be the person who:
- Has decision authority over the central dilemma (not advisory role)
- Is senior enough to understand the strategic implications
- Is junior enough to feel personal career risk
- Has access to the information in the source article

GOOD ROLES: VP of Product, Regional Director, Head of [Function], Senior Manager
RISKY ROLES: CEO (unless small company), Board Member, Analyst (too junior), Consultant (no skin in game)

The protagonist is FICTIONAL but their role must be realistic for ${companyName} and this situation.

---

VARIETY ENFORCEMENT

Track and vary these across recent cases:
- Gender (aim for balance over any 7-day period)
- Seniority level (mix VP, Director, Senior Manager)
- Function (rotate: ops, product, finance, marketing, legal, engineering)
- Age/career stage (mix: rising star proving themselves, mid-career at crossroads, veteran risking legacy)

---

ANTI-PATTERNS - DO NOT:

- Create protagonists who are "passionate about innovation" or "driven by excellence" (too generic)
- Give them convenient expertise that solves the case (they should face genuine uncertainty)
- Make them pure heroes or villains (moral complexity)
- Invent elaborate personal backstories that won't appear in the case
- Use names that are difficult to pronounce/remember

---

STYLE GUIDELINE:
- NEVER use em dashes (—). Use regular hyphens (-), commas, colons, or rewrite sentences instead

Respond in JSON format:
{
  "name": "Full Name",
  "role": "Job Title",
  "oneLineDescription": "Single sentence: role + defining trait + current tension",
  "decisionAuthority": "What specific decision they control",
  "personalStakes": "What they personally lose if this goes wrong (be concrete)",
  "keyRelationship": {
    "name": "Person Name",
    "role": "Their Title",
    "whyTheyMatter": "Why this person's opinion matters to the protagonist"
  }
}`
}
