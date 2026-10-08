/**
 * Offer Comparison API Engine
 *
 * Compares 2 offers across 12 dimensions:
 * 1. Salary
 * 2. Role
 * 3. Location
 * 4. Work Mode
 * 5. Growth
 * 6. Technology
 * 7. Work-Life Balance
 * 8. Notice Period
 * 9. Probation
 * 10. Benefits
 * 11. Potential Risk
 * 12. Safety Assessment
 *
 * NON-PRESCRIPTIVE GUIDELINES:
 * - Does NOT recommend a job solely based on salary.
 * - Does NOT definitively command users to resign.
 * - Provides decision-support analysis and recommends verifying important terms with employer/legal professional.
 */

export const PRESET_OFFER_COMPARISONS = {
  sampleA: {
    company: 'Acme Corp Technologies',
    role: 'Senior Software Engineer',
    salary: '$140,000 / year (Fixed Base) + $15,000 Target Bonus',
    salaryNumeric: 155000,
    location: 'San Francisco, CA',
    workMode: 'Hybrid (3 days in-office)',
    growth: 'High — Tier-1 product org with clear staff engineer track',
    technology: 'Cloud Infrastructure, React, Node.js, Kubernetes',
    workLifeBalance: 'Good — Standard 40 hrs/week, 20 PTO days',
    noticePeriod: '30 Days post-probation',
    probation: '3 Months',
    benefits: 'Comprehensive health, 401(k) 5% match, learning stipend',
    potentialRisk: 'Low — Standard background verification, no service bond',
    safetyScore: 92,
    safetyLevel: 'LOW',
  },

  sampleB: {
    company: 'Nexus AI Labs',
    role: 'Full Stack Engineer',
    salary: '$165,000 / year ($115,000 Base + $50,000 Variable Pay)',
    salaryNumeric: 165000,
    location: 'Bengaluru / Remote',
    workMode: 'In-Office (5 days)',
    growth: 'Very High — Fast-paced series B AI startup with equity upside',
    technology: 'Python, PyTorch, Fast-API, Next.js, Vector DBs',
    workLifeBalance: 'Demanding — Startup schedule, high sprint velocity',
    noticePeriod: '90 Days (3 months)',
    probation: '6 Months',
    benefits: 'Basic health coverage + 4-year vesting ESOP allocation',
    potentialRisk: 'Medium-High — 90-day notice, ₹250k training bond if exit < 12 months',
    safetyScore: 65,
    safetyLevel: 'MEDIUM',
  },

  standardVsStartup: {
    offerA: {
      company: 'Enterprise Systems Inc.',
      role: 'Lead Full Stack Developer',
      salary: '$135,000 Base + $10,000 Bonus',
      salaryNumeric: 145000,
      location: 'New York, NY',
      workMode: 'Hybrid (2 days in-office)',
      growth: 'Moderate — Stable hierarchy, predictable promotion cycles',
      technology: 'Java, Spring Boot, Angular, PostgreSQL',
      workLifeBalance: 'Excellent — Fixed hours, strict weekend offline policy',
      noticePeriod: '30 Days',
      probation: '3 Months',
      benefits: 'Health, dental, pension plan, 25 days PTO',
      potentialRisk: 'Low — Established corporate policies',
      safetyScore: 90,
      safetyLevel: 'LOW',
    },
    offerB: {
      company: 'HyperGrowth AI Tech',
      role: 'Senior AI Engineer',
      salary: '$170,000 ($120,000 Base + $50,000 KPI Performance Pay)',
      salaryNumeric: 170000,
      location: 'San Francisco, CA',
      workMode: 'Remote (US)',
      growth: 'Aggressive — Early employee equity, rapid leadership opportunities',
      technology: 'Python, LLM Finetuning, LangChain, TypeScript, AWS',
      workLifeBalance: 'High Intensity — Weekend release cycles expected',
      noticePeriod: '60 Days',
      probation: '6 Months',
      benefits: 'Health insurance + 0.5% equity options vesting over 4 years',
      potentialRisk: 'Medium — 6 months probation, high variable compensation component',
      safetyScore: 72,
      safetyLevel: 'MEDIUM',
    },
  },
}

export async function compareTwoOffers(offerA, offerB) {
  await new Promise((r) => setTimeout(r, 600))

  const dimNames = [
    { key: 'salary', label: '1. Salary & Compensation Structure' },
    { key: 'role', label: '2. Role & Designation' },
    { key: 'location', label: '3. Location & Commute' },
    { key: 'workMode', label: '4. Work Mode (Remote / Hybrid / In-Office)' },
    { key: 'growth', label: '5. Career Growth Potential' },
    { key: 'technology', label: '6. Tech Stack & Learning Opportunities' },
    { key: 'workLifeBalance', label: '7. Work-Life Balance & Hours' },
    { key: 'noticePeriod', label: '8. Notice Period & Exit Flexibility' },
    { key: 'probation', label: '9. Probation & Confirmation Terms' },
    { key: 'benefits', label: '10. Health & Fringe Benefits' },
    { key: 'potentialRisk', label: '11. Potential Risk & Contract Clauses' },
    { key: 'safetyAssessment', label: '12. Transition Safety Assessment' },
  ]

  const dimensions = dimNames.map((d) => {
    let valA = offerA[d.key] || 'Not specified'
    let valB = offerB[d.key] || 'Not specified'

    if (d.key === 'safetyAssessment') {
      valA = `Score: ${offerA.safetyScore || 90}/100 (${offerA.safetyLevel || 'LOW'} Risk)`
      valB = `Score: ${offerB.safetyScore || 65}/100 (${offerB.safetyLevel || 'MEDIUM'} Risk)`
    }

    let tradeOffAnalysis = ''
    if (d.key === 'salary') {
      tradeOffAnalysis = 'Offer B has a higher total potential figure, but Offer A provides a higher fixed base ratio with lower KPI variability.'
    } else if (d.key === 'workLifeBalance') {
      tradeOffAnalysis = 'Offer A prioritizes predictable working hours and higher PTO, whereas Offer B offers high-intensity startup momentum.'
    } else if (d.key === 'noticePeriod') {
      tradeOffAnalysis = 'Offer A provides easier exit flexibility (30 days vs 90 days).'
    } else if (d.key === 'potentialRisk') {
      tradeOffAnalysis = 'Offer A has minimal contract restrictions, whereas Offer B includes service bond reimbursement clauses.'
    } else {
      tradeOffAnalysis = 'Compare team scope and long-term skill development alignment.'
    }

    return {
      key: d.key,
      label: d.label,
      offerAValue: valA,
      offerBValue: valB,
      tradeOffAnalysis,
    }
  })

  // Decision Support Summary (Strictly Non-Prescriptive)
  const decisionSupport = {
    summaryText: `Comparing ${offerA.company || 'Offer A'} vs ${offerB.company || 'Offer B'} highlights key trade-offs between fixed base compensation security versus high variable upside and fast growth.`,
    keyTradeOffs: [
      {
        title: 'Compensation vs Fixed Security',
        detail: `${offerB.company || 'Offer B'} offers higher target CTC, but carries a higher variable component. ${offerA.company || 'Offer A'} offers higher guaranteed monthly cashflow.`,
      },
      {
        title: 'Exit Flexibility & Contract Terms',
        detail: `${offerA.company || 'Offer A'} has a shorter notice period (30 days) and lower contract friction compared to ${offerB.company || 'Offer B'}.`,
      },
      {
        title: 'Work Culture & Intensity',
        detail: `${offerA.company || 'Offer A'} offers established work-life balance, while ${offerB.company || 'Offer B'} provides fast-paced technical learning in modern stacks.`,
      },
    ],
    guidelinesNotice: [
      'Salary is only one component — consider learning velocity, job stability, and daily work-life harmony.',
      'This tool provides objective decision-support analysis and does not issue mandatory resignation directives.',
      'We recommend verifying specific contract clauses, variable pay milestones, and notice buyout terms directly with HR or a qualified legal advisor before accepting.',
    ],
  }

  return {
    offerA,
    offerB,
    dimensions,
    decisionSupport,
  }
}
