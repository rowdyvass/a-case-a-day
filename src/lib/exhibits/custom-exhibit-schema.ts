/**
 * Custom Exhibit Schema & Validation
 * 
 * Defines the structure, guardrails, and validation rules for AI-generated
 * custom interactive exhibits. These exhibits run in sandboxed iframes for security.
 */

// ============== SCHEMA ==============

export interface CustomExhibitData {
  /** Schema version for future migrations */
  schemaVersion: 1
  
  /** Human-readable description of what this exhibit does */
  description: string
  
  /** Type of interactivity (for analytics and categorization) */
  interactivityType: 
    | 'calculator'      // Sliders, inputs, computed outputs
    | 'simulation'      // Business scenarios, decision trees
    | 'visualization'   // Animated or dynamic charts
    | 'gamified'        // Drag-drop, sorting, matching
    | 'exploration'     // Click-to-reveal, expandable sections
  
  /** The HTML content (body only, no <html> or <head>) */
  html: string
  
  /** CSS styles (will be scoped to the exhibit) */
  css: string
  
  /** JavaScript code (runs in sandboxed context) */
  js: string
  
  /** Optional: Initial state for the exhibit */
  initialState?: Record<string, unknown>
  
  /** Optional: Accessibility description for screen readers */
  accessibilityDescription?: string
}

// ============== GUARDRAILS ==============

export const CUSTOM_EXHIBIT_LIMITS = {
  /** Maximum HTML size in bytes */
  maxHtmlSize: 10 * 1024, // 10KB
  
  /** Maximum CSS size in bytes */
  maxCssSize: 5 * 1024, // 5KB
  
  /** Maximum JS size in bytes */
  maxJsSize: 15 * 1024, // 15KB
  
  /** Maximum total size in bytes */
  maxTotalSize: 30 * 1024, // 30KB
  
  /** Minimum required content */
  minHtmlSize: 50, // At least some HTML required
} as const

/** Patterns that are NOT allowed in custom exhibit code */
export const BLOCKED_PATTERNS = [
  // Security: No dynamic code execution
  { pattern: /\beval\s*\(/gi, reason: 'eval() is not allowed for security' },
  { pattern: /\bnew\s+Function\s*\(/gi, reason: 'new Function() is not allowed for security' },
  { pattern: /\bsetTimeout\s*\(\s*["'`]/gi, reason: 'setTimeout with string is not allowed' },
  { pattern: /\bsetInterval\s*\(\s*["'`]/gi, reason: 'setInterval with string is not allowed' },
  
  // Security: No external requests
  { pattern: /\bfetch\s*\(/gi, reason: 'fetch() is not allowed - no external requests' },
  { pattern: /\bXMLHttpRequest\b/gi, reason: 'XMLHttpRequest is not allowed - no external requests' },
  { pattern: /\bWebSocket\b/gi, reason: 'WebSocket is not allowed - no external connections' },
  
  // Security: No external scripts or resources
  { pattern: /<script\s+[^>]*src\s*=/gi, reason: 'External scripts are not allowed' },
  { pattern: /<link\s+[^>]*href\s*=\s*["']https?:/gi, reason: 'External stylesheets are not allowed' },
  { pattern: /<img\s+[^>]*src\s*=\s*["']https?:/gi, reason: 'External images are not allowed' },
  { pattern: /<iframe/gi, reason: 'Nested iframes are not allowed' },
  
  // Security: No cookie/storage access
  { pattern: /\bdocument\.cookie\b/gi, reason: 'Cookie access is not allowed' },
  { pattern: /\blocalStorage\b/gi, reason: 'localStorage is not allowed' },
  { pattern: /\bsessionStorage\b/gi, reason: 'sessionStorage is not allowed' },
  { pattern: /\bindexedDB\b/gi, reason: 'indexedDB is not allowed' },
  
  // Security: No parent frame access
  { pattern: /\bparent\./gi, reason: 'Parent frame access is not allowed' },
  { pattern: /\btop\./gi, reason: 'Top frame access is not allowed' },
  { pattern: /\bwindow\.parent\b/gi, reason: 'Parent window access is not allowed' },
  { pattern: /\bwindow\.top\b/gi, reason: 'Top window access is not allowed' },
  
  // Security: No form submissions to external URLs
  { pattern: /<form\s+[^>]*action\s*=\s*["']https?:/gi, reason: 'External form actions are not allowed' },
] as const

// ============== BASE CSS ==============

/** 
 * Base CSS that's injected into every custom exhibit.
 * Provides design system variables and sensible defaults.
 */
export const BASE_EXHIBIT_CSS = `
/* Design System Variables */
:root {
  /* Colors - matching the app's slate/amber theme */
  --color-primary: #f59e0b;
  --color-primary-hover: #d97706;
  --color-primary-light: #fef3c7;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;
  
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;
  
  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  
  --color-border: #e2e8f0;
  --color-border-dark: #cbd5e1;
  
  /* Typography */
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}

/* Reset & Base Styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text);
  background: var(--color-bg);
  padding: var(--space-4);
}

/* Common Component Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-border);
}

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.input, .select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  transition: border-color var(--transition-fast);
}

.input:focus, .select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-bg-tertiary);
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
}

.value-sm {
  font-size: 18px;
}

.value-lg {
  font-size: 32px;
}

.positive { color: var(--color-success); }
.negative { color: var(--color-danger); }
.neutral { color: var(--color-text-secondary); }

/* Layout Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

.text-center { text-align: center; }
.text-right { text-align: right; }

/* Animation Utilities */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fadeIn var(--transition-normal); }
.animate-slide-up { animation: slideUp var(--transition-slow); }
`

// ============== VALIDATION ==============

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates a custom exhibit's data against all guardrails
 */
export function validateCustomExhibit(data: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Type check
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Custom exhibit data must be an object'], warnings: [] }
  }
  
  const exhibit = data as Partial<CustomExhibitData>
  
  // Required fields
  if (exhibit.schemaVersion !== 1) {
    errors.push('schemaVersion must be 1')
  }
  
  if (!exhibit.description || typeof exhibit.description !== 'string') {
    errors.push('description is required and must be a string')
  }
  
  if (!exhibit.interactivityType) {
    errors.push('interactivityType is required')
  } else if (!['calculator', 'simulation', 'visualization', 'gamified', 'exploration'].includes(exhibit.interactivityType)) {
    errors.push('interactivityType must be one of: calculator, simulation, visualization, gamified, exploration')
  }
  
  if (!exhibit.html || typeof exhibit.html !== 'string') {
    errors.push('html is required and must be a string')
  }
  
  if (typeof exhibit.css !== 'string') {
    errors.push('css must be a string')
  }
  
  if (typeof exhibit.js !== 'string') {
    errors.push('js must be a string')
  }
  
  // Size limits
  const htmlSize = new TextEncoder().encode(exhibit.html || '').length
  const cssSize = new TextEncoder().encode(exhibit.css || '').length
  const jsSize = new TextEncoder().encode(exhibit.js || '').length
  const totalSize = htmlSize + cssSize + jsSize
  
  if (htmlSize < CUSTOM_EXHIBIT_LIMITS.minHtmlSize) {
    errors.push(`HTML content is too small (${htmlSize} bytes, minimum ${CUSTOM_EXHIBIT_LIMITS.minHtmlSize})`)
  }
  
  if (htmlSize > CUSTOM_EXHIBIT_LIMITS.maxHtmlSize) {
    errors.push(`HTML exceeds size limit (${htmlSize} bytes, max ${CUSTOM_EXHIBIT_LIMITS.maxHtmlSize})`)
  }
  
  if (cssSize > CUSTOM_EXHIBIT_LIMITS.maxCssSize) {
    errors.push(`CSS exceeds size limit (${cssSize} bytes, max ${CUSTOM_EXHIBIT_LIMITS.maxCssSize})`)
  }
  
  if (jsSize > CUSTOM_EXHIBIT_LIMITS.maxJsSize) {
    errors.push(`JavaScript exceeds size limit (${jsSize} bytes, max ${CUSTOM_EXHIBIT_LIMITS.maxJsSize})`)
  }
  
  if (totalSize > CUSTOM_EXHIBIT_LIMITS.maxTotalSize) {
    errors.push(`Total size exceeds limit (${totalSize} bytes, max ${CUSTOM_EXHIBIT_LIMITS.maxTotalSize})`)
  }
  
  // Check for blocked patterns
  const allCode = `${exhibit.html || ''} ${exhibit.css || ''} ${exhibit.js || ''}`
  
  for (const { pattern, reason } of BLOCKED_PATTERNS) {
    if (pattern.test(allCode)) {
      errors.push(reason)
    }
  }
  
  // Warnings (non-blocking)
  if (!exhibit.accessibilityDescription) {
    warnings.push('Consider adding an accessibilityDescription for screen reader users')
  }
  
  if (jsSize > 10 * 1024) {
    warnings.push('JavaScript is quite large, consider simplifying for better performance')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Generates the complete HTML document for the sandboxed iframe
 */
export function generateExhibitDocument(data: CustomExhibitData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
${BASE_EXHIBIT_CSS}

/* Custom Exhibit Styles */
${data.css}
  </style>
</head>
<body>
  ${data.accessibilityDescription ? `<div class="sr-only" aria-live="polite">${data.accessibilityDescription}</div>` : ''}
  ${data.html}
  <script>
    // Exhibit initialization
    (function() {
      try {
        // Initial state if provided
        const initialState = ${JSON.stringify(data.initialState || {})};
        
        // Custom exhibit code
        ${data.js}
        
        // Notify parent of height changes for auto-resize
        function notifyHeight() {
          const height = document.body.scrollHeight;
          window.parent.postMessage({ type: 'exhibit-resize', height }, '*');
        }
        
        // Initial height notification
        notifyHeight();
        
        // Watch for DOM changes
        const observer = new MutationObserver(notifyHeight);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        
        // Also notify on window resize
        window.addEventListener('resize', notifyHeight);
      } catch (error) {
        console.error('Exhibit error:', error);
        document.body.innerHTML = '<div style="color: #ef4444; padding: 1rem;">Error loading exhibit. Please refresh the page.</div>';
      }
    })();
  </script>
</body>
</html>`
}

