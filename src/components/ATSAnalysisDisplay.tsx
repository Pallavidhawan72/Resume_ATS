'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, AlertCircle, TrendingUp, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeComparison } from '@/components/ResumeComparison'
import { ATSAnalysis, ResumeData } from '@/types/resume'

interface ATSAnalysisDisplayProps {
  analysis: ATSAnalysis
  originalResume: ResumeData
  optimizedResume: ResumeData
  onDownloadPDF: () => void
  onDownloadWord: () => void
  isGenerating?: boolean
  className?: string
}

export function ATSAnalysisDisplay({
  analysis,
  originalResume,
  optimizedResume,
  onDownloadPDF,
  onDownloadWord,
  isGenerating = false,
  className = ''
}: ATSAnalysisDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600'
    if (score >= 60) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall ATS Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            ATS Compatibility Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}%
              </div>
              <p className="text-sm text-gray-500">
                {analysis.score >= 80 ? 'Excellent' : 
                 analysis.score >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
            <div className="w-32 h-32">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    className={getScoreBgColor(analysis.score)}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${analysis.score}, 100`}
                  />
                </svg>
              </div>
            </div>
          </div>
          <Progress value={analysis.score} className="w-full" />
        </CardContent>
      </Card>

      {/* Keyword Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.matches.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center">
                  {match.found ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="text-sm font-medium">{match.skill}</span>
                </div>
                <Badge variant={match.importance === 'high' ? 'destructive' : 
                              match.importance === 'medium' ? 'secondary' : 'outline'}>
                  {match.importance}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Missing Important Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="destructive">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Consider adding these keywords to improve your ATS score.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                <div className="mr-3">
                  {getImpactIcon(improvement.impact)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-blue-900">{improvement.section}</h4>
                    <Badge variant={improvement.impact === 'high' ? 'destructive' : 
                                  improvement.impact === 'medium' ? 'secondary' : 'outline'}>
                      {improvement.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700">{improvement.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Suggestions */}
      {analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Resume Comparison */}
      <ResumeComparison
        originalResume={originalResume}
        optimizedResume={optimizedResume}
      />

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Download Optimized Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onDownloadPDF}
              disabled={isGenerating}
              className="flex-1"
              variant="primary"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>
            <Button
              onClick={onDownloadWord}
              disabled={isGenerating}
              className="flex-1"
              variant="outline"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download Word
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Your optimized resume with ATS-friendly formatting and keyword optimization
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
