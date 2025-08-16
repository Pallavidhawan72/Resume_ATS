import { JobDescription } from '@/types/resume'

export class JobDescriptionAnalyzer {
  private static readonly COMMON_SKILLS = [
    // Technical Skills
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
    'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
    'html', 'css', 'sass', 'bootstrap', 'tailwind', 'material-ui',
    'agile', 'scrum', 'kanban', 'jira', 'confluence',
    
    // Design & Creative Skills
    'photoshop', 'illustrator', 'indesign', 'powerpoint', 'keynote', 'word', 'adobe creative suite',
    'graphic design', 'visual design', 'ui design', 'ux design', 'web design', 'print design',
    'branding', 'brand guidelines', 'typography', 'layout', 'visual hierarchy', 'infographics',
    'creative', 'storytelling', 'visual communication', 'design thinking', 'prototyping',
    'figma', 'sketch', 'adobe xd', 'canva', 'coreldraw', 'after effects', 'premiere pro',
    'social media', 'content creation', 'marketing materials', 'presentations', 'proposals',
    
    // Soft Skills
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'project management', 'time management', 'collaboration', 'innovation',
    'adaptability', 'creativity', 'critical thinking', 'decision making',
    'attention to detail', 'deadline management', 'client communication',
    
    // Business Skills
    'data analysis', 'business intelligence', 'market research', 'strategic planning',
    'budget management', 'stakeholder management', 'vendor management',
    'quality assurance', 'testing', 'documentation', 'training'
  ]

  private static readonly SKILL_IMPORTANCE_KEYWORDS = {
    high: ['required', 'must have', 'essential', 'mandatory', 'critical', 'key requirement'],
    medium: ['preferred', 'desired', 'nice to have', 'advantage', 'plus', 'beneficial'],
    low: ['familiar', 'exposure', 'basic', 'some experience', 'awareness']
  }

  static analyzeJobDescription(title: string, company: string, content: string): JobDescription {
    const lowercaseContent = content.toLowerCase()
    
    const requiredSkills = this.extractSkills(content, ['required', 'must', 'essential', 'mandatory'])
    const preferredSkills = this.extractSkills(content, ['preferred', 'desired', 'nice to have', 'plus'])
    const keywords = this.extractKeywords(content)

    return {
      title,
      company,
      content,
      requiredSkills,
      preferredSkills,
      keywords
    }
  }

  private static extractSkills(content: string, indicators: string[]): string[] {
    const skills: string[] = []
    const lowercaseContent = content.toLowerCase()

    // Find sections that mention requirements
    for (const indicator of indicators) {
      const regex = new RegExp(`${indicator}[\\s\\S]*?(?=\\n\\s*(?:preferred|desired|nice|plus|responsibilities|duties|we offer)|$)`, 'gi')
      const matches = content.match(regex)
      
      if (matches) {
        for (const match of matches) {
          const matchedSkills = this.COMMON_SKILLS.filter(skill => 
            match.toLowerCase().includes(skill.toLowerCase())
          )
          skills.push(...matchedSkills)
        }
      }
    }

    // Also check for skills in bullet points
    const bulletPoints = content.match(/[•·-]\s*[^\n]+/g) || []
    for (const point of bulletPoints) {
      const matchedSkills = this.COMMON_SKILLS.filter(skill => 
        point.toLowerCase().includes(skill.toLowerCase())
      )
      skills.push(...matchedSkills)
    }

    return [...new Set(skills)] // Remove duplicates
  }

  private static extractKeywords(content: string): string[] {
    const keywords: string[] = []
    
    // Extract nouns and important terms (simplified approach)
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)

    // Count word frequency
    const wordCount: { [key: string]: number } = {}
    for (const word of words) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }

    // Get most frequent words (excluding common words)
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'will', 'with', 'work', 'team', 'experience', 'ability', 'knowledge', 'skills', 'working', 'years']
    
    const sortedWords = Object.entries(wordCount)
      .filter(([word, count]) => count > 1 && !commonWords.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word)

    keywords.push(...sortedWords)
    
    // Add identified skills
    keywords.push(...this.COMMON_SKILLS.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    ))

    return [...new Set(keywords)]
  }

  static getSkillImportance(skill: string, jobDescription: string): 'high' | 'medium' | 'low' {
    const lowercaseContent = jobDescription.toLowerCase()
    const lowercaseSkill = skill.toLowerCase()

    for (const [importance, keywords] of Object.entries(this.SKILL_IMPORTANCE_KEYWORDS)) {
      for (const keyword of keywords) {
        const regex = new RegExp(`${keyword}[\\s\\S]*?${lowercaseSkill}|${lowercaseSkill}[\\s\\S]*?${keyword}`, 'i')
        if (regex.test(lowercaseContent)) {
          return importance as 'high' | 'medium' | 'low'
        }
      }
    }

    return 'medium' // Default importance
  }
}
