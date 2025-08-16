<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Resume Optimization Website - Copilot Instructions

This is a Next.js application for resume optimization and ATS compliance checking. The project includes:

## Project Structure
- **Frontend**: React components with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes for server-side processing
- **Features**: File upload, resume parsing, job description analysis, ATS optimization, document generation

## Key Features to Implement
1. **File Upload**: Support for PDF, DOC, DOCX resume uploads and job description text input
2. **Resume Parsing**: Extract text and structure from uploaded resume files
3. **Job Description Analysis**: Parse job requirements and keywords
4. **ATS Optimization**: 
   - Keyword matching and suggestions
   - Format optimization for ATS systems
   - Score calculation and recommendations
5. **Document Generation**: Export optimized resumes in PDF and Word formats

## Technical Requirements
- Use TypeScript for type safety
- Implement proper error handling and validation
- Follow React best practices and hooks patterns
- Use Tailwind CSS for responsive design
- Implement secure file handling
- Add proper loading states and user feedback

## Libraries and Dependencies
- File processing: `pdf-parse`, `mammoth`, `docx`
- Document generation: `puppeteer`, `html-pdf-node`
- UI components: Consider using `shadcn/ui` or similar component library
- Form handling: `react-hook-form` with validation
- API integration: Built-in Next.js API routes

## Code Style
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the Next.js 14 App Router patterns
- Use server components where appropriate
- Implement proper SEO and accessibility features
