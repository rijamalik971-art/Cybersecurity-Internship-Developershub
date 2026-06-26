# Cybersecurity Internship  DevelopersHub Corporation
## Intern Information
**Program:** DevelopersHub Cybersecurity Internship
 **Task:** Phase 1: Strengthening Security Measures for a Web Application
## Week 1: Security Assessment
### Application Used
**OWASP NodeGoat** Deliberately vulnerable Node.js web application
**1.Official Repository: https://github.com/OWASP/NodeGoat
2. Running locally on: http://localhost:4000**

### Tools Used
OWASP ZAP by Checkmarx v2.16.1 (Automated vulnerability scanner)
Browser Developer Tools (Manual XSS & SQL Injection testing)
npm audit (Dependency vulnerability analysis)

### Vulnerabilities Found
| Risk Level | Count |
|------------|-------|
| Medium | 5 |
| Low | 8 |
| Informational | 6 |
| npm Dependencies | 143 (36 critical) |

### Key Vulnerabilities Identified
 .Content Security Policy (CSP) Header Not Set
 .Cross-Domain Misconfiguration (CORS)
 .Missing Anti-Clickjacking Header
 .Vulnerable JS Libraries (jQuery 3.3.1, Bootstrap 3.3.7)
 .Cookie Security Issues (No HttpOnly, No SameSite)
 .Server Information Leakage
 .HSTS Not Configured

### Files in This Repository
`Week1 Security Assessment Report.docx` : Full vulnerability report + summary

## Week 2: Implementing Security Measures

### Libraries Installed
| Library | Purpose |
|---------|---------|
| validator | Input sanitization and validation |
| bcrypt | Password hashing |
| jsonwebtoken | Token based authentication |
| helmet | HTTP security headers |

### Security Fixes Applied
 Input validation added for all user inputs
 Passwords hashed using bcrypt (10 salt rounds)
 JWT token authentication implemented
 Helmet.js configured security headers active
 Cookie HttpOnly flag enabled
 Template autoescape enabled (XSS fix)
 X-Powered-By header removed

### Files
server.js:Updated secure server code
Week2:Security Implementation Report.docx: Implementation report
Week2:Document Finding.docx: Security fixes summary

## Week 3: Advanced Security & Final Report
*Coming Soon*
