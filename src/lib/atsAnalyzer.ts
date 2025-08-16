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

  private static generateSuggestions(resume: ResumeData, jobDescription: JobDescription, matches: any[]): string[] {
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

  private static generateImprovements(resume: ResumeData, jobDescription: JobDescription, matches: any[]): any[] {
    const improvements = []
    
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
    const missingSkills = analysis.missingKeywords.slice(0, 5)
    const allJobSkills = [...new Set([...jobDescription.requiredSkills, ...jobDescription.preferredSkills])]
    const jobKeywords = jobDescription.keywords.slice(0, 10)
    
    console.log('� COMPREHENSIVE ATS OPTIMIZATION')
    console.log('Job skills:', allJobSkills.slice(0, 10))
    console.log('Job keywords:', jobKeywords)
    console.log('Missing skills:', missingSkills)
    
    let optimizedContent = resume.content
    let changesLog: string[] = []
    
    try {
      // 1. ENHANCE PROFESSIONAL SUMMARY with job-relevant keywords
      console.log('Step 1: Enhancing summary...')
      optimizedContent = this.enhanceSummaryWithKeywords(optimizedContent, jobDescription, changesLog)
      console.log('Step 1 complete, content type:', typeof optimizedContent)
      
      // 2. ENHANCE EXPERIENCE SECTION with relevant action words and achievements
      console.log('Step 2: Enhancing experience...')
      optimizedContent = this.enhanceExperienceSection(optimizedContent, jobDescription, changesLog)
      console.log('Step 2 complete, content type:', typeof optimizedContent)
      
      // 3. ADD MISSING SKILLS to skills sections
      console.log('Step 3: Enhancing skills...')
      optimizedContent = this.enhanceSkillsSections(optimizedContent, allJobSkills, jobDescription, changesLog)
      console.log('Step 3 complete, content type:', typeof optimizedContent)
      
      // 4. OPTIMIZE SECTION HEADERS and formatting for ATS
      console.log('Step 4: Optimizing headers...')
      optimizedContent = this.optimizeSectionHeaders(optimizedContent, changesLog)
      console.log('Step 4 complete, content type:', typeof optimizedContent)
      
      // 5. ADD RELEVANT KEYWORDS throughout content naturally
      console.log('Step 5: Adding keywords...')
      optimizedContent = this.addRelevantKeywords(optimizedContent, jobKeywords, changesLog)
      console.log('Step 5 complete, content type:', typeof optimizedContent)
    } catch (error) {
      console.error('Error in enhancement steps:', error)
      optimizedContent = resume.content // Fallback to original
    }
    
    // Update the sections object with enhanced skills
    if (resume.sections.skills) {
      const enhancedSkills = this.addMinimalSkills(resume.sections.skills, allJobSkills, jobDescription)
      optimizedResume.sections.skills = enhancedSkills
      if (enhancedSkills.length > resume.sections.skills.length) {
        changesLog.push(`Added ${enhancedSkills.length - resume.sections.skills.length} new relevant skills`)
      }
    }
    
    // 6. Update the content with all enhancements
    if (typeof optimizedContent === 'string') {
      optimizedResume.content = optimizedContent
    } else {
      console.error('ERROR: optimizedContent is not a string:', typeof optimizedContent, optimizedContent)
      optimizedResume.content = resume.content // Fallback to original
      changesLog.push('Error occurred during optimization - used original content')
    }
    
    // 7. Store changes log for display
    (optimizedResume as any).changesLog = changesLog
    
    console.log('✅ OPTIMIZATION COMPLETE')
    console.log('Changes made:', changesLog)
    console.log('Content length - Original:', resume.content.length, 'Optimized:', optimizedContent.length)
    
    return optimizedResume
  }

  private static enhanceSummaryWithKeywords(content: string, jobDescription: JobDescription, changesLog: string[]): string {
    // Find professional summary section
    const summaryMatch = content.match(/(PROFESSIONAL SUMMARY)([\s\S]*?)(?=\n\n[A-Z]|$)/i)
    if (!summaryMatch) return content
    
    let summarySection = summaryMatch[0]
    const summaryContent = summaryMatch[2].trim()
    
    // Add relevant keywords naturally to summary
    const relevantKeywords = jobDescription.keywords.filter(keyword => 
      keyword.length > 3 && 
      keyword.length < 20 &&
      !summaryContent.toLowerCase().includes(keyword.toLowerCase()) &&
      /(design|creative|visual|brand|marketing|digital|project|management|team|leadership|innovative|strategic|analytical)/i.test(keyword)
    ).slice(0, 3)
    
    if (relevantKeywords.length > 0) {
      // Add keywords naturally at the end of summary
      const enhancedSummary = summaryContent + ` Experienced in ${relevantKeywords.join(', ')} with a focus on delivering exceptional results.`
      summarySection = summarySection.replace(summaryContent, enhancedSummary)
      changesLog.push(`Enhanced professional summary with ${relevantKeywords.length} relevant keywords: ${relevantKeywords.join(', ')}`)
    }
    
    return content.replace(summaryMatch[0], summarySection)
  }

  private static enhanceExperienceSection(content: string, jobDescription: JobDescription, changesLog: string[]): string {
    // Find experience sections and enhance bullet points
    const experienceMatch = content.match(/(PROFESSIONAL EXPERIENCE|EXPERIENCE|WORK EXPERIENCE)([\s\S]*?)(?=\n\n[A-Z]|$)/i)
    if (!experienceMatch) return content
    
    let experienceSection = experienceMatch[0]
    
    // Add power words and quantify achievements where possible
    const powerWords = ['Spearheaded', 'Orchestrated', 'Championed', 'Streamlined', 'Optimized', 'Pioneered', 'Executed', 'Delivered']
    const enhancements = [
      'resulting in improved efficiency',
      'leading to increased client satisfaction',
      'contributing to brand recognition',
      'enhancing user experience',
      'driving project success'
    ]
    
    // Find bullet points and enhance some of them
    const bulletPoints = experienceSection.match(/^[•\-\*]\s.+$/gm) || []
    let enhancedCount = 0
    
    bulletPoints.slice(0, 2).forEach((bullet, index) => {
      if (!bullet.includes('resulting in') && !bullet.includes('leading to') && !bullet.includes('contributing to')) {
        const enhancement = enhancements[index % enhancements.length]
        const enhancedBullet = bullet + ', ' + enhancement
        experienceSection = experienceSection.replace(bullet, enhancedBullet)
        enhancedCount++
      }
    })
    
    if (enhancedCount > 0) {
      changesLog.push(`Enhanced ${enhancedCount} experience bullet points with impact statements`)
    }
    
    // Add relevant skills to experience descriptions
    const relevantJobSkills = jobDescription.requiredSkills.concat(jobDescription.preferredSkills)
      .filter(skill => skill.length < 20 && /(adobe|design|project|management|marketing|digital|creative)/i.test(skill))
      .slice(0, 2)
    
    if (relevantJobSkills.length > 0) {
      // Add a new bullet point with relevant skills
      const skillsBullet = `• Utilized ${relevantJobSkills.join(' and ')} to deliver comprehensive solutions aligned with business objectives`
      experienceSection += '\n' + skillsBullet
      changesLog.push(`Added experience bullet highlighting ${relevantJobSkills.join(' and ')} skills`)
    }
    
    return content.replace(experienceMatch[0], experienceSection)
  }

  private static enhanceSkillsSections(content: string, jobSkills: string[], jobDescription: JobDescription, changesLog: string[]): string {
    let enhancedContent = content
    
    // Enhance Technical Skills section
    const technicalMatch = enhancedContent.match(/(TECHNICAL SKILLS)([\s\S]*?)(?=\n\n|FUNCTIONAL SKILLS|$)/i)
    if (technicalMatch) {
      const relevantTechSkills = jobSkills.filter(skill => 
        !technicalMatch[0].toLowerCase().includes(skill.toLowerCase()) &&
        /(adobe|photoshop|illustrator|indesign|html|css|javascript|wordpress|design|digital|web|responsive)/i.test(skill)
      ).slice(0, 3)
      
      if (relevantTechSkills.length > 0) {
        const originalSection = technicalMatch[0]
        const enhancedSection = originalSection + ' | ' + relevantTechSkills.join(' | ')
        enhancedContent = enhancedContent.replace(originalSection, enhancedSection)
        changesLog.push(`Added ${relevantTechSkills.length} technical skills: ${relevantTechSkills.join(', ')}`)
      }
    }
    
    // Enhance Functional Skills section
    const functionalMatch = enhancedContent.match(/(FUNCTIONAL SKILLS)([\s\S]*?)(?=\n\n|$)/i)
    if (functionalMatch) {
      const relevantFunctionalSkills = jobSkills.filter(skill => 
        !functionalMatch[0].toLowerCase().includes(skill.toLowerCase()) &&
        /(project|management|communication|leadership|teamwork|collaboration|problem|analytical|strategic|planning)/i.test(skill)
      ).slice(0, 3)
      
      if (relevantFunctionalSkills.length > 0) {
        const originalSection = functionalMatch[0]
        const enhancedSection = originalSection + ' | ' + relevantFunctionalSkills.join(' | ')
        enhancedContent = enhancedContent.replace(originalSection, enhancedSection)
        changesLog.push(`Added ${relevantFunctionalSkills.length} functional skills: ${relevantFunctionalSkills.join(', ')}`)
      }
    }
    
    return enhancedContent
  }

  private static optimizeSectionHeaders(content: string, changesLog: string[]): string {
    // Ensure section headers are ATS-friendly
    let optimizedContent = content
    const headerOptimizations = {
      'WORK EXPERIENCE': 'PROFESSIONAL EXPERIENCE',
      'EMPLOYMENT HISTORY': 'PROFESSIONAL EXPERIENCE',
      'CAREER HISTORY': 'PROFESSIONAL EXPERIENCE',
      'SKILLS & COMPETENCIES': 'CORE COMPETENCIES',
      'ABILITIES': 'SKILLS',
      'QUALIFICATIONS': 'SKILLS'
    }
    
    let headerChanges = 0
    Object.entries(headerOptimizations).forEach(([old, newHeader]) => {
      if (optimizedContent.includes(old)) {
        optimizedContent = optimizedContent.replace(old, newHeader)
        headerChanges++
      }
    })
    
    if (headerChanges > 0) {
      changesLog.push(`Optimized ${headerChanges} section headers for ATS compatibility`)
    }
    
    return optimizedContent
  }

  private static addRelevantKeywords(content: string, keywords: string[], changesLog: string[]): string {
    // Add a new section with relevant keywords if they're missing
    const missingKeywords = keywords.filter(keyword => 
      keyword.length > 3 && 
      keyword.length < 25 &&
      !content.toLowerCase().includes(keyword.toLowerCase()) &&
      /(design|creative|brand|marketing|project|digital|visual|strategic|innovative|analytical|leadership|management)/i.test(keyword)
    ).slice(0, 5)
    
    if (missingKeywords.length > 0) {
      const keywordSection = `\n\nCORE COMPETENCIES\n${missingKeywords.join(' | ')}`
      const enhancedContent = content + keywordSection
      changesLog.push(`Added Core Competencies section with ${missingKeywords.length} relevant keywords: ${missingKeywords.join(', ')}`)
      return enhancedContent
    }
    
    return content
  }

  private static addMinimalSkills(originalSkills: string[], jobSkills: string[], jobDescription: JobDescription): string[] {
    const enhancedSkills = [...originalSkills]
    const originalSkillsLower = originalSkills.map(s => s.toLowerCase())
    
    console.log('🎯 Skill matching debug:')
    console.log('Original skills:', originalSkills)
    console.log('Job skills to check:', jobSkills.slice(0, 10))
    
    // Add relevant missing skills that are simple terms - made more permissive
    const relevantJobSkills = jobSkills.filter(jobSkill => {
      const isNotAlreadyPresent = !originalSkillsLower.includes(jobSkill.toLowerCase())
      const isReasonableLength = jobSkill.length < 30 // Increased from 25
      const isNotTooComplex = jobSkill.split(' ').length <= 4 // Increased from 3
      const isValidFormat = /^[a-zA-Z\s\-&.0-9+#()\/]+$/.test(jobSkill) // More permissive
      
      // Much broader skill categories - focus on practical skills
      const isRelevantSkill = /(adobe|photoshop|illustrator|indesign|powerpoint|keynote|presentation|brand|visual|creative|design|layout|typography|infographic|marketing|digital|social|media|content|web|responsive|html|css|javascript|bootstrap|wordpress|github|git|project|management|collaboration|communication|teamwork|leadership|problem|solving|analytical|organizational|time|attention|detail|microsoft|office|word|excel|outlook|canva|figma|sketch|ui|ux|graphic|print|publishing|advertising|campaign|strategy|planning|research|analysis|reporting|documentation|training|client|customer|stakeholder)/i.test(jobSkill)
      
      console.log(`Checking "${jobSkill}":`, {
        isNotAlreadyPresent,
        isReasonableLength,
        isNotTooComplex,
        isValidFormat,
        isRelevantSkill
      })
      
      return isNotAlreadyPresent && isReasonableLength && isNotTooComplex && isValidFormat && isRelevantSkill
    }).slice(0, 5) // Increased to 5 skills max
    
    console.log('Relevant job skills found:', relevantJobSkills)
    
    // If no relevant skills were found from job description, add some common ones
    if (relevantJobSkills.length === 0) {
      console.log('⚠️ No relevant skills found from job, adding common design/marketing skills')
      const commonSkills = ['Adobe Creative Suite', 'Microsoft PowerPoint', 'Brand Guidelines', 'Visual Communication', 'Project Coordination']
      const skillsToAdd = commonSkills.filter(skill => 
        !originalSkillsLower.includes(skill.toLowerCase())
      ).slice(0, 2)
      
      skillsToAdd.forEach(skill => {
        enhancedSkills.push(skill)
        console.log(`✅ Added common skill: ${skill}`)
      })
    } else {
      relevantJobSkills.forEach(skill => {
        enhancedSkills.push(skill)
        console.log(`✅ Added skill: ${skill}`)
      })
    }
    
    return enhancedSkills
  }

  private static enhanceSummary(originalSummary: string, jobDescription: JobDescription, missingSkills: string[]): string {
    // For now, let's NOT modify the summary at all to preserve the original content
    // Only return the original summary unchanged
    return originalSummary
    
    /* 
    // Future enhancement logic (currently disabled to preserve original content):
    let enhancedSummary = originalSummary
    
    // Only add a few relevant keywords if they're missing and relevant
    const relevantMissingSkills = missingSkills.filter(skill => 
      skill.length < 20 && // Avoid long phrases
      !originalSummary.toLowerCase().includes(skill.toLowerCase()) &&
      /^[a-zA-Z\s\-]+$/.test(skill) // Only simple skills
    ).slice(0, 1) // Max 1 addition to be conservative
    
    if (relevantMissingSkills.length > 0) {
      // Add skills naturally to the end
      const lastChar = enhancedSummary.trim().slice(-1)
      const separator = lastChar === '.' ? ' ' : '. '
      enhancedSummary += `${separator}Experienced with ${relevantMissingSkills.join(' and ')}.`
    }
    
    return enhancedSummary
    */
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
