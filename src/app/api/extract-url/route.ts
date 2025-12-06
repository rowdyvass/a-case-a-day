import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ACaseADay/1.0; +https://acaseaday.com)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()

    // Simple HTML parsing - extract title and main content
    // In production, you'd want a more robust solution like Readability.js
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''

    // Try to extract article content
    // Look for common article content containers
    let content = ''
    
    // Try Open Graph description first
    const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i) ||
                        html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:description"/i)
    
    if (ogDescMatch) {
      content = ogDescMatch[1]
    }

    // Try to extract paragraph content
    const paragraphs = html.match(/<p[^>]*>([^<]+(?:<[^p][^>]*>[^<]*<\/[^p][^>]*>)*[^<]*)<\/p>/gi) || []
    const cleanParagraphs = paragraphs
      .map(p => p.replace(/<[^>]+>/g, '').trim())
      .filter(p => p.length > 50) // Only keep substantial paragraphs
      .slice(0, 20) // Limit to first 20 paragraphs

    if (cleanParagraphs.length > 0) {
      content = cleanParagraphs.join('\n\n')
    }

    // Try to extract company name from title
    let company = ''
    const companyPatterns = [
      /^([A-Z][a-zA-Z0-9\s]+?)(?:\s+[-–—|:])/,
      /(?:about|at|of)\s+([A-Z][a-zA-Z0-9\s]+?)(?:\s|$)/i
    ]
    
    for (const pattern of companyPatterns) {
      const match = title.match(pattern)
      if (match) {
        company = match[1].trim()
        break
      }
    }

    return NextResponse.json({
      title,
      content: content || 'Could not extract article content. Please paste the text manually.',
      company,
      url
    })
  } catch (error) {
    console.error('URL extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract URL' },
      { status: 500 }
    )
  }
}


