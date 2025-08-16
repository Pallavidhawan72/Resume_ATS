import * as mammoth from 'mammoth'
import { ResumeData, PersonalInfo, Experience, Education } from '@/types/resume'
import { generateResumeId } from './idGenerator'

export class ResumeParser {
  static async parseFile(file: Buffer, fileName: string): Promise<string> {
    const fileExtension = fileName.split('.').pop()?.toLowerCase()

    switch (fileExtension) {
      case 'pdf':
        // For now, we'll return a message for PDF files
        // In a production app, you'd use a proper PDF parser
        return "PDF parsing is currently under maintenance. Please upload a Word document or text file for best results. If you need to use a PDF, please convert it to a Word document first."
      case 'doc':
      case 'docx':
        return await this.parseWord(file)
      case 'txt':
        return file.toString('utf-8')
      default:
        throw new Error('Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files.')
    }
  }

  private static async parseWord(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    } catch (error) {
      throw new Error('Failed to parse Word document')
    }
  }

  static extractPersonalInfo(text: string): PersonalInfo {
    const personalInfo: PersonalInfo = {
      name: '',
      email: '',
      phone: '',
      location: ''
    }

    const lines = text.split('\n').filter(line => line.trim())

    // Enhanced name extraction - look for proper names in first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim()
      
      // Name patterns: First Last, First Middle Last, etc.
      if (/^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+(\s[A-Z][a-zA-Z]+)?$/.test(line) &&
          !line.includes('@') && !line.includes('+') && !line.includes('Road') && !line.includes('Street')) {
        personalInfo.name = line
        break
      }
    }

    // Enhanced email extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
    if (emailMatch && emailMatch.length > 0) {
      personalInfo.email = emailMatch[0]
    }

    // Enhanced phone extraction - handle international formats
    const phoneMatches = text.match(/(\+\d{1,3}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g)
    if (phoneMatches && phoneMatches.length > 0) {
      personalInfo.phone = phoneMatches[0]
    }

    // Enhanced location extraction - look for address patterns
    const locationPatterns = [
      /\d+\s+[A-Za-z\s]+(?:Road|Street|Avenue|Drive|Lane|Way|Court|Place)\s+[A-Z0-9]{3,}\s+[A-Za-z\s]+,\s*[A-Z]{2,3},?\s*[A-Z]{2,}/,
      /[A-Za-z\s]+,\s*[A-Z]{2,3}(?:\s*[A-Z0-9]{3}\s*[A-Z0-9]{3})?\s*[A-Za-z\s]*,?\s*[A-Z]{2,}/,
      /[A-Z0-9]{3}\s*[A-Z0-9]{3}\s+[A-Za-z\s]+,\s*[A-Z]{2,}/
    ]
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern)
      if (match) {
        personalInfo.location = match[0].trim()
        break
      }
    }

    // Enhanced LinkedIn extraction
    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i)
    if (linkedinMatch) {
      personalInfo.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`
    }

    return personalInfo
  }

  static extractSections(text: string): {
    summary?: string
    experience?: Experience[]
    education?: Education[]
    skills?: string[]
  } {
    const sections: any = {}

    // Normalize text for better parsing
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    // Extract professional summary - look for longer descriptive paragraphs
    let summaryText = ''
    let foundSummarySection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check if this is a summary section header
      if (/^(professional\s+summary|summary|objective|profile)/i.test(line)) {
        foundSummarySection = true
        continue
      }
      
      // If we found the summary section, collect the content
      if (foundSummarySection) {
        // Stop if we hit another major section
        if (/^(core\s+competencies|professional\s+experience|experience|education|skills|technical|awards|certifications)/i.test(line)) {
          break
        }
        
        // Add lines that look like summary content
        if (line.length > 20) {
          summaryText += line + ' '
        }
      }
      
      // Also catch descriptive lines that look like summaries (even without headers)
      else if (!foundSummarySection && 
               line.length > 100 && 
               /\b(innovative|creative|experienced|skilled|passionate|design|technical|professional)\b/i.test(line) &&
               !/^(experience|education|skills|awards)/i.test(line)) {
        summaryText += line + ' '
      }
    }
    
    if (summaryText.trim()) {
      sections.summary = summaryText.trim()
    }

    // Extract ALL technical and functional skills
    const skillsSet = new Set<string>()
    let inSkillsSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check for skills section headers
      if (/^(technical\s+skills|functional\s+skills|core\s+competencies|skills)/i.test(line)) {
        inSkillsSection = true
        continue
      }
      
      if (inSkillsSection) {
        // Stop if we hit another major section
        if (/^(professional\s+experience|experience|education|awards|certifications|internships)/i.test(line)) {
          break
        }
        
        // Process skills lines
        if (line.length > 0) {
          // Handle different skill formats
          let skillsInLine: string[] = []
          
          // Check if line starts with category (like "Front-End:-")
          if (line.includes(':-') || line.includes(':')) {
            const parts = line.split(/:-|:/)
            if (parts.length > 1) {
              skillsInLine = parts[1].split(/[|,•·\-]/)
            }
          } else {
            // Regular skill line
            skillsInLine = line.split(/[|,•·]/)
          }
          
          skillsInLine.forEach(skill => {
            const cleanSkill = skill.replace(/^[\s\-•·|:-]+|[\s\-•·|:-]+$/g, '').trim()
            if (cleanSkill.length > 1 && cleanSkill.length < 50) {
              skillsSet.add(cleanSkill)
            }
          })
        }
      }
    }
    
    if (skillsSet.size > 0) {
      sections.skills = Array.from(skillsSet)
    }

    // Extract experience - preserve the detailed structure
    const experienceEntries: any[] = []
    let inExperienceSection = false
    let currentExperience: any = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (/^(professional\s+experience|experience)/i.test(line)) {
        inExperienceSection = true
        continue
      }
      
      if (inExperienceSection) {
        if (/^(education|internships|awards|certifications|technical|skills)/i.test(line)) {
          // Save current experience if exists
          if (currentExperience) {
            experienceEntries.push(currentExperience)
          }
          break
        }
        
        // Check if this looks like a company/position line
        if (line.includes('–') || line.includes('-') || /\d{4}/.test(line)) {
          // Save previous experience
          if (currentExperience) {
            experienceEntries.push(currentExperience)
          }
          
          // Start new experience entry
          currentExperience = {
            company: line,
            position: '',
            description: [],
            startDate: '',
            endDate: ''
          }
        } else if (currentExperience && line.length > 10) {
          // Add to current experience description
          currentExperience.description.push(line)
        }
      }
    }
    
    // Don't forget the last experience
    if (currentExperience) {
      experienceEntries.push(currentExperience)
    }
    
    if (experienceEntries.length > 0) {
      sections.experience = experienceEntries
    }

    // Extract education
    const educationEntries: any[] = []
    let inEducationSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (/^education/i.test(line)) {
        inEducationSection = true
        continue
      }
      
      if (inEducationSection) {
        if (/^(awards|certifications|technical|skills)/i.test(line)) {
          break
        }
        
        if (line.length > 10) {
          educationEntries.push({
            institution: line,
            degree: '',
            field: '',
            startDate: '',
            endDate: ''
          })
        }
      }
    }
    
    if (educationEntries.length > 0) {
      sections.education = educationEntries
    }

    return sections
  }

  static createResumeData(fileName: string, content: string): ResumeData {
    const personalInfo = this.extractPersonalInfo(content)
    const sections = this.extractSections(content)

    return {
      id: generateResumeId(fileName, content),
      fileName,
      content,
      sections: {
        personalInfo,
        ...sections
      },
      uploadedAt: new Date('2025-01-01') // Use fixed date to avoid hydration issues
    }
  }
}
