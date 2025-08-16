'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { JobDescriptionInput } from '@/components/JobDescriptionInput'
import { ATSAnalysisDisplay } from '@/components/ATSAnalysisDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Zap, CheckCircle } from 'lucide-react'
import { ResumeData, ATSAnalysis } from '@/types/resume'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [optimizedResumeData, setOptimizedResumeData] = useState<ResumeData | null>(null)
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        setResumeData(result.data)
        setCurrentStep(2)
      } else {
        alert(result.error || 'Failed to upload resume')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload resume. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleJobDescriptionSubmit = async (jobData: {
    title: string
    company: string
    description: string
  }) => {
    if (!resumeData) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData,
          jobTitle: jobData.title,
          company: jobData.company,
          jobDescription: jobData.description
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setAtsAnalysis(result.data.atsAnalysis)
        setOptimizedResumeData(result.data.optimizedResume)
        setCurrentStep(3)
      } else {
        alert(result.error || 'Failed to analyze job description')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze job description. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!optimizedResumeData) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumeData: optimizedResumeData })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${optimizedResumeData.sections?.personalInfo?.name || 'resume'}_optimized.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Failed to generate PDF')
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadWord = async () => {
    if (!optimizedResumeData) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/download-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumeData: optimizedResumeData })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${optimizedResumeData.sections?.personalInfo?.name || 'resume'}_optimized.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Failed to generate Word document')
      }
    } catch (error) {
      console.error('Word generation error:', error)
      alert('Failed to generate Word document. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const resetProcess = () => {
    setCurrentStep(1)
    setResumeData(null)
    setOptimizedResumeData(null)
    setAtsAnalysis(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Zap className="h-8 w-8 text-blue-600 mr-3" />
                ResumeATS Pro
              </h1>
              <p className="text-gray-600 mt-1">Optimize your resume for ATS systems and get more interviews</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Progress Steps */}
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                  </div>
                  <span className="ml-2 text-sm font-medium">Upload</span>
                </div>
                <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
                  </div>
                  <span className="ml-2 text-sm font-medium">Analyze</span>
                </div>
                <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    {currentStep >= 3 ? <CheckCircle className="h-5 w-5" /> : '3'}
                  </div>
                  <span className="ml-2 text-sm font-medium">Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Resume</h2>
              <p className="text-gray-600">
                Upload your current resume to start the ATS optimization process. We support DOC, DOCX, and TXT files.
                <br />
                <span className="text-sm text-orange-600">Note: PDF support is temporarily unavailable. Please upload a Word document for best results.</span>
              </p>
            </div>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedFileTypes=".doc,.docx,.txt"
              maxFileSize={5 * 1024 * 1024} // 5MB
            />

            {isProcessing && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-600 font-medium">Processing your resume...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <JobDescriptionInput
                  onJobDescriptionSubmit={handleJobDescriptionSubmit}
                />
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Uploaded Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">File:</span>
                        <span className="text-sm text-gray-600">{resumeData?.fileName}</span>
                      </div>
                      {resumeData?.sections.personalInfo?.name && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Name:</span>
                          <span className="text-sm text-gray-600">{resumeData.sections.personalInfo.name}</span>
                        </div>
                      )}
                      {resumeData?.sections.personalInfo?.email && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Email:</span>
                          <span className="text-sm text-gray-600">{resumeData.sections.personalInfo.email}</span>
                        </div>
                      )}
                      <button
                        onClick={resetProcess}
                        className="w-full mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        Upload Different Resume
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {isProcessing && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-600 font-medium">Analyzing job requirements and optimizing resume...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && atsAnalysis && resumeData && optimizedResumeData && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ATS Analysis Complete!</h2>
              <p className="text-gray-600">
                Here&apos;s your detailed ATS compatibility analysis and optimized resume download options.
              </p>
              <button
                onClick={resetProcess}
                className="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Start Over with New Resume
              </button>
            </div>

            <ATSAnalysisDisplay
              analysis={atsAnalysis}
              originalResume={resumeData}
              optimizedResume={optimizedResumeData}
              onDownloadPDF={handleDownloadPDF}
              onDownloadWord={handleDownloadWord}
              isGenerating={isGenerating}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 ResumeATS Pro. Optimize your resume for better job opportunities.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
