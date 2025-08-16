'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Briefcase, Sparkles } from 'lucide-react'

interface JobDescriptionInputProps {
  onJobDescriptionSubmit: (jobData: {
    title: string
    company: string
    description: string
  }) => void
  className?: string
}

export function JobDescriptionInput({
  onJobDescriptionSubmit,
  className = ''
}: JobDescriptionInputProps) {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = async () => {
    if (!description.trim()) return

    setIsAnalyzing(true)
    
    try {
      // Here we'll add the actual job description analysis
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate processing
      
      onJobDescriptionSubmit({
        title: jobTitle,
        company: company,
        description: description
      })
    } catch (error) {
      console.error('Error analyzing job description:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const isValid = description.trim().length > 50

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Job Description
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <Input
              id="job-title"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company (Optional)
            </label>
            <Input
              id="company"
              placeholder="e.g., Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description *
          </label>
          <Textarea
            id="job-description"
            placeholder="Paste the complete job description here. Include requirements, responsibilities, and preferred qualifications for best results..."
            className="min-h-[200px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            {description.length} characters (minimum 50 required)
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Sparkles className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Tips for better results:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Include the complete job posting with requirements and responsibilities</li>
                <li>• Copy preferred qualifications and desired skills</li>
                <li>• Include company information if available</li>
                <li>• The more detailed the job description, the better the optimization</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isValid || isAnalyzing}
          className="w-full"
          variant="primary"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing Job Requirements...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze & Optimize Resume
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
