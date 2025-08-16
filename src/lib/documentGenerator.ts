import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { ResumeData } from '@/types/resume'

export class DocumentGenerator {
  static async generatePDF(resumeData: ResumeData): Promise<Buffer> {
    const pdf = new jsPDF()
    let yPosition = 20

    // Helper function to add text preserving original formatting
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false, preserveSpacing: boolean = false) => {
      pdf.setFontSize(fontSize)
      if (isBold) {
        pdf.setFont('helvetica', 'bold')
      } else {
        pdf.setFont('helvetica', 'normal')
      }
      
      if (preserveSpacing) {
        // Preserve exact spacing and indentation
        pdf.text(text, 20, yPosition)
        yPosition += fontSize * 0.5 + 3
      } else {
        const lines = pdf.splitTextToSize(text, 170)
        pdf.text(lines, 20, yPosition)
        yPosition += lines.length * (fontSize * 0.4) + 5
      }
      
      // Add new page if needed
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
    }

    // PROCESS ALL RESUME CONTENT INCLUDING ALL SECTIONS
    if (resumeData.content && resumeData.content.trim().length > 0) {
      const lines = resumeData.content.split('\n')
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmedLine = line.trim()
        
        // Preserve empty lines exactly as they are
        if (trimmedLine.length === 0) {
          yPosition += 4
          continue
        }
        
        // Detect different types of content more accurately
        const originalIndentation = line.length - line.trimStart().length
        
        // Name detection (first few lines, proper case names)
        const isName = i < 5 && 
                      /^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+(\s[A-Z][a-zA-Z]+)?$/.test(trimmedLine) &&
                      !trimmedLine.includes('@') && !trimmedLine.includes('+') && !trimmedLine.includes('.')
        
        // Contact info detection (email, phone, address)
        const isContactInfo = /(@|\.com|\+\d|^\d{3}[\-\s]?\d{3}[\-\s]?\d{4}|Road|Street|Avenue|Drive|Lane|Boulevard|ON,|CANADA|linkedin\.com)/i.test(trimmedLine)
        
        // Job title detection (typically in caps)
        const isJobTitle = /^[A-Z][A-Z\s&\-]+$/.test(trimmedLine) && 
                          trimmedLine.length < 80 && 
                          (trimmedLine.includes('DESIGNER') || trimmedLine.includes('COORDINATOR') || 
                           trimmedLine.includes('MANAGER') || trimmedLine.includes('DEVELOPER') ||
                           trimmedLine.includes('SPECIALIST') || trimmedLine.includes('ANALYST'))
        
        // Section headers detection (expanded to catch all sections)
        const isSectionHeader = /^[A-Z][A-Z\s\-]+$/.test(trimmedLine) && 
                               trimmedLine.length < 60 &&
                               /(PROFESSIONAL|SUMMARY|EXPERIENCE|EDUCATION|SKILLS|COMPETENCIES|AWARDS|TECHNICAL|FUNCTIONAL|CERTIFICATIONS|INTERNSHIPS|EMPLOYMENT|WORK|PROJECTS|ACHIEVEMENTS|QUALIFICATIONS|TRAINING|LANGUAGES|REFERENCES|VOLUNTEER)/.test(trimmedLine)
        
        // Company/Institution detection (broader patterns)
        const isCompanyName = /^[A-Z][A-Z\s&\-,\.]+(\s–\s|\s-\s|\sÂ\s|\s\|\s)/.test(trimmedLine) ||
                             /LTD|INC|CORP|LLC|COLLEGE|UNIVERSITY|TECHNOLOGY|MANUFACTURING|SOLUTIONS|SERVICES|GROUP|COMPANY/i.test(trimmedLine) ||
                             (trimmedLine.includes(' – ') && /^[A-Z]/.test(trimmedLine))
        
        // Position/Role detection (job titles with dates or descriptions)
        const isPosition = (originalIndentation > 0 || /\(.*\d{4}.*\)/.test(trimmedLine)) && 
                          (/coordinator|designer|manager|internship|developer|analyst|specialist|assistant|lead|senior|junior/i.test(trimmedLine) || 
                           /\(.*\d{4}.*\)/.test(trimmedLine) ||
                           /\d{4}\s*-\s*\d{4}/.test(trimmedLine))
        
        // Bullet points detection (various bullet styles)
        const isBulletPoint = /^[•·\-\*\+]\s/.test(trimmedLine) || 
                             (originalIndentation > 0 && /^(Designed|Created|Assisted|Led|Managed|Developed|Collaborated|Conducted|Implemented|Coordinated|Executed|Maintained|Optimized|Analyzed|Built|Established|Delivered)/.test(trimmedLine))
        
        // Date detection (standalone dates)
        const isDate = /^\d{4}\s*-\s*\d{4}$/.test(trimmedLine) || /^\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4}$/.test(trimmedLine)
        
        // Skills list detection
        const isSkillsList = /^(HTML|CSS|JavaScript|PHP|MySQL|Adobe|Photoshop|Illustrator|InDesign|WordPress|jQuery|Bootstrap|Git|Python|Java|C\+\+|React|Vue|Angular|Node|Express|MongoDB|SQL|AWS|Azure|Google|Microsoft|Office|Excel|PowerPoint|Word|Outlook|Slack|Trello|Asana|Jira|Figma|Sketch|XD|Canva|GIMP|Final Cut|Premiere|After Effects|Maya|Blender|Unity|Unreal|Android|iOS|Swift|Kotlin|Flutter|React Native|Docker|Kubernetes|Jenkins|Travis|GitHub|GitLab|Bitbucket|Heroku|Netlify|Vercel|DigitalOcean|Linode|Vultr|Cloudflare|Stripe|PayPal|Mailchimp|SendGrid|Twilio|Zapier|IFTTT|Google Analytics|Facebook Ads|Google Ads|SEO|SEM|SMM|Content Marketing|Email Marketing|Affiliate Marketing|Influencer Marketing|Brand Management|Social Media|Public Relations|Customer Service|Sales|Business Development|Project Management|Agile|Scrum|Kanban|Lean|Six Sigma|PMP|PRINCE2|ITIL|ISO|GDPR|HIPAA|SOX|PCI|NIST|OWASP|CISSP|CISM|CISA|CEH|OSCP|SANS|CompTIA|Cisco|Microsoft|Amazon|Google|Oracle|Salesforce|HubSpot|Marketo|Pardot|Eloqua|MailChimp|Constant Contact|AWeber|GetResponse|ConvertKit|ActiveCampaign|Drip|Infusionsoft|Ontraport|ClickFunnels|Leadpages|Unbounce|Instapage|Optimizely|VWO|Hotjar|Crazy Egg|Google Tag Manager|Google Search Console|Bing Webmaster Tools|Yandex Metrica|Adobe Analytics|Mixpanel|Amplitude|Segment|Intercom|Drift|Zendesk|Freshdesk|Help Scout|Kayako|LiveChat|Olark|Tawk|Crisp|Pure Chat|Tidio|Chatra|Smartsupp|Userlike|Comm100|Bold360|SnapEngage|Provide Support|LiveAgent|Help Crunch|Groove|Front|Gorgias|Re)/.test(trimmedLine)
        
        // Choose appropriate formatting based on content type
        if (isName) {
          addText(trimmedLine, 18, true)
        } else if (isContactInfo) {
          addText(trimmedLine, 10, false)
        } else if (isJobTitle) {
          addText(trimmedLine, 14, true)
          yPosition += 2
        } else if (isSectionHeader) {
          yPosition += 5
          addText(trimmedLine, 13, true)
          yPosition += 3
        } else if (isCompanyName) {
          addText(trimmedLine, 11, true)
        } else if (isPosition) {
          addText(trimmedLine, 10, true)
        } else if (isDate) {
          addText(trimmedLine, 9, false)
        } else if (isBulletPoint) {
          addText(trimmedLine, 10, false)
        } else if (isSkillsList) {
          addText(trimmedLine, 10, false)
        } else {
          // Regular content - preserve as is
          addText(trimmedLine, 10, false)
        }
      }
    } else {
      // Generate from all available sections if no raw content
      this.generatePDFFromSections(pdf, resumeData, addText, yPosition)
    }

    return Buffer.from(pdf.output('arraybuffer'))
  }

  private static generatePDFFromSections(pdf: unknown, resumeData: ResumeData, addText: (text: string, fontSize?: number, isBold?: boolean, preserveSpacing?: boolean) => void, yPosition: number) {
    // Fallback method using extracted sections (previous implementation)
    
    // Add header
    if (resumeData.sections.personalInfo?.name) {
      addText(resumeData.sections.personalInfo.name, 18, true)
    }

    // Add contact info
    const contact = resumeData.sections.personalInfo
    if (contact) {
      let contactLine = ''
      if (contact.email) contactLine += contact.email + ' | '
      if (contact.phone) contactLine += contact.phone + ' | '
      if (contact.location) contactLine += contact.location
      if (contactLine) {
        addText(contactLine.replace(/\s\|\s$/, ''), 10)
      }
      if (contact.linkedin) {
        addText(contact.linkedin, 10)
      }
    }

    // Add summary
    if (resumeData.sections.summary) {
      addText('PROFESSIONAL SUMMARY', 14, true)
      addText(resumeData.sections.summary)
    }

    // Add skills
    if (resumeData.sections.skills && resumeData.sections.skills.length > 0) {
      addText('SKILLS', 14, true)
      addText(resumeData.sections.skills.join(', '))
    }
  }

  static async generateWord(resumeData: ResumeData): Promise<Buffer> {
    const paragraphs: any[] = []
    
    // PROCESS ALL RESUME CONTENT INCLUDING ALL SECTIONS  
    if (resumeData.content && resumeData.content.trim().length > 0) {
      const lines = resumeData.content.split('\n')
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmedLine = line.trim()
        
        // Preserve empty lines for spacing
        if (trimmedLine.length === 0) {
          paragraphs.push(new Paragraph({ 
            children: [new TextRun({ text: "" })],
            spacing: { after: 120 }
          }))
          continue
        }
        
        const originalIndentation = line.length - line.trimStart().length
        
        // Enhanced content detection (same as PDF version)
        const isName = i < 5 && 
                      /^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+(\s[A-Z][a-zA-Z]+)?$/.test(trimmedLine) &&
                      !trimmedLine.includes('@') && !trimmedLine.includes('+') && !trimmedLine.includes('.')
        
        const isContactInfo = /(@|\.com|\+\d|^\d{3}[\-\s]?\d{3}[\-\s]?\d{4}|Road|Street|Avenue|Drive|Lane|Boulevard|ON,|CANADA|linkedin\.com)/i.test(trimmedLine)
        
        const isJobTitle = /^[A-Z][A-Z\s&\-]+$/.test(trimmedLine) && 
                          trimmedLine.length < 80 && 
                          (trimmedLine.includes('DESIGNER') || trimmedLine.includes('COORDINATOR') || 
                           trimmedLine.includes('MANAGER') || trimmedLine.includes('DEVELOPER') ||
                           trimmedLine.includes('SPECIALIST') || trimmedLine.includes('ANALYST'))
        
        const isSectionHeader = /^[A-Z][A-Z\s\-]+$/.test(trimmedLine) && 
                               trimmedLine.length < 60 &&
                               /(PROFESSIONAL|SUMMARY|EXPERIENCE|EDUCATION|SKILLS|COMPETENCIES|AWARDS|TECHNICAL|FUNCTIONAL|CERTIFICATIONS|INTERNSHIPS|EMPLOYMENT|WORK|PROJECTS|ACHIEVEMENTS|QUALIFICATIONS|TRAINING|LANGUAGES|REFERENCES|VOLUNTEER)/.test(trimmedLine)
        
        const isCompanyName = /^[A-Z][A-Z\s&\-,\.]+(\s–\s|\s-\s|\sÂ\s|\s\|\s)/.test(trimmedLine) ||
                             /LTD|INC|CORP|LLC|COLLEGE|UNIVERSITY|TECHNOLOGY|MANUFACTURING|SOLUTIONS|SERVICES|GROUP|COMPANY/i.test(trimmedLine) ||
                             (trimmedLine.includes(' – ') && /^[A-Z]/.test(trimmedLine))
        
        const isPosition = (originalIndentation > 0 || /\(.*\d{4}.*\)/.test(trimmedLine)) && 
                          (/coordinator|designer|manager|internship|developer|analyst|specialist|assistant|lead|senior|junior/i.test(trimmedLine) || 
                           /\(.*\d{4}.*\)/.test(trimmedLine) ||
                           /\d{4}\s*-\s*\d{4}/.test(trimmedLine))
        
        const isBulletPoint = /^[•·\-\*\+]\s/.test(trimmedLine) || 
                             (originalIndentation > 0 && /^(Designed|Created|Assisted|Led|Managed|Developed|Collaborated|Conducted|Implemented|Coordinated|Executed|Maintained|Optimized|Analyzed|Built|Established|Delivered)/.test(trimmedLine))
        
        const isQuotedText = trimmedLine.startsWith('"') && trimmedLine.endsWith('"')
        
        const isDate = /^\d{4}\s*-\s*\d{4}$/.test(trimmedLine) || /^\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4}$/.test(trimmedLine)
        
        // Apply appropriate Word formatting based on content type
        if (isName) {
          paragraphs.push(new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: 'center',
            children: [new TextRun({ 
              text: trimmedLine, 
              bold: true, 
              size: 32,
              font: 'Arial'
            })],
            spacing: { after: 240 }
          }))
        } else if (isContactInfo) {
          paragraphs.push(new Paragraph({
            alignment: 'center',
            children: [new TextRun({ 
              text: trimmedLine, 
              size: 20,
              font: 'Arial'
            })],
            spacing: { after: 120 }
          }))
        } else if (isJobTitle) {
          paragraphs.push(new Paragraph({
            alignment: 'center',
            children: [new TextRun({ 
              text: trimmedLine, 
              bold: true, 
              size: 24,
              font: 'Arial'
            })],
            spacing: { before: 240, after: 120 }
          }))
        } else if (isQuotedText) {
          paragraphs.push(new Paragraph({
            alignment: 'center',
            children: [new TextRun({ 
              text: trimmedLine, 
              italics: true,
              size: 22,
              font: 'Arial'
            })],
            spacing: { after: 240 }
          }))
        } else if (isSectionHeader) {
          paragraphs.push(new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ 
              text: trimmedLine, 
              bold: true, 
              size: 24,
              font: 'Arial'
            })],
            spacing: { before: 360, after: 180 }
          }))
        } else if (isCompanyName) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ 
              text: trimmedLine, 
              bold: true, 
              size: 22,
              font: 'Arial'
            })],
            spacing: { before: 180, after: 60 }
          }))
        } else if (isPosition) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ 
              text: trimmedLine, 
              bold: true, 
              size: 20,
              font: 'Arial'
            })],
            spacing: { after: 120 }
          }))
        } else if (isDate) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ 
              text: trimmedLine, 
              size: 18,
              font: 'Arial'
            })],
            spacing: { after: 60 }
          }))
        } else if (isBulletPoint) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ 
              text: trimmedLine, 
              size: 20,
              font: 'Arial'
            })],
            spacing: { after: 60 },
            indent: { left: 360 }
          }))
        } else {
          // Regular content - preserve exactly as written
          paragraphs.push(new Paragraph({
            children: [new TextRun({ 
              text: trimmedLine, 
              size: 20,
              font: 'Arial'
            })],
            spacing: { after: 120 }
          }))
        }
      }
    } else {
      // Fallback to section-based generation
      paragraphs.push(...this.generateWordFromSections(resumeData))
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: paragraphs
      }]
    })

    return await Packer.toBuffer(doc)
  }

  private static generateWordFromSections(resumeData: ResumeData): unknown[] {
    const paragraphs: unknown[] = []
    
    // Header
    if (resumeData.sections.personalInfo?.name) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({
          text: resumeData.sections.personalInfo.name,
          bold: true,
          size: 32
        })]
      }))
    }

    // Contact info
    const contact = resumeData.sections.personalInfo
    if (contact) {
      let contactLine = ''
      if (contact.email) contactLine += contact.email + ' | '
      if (contact.phone) contactLine += contact.phone + ' | '
      if (contact.location) contactLine += contact.location
      
      if (contactLine) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({
            text: contactLine.replace(/\s\|\s$/, ''),
            size: 20
          })]
        }))
      }
    }

    // Summary
    if (resumeData.sections.summary) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 24 })]
      }))
      
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: resumeData.sections.summary, size: 20 })]
      }))
    }

    // Skills
    if (resumeData.sections.skills && resumeData.sections.skills.length > 0) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: 'SKILLS', bold: true, size: 24 })]
      }))
      
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: resumeData.sections.skills.join(', '), size: 20 })]
      }))
    }

    return paragraphs
  }
}
