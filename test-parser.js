import { ResumeParser } from './src/lib/resumeParser.js'
import fs from 'fs'

// Test with your resume content
const resumeContent = `PALLAVI DHAWAN  
8837 Mississauaga Road L6Y 0C2 Brampton, ON, CANADA
pallavidhawan72@gmail.com +1 647 201 0689

GRAPHIC DESIGNER &  SOCIAL MEDIA COORDINATOR
"Innovative Designer Specialising in Graphics, Fashion, & Eco-Friendly Practices"
Design Maverick & Pixel Perfectionist, Crafting Memorable Brand Experiences with Alchemic Graphic Magic — and Bringing Them to Life Through Intuitive, Impactful Web Development. Transforming Ideas into Vibrant Visual Masterpieces, Online and Beyond.

Creative and technically skilled web & graphic designer and marketing coordinator with hands-on experience in responsive design, content management systems, and digital marketing. Strong background in HTML/CSS, WordPress, Adobe Suite, SEO implementation, and creating landing pages. Adept at transforming designs into interactive web pages and collaborating with teams to meet project scopes and deadlines. Passionate about growing with a fast-paced digital team.

CORE COMPETENCIES


PROFESSIONAL EXPERIENCE

ZOLAR TECHNOLOGY & MANUFACTURING – Ontario, Canada
 Marketing Coordinator & Graphic Designer (Internship)
 September 2024 – March 2025
Designed and developed digital marketing materials, including brochures, social media content, and website graphics to enhance brand visibility.
Assisted in planning and executing social media campaigns, leading to a 35% increase in engagement.

TECHNICAL SKILLS
Front-End:- HTML5, CSS3, Bootstrap, Responsive Design | Shopify | Wordpress | GitHub |  Adobe Creative Suite | Photoshop | Illustrator | InDesign |  Coreldraw | MS Office | Competent with PC and MAC operating systems.

FUNCTIONAL SKILLS
Creativity and Innovation | Attention to detail | Communication Skills | Time Management and meeting deadlines | Adaptability and openness to feedback | Problem-solving skills | Collaboration and Teamwork | Understanding of Branding and Marketing | Organizational and Project management skills.`

console.log("Testing resume parsing...")
const resumeData = ResumeParser.createResumeData("test-resume.txt", resumeContent)

console.log("Personal Info:", resumeData.sections.personalInfo)
console.log("Summary:", resumeData.sections.summary)
console.log("Skills:", resumeData.sections.skills)
console.log("Experience:", resumeData.sections.experience)
