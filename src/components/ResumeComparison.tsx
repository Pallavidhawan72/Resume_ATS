'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react'
import { ResumeData } from '@/types/resume'

interface ResumeComparisonProps {
  originalResume: ResumeData
  optimizedResume: ResumeData
  className?: string
}

export function ResumeComparison({
  originalResume,
  optimizedResume,
  className = ''
}: ResumeComparisonProps) {
  const [showOriginal, setShowOriginal] = useState(true)
  const [showOptimized, setShowOptimized] = useState(true)

  // Calculate improvements
  const originalSkillsCount = originalResume.sections.skills?.length || 0
  const optimizedSkillsCount = optimizedResume.sections.skills?.length || 0
  const addedSkills = optimizedSkillsCount - originalSkillsCount

  const originalSummaryLength = originalResume.sections.summary?.length || 0
  const optimizedSummaryLength = optimizedResume.sections.summary?.length || 0

  // Get changes log if available
  const changesLog = (optimizedResume as { changesLog?: string[] }).changesLog || []
  const contentLengthDiff = (optimizedResume.content?.length || 0) - (originalResume.content?.length || 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Resume Comparison
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              +{addedSkills} skills added
            </Badge>
            <Badge variant="outline">
              +{contentLengthDiff} characters
            </Badge>
            {changesLog.length > 0 && (
              <Badge variant="default">
                {changesLog.length} sections enhanced
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Toggle Controls */}
          <div className="flex space-x-4">
            <Button
              variant={showOriginal ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              {showOriginal ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              Original Resume
            </Button>
            <Button
              variant={showOptimized ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOptimized(!showOptimized)}
            >
              {showOptimized ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              Optimized Resume
            </Button>
          </div>

          {/* Changes Summary */}
          {changesLog.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-green-700 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Key Improvements Made
              </h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {changesLog.map((change: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Full Resume Content Comparison */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Complete Resume Content</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {showOriginal && (
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h5 className="font-medium text-sm text-gray-600 mb-2">Original Resume</h5>
                  <div className="text-sm whitespace-pre-wrap font-mono text-xs">
                    {originalResume.content || "No content found"}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Content length: {(originalResume.content || "").length} characters
                  </div>
                </div>
              )}
              
              {showOptimized && (
                <div className="border rounded-lg p-4 bg-green-50 border-green-200 max-h-96 overflow-y-auto">
                  <h5 className="font-medium text-sm text-green-700 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Optimized Resume
                  </h5>
                  <div className="text-sm whitespace-pre-wrap font-mono text-xs">
                    {optimizedResume.content || "No content found"}
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    Content length: {(optimizedResume.content || "").length} characters
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills Comparison */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Skills Enhancement</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {showOriginal && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-sm text-gray-600 mb-2">Original Skills ({originalSkillsCount})</h5>
                  <div className="text-sm">
                    {originalResume.sections.skills && originalResume.sections.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {originalResume.sections.skills.map((skill: string, index: number) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "No skills found"
                    )}
                  </div>
                </div>
              )}
              
              {showOptimized && (
                <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <h5 className="font-medium text-sm text-green-700 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Enhanced Skills ({optimizedSkillsCount})
                  </h5>
                  <div className="text-sm">
                    {optimizedResume.sections.skills && optimizedResume.sections.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {optimizedResume.sections.skills.map((skill: string, index: number) => {
                          const isNewSkill = !originalResume.sections.skills?.includes(skill)
                          return (
                            <span 
                              key={index} 
                              className={`px-2 py-1 rounded text-xs ${
                                isNewSkill 
                                  ? 'bg-green-200 text-green-800 font-medium' 
                                  : 'bg-gray-100'
                              }`}
                            >
                              {skill}
                              {isNewSkill && <span className="ml-1">✨</span>}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      "No skills found"
                    )}
                  </div>
                  {addedSkills > 0 && (
                    <div className="mt-2 text-xs text-green-600">
                      +{addedSkills} new skills added (marked with ✨)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary Comparison */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Professional Summary</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {showOriginal && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-sm text-gray-600 mb-2">Original</h5>
                  <p className="text-sm">
                    {originalResume.sections.summary || "No summary found"}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Length: {originalSummaryLength} characters
                  </div>
                </div>
              )}
              
              {showOptimized && (
                <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <h5 className="font-medium text-sm text-green-700 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Optimized
                  </h5>
                  <p className="text-sm">
                    {optimizedResume.sections.summary}
                  </p>
                  <div className="mt-2 text-xs text-green-600">
                    Length: {optimizedSummaryLength} characters (+{optimizedSummaryLength - originalSummaryLength})
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Improvements Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              ATS Optimization Results
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Added {addedSkills} job-relevant skills and keywords
              </li>
              <li className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Enhanced professional summary with targeted keywords
              </li>
              <li className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Optimized experience section with power words
              </li>
              <li className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Improved section headers for ATS compatibility
              </li>
              {changesLog.length > 0 && (
                <li className="flex items-center text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Enhanced {changesLog.length} sections with comprehensive improvements
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
