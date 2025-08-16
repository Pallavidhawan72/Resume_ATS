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

  private static calculateATSScore(matches: any[], resume: ResumeData, jobDescription: JobDescription): number {
    let totalWeight = 0
    let achievedWeight = 0

    for (const match of matches) {
      const weight = match.importance === 'high' ? 3 : match.importance === 'medium' ? 2 : 1
      totalWeight += weight
      
      if (match.found) {
        achievedWeight += weight
      }
    }

    // Base score from keyword matching
    const keywordScore = totalWeight > 0 ? (achievedWeight / totalWeight) * 100 : 0

    // Additional scoring factors
    let formatScore = 100
    let structureScore = 100

    // Check for ATS-friendly formatting
    const resumeContent = resume.content
    
    // Penalize for tables, images, headers/footers (simplified check)
    if (resumeContent.includes('|') || resumeContent.includes('┌') || resumeContent.includes('─')) {
      formatScore -= 15
    }

    // Check for proper section headers
    const hasExperienceSection = /experience|work history|employment/i.test(resumeContent)
    const hasEducationSection = /education|academic|degree/i.test(resumeContent)
    const hasSkillsSection = /skills|technical|competencies/i.test(resumeContent)

    if (!hasExperienceSection) structureScore -= 20
    if (!hasEducationSection) structureScore -= 10
    if (!hasSkillsSection) structureScore -= 15

    // Contact information check
    if (!resume.sections.personalInfo?.email) structureScore -= 10
    if (!resume.sections.personalInfo?.phone) structureScore -= 10

    // Calculate final score (weighted average)
    const finalScore = Math.round(
      (keywordScore * 0.6) + (formatScore * 0.2) + (structureScore * 0.2)
    )

    return Math.max(0, Math.min(100, finalScore))
  }

  private static generateSuggestions(resume: ResumeData, jobDescription: JobDescription, matches: any[]): string[] {
    const suggestions: string[] = []
    
    const foundSkills = matches.filter(m => m.found).length
    const totalSkills = matches.length
    const matchRate = totalSkills > 0 ? foundSkills / totalSkills : 0

    if (matchRate < 0.3) {
      suggestions.push("Consider adding more relevant keywords from the job description to your resume")
    }

    if (!resume.sections.personalInfo?.email) {
      suggestions.push("Add a professional email address to your contact information")
    }

    if (!resume.sections.personalInfo?.phone) {
      suggestions.push("Include a phone number in your contact information")
    }

    if (!resume.sections.personalInfo?.linkedin) {
      suggestions.push("Add your LinkedIn profile URL to increase professional credibility")
    }

    if (!resume.sections.summary) {
      suggestions.push("Add a professional summary that includes keywords from the job description")
    }

    const highImportanceMissing = matches.filter(m => !m.found && m.importance === 'high')
    if (highImportanceMissing.length > 0) {
      suggestions.push("Focus on highlighting experience with required skills: " + 
        highImportanceMissing.slice(0, 3).map(m => m.skill).join(', '))
    }

    // Formatting suggestions
    suggestions.push("Use simple formatting without tables, text boxes, or graphics for better ATS compatibility")
    suggestions.push("Save your resume as both PDF and Word formats to ensure compatibility")
    suggestions.push("Use standard section headings like 'Experience', 'Education', and 'Skills'")

    return suggestions
  }

  private static findMissingKeywords(resume: ResumeData, jobDescription: JobDescription): string[] {
    const resumeContent = resume.content.toLowerCase()
    const requiredSkills = jobDescription.requiredSkills
    
    return requiredSkills.filter(skill => 
      !resumeContent.includes(skill.toLowerCase())
    ).slice(0, 10) // Limit to top 10
  }

  private static generateImprovements(resume: ResumeData, jobDescription: JobDescription, matches: any[]): any[] {
    const improvements: any[] = []
    
    // Check for missing high-importance skills
    const missingHighImportance = matches.filter(m => !m.found && m.importance === 'high')
    if (missingHighImportance.length > 0) {
      improvements.push({
        section: "Skills & Experience",
        suggestion: `Add experience or mention of these critical skills: ${missingHighImportance.slice(0, 3).map(m => m.skill).join(', ')}`,
        impact: 'high'
      })
    }

    // Summary section improvement
    if (!resume.sections.summary) {
      improvements.push({
        section: "Professional Summary",
        suggestion: "Add a compelling professional summary that incorporates key job requirements and showcases your value proposition",
        impact: 'high'
      })
    }

    // Contact information improvements
    if (!resume.sections.personalInfo?.email) {
      improvements.push({
        section: "Contact Information",
        suggestion: "Add a professional email address using your name (avoid unprofessional addresses)",
        impact: 'medium'
      })
    }

    // Skills section optimization
    const missingMediumSkills = matches.filter(m => !m.found && m.importance === 'medium')
    if (missingMediumSkills.length > 0) {
      improvements.push({
        section: "Skills Section",
        suggestion: `Consider adding these relevant skills if you have experience: ${missingMediumSkills.slice(0, 4).map(m => m.skill).join(', ')}`,
        impact: 'medium'
      })
    }

    // Experience section optimization
    const experienceKeywords = matches.filter(m => m.found).length
    if (experienceKeywords < 3) {
      improvements.push({
        section: "Work Experience",
        suggestion: "Rewrite job descriptions using keywords from the job posting and quantify achievements with specific metrics",
        impact: 'high'
      })
    }

    // Format improvements
    improvements.push({
      section: "Format & Structure",
      suggestion: "Ensure consistent formatting, use bullet points for achievements, and maintain standard section ordering (Contact, Summary, Experience, Education, Skills)",
      impact: 'low'
    })

    return improvements
  }

  static optimizeResumeContent(resume: ResumeData, jobDescription: JobDescription): ResumeData {
    // Create an optimized copy of the resume
    const optimizedResume = JSON.parse(JSON.stringify(resume)) as ResumeData
    
    // Get analysis data
    const analysis = this.analyzeResume(resume, jobDescription)
    const missingSkills = analysis.missingKeywords.slice(0, 5) // Limit to most important
    const allJobSkills = [...new Set([...jobDescription.requiredSkills, ...jobDescription.preferredSkills])]
    
    // Preserve original structure and only enhance, don't replace
    
    // 1. Enhance Professional Summary (preserve original if good)
    if (resume.sections.summary && resume.sections.summary.length > 50) {
      // Only enhance existing summary, don't replace
      optimizedResume.sections.summary = this.enhanceSummary(
        resume.sections.summary, 
        jobDescription, 
        missingSkills
      )
    }
    
    // 2. Enhance Skills Section (add missing relevant skills)
    if (resume.sections.skills && resume.sections.skills.length > 0) {
      optimizedResume.sections.skills = this.enhanceSkills(
        resume.sections.skills, 
        allJobSkills,
        jobDescription
      )
    }
    
    // 3. Preserve experience and education as-is (they're already good)
    // Only add minor keyword enhancements if needed
    
    // 4. Update content with optimized sections
    optimizedResume.content = this.reconstructResumeContent(optimizedResume)
    
    return optimizedResume
  }

  private static enhanceSummary(originalSummary: string, jobDescription: JobDescription, missingSkills: string[]): string {
    let enhancedSummary = originalSummary
    
    // Only add a few relevant keywords if they're missing and relevant
    const relevantMissingSkills = missingSkills.filter(skill => 
      skill.length < 20 && // Avoid long phrases
      !originalSummary.toLowerCase().includes(skill.toLowerCase())
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
      jobSkill.split(' ').length <= 3 // Avoid complex terms
    ).slice(0, 5)
    
    relevantJobSkills.forEach(skill => {
      enhancedSkills.push(skill)
    })
    
    return enhancedSkills
  }
      }
    }
    
    // Prioritize required skills at the beginning
    const requiredSkills = jobDescription.requiredSkills.filter(skill => 
      optimizedSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    )
    
    const otherSkills = optimizedSkills.filter(skill => 
      !requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
    )
    
    return [...requiredSkills, ...otherSkills].slice(0, 20) // Limit to 20 skills
  }

  private static optimizeExperience(experiences: Experience[], jobDescription: JobDescription, missingKeywords: string[]): Experience[] {
    return experiences.map(exp => {
      const optimizedExp = { ...exp }
      const enhancedDescriptions = [...exp.description]
      
      // Add relevant keywords to job descriptions
      const relevantKeywords = missingKeywords.filter(keyword => 
        // Add keywords that make sense for work experience
        !keyword.toLowerCase().includes('degree') && 
        !keyword.toLowerCase().includes('certification') &&
        keyword.length > 2
      ).slice(0, 2)
      
      relevantKeywords.forEach(keyword => {
        // Add keyword naturally to descriptions
        const keywordPhrase = `Utilized ${keyword} to enhance project delivery and team efficiency`
        if (!enhancedDescriptions.some(desc => desc.toLowerCase().includes(keyword.toLowerCase()))) {
          enhancedDescriptions.push(keywordPhrase)
        }
      })
      
      optimizedExp.description = enhancedDescriptions
      return optimizedExp
    })
  }

  private static reconstructResumeContent(resume: ResumeData): string {
    let content = ''
    
    // Personal Info
    if (resume.sections.personalInfo) {
      const info = resume.sections.personalInfo
      content += `${info.name}\n`
      if (info.email) content += `Email: ${info.email}\n`
      if (info.phone) content += `Phone: ${info.phone}\n`
      if (info.location) content += `Location: ${info.location}\n`
      if (info.linkedin) content += `LinkedIn: ${info.linkedin}\n`
      content += '\n'
    }
    
    // Professional Summary
    if (resume.sections.summary) {
      content += 'PROFESSIONAL SUMMARY\n'
      content += `${resume.sections.summary}\n\n`
    }
    
    // Experience
    if (resume.sections.experience && resume.sections.experience.length > 0) {
      content += 'EXPERIENCE\n\n'
      resume.sections.experience.forEach(exp => {
        content += `${exp.position} | ${exp.company} | ${exp.startDate} - ${exp.endDate}\n`
        exp.description.forEach(desc => {
          content += `• ${desc}\n`
        })
        content += '\n'
      })
    }
    
    // Education
    if (resume.sections.education && resume.sections.education.length > 0) {
      content += 'EDUCATION\n\n'
      resume.sections.education.forEach(edu => {
        content += `${edu.degree} in ${edu.field} | ${edu.institution} | ${edu.startDate} - ${edu.endDate}\n`
        if (edu.gpa) content += `GPA: ${edu.gpa}\n`
        content += '\n'
      })
    }
    
    // Skills
    if (resume.sections.skills && resume.sections.skills.length > 0) {
      content += 'SKILLS\n'
      content += `${resume.sections.skills.join(', ')}\n\n`
    }
    
    return content
  }
}
