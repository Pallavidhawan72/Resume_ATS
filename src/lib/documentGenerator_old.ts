import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { ResumeData } from '@/types/resume'
// This file is deprecated and not used in the build. All code is commented out to prevent syntax errors.
/*
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
          yPosition += 5 // Add some space for empty lines
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
          yPosition += 3
        } else {
          addText(trimmedLine, 10, false)
        }
      }
    } else {
      // Fallback to section-based generation if content is empty
      this.generatePDFFromSections(pdf, resumeData, addText)
    }

    return Buffer.from(pdf.output('arraybuffer'))
  }

  private static generatePDFFromSections(pdf: any, resumeData: ResumeData, addText: Function) {
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
  
  // Add experience
  if (resumeData.sections.experience && resumeData.sections.experience.length > 0) {
    addText('EXPERIENCE', 14, true)
    for (const exp of resumeData.sections.experience) {
      addText(`${exp.position} | ${exp.company}`, 12, true)
      addText(`${exp.startDate} - ${exp.endDate}`, 10)
      for (const desc of exp.description) {
        addText(`• ${desc}`, 11)
      }
      yPosition += 5
    }
  }

  // Add education
  if (resumeData.sections.education && resumeData.sections.education.length > 0) {
    addText('EDUCATION', 14, true)
    for (const edu of resumeData.sections.education) {
      addText(`${edu.degree} in ${edu.field}`, 12, true)
      addText(`${edu.institution} | ${edu.startDate} - ${edu.endDate}`, 10)
      if (edu.gpa) addText(`GPA: ${edu.gpa}`, 10)
      yPosition += 5
    }
  }

  // Add skills
  if (resumeData.sections.skills && resumeData.sections.skills.length > 0) {
    addText('SKILLS', 14, true)
    addText(resumeData.sections.skills.join(', '))
  }

  return Buffer.from(pdf.output('arraybuffer'))
}

static async generateWord(resumeData: ResumeData): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header
        ...(resumeData.sections.personalInfo?.name ? [
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.sections.personalInfo.name,
                bold: true,
                size: 32
              })
            ],
            heading: HeadingLevel.TITLE
          })
        ] : []),

        // Contact Info
        ...(resumeData.sections.personalInfo ? [
          new Paragraph({
            children: [
              new TextRun({
                text: [
                  resumeData.sections.personalInfo.email,
                  resumeData.sections.personalInfo.phone,
                  resumeData.sections.personalInfo.location
                ].filter(Boolean).join(' | '),
                size: 20
              })
            ]
          }),
          ...(resumeData.sections.personalInfo.linkedin ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.sections.personalInfo.linkedin,
                  size: 20
                })
              ]
            })
          ] : [])
        ] : []),

        // Summary
        ...(resumeData.sections.summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFESSIONAL SUMMARY",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.sections.summary,
                size: 22
              })
            ]
          })
        ] : []),

        // Experience
        ...(resumeData.sections.experience && resumeData.sections.experience.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "EXPERIENCE",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          ...resumeData.sections.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.position} | ${exp.company}`,
                  bold: true,
                  size: 22
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.startDate} - ${exp.endDate}`,
                  size: 20
                })
              ]
            }),
            ...exp.description.map(desc => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${desc}`,
                    size: 22
                  })
                ]
              })
            )
          ])
        ] : []),

        // Education
        ...(resumeData.sections.education && resumeData.sections.education.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          ...resumeData.sections.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.degree} in ${edu.field}`,
                  bold: true,
                  size: 22
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.institution} | ${edu.startDate} - ${edu.endDate}`,
                  size: 20
                })
              ]
            })
          ])
        ] : []),

        // Skills
        ...(resumeData.sections.skills && resumeData.sections.skills.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "SKILLS",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.sections.skills.join(', '),
                size: 22
              })
            ]
          })
        ] : [])
      ]
    }])
  })

  return await Packer.toBuffer(doc)
}
*/

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
          yPosition += 5 // Add some space for empty lines
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
          yPosition += 3
        } else {
          addText(trimmedLine, 10, false)
        }
      }
    } else {
      // Fallback to section-based generation if content is empty
      this.generatePDFFromSections(pdf, resumeData, addText)
    }

    return Buffer.from(pdf.output('arraybuffer'))
  }

  private static generatePDFFromSections(pdf: any, resumeData: ResumeData, addText: Function) {
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
    }

    // Add experience
    if (resumeData.sections.experience && resumeData.sections.experience.length > 0) {
      addText('EXPERIENCE', 14, true)
      for (const exp of resumeData.sections.experience) {
        addText(`${exp.position} | ${exp.company}`, 12, true)
        addText(`${exp.startDate} - ${exp.endDate}`, 10)
        for (const desc of exp.description) {
          addText(`• ${desc}`, 11)
        }
        yPosition += 5
      }
    }

    // Add education
    if (resumeData.sections.education && resumeData.sections.education.length > 0) {
      addText('EDUCATION', 14, true)
      for (const edu of resumeData.sections.education) {
        addText(`${edu.degree} in ${edu.field}`, 12, true)
        addText(`${edu.institution} | ${edu.startDate} - ${edu.endDate}`, 10)
        if (edu.gpa) addText(`GPA: ${edu.gpa}`, 10)
        yPosition += 5
      }
    }

    // Add skills
    if (resumeData.sections.skills && resumeData.sections.skills.length > 0) {
      addText('SKILLS', 14, true)
      addText(resumeData.sections.skills.join(', '))
    }

    return Buffer.from(pdf.output('arraybuffer'))
  }

  static async generateWord(resumeData: ResumeData): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          ...(resumeData.sections.personalInfo?.name ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.sections.personalInfo.name,
                  bold: true,
                  size: 32
                })
              ],
              heading: HeadingLevel.TITLE
            })
          ] : []),

          // Contact Info
          ...(resumeData.sections.personalInfo ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: [
                    resumeData.sections.personalInfo.email,
                    resumeData.sections.personalInfo.phone,
                    resumeData.sections.personalInfo.location
                  ].filter(Boolean).join(' | '),
                  size: 20
                })
              ]
            }),
            ...(resumeData.sections.personalInfo.linkedin ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: resumeData.sections.personalInfo.linkedin,
                    size: 20
                  })
                ]
              })
            ] : [])
          ] : []),

          // Summary
          ...(resumeData.sections.summary ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "PROFESSIONAL SUMMARY",
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.sections.summary,
                  size: 22
                })
              ]
            })
          ] : []),

          // Experience
          ...(resumeData.sections.experience && resumeData.sections.experience.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "EXPERIENCE",
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            ...resumeData.sections.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.position} | ${exp.company}`,
                    bold: true,
                    size: 22
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.startDate} - ${exp.endDate}`,
                    size: 20
                  })
                ]
              }),
              ...exp.description.map(desc => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${desc}`,
                      size: 22
                    })
                  ]
                })
              )
            ])
          ] : []),

          // Education
          ...(resumeData.sections.education && resumeData.sections.education.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "EDUCATION",
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            ...resumeData.sections.education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.degree} in ${edu.field}`,
                    bold: true,
                    size: 22
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.institution} | ${edu.startDate} - ${edu.endDate}`,
                    size: 20
                  })
                ]
              })
            ])
          ] : []),

          // Skills
          ...(resumeData.sections.skills && resumeData.sections.skills.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "SKILLS",
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.sections.skills.join(', '),
                  size: 22
                })
              ]
            })
          ] : [])
        ]
      }]
    })

    return await Packer.toBuffer(doc)
  }
}
