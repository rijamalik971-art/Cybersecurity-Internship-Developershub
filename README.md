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
