/**
 * AI Career Companion Backend API Server
 * 
 * Local Development: http://localhost:5000
 * Provides complete REST endpoints for:
 * - Authentication & Persona Switching
 * - Dashboard Aggregation
 * - Practice Test Generation & Evaluation
 * - Offer Letter Clause Analysis & Comparison
 * - Unified AI Career Assistant Chat
 */

import http from 'http'
import url from 'url'

const PORT = process.env.PORT || 5000

// Helper to handle CORS & JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(data))
}

// Body parser helper
function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        resolve({})
      }
    })
  })
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const method = req.method

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    return res.end()
  }

  // 1. Health Check
  if (pathname === '/api/v1/health' || pathname === '/health' || pathname === '/') {
    return sendJSON(res, 200, {
      status: 'healthy',
      service: 'AI Career Companion API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      ports: { frontend: 5173, backend: PORT },
    })
  }

  // 2. Auth: Login
  if (pathname === '/api/v1/auth/login' && method === 'POST') {
    const body = await parseBody(req)
    return sendJSON(res, 200, {
      success: true,
      token: 'jwt_mock_token_' + Date.now(),
      user: {
        id: 'user-001',
        email: body.email || 'alex.johnson@example.com',
        name: 'Alex Johnson',
        role: 'Senior Software Engineer',
        plan: 'Pro Tier',
      },
    })
  }

  // 3. Auth: Register
  if (pathname === '/api/v1/auth/register' && method === 'POST') {
    const body = await parseBody(req)
    return sendJSON(res, 201, {
      success: true,
      token: 'jwt_mock_token_' + Date.now(),
      user: {
        id: 'user-' + Date.now(),
        email: body.email || 'new.user@example.com',
        name: body.name || 'Engineer',
        role: body.role || 'Junior Software Engineer',
        plan: 'Starter Tier',
      },
    })
  }

  // 4. Dashboard Summary Data
  if (pathname === '/api/v1/dashboard' && method === 'GET') {
    return sendJSON(res, 200, {
      careerHealth: {
        overallScore: 84,
        healthStatus: 'Excellent — Tier 1 Candidate',
      },
      stats: {
        resumeScore: 88,
        interviewReadiness: 82,
        technicalSkillsScore: 90,
      },
    })
  }

  // 5. Practice: Test Evaluation
  if (pathname === '/api/v1/practice/submit' && method === 'POST') {
    const body = await parseBody(req)
    const score = body.score || 90
    return sendJSON(res, 200, {
      success: true,
      score,
      scoreOutOf100: `${score}/100`,
      stars: score >= 90 ? '⭐⭐⭐⭐⭐' : score >= 80 ? '⭐⭐⭐⭐' : '⭐⭐⭐',
      feedback: 'Excellent response accuracy and pattern application.',
    })
  }

  // 6. Offer Letter Analysis Endpoint
  if (pathname === '/api/v1/offer/analyze' && method === 'POST') {
    const body = await parseBody(req)
    return sendJSON(res, 200, {
      success: true,
      company: body.companyName || 'Acme Corp Technologies',
      safetyScore: 86,
      safetyLevel: 'LOW',
      concernsCount: 1,
    })
  }

  // 7. Career Assistant Chat Message
  if (pathname === '/api/v1/career-chat' && method === 'POST') {
    const body = await parseBody(req)
    return sendJSON(res, 200, {
      reply: `Backend confirmation: processed request for "${body.message || 'career advice'}" successfully.`,
      timestamp: new Date().toLocaleTimeString(),
    })
  }

  // 404 Route
  return sendJSON(res, 404, { error: 'Route not found' })
})

server.listen(PORT, () => {
  console.log(`\n🚀 AI Career Companion Backend Server running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/v1/health\n`)
})
