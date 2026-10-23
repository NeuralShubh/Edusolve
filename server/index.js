import http from 'node:http'

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  PORT = 10000,
  ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:5174',
} = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.')
  process.exit(1)
}

const SB = SUPABASE_URL.replace(/\/+$/, '')
const origins = ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
const today = () => new Date().toISOString().slice(0, 10)

async function sb(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${SB}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let json = null
  try { json = text ? JSON.parse(text) : null } catch { json = null }
  return { ok: res.ok, status: res.status, json, text }
}

function send(res, code, payload) {
  const body = payload === undefined ? '' : JSON.stringify(payload)
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 64 * 1024) { reject(new Error('Body too large')); req.destroy(); return }
      raw += chunk
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try { resolve(JSON.parse(raw)) } catch { reject(new Error('Invalid JSON')) }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin
  const allowed = !origin || origins.includes('*') || origins.includes(origin)
  if (origin && allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(allowed ? 204 : 403)
    return res.end()
  }
  if (!allowed) return send(res, 403, { error: 'Origin not allowed' })

  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname

  try {
    if (req.method === 'GET' && path === '/api/health') {
      return send(res, 200, { ok: true, service: 'edusolve-api', time: new Date().toISOString() })
    }

    if (path === '/api/feedback' && req.method === 'GET') {
      const limit = Math.min(Number(url.searchParams.get('limit')) || 300, 500)
      const r = await sb(`feedback?select=id,title,verdict,source,created_at&order=created_at.desc&limit=${limit}`)
      if (!r.ok) return send(res, 500, { error: r.text || 'Supabase error' })
      return send(res, 200, (r.json || []).map((row) => ({
        id: row.id,
        title: row.title,
        verdict: row.verdict,
        source: row.source,
        at: Date.parse(row.created_at),
      })))
    }

    if (path === '/api/feedback' && req.method === 'POST') {
      const body = await readBody(req)
      const { title, verdict, source, at } = body
      if (typeof title !== 'string' || !title.trim()) return send(res, 400, { error: 'title is required' })
      if (verdict !== 'solved' && verdict !== 'unsolved') return send(res, 400, { error: 'verdict must be solved or unsolved' })
      if (typeof source !== 'string' || !source.trim()) return send(res, 400, { error: 'source is required' })
      const when = at ? new Date(at) : new Date()
      const createdAt = Number.isNaN(when.getTime()) ? new Date().toISOString() : when.toISOString()
      const r = await sb('feedback?select=id,created_at', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: {
          title: title.trim().slice(0, 255),
          verdict,
          source: source.trim().slice(0, 32),
          created_at: createdAt,
        },
      })
      if (!r.ok || !r.json || !r.json[0]) return send(res, 500, { error: r.text || 'Supabase error' })
      return send(res, 201, { id: r.json[0].id, at: Date.parse(r.json[0].created_at) })
    }

    if (path === '/api/feedback' && req.method === 'DELETE') {
      const r = await sb('feedback?id=not.is.null', { method: 'DELETE' })
      if (!r.ok) return send(res, 500, { error: r.text || 'Supabase error' })
      res.writeHead(204)
      return res.end()
    }

    if (path === '/api/visits' && req.method === 'GET') {
      const r = await sb('visits_daily?select=day,count')
      if (!r.ok) return send(res, 500, { error: r.text || 'Supabase error' })
      const out = {}
      for (const row of r.json || []) out[row.day] = row.count
      return send(res, 200, out)
    }

    if (path === '/api/visits' && req.method === 'POST') {
      const day = today()
      const cur = await sb(`visits_daily?select=count&day=eq.${day}`)
      if (!cur.ok) return send(res, 500, { error: cur.text || 'Supabase error' })
      const count = ((cur.json && cur.json[0] && cur.json[0].count) || 0) + 1
      const r = await sb('visits_daily?on_conflict=day', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: { day, count },
      })
      if (!r.ok) return send(res, 500, { error: r.text || 'Supabase error' })
      return send(res, 200, { day, count })
    }

    if (path === '/api/featured' && req.method === 'GET') {
      const r = await sb('featured?select=category_id')
      if (!r.ok) return send(res, 500, { error: r.text || 'Supabase error' })
      return send(res, 200, (r.json || []).map((row) => row.category_id))
    }

    if (path === '/api/featured/toggle' && req.method === 'POST') {
      const body = await readBody(req)
      const id = typeof body.category_id === 'string' ? body.category_id.trim().slice(0, 64) : ''
      if (!id) return send(res, 400, { error: 'category_id is required' })
      const cur = await sb(`featured?select=category_id&category_id=eq.${encodeURIComponent(id)}`)
      if (!cur.ok) return send(res, 500, { error: cur.text || 'Supabase error' })
      const exists = cur.json && cur.json.length > 0
      const r = exists
        ? await sb(`featured?category_id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
        : await sb('featured', { method: 'POST', body: { category_id: id } })
      if (!r.ok) return send(res, 500, { error: r.text || 'Supabase error' })
      const all = await sb('featured?select=category_id')
      if (!all.ok) return send(res, 500, { error: all.text || 'Supabase error' })
      return send(res, 200, (all.json || []).map((row) => row.category_id))
    }

    return send(res, 404, { error: 'Not found' })
  } catch (err) {
    console.error(err)
    return send(res, 500, { error: 'Internal server error' })
  }
})

server.listen(Number(PORT), () => {
  console.log(`EduSolve API listening on port ${PORT}`)
})
