import { NextRequest, NextResponse } from 'next/server'
import { JobDescriptionAnalyzer } from '@/lib/jobDescriptionAnalyzer'
import { ATSAnalyzer } from '@/lib/atsAnalyzer'
import { ResumeData } from '@/types/resume'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeData, jobTitle, company, jobDescription } = body

    // Validate input
    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume data and job description are required' },
        { status: 400 }
      )
    }

    if (jobDescription.length < 50) {
      return NextResponse.json(
        { error: 'Job description must be at least 50 characters long' },
        { status: 400 }
      )
    }

    // Analyze job description
    const analyzedJob = JobDescriptionAnalyzer.analyzeJobDescription(
      jobTitle || 'Position',
      company || '',
      jobDescription
    )

    // Perform ATS analysis
    const atsAnalysis = ATSAnalyzer.analyzeResume(resumeData as ResumeData, analyzedJob)

    // Generate optimized resume
    const optimizedResume = ATSAnalyzer.optimizeResumeContent(resumeData as ResumeData, analyzedJob)

    return NextResponse.json({
      success: true,
      data: {
        jobAnalysis: analyzedJob,
        atsAnalysis,
        optimizedResume
      }
    })

  } catch (error) {
    console.error('Job analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze job description. Please try again.' },
      { status: 500 }
    )
  }
}
