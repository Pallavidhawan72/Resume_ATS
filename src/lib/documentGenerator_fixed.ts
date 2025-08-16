import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { ResumeData } from '@/types/resume'

export class DocumentGenerator {
  static async generatePDF(resumeData: ResumeData): Promise<Buffer> {
    const pdf = new jsPDF()
    let yPosition = 20

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      pdf.setFontSize(fontSize)
      if (isBold) {
        pdf.setFont('helvetica', 'bold')
      } else {
        pdf.setFont('helvetica', 'normal')
      }
      
      const lines = pdf.splitTextToSize(text, 170)
      pdf.text(lines, 20, yPosition)
      yPosition += lines.length * (fontSize * 0.4) + 5
      
      // Add new page if needed
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
    }

    // Use the FULL original content instead of just extracted sections
    if (resumeData.content && resumeData.content.trim().length > 0) {
      // Split content into lines and process
      const lines = resumeData.content.split('\n')
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.length === 0) {
          yPosition += 3 // Add some space for empty lines
          continue
        }
        
        // Check if this is a heading (all caps, short line)
        const isHeading = /^[A-Z\s&]+$/.test(trimmedLine) && 
                         trimmedLine.length < 80 && 
                         !/\d/.test(trimmedLine) &&
                         !trimmedLine.includes('@') &&
                         !trimmedLine.includes('+')
        
        // Check if this is a name (first line, title case)
        const isName = lines.indexOf(line) < 3 && 
                      /^[A-Z][a-z]+ [A-Z][a-z]+/.test(trimmedLine) &&
                      !trimmedLine.includes('@')
        
        if (isName) {
          addText(trimmedLine, 18, true)
        } else if (isHeading && trimmedLine.length > 5) {
          addText(trimmedLine, 12, true)
          yPosition += 2
        } else {
          addText(trimmedLine, 10, false)
        }
      }
    } else {
      // Fallback to section-based generation if content is empty
      this.generatePDFFromSections(pdf, resumeData, addText, yPosition)
    }

    return Buffer.from(pdf.output('arraybuffer'))
  }

  private static generatePDFFromSections(pdf: any, resumeData: ResumeData, addText: Function, yPosition: number) {
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
    // Create paragraphs from the full resume content
    const paragraphs: any[] = []
    
    if (resumeData.content && resumeData.content.trim().length > 0) {
      // Use the FULL original content
      const lines = resumeData.content.split('\n')
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.length === 0) {
          // Add empty paragraph for spacing
          paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }))
          continue
        }
        
        // Check if this is a heading
        const isHeading = /^[A-Z\s&]+$/.test(trimmedLine) && 
                         trimmedLine.length < 80 && 
                         !/\d/.test(trimmedLine) &&
                         !trimmedLine.includes('@') &&
                         !trimmedLine.includes('+')
        
        // Check if this is a name
        const isName = lines.indexOf(line) < 3 && 
                      /^[A-Z][a-z]+ [A-Z][a-z]+/.test(trimmedLine) &&
                      !trimmedLine.includes('@')
        
        if (isName) {
          paragraphs.push(new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [new TextRun({ text: trimmedLine, bold: true, size: 32 })]
          }))
        } else if (isHeading && trimmedLine.length > 5) {
          paragraphs.push(new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: trimmedLine, bold: true, size: 24 })]
          }))
        } else {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: trimmedLine, size: 20 })]
          }))
        }
      }
    } else {
      // Fallback to section-based generation
      paragraphs.push(...this.generateWordFromSections(resumeData))
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    })

    return await Packer.toBuffer(doc)
  }

  private static generateWordFromSections(resumeData: ResumeData): any[] {
    const paragraphs: any[] = []
    
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
