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

    // Generate Word document
    const wordBuffer = await DocumentGenerator.generateWord(resumeData as ResumeData)

    // Set headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    headers.set('Content-Disposition', `attachment; filename="${resumeData.sections?.personalInfo?.name || 'resume'}_optimized.docx"`)

    return new NextResponse(new Uint8Array(wordBuffer), {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Word generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Word document. Please try again.' },
      { status: 500 }
    )
  }
}
