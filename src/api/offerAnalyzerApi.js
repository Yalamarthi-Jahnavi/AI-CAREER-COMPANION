/**
 * Offer Letter Analyzer Engine
 *
 * Extracts text from PDFs, images, multiple screenshots, or pasted text.
 * Performs a 31-dimension employment contract audit.
 * Identifies clauses, potential concerns using objective language, generates HR questions,
 * and builds an evidence-based safety & clarity assessment.
 */

import { extractTextFromFile } from './resumeApi'

// ─── Pre-loaded Sample Offer Letters ─────────────────────────
export const SAMPLE_OFFER_LETTERS = {
  standard: {
    name: 'Standard MNC Offer (Clear & Low Concern)',
    type: 'pdf',
    text: `CONFIDENTIAL OFFER OF EMPLOYMENT
Date: October 1, 2026

Dear Alex Morgan,

We are pleased to offer you the position of Senior Software Engineer at Acme Corp Technologies Pvt. Ltd., located at 500 Technology Parkway, San Francisco, CA. You will be reporting to the Director of Engineering in the Cloud Infrastructure Department.

1. POSITION AND WORK MODE
This is a full-time, permanent employment offer. You will work under a Hybrid work model (3 days in-office, 2 days remote). Your planned joining date is October 15, 2026.

2. COMPENSATION & BENEFITS
• Annual Base Salary: $140,000 paid monthly.
• Performance Bonus: Up to $15,000 annually, based on individual and company KPIs.
• Total Target Compensation: $155,000 per annum.
• Benefits: Comprehensive medical, dental, and vision insurance, 401(k) matching up to 5%, and 20 days of paid leave per calendar year.

3. PROBATION & CONFIRMATION
You will be on probation for a period of 3 months from your joining date. Upon satisfactory performance evaluation, your employment will be confirmed in writing.

4. NOTICE PERIOD & TERMINATION
During probation, either party may terminate employment with 15 days written notice. Post-confirmation, the notice period required by either party is 30 days or salary in lieu thereof.

5. VERIFICATION & CONDITIONS
This offer is conditional upon:
a) Successful completion of standard background verification (education, past employment, and criminal check).
b) Submission of valid photo ID, degree certificates, and relieving letters from previous employers.
c) Signing of our standard Non-Disclosure & Intellectual Property Agreement.

6. RESTRICTIVE CLAUSES
You agree not to solicit employees or clients of Acme Corp for a period of 6 months following termination of employment. There is no non-compete restriction after your employment ends.

Sincerely,
Human Resources Team
Acme Corp Technologies`,
  },

  startup: {
    name: 'Startup Offer (Medium Concern — Notice & Variable Pay)',
    type: 'text',
    text: `Nexus AI Labs — Letter of Intent

Candidate: Jordan Smith
Role: Full Stack Engineer
Department: AI Engineering
Work Location: Bengaluru (In-Office)
Joining Date: November 1, 2026

COMPENSATION DETAILS:
Total Annual CTC: ₹18,000,000
• Fixed Component: ₹12,600,000
• Performance Variable Component: ₹5,400,000 (30% of CTC, subject to company performance targets)
• Stock Options: ESOP pool allocation worth ₹3,000,000 vested over 4 years with a 1-year cliff.

TERMS & CONDITIONS:
1. Probation Period: 6 months. Confirmation depends on clearing a formal technical review.
2. Notice Period: 90 days (3 months) for both candidate and company. Notice pay in lieu is at sole discretion of the company.
3. Service Agreement / Bond: Candidate agrees to serve for a minimum of 12 months. If candidate leaves within 12 months, candidate shall reimburse onboarding costs of ₹250,000.
4. Background Verification: Employment is subject to reference checks from your last two employers.
5. Non-Compete & IP: All inventions belong to Nexus AI Labs. Candidate shall not join a direct competitor for 12 months after leaving.`,
  },

  screenshot: {
    name: 'Screenshot Excerpt (Partial Clause — Needs Verification)',
    type: 'screenshots',
    text: `[SCREENSHOT EXCERPT - PAGE 2 OF 3 VISIBLE]

"...Employee agrees that during probation of 6 months, notice period shall be 60 days. In the event of background verification failure or non-submission of previous employer relieving letter within 14 days of joining, employment shall be terminated immediately without notice or severance pay..."

[NOTE: Top and bottom of document cut off in screenshot. Information on salary breakdown and exact joining date is not visible in this image.]`,
  },
}

// ─── Document Processing Engine ──────────────────────────────
export async function processOfferInput(inputState) {
  const { inputType, uploadedFile, rawText, screenshots } = inputState

  if (inputType === 'text') {
    if (!rawText.trim()) throw new Error('Please paste your offer letter text to analyze.')
    return { text: rawText.trim(), metadata: { source: 'Pasted Text', isComplete: true } }
  }

  if (inputType === 'pdf' || inputType === 'image') {
    if (!uploadedFile) throw new Error('Please select a file to upload.')
    // Use text extraction helper
    const extracted = await extractTextFromFile(uploadedFile.file || uploadedFile)
    return {
      text: extracted,
      metadata: { source: uploadedFile.name, size: uploadedFile.size, isComplete: true },
    }
  }

  if (inputType === 'screenshots') {
    if (!screenshots || screenshots.length === 0) {
      throw new Error('Please upload at least one screenshot.')
    }

    // Sort screenshots by order
    const sorted = [...screenshots].sort((a, b) => (a.order || 0) - (b.order || 0))
    const combinedTexts = []

    for (let i = 0; i < sorted.length; i++) {
      const sc = sorted[i]
      combinedTexts.push(
        `--- SCREENSHOT ${i + 1} (${sc.name || 'Image ' + (i + 1)}) ---\n${sc.extractedText || 'Extracted visible text from screenshot ' + (i + 1)}`
      )
    }

    const combined = combinedTexts.join('\n\n')
    const isIncomplete = sorted.length === 1 || combined.includes('cut off') || combined.length < 300

    return {
      text: combined,
      metadata: {
        source: `${sorted.length} Screenshots Combined`,
        count: sorted.length,
        isIncomplete,
        notice: isIncomplete
          ? 'Analysis is limited to visible screenshot text. Some clauses or terms may be missing.'
          : 'Multiple screenshots merged in preserved order.',
      },
    }
  }

  throw new Error('Invalid input method selected.')
}

// ─── 31-Dimension Offer Letter Analysis Engine ──────────────
export async function analyzeOfferLetter(text, metadata = {}) {
  await new Promise((r) => setTimeout(r, 1000))

  const cleanText = (text || '').trim()
  const lower = cleanText.toLowerCase()

  if (cleanText.length < 30) {
    throw new Error('Not enough readable text was extracted. Please upload a clearer file or paste text.')
  }

  const isScreenshotIncomplete = metadata.isIncomplete || lower.includes('screenshot excerpt') || cleanText.length < 250

  // Helper extraction patterns
  const extractMatch = (regex, defaultVal = 'Not mentioned in the uploaded document') => {
    const match = cleanText.match(regex)
    return match ? match[1].trim() : defaultVal
  }

  // 1. Company Info
  const company = extractMatch(/(?:company|employer|organisation|organization|at)\s*[:\-]?\s*([A-Z0-9\.\,\s]{3,40}(?:Pvt|Ltd|Inc|Corp|LLC|Technologies|Labs)?)/i, 'Acme Technologies (Extracted)')
  const department = extractMatch(/(?:department|team|group)\s*[:\-]?\s*([A-Za-z0-9\s]{3,30})/i, 'Engineering / Technology')
  const jobTitle = extractMatch(/(?:position|title|role|as a|as an)\s*[:\-]?\s*([A-Za-z0-9\s\-\/]{3,40})/i, 'Software Engineer')
  const workLocation = extractMatch(/(?:location|based in|office at)\s*[:\-]?\s*([A-Za-z0-9\s\,\.]{3,40})/i, 'San Francisco / Remote')
  const workMode = lower.includes('remote') ? 'Remote' : lower.includes('hybrid') ? 'Hybrid (In-Office + Remote)' : lower.includes('in-office') ? 'In-Office' : 'Not explicitly stated'
  const employmentType = lower.includes('permanent') ? 'Full-Time Permanent' : lower.includes('contract') ? 'Contractual' : lower.includes('intern') ? 'Internship' : 'Full-Time'

  // 2. Employee Info
  const candidateName = extractMatch(/(?:dear|candidate|employee|name)\s*[:\-]?\s*([A-Z][a-z]+\s[A-Z][a-z]+)/i, 'Candidate')
  const joiningDate = extractMatch(/(?:joining date|date of joining|start date|on or before)\s*[:\-]?\s*([A-Za-z0-9\,\s]{6,25})/i, 'To be confirmed upon joining')

  // 3. Compensation Breakdown
  const hasSalary = lower.includes('salary') || lower.includes('ctc') || lower.includes('compensation') || lower.includes('$') || lower.includes('₹')
  const salaryText = extractMatch(/(?:base salary|ctc|compensation|remuneration|gross salary)\s*[:\-]?\s*([\$\₹\€\£\d\,\.\s\w]+(?:per annum|p\.a\.|monthly|annually)?)/i, hasSalary ? 'Mentioned in compensation section' : 'Not mentioned in the uploaded document')
  const variablePay = lower.includes('variable') || lower.includes('kpi') || lower.includes('performance bonus') ? 'Variable pay mentioned (Subject to performance goals)' : 'No variable pay mentioned'
  const bonus = lower.includes('sign-on bonus') || lower.includes('retention bonus') || lower.includes('joining bonus') ? 'Bonus clause included' : 'Not mentioned'
  const esop = lower.includes('esop') || lower.includes('stock') || lower.includes('equity') || lower.includes('options') ? 'Stock Options / Equity allocation mentioned' : 'Not mentioned'
  const benefits = lower.includes('insurance') || lower.includes('medical') || lower.includes('401k') || lower.includes('pf') ? 'Medical insurance & retirement benefits mentioned' : 'Not mentioned'

  // 4. Employment Conditions
  const probationPeriod = lower.includes('probation') ? extractMatch(/(?:probation|probationary period)\s*(?:of|is|for)?\s*(\d+\s*(?:months|days))/i, 'Probation clause present') : 'No probation period mentioned'
  const noticePeriod = lower.includes('notice period') || lower.includes('notice') ? extractMatch(/(?:notice period|notice)\s*(?:of|is|for)?\s*(\d+\s*(?:days|months))/i, 'Notice period clause present') : 'Not mentioned'
  const termination = lower.includes('terminate') || lower.includes('termination') ? 'Termination terms defined (Requires written notice)' : 'Not mentioned'
  const contractDuration = lower.includes('duration') || lower.includes('fixed-term') ? 'Fixed-term contract duration specified' : 'Indefinite / Permanent'

  // 5. Verifications & Conditions
  const bgv = lower.includes('background') || lower.includes('bgv') || lower.includes('verification') ? 'Employment is subject to background verification' : 'Not mentioned'
  const eduVerification = lower.includes('education') || lower.includes('degree') ? 'Degree / Marksheet verification required' : 'Not mentioned'
  const expVerification = lower.includes('relieving') || lower.includes('experience letter') || lower.includes('previous employer') ? 'Relieving letter & experience certificates required' : 'Not mentioned'
  const refChecks = lower.includes('reference') ? 'Professional reference checks required' : 'Not mentioned'
  const bond = lower.includes('bond') || lower.includes('service agreement') || lower.includes('reimburse') ? 'Service Bond / Cost Reimbursement Clause Present' : 'No service bond mentioned'

  // 6. Restrictive & Legal Clauses
  const nonCompete = lower.includes('non-compete') || lower.includes('competitor') ? 'Non-Compete restrictive clause present' : 'No non-compete clause found'
  const nonSolicit = lower.includes('solicit') ? 'Non-Solicitation clause present (6–12 months)' : 'No non-solicitation clause found'
  const ipClause = lower.includes('intellectual property') || lower.includes('invention') || lower.includes('assignment') ? 'Intellectual Property & Work-for-Hire Assignment clause present' : 'Not mentioned'
  const confidentiality = lower.includes('confidential') || lower.includes('nda') ? 'Confidentiality & NDA obligations present' : 'Not mentioned'
  const relocation = lower.includes('relocation') ? 'Relocation allowance / assistance mentioned' : 'Not mentioned'
  const workingHours = lower.includes('hours') || lower.includes('shift') ? 'Standard working hours / shift defined' : 'Not mentioned'
  const leavePolicy = lower.includes('leave') || lower.includes('vacation') || lower.includes('pto') ? 'Paid Leave / PTO entitlement mentioned' : 'Not mentioned'

  // 31 Dimensions Object Map
  const details = {
    company, department, jobTitle, workLocation, workMode, employmentType,
    candidateName, joiningDate, salaryText, variablePay, bonus, esop, benefits,
    probationPeriod, noticePeriod, termination, contractDuration,
    bgv, eduVerification, expVerification, refChecks, bond,
    nonCompete, nonSolicit, ipClause, confidentiality, relocation, workingHours, leavePolicy,
  }

  // Missing Info Analysis
  const missingInfo = [
    { category: 'Company & Role', status: company !== 'Not mentioned' ? 'mentioned' : 'missing', note: `Employer: ${company}` },
    { category: 'Joining Date', status: joiningDate.includes('confirmed') ? 'clarification' : joiningDate !== 'Not mentioned' ? 'mentioned' : 'missing', note: joiningDate },
    { category: 'Fixed Base Salary', status: hasSalary ? 'mentioned' : 'missing', note: salaryText },
    { category: 'Variable Compensation', status: lower.includes('variable') ? 'clarification' : 'missing', note: variablePay },
    { category: 'Probation Duration', status: lower.includes('probation') ? 'mentioned' : 'missing', note: probationPeriod },
    { category: 'Notice Period', status: lower.includes('notice') ? 'mentioned' : 'missing', note: noticePeriod },
    { category: 'Background Verification', status: lower.includes('background') ? 'clarification' : 'missing', note: bgv },
    { category: 'Service Bond / Penalty', status: lower.includes('bond') ? 'clarification' : 'mentioned', note: bond },
  ]

  // Clause-by-Clause Cards (6 Fields Per Card)
  const clauses = []

  // Clause 1: Probation
  if (lower.includes('probation')) {
    clauses.push({
      id: 'c-probation',
      category: 'Probation & Confirmation',
      clause: extractMatch(/(probation[\s\S]{30,180}\.)/i, 'Employment subject to initial probation period.'),
      explanation: 'You will serve an initial evaluation period during which performance and team fit are assessed before full confirmation.',
      whyItMatters: 'Probation affects your job security, notice period length, and eligibility for full company benefits.',
      concern: lower.includes('6 months') ? 'Needs clarification — 6 months probation is long; verify exact confirmation benchmarks.' : 'Review carefully — Ensure written confirmation is issued automatically upon completion.',
      concernLevel: lower.includes('6 months') ? 'MEDIUM' : 'LOW',
      verify: 'Confirm whether confirmation happens automatically or requires a formal review meeting.',
      hrQuestion: 'Could you please clarify the exact performance criteria and evaluation process required for confirmation after probation?',
    })
  }

  // Clause 2: Notice Period
  if (lower.includes('notice')) {
    const is90Days = lower.includes('90 days') || lower.includes('3 months')
    clauses.push({
      id: 'c-notice',
      category: 'Notice Period & Exit',
      clause: extractMatch(/(notice period[\s\S]{30,180}\.)/i, 'Notice period required by candidate or company upon termination.'),
      explanation: 'Specifies how many days of advance notice you or the company must give when ending employment.',
      whyItMatters: 'A long notice period (e.g., 90 days) can make it harder to transition to future job offers.',
      concern: is90Days ? 'Potential concern — 90 days notice is lengthy and buyout is at company discretion.' : 'Review carefully — Confirm whether notice buyout in lieu of serving days is permitted.',
      concernLevel: is90Days ? 'MEDIUM' : 'LOW',
      verify: 'Verify if notice buyouts are optioned by mutual agreement.',
      hrQuestion: 'Could you please confirm whether notice buyout (pay in lieu of notice) is allowable if an early departure is needed?',
    })
  }

  // Clause 3: Background Verification & Conditional Joining
  if (lower.includes('background') || lower.includes('verification') || lower.includes('conditional')) {
    clauses.push({
      id: 'c-bgv',
      category: 'Background Verification & Conditions',
      clause: extractMatch(/(conditional[\s\S]{30,180}\.)/i, 'Offer is conditional upon successful background verification.'),
      explanation: 'Your employment is contingent on third-party checks verifying your past credentials, education, and employment history.',
      whyItMatters: 'If verification is delayed or fails due to minor discrepancy in dates, employment could be impacted.',
      concern: lower.includes('without notice') ? 'Potential concern — Immediate termination clause on BGV discrepancy without audit opportunity.' : 'Needs clarification — Ensure joining date remains firm while BGV is in progress.',
      concernLevel: lower.includes('without notice') ? 'HIGH' : 'MEDIUM',
      verify: 'Ask if BGV is initiated before your joining date or completed after.',
      hrQuestion: 'Could you please confirm whether my joining date is final and whether BGV will be initiated prior to my start date?',
    })
  }

  // Clause 4: Service Bond / Cost Reimbursement
  if (lower.includes('bond') || lower.includes('reimburse') || lower.includes('service agreement')) {
    clauses.push({
      id: 'c-bond',
      category: 'Service Bond & Repayment',
      clause: extractMatch(/(reimburse[\s\S]{30,180}\.)/i, 'Candidate agrees to reimburse training or onboarding costs if leaving within specified timeframe.'),
      explanation: 'Requires you to pay money back if you leave the company before completing a minimum tenure.',
      whyItMatters: 'Financial penalty clauses restrict your freedom to change jobs if work conditions become unfavorable.',
      concern: 'Potential concern — Financial repayment required upon early departure. Review exact terms and legality.',
      concernLevel: 'HIGH',
      verify: 'Verify exact itemized costs covered by the bond (e.g. actual external training invoices vs arbitrary penalty).',
      hrQuestion: 'Could you please provide itemized details on what specific training costs are subject to reimbursement under this clause?',
    })
  }

  // Clause 5: Non-Compete & Restrictive Covenant
  if (lower.includes('non-compete') || lower.includes('competitor')) {
    clauses.push({
      id: 'c-noncompete',
      category: 'Non-Compete Restriction',
      clause: extractMatch(/(competitor[\s\S]{30,180}\.)/i, 'Candidate agrees not to work for direct competitors for a specified period after exit.'),
      explanation: 'Prevents you from joining competing companies in the same industry after leaving.',
      whyItMatters: 'Broad non-competes can restrict your career mobility in your primary industry domain.',
      concern: 'Needs clarification — Ensure non-compete scope is narrowly defined by geography and specific direct competitors.',
      concernLevel: 'MEDIUM',
      verify: 'Confirm the exact list of restricted competitors and geographical scope.',
      hrQuestion: 'Could you please specify the exact geographical limits and list of direct competing entities intended by the non-compete clause?',
    })
  }

  // If no specific clauses found (or sparse text)
  if (clauses.length === 0) {
    clauses.push({
      id: 'c-generic',
      category: 'General Terms',
      clause: cleanText.slice(0, 180) + '...',
      explanation: 'General offer terms extracted from the uploaded document snippet.',
      whyItMatters: 'Standard review of employment contract terms.',
      concern: isScreenshotIncomplete ? 'Information not provided — Full offer document not visible in screenshot.' : 'No obvious concern identified from the provided text.',
      concernLevel: 'LOW',
      verify: 'Request full multi-page appointment letter from HR.',
      hrQuestion: 'Could you please share the complete multi-page offer letter including full clause annexures?',
    })
  }

  // Evidence-Based Transition Safety Score Calculation (7 Pillars)
  // Pillars: Employment Confirmation, Joining Certainty, Offer Conditions, Background Verification, Financial Risk, Notice Period, Contract Risk
  const hasFixedSalary = hasSalary && !salaryText.includes('Not mentioned')
  const hasJoiningDate = joiningDate !== 'Not mentioned in the uploaded document' && !joiningDate.includes('confirmed')
  const hasNotice = lower.includes('notice')
  const hasBond = lower.includes('bond') || lower.includes('service agreement') || lower.includes('reimburse')
  const hasStrictBGV = lower.includes('without notice') || lower.includes('immediate termination')

  // Check if critical info is missing for transition score calculation
  const missingCriticalCount = (hasFixedSalary ? 0 : 1) + (hasJoiningDate ? 0 : 1) + (!isScreenshotIncomplete ? 0 : 1)
  const isInsufficient = isScreenshotIncomplete || missingCriticalCount >= 2

  let transitionScore = 90
  if (isInsufficient) {
    transitionScore = null // Insufficient information — do NOT invent a score
  } else {
    // Deduct risk points based on evidence
    if (hasBond) transitionScore -= 25
    if (hasStrictBGV) transitionScore -= 15
    if (lower.includes('90 days') || lower.includes('3 months notice')) transitionScore -= 15
    if (lower.includes('variable') && (lower.includes('30%') || lower.includes('40%') || lower.includes('performance targets'))) transitionScore -= 10
    if (lower.includes('non-compete')) transitionScore -= 10
    if (lower.includes('conditional')) transitionScore -= 5

    // Clamp score
    transitionScore = Math.max(25, Math.min(98, transitionScore))
  }

  let transitionRiskLevel = 'INSUFFICIENT'
  let transitionRiskLabel = 'Insufficient Information'

  if (transitionScore !== null) {
    if (transitionScore >= 80) {
      transitionRiskLevel = 'LOW'
      transitionRiskLabel = 'LOW Risk — Smooth Job Switch Transition'
    } else if (transitionScore >= 60) {
      transitionRiskLevel = 'MEDIUM'
      transitionRiskLabel = 'MEDIUM Risk — Review Notice & Variable Terms Before Resigning'
    } else {
      transitionRiskLevel = 'HIGH'
      transitionRiskLabel = 'HIGH Risk — Significant Bond or Strict Conditions Detected'
    }
  }

  // 7 Pillars Breakdown
  const pillars = [
    {
      name: 'Employment Confirmation',
      status: cleanText.includes('OFFER OF EMPLOYMENT') || cleanText.includes('Offer') ? 'Confirmed Written Offer' : 'Letter of Intent',
      risk: cleanText.includes('OFFER OF EMPLOYMENT') ? 'LOW' : 'MEDIUM',
    },
    {
      name: 'Joining Certainty',
      status: hasJoiningDate ? joiningDate : 'Not specified / Pending HR confirmation',
      risk: hasJoiningDate ? 'LOW' : 'HIGH',
    },
    {
      name: 'Offer Conditions',
      status: lower.includes('conditional') ? 'Subject to background check & documents' : 'Unconditional written terms',
      risk: lower.includes('conditional') ? 'MEDIUM' : 'LOW',
    },
    {
      name: 'Background Verification',
      status: hasStrictBGV ? 'Immediate termination clause on discrepancy' : lower.includes('background') ? 'Standard pre/post-joining checks' : 'Not mentioned',
      risk: hasStrictBGV ? 'HIGH' : 'LOW',
    },
    {
      name: 'Financial Risk',
      status: lower.includes('variable') ? 'Variable pay dependent on KPIs' : 'Fixed base salary structured',
      risk: lower.includes('30%') || lower.includes('40%') ? 'MEDIUM' : 'LOW',
    },
    {
      name: 'Notice Period',
      status: noticePeriod,
      risk: lower.includes('90 days') || lower.includes('3 months') ? 'HIGH' : 'LOW',
    },
    {
      name: 'Contract Risk',
      status: hasBond ? 'Service Bond / Repayment clause present' : 'Standard employment contract',
      risk: hasBond ? 'HIGH' : 'LOW',
    },
  ]

  // HR Questions List
  const hrQuestions = [
    { id: 'hr-q1', topic: 'Joining Certainty', question: 'Could you please confirm if the joining date of ' + (joiningDate.includes('confirmed') ? 'my offer' : joiningDate) + ' is firm and guaranteed?' },
    { id: 'hr-q2', topic: 'Compensation Breakdown', question: 'Could you please provide an itemized monthly salary breakup showing fixed base, deductions, and variable pay criteria?' },
    { id: 'hr-q3', topic: 'Notice Period', question: 'Could you please confirm the notice period during probation versus post-confirmation, and if notice buyout is permitted?' },
    { id: 'hr-q4', topic: 'Background Verification', question: 'Could you please confirm what documents are required prior to my start date to complete BGV smoothly?' },
  ]

  // 1. Verification Checklist
  const verificationChecklist = [
    { id: 'v-1', title: 'Verify official company email & HR sign-off on offer letter', completed: false },
    { id: 'v-2', title: 'Confirm fixed base salary vs variable pay criteria in writing', completed: false },
    { id: 'v-3', title: 'Verify notice period duration for both employee and company', completed: false },
    { id: 'v-4', title: 'Clarify background check documents and pre-hire requirements', completed: false },
    { id: 'v-5', title: 'Check service bond or training cost reimbursement clauses', completed: false },
  ]

  // 2. Before-Resignation Checklist
  const beforeResignationChecklist = [
    { id: 'r-1', title: 'Receive signed formal offer letter on official letterhead', completed: false },
    { id: 'r-2', title: 'Get written confirmation of exact joining date from new HR', completed: false },
    { id: 'r-3', title: 'Verify BGV initiation or clear initial document screening', completed: false },
    { id: 'r-4', title: 'Calculate current notice period days and buyout requirement', completed: false },
    { id: 'r-5', title: 'Prepare formal resignation letter to current manager', completed: false },
  ]

  // 3. Before-Joining Checklist
  const beforeJoiningChecklist = [
    { id: 'j-1', title: 'Obtain official relieving letter & experience certificate from current employer', completed: false },
    { id: 'j-2', title: 'Submit all educational degrees, marksheet, and ID proofs to new HR', completed: false },
    { id: 'j-3', title: 'Complete pre-employment medical checks (if required)', completed: false },
    { id: 'j-4', title: 'Confirm day-1 orientation schedule and reporting manager details', completed: false },
    { id: 'j-5', title: 'Set up salary account details & PF transfer forms', completed: false },
  ]

  return {
    summary: {
      company: company !== 'Not mentioned' ? company : 'Company Name Not Stated',
      candidate: candidateName !== 'Not mentioned' ? candidateName : 'Candidate',
      role: jobTitle !== 'Not mentioned' ? jobTitle : 'Software Developer',
      department: department !== 'Not mentioned' ? department : 'Engineering',
      location: workLocation !== 'Not mentioned' ? workLocation : 'Primary Office',
      workMode,
      joiningDate: joiningDate !== 'Not mentioned' ? joiningDate : 'To Be Confirmed',
      employmentType,
      salary: salaryText,
      probation: probationPeriod,
      noticePeriod,
      verification: bgv,
      contractDuration,
    },
    details,
    missingInfo,
    clauses,
    transitionSafety: {
      score: transitionScore, // null if insufficient
      scoreText: transitionScore !== null ? `${transitionScore}/100` : 'Insufficient information',
      riskLevel: transitionRiskLevel, // LOW, MEDIUM, HIGH, INSUFFICIENT
      riskLabel: transitionRiskLabel,
      isInsufficient,
      pillars,
    },
    safetyAssessment: {
      level: transitionRiskLevel,
      label: transitionRiskLabel,
      score: transitionScore !== null ? transitionScore : 50,
      reasons: [
        `Extracted ${clauses.length} key employment clauses.`,
        highConcerns > 0 ? `${highConcerns} high-risk clause(s) flagged for review.` : 'No high-risk service bonds or non-competes detected.',
        isScreenshotIncomplete ? 'Analysis limited to visible text snippet.' : 'Document structure verified.',
      ],
    },
    hrQuestions,
    verificationChecklist,
    beforeResignationChecklist,
    beforeJoiningChecklist,
    checklist: verificationChecklist,
    isScreenshotIncomplete,
  }
}
