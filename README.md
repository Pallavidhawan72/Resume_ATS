# ResumeATS Pro

A powerful web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) and improve their chances of getting interviews.

## Features

### 🚀 Core Functionality
- **Resume Upload**: Support for PDF, DOC, DOCX, and TXT file formats
- **Job Description Analysis**: Intelligent parsing of job requirements and keywords
- **ATS Compatibility Scoring**: Comprehensive analysis with actionable feedback
- **Resume Optimization**: AI-powered suggestions for improvement
- **Document Generation**: Download optimized resumes in PDF and Word formats

### 📊 Analysis Features
- **Keyword Matching**: Identifies missing and matched keywords from job descriptions
- **Skills Gap Analysis**: Highlights required vs. preferred skills
- **Format Optimization**: Ensures ATS-friendly formatting
- **Section Analysis**: Validates resume structure and completeness
- **Scoring System**: Provides overall ATS compatibility score (0-100%)

### 🎯 Optimization Features
- **Smart Suggestions**: Personalized recommendations for improvement
- **Missing Keywords Detection**: Identifies critical terms to include
- **Impact Assessment**: Prioritizes changes by potential impact
- **Professional Formatting**: Generates clean, ATS-compatible documents

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **File Processing**: pdf-parse, mammoth, docx
- **Document Generation**: jsPDF, @react-pdf/renderer
- **Form Handling**: react-hook-form with validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-ats-pro
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Step 1: Upload Resume
- Drag and drop or select your resume file
- Supported formats: PDF, DOC, DOCX, TXT
- Maximum file size: 5MB

### Step 2: Add Job Description
- Paste the complete job posting
- Include job title and company (optional)
- The more detailed the description, the better the analysis

### Step 3: Review Analysis & Download
- View your ATS compatibility score
- Review keyword matches and gaps
- Read improvement suggestions
- Download optimized resume in PDF or Word format

## Project Structure

```
src/
├── app/
│   ├── api/                 # Next.js API routes
│   │   ├── upload-resume/   # Resume file processing
│   │   ├── analyze-job/     # Job description analysis
│   │   ├── download-pdf/    # PDF generation
│   │   └── download-word/   # Word document generation
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── FileUpload.tsx       # File upload component
│   ├── JobDescriptionInput.tsx # Job description form
│   └── ATSAnalysisDisplay.tsx  # Results display
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── resumeParser.ts      # Resume text extraction
│   ├── jobDescriptionAnalyzer.ts # Job analysis logic
│   ├── atsAnalyzer.ts       # ATS scoring algorithm
│   └── documentGenerator.ts # PDF/Word generation
└── types/
    └── resume.ts            # TypeScript type definitions
```

## API Endpoints

### POST /api/upload-resume
Processes uploaded resume files and extracts text content.

**Request**: FormData with resume file
**Response**: Parsed resume data with sections

### POST /api/analyze-job
Analyzes job description and compares with resume.

**Request**: Resume data and job description
**Response**: ATS analysis with score and suggestions

### POST /api/download-pdf
Generates optimized PDF resume.

**Request**: Resume data
**Response**: PDF file download

### POST /api/download-word
Generates optimized Word document resume.

**Request**: Resume data
**Response**: DOCX file download

## Key Features Explained

### ATS Scoring Algorithm
- **Keyword Matching (60%)**: Matches required and preferred skills
- **Format Compatibility (20%)**: Checks for ATS-friendly formatting
- **Structure Analysis (20%)**: Validates standard resume sections

### Resume Parsing
- Extracts personal information (name, email, phone, LinkedIn)
- Identifies resume sections (summary, experience, education, skills)
- Handles multiple file formats with error handling

### Job Description Analysis
- Identifies required vs. preferred skills
- Extracts key terms and technologies
- Categorizes skills by importance level
- Generates keyword frequency analysis

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@resumeatspro.com or create an issue in the repository.

## Roadmap

- [ ] AI-powered resume rewriting
- [ ] Multiple resume templates
- [ ] Job matching recommendations
- [ ] Bulk processing capabilities
- [ ] Integration with job boards
- [ ] Analytics dashboard
- [ ] Mobile app version
