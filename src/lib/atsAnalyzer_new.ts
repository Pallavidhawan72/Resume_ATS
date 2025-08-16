import { ResumeData, JobDescription, ATSAnalysis, Experience } from '@/types/resume'
import { JobDescriptionAnalyzer } from './jobDescriptionAnalyzer'

export class ATSAnalyzer {
  static analyzeResume(resume: ResumeData, jobDescription: JobDescription): ATSAnalysis {
    const resumeContent = resume.content.toLowerCase()
    const jobContent = jobDescription.content.toLowerCase()
    
    // Analyze keyword matches
    const matches = this.analyzeKeywordMatches(resume, jobDescription)
    
    // Calculate overall score
    const score = this.calculateATSScore(matches, resume, jobDescription)
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(resume, jobDescription, matches)
    
    // Find missing keywords
    const missingKeywords = this.findMissingKeywords(resume, jobDescription)
    
    // Generate improvement suggestions
    const improvements = this.generateImprovements(resume, jobDescription, matches)

    return {
      score,
      matches,
      suggestions,
      missingKeywords,
      improvements
    }
  }

  private static analyzeKeywordMatches(resume: ResumeData, jobDescription: JobDescription) {
    const resumeContent = resume.content.toLowerCase()
    const allJobSkills = [...jobDescription.requiredSkills, ...jobDescription.preferredSkills]
    
    return allJobSkills.map(skill => {
      const found = resumeContent.includes(skill.toLowerCase())
      const importance = JobDescriptionAnalyzer.getSkillImportance(skill, jobDescription.content)
      
      return {
        skill,
        found,
        importance
      }
    })
  }

  private static calculateATSScore(matches: { skill: string; found: boolean; importance: string }[], resume: ResumeData, jobDescription: JobDescription): number {
    let totalWeight = 0
    let achievedWeight = 0

    // Weight keywords by importance
    matches.forEach(match => {
      let weight = 1
      if (match.importance === 'high') weight = 3
      else if (match.importance === 'medium') weight = 2

      totalWeight += weight
      if (match.found) achievedWeight += weight
    })

    // Base score from keyword matching
    let score = totalWeight > 0 ? (achievedWeight / totalWeight) * 70 : 0

    // Bonus points for having key sections
    if (resume.sections.summary) score += 10
    if (resume.sections.experience && resume.sections.experience.length > 0) score += 10
    if (resume.sections.skills && resume.sections.skills.length > 0) score += 5
    if (resume.sections.education && resume.sections.education.length > 0) score += 5

    return Math.min(Math.round(score), 100)
  }

  private static generateSuggestions(resume: ResumeData, jobDescription: JobDescription, matches: { skill: string; found: boolean; importance: string }[]): string[] {
    const suggestions = []
    
    const missingHighImportance = matches.filter(m => !m.found && m.importance === 'high')
    const missingMediumImportance = matches.filter(m => !m.found && m.importance === 'medium')

    if (missingHighImportance.length > 0) {
      suggestions.push(`Add these high-priority skills: ${missingHighImportance.slice(0, 3).map(m => m.skill).join(', ')}`)
    }

    if (missingMediumImportance.length > 0) {
      suggestions.push(`Consider including these relevant skills: ${missingMediumImportance.slice(0, 3).map(m => m.skill).join(', ')}`)
    }

    if (!resume.sections.summary) {
      suggestions.push('Add a professional summary section highlighting your key qualifications')
    }

    return suggestions
  }

  private static findMissingKeywords(resume: ResumeData, jobDescription: JobDescription): string[] {
    const resumeContent = resume.content.toLowerCase()
    const allJobKeywords = [...jobDescription.requiredSkills, ...jobDescription.preferredSkills, ...jobDescription.keywords]
    
    return allJobKeywords.filter(keyword => 
      !resumeContent.includes(keyword.toLowerCase())
    ).slice(0, 10) // Limit to 10 most important
  }

  private static generateImprovements(resume: ResumeData, jobDescription: JobDescription, matches: { skill: string; found: boolean; importance: string }[]): { section: string; suggestion: string; impact: "high" | "medium" | "low" }[] {
    const improvements: { section: string; suggestion: string; impact: "high" | "medium" | "low" }[] = []
    
    const missingHighPriority = matches.filter(m => !m.found && m.importance === 'high')
    const missingMediumPriority = matches.filter(m => !m.found && m.importance === 'medium')

    // High impact improvements
    if (missingHighPriority.length > 0) {
      improvements.push({
        section: 'Skills',
        suggestion: `Add critical skills: ${missingHighPriority.slice(0, 3).map(m => m.skill).join(', ')}`,
        impact: 'high'
      })
    }

    // Medium impact improvements
    if (missingMediumPriority.length > 0) {
      improvements.push({
        section: 'Skills',
        suggestion: `Include preferred skills: ${missingMediumPriority.slice(0, 3).map(m => m.skill).join(', ')}`,
        impact: 'medium'
      })
    }

    // Summary improvements
    if (!resume.sections.summary || resume.sections.summary.length < 100) {
      improvements.push({
        section: 'Professional Summary',
        suggestion: 'Expand your professional summary to 2-3 sentences highlighting your most relevant experience and skills',
        impact: 'medium'
      })
    }

    return improvements
  }

  static optimizeResumeContent(resume: ResumeData, jobDescription: JobDescription): ResumeData {
    // Create an optimized copy of the resume - preserve ALL original data
    const optimizedResume = JSON.parse(JSON.stringify(resume)) as ResumeData
    
    // Get analysis data
    const analysis = this.analyzeResume(resume, jobDescription)
    const missingSkills = analysis.missingKeywords.slice(0, 5) // Limit to most important
    const allJobSkills = [...new Set([...jobDescription.requiredSkills, ...jobDescription.preferredSkills])]
    
    // PRESERVE ORIGINAL CONTENT - only add missing relevant skills
    
    // 1. Enhance Professional Summary (preserve original if good)
    if (resume.sections.summary && resume.sections.summary.length > 50) {
      // Only enhance existing summary, don't replace
      optimizedResume.sections.summary = this.enhanceSummary(
        resume.sections.summary, 
        jobDescription, 
        missingSkills
      )
    } else if (resume.sections.summary) {
      // Keep original summary as is
      optimizedResume.sections.summary = resume.sections.summary
    }
    
    // 2. Enhance Skills Section (add missing relevant skills)
    if (resume.sections.skills && resume.sections.skills.length > 0) {
      optimizedResume.sections.skills = this.enhanceSkills(
        resume.sections.skills, 
        allJobSkills,
        jobDescription
      )
    }
    
    // 3. Keep all other sections exactly as they are
    optimizedResume.sections.personalInfo = resume.sections.personalInfo
    optimizedResume.sections.experience = resume.sections.experience
    optimizedResume.sections.education = resume.sections.education
    optimizedResume.sections.certifications = resume.sections.certifications
    optimizedResume.sections.projects = resume.sections.projects
    
    // 4. Preserve the original content structure
    optimizedResume.content = resume.content // Keep original formatting
    
    return optimizedResume
  }

  private static enhanceSummary(originalSummary: string, jobDescription: JobDescription, missingSkills: string[]): string {
    let enhancedSummary = originalSummary
    
    // Only add a few relevant keywords if they're missing and relevant
    const relevantMissingSkills = missingSkills.filter(skill => 
      skill.length < 20 && // Avoid long phrases
      !originalSummary.toLowerCase().includes(skill.toLowerCase()) &&
      /^[a-zA-Z\s\-]+$/.test(skill) // Only simple skills
    ).slice(0, 2) // Max 2 additions
    
    if (relevantMissingSkills.length > 0) {
      // Add skills naturally to the end
      const lastChar = enhancedSummary.trim().slice(-1)
      const separator = lastChar === '.' ? ' ' : '. '
      enhancedSummary += `${separator}Experienced with ${relevantMissingSkills.join(' and ')}.`
    }
    
    return enhancedSummary
  }

  private static enhanceSkills(originalSkills: string[], jobSkills: string[], jobDescription: JobDescription): string[] {
    const enhancedSkills = [...originalSkills]
    const originalSkillsLower = originalSkills.map(s => s.toLowerCase())
    
    // Add only highly relevant missing skills (max 3-5)
    const relevantJobSkills = jobSkills.filter(jobSkill => 
      !originalSkillsLower.includes(jobSkill.toLowerCase()) &&
      jobSkill.length < 25 && // Avoid long phrases
      jobSkill.split(' ').length <= 3 && // Avoid complex terms
      /^[a-zA-Z\s\-&.]+$/.test(jobSkill) // Only valid skill names
    ).slice(0, 5)
    
    relevantJobSkills.forEach(skill => {
      enhancedSkills.push(skill)
    })
    
    return enhancedSkills
  }
}
