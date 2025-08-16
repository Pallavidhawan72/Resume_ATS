import { NextRequest, NextResponse } from 'next/server'
import { DocumentGenerator } from '@/lib/documentGenerator'
import { ResumeData } from '@/types/resume'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeData } = body

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      )
    }

    // Generate PDF
    const pdfBuffer = await DocumentGenerator.generatePDF(resumeData as ResumeData)

    // Set headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="${resumeData.sections?.personalInfo?.name || 'resume'}_optimized.pdf"`)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF. Please try again.' },
      { status: 500 }
    )
  }
}
