import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  PORT = 4000,
  ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:5174',
} = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const app = express()
const origins = ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    if (!origin || origins.includes('*') || origins.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json({ limit: '64kb' }))

const fail = (res, code, message) => res.status(code).json({ error: message })
const today = () => new Date().toISOString().slice(0, 10)

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'edusolve-api', time: new Date().toISOString() })
})

app.get('/api/feedback', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 300, 500)
  const { data, error } = await supabase
    .from('feedback')
    .select('id, title, verdict, source, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return fail(res, 500, error.message)
  res.json(data.map((r) => ({
    id: r.id,
    title: r.title,
    verdict: r.verdict,
    source: r.source,
    at: Date.parse(r.created_at),
  })))
})

app.post('/api/feedback', async (req, res) => {
  const { title, verdict, source, at } = req.body || {}
  if (typeof title !== 'string' || !title.trim()) return fail(res, 400, 'title is required')
  if (verdict !== 'solved' && verdict !== 'unsolved') return fail(res, 400, 'verdict must be solved or unsolved')
  if (typeof source !== 'string' || !source.trim()) return fail(res, 400, 'source is required')

  const when = at ? new Date(at) : new Date()
  const createdAt = Number.isNaN(when.getTime()) ? new Date().toISOString() : when.toISOString()

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      title: title.trim().slice(0, 255),
      verdict,
      source: source.trim().slice(0, 32),
      created_at: createdAt,
    })
    .select('id, created_at')
    .single()
  if (error) return fail(res, 500, error.message)
  res.status(201).json({ id: data.id, at: Date.parse(data.created_at) })
})

app.delete('/api/feedback', async (req, res) => {
  const { error } = await supabase.from('feedback').delete().not('id', 'is', null)
  if (error) return fail(res, 500, error.message)
  res.status(204).end()
})

app.get('/api/visits', async (req, res) => {
  const { data, error } = await supabase.from('visits_daily').select('day, count')
  if (error) return fail(res, 500, error.message)
  const out = {}
  for (const row of data) out[row.day] = row.count
  res.json(out)
})

app.post('/api/visits', async (req, res) => {
  const day = today()
  const { data: row, error: readErr } = await supabase
    .from('visits_daily')
    .select('count')
    .eq('day', day)
    .maybeSingle()
  if (readErr) return fail(res, 500, readErr.message)

  const count = (row?.count || 0) + 1
  const { error } = await supabase.from('visits_daily').upsert({ day, count }, { onConflict: 'day' })
  if (error) return fail(res, 500, error.message)
  res.json({ day, count })
})

app.get('/api/featured', async (req, res) => {
  const { data, error } = await supabase.from('featured').select('category_id')
  if (error) return fail(res, 500, error.message)
  res.json(data.map((r) => r.category_id))
})

app.post('/api/featured/toggle', async (req, res) => {
  const { category_id } = req.body || {}
  if (typeof category_id !== 'string' || !category_id.trim()) return fail(res, 400, 'category_id is required')
  const id = category_id.trim().slice(0, 64)

  const { data: row, error: readErr } = await supabase
    .from('featured')
    .select('category_id')
    .eq('category_id', id)
    .maybeSingle()
  if (readErr) return fail(res, 500, readErr.message)

  const { error } = row
    ? await supabase.from('featured').delete().eq('category_id', id)
    : await supabase.from('featured').insert({ category_id: id })
  if (error) return fail(res, 500, error.message)

  const { data, error: listErr } = await supabase.from('featured').select('category_id')
  if (listErr) return fail(res, 500, listErr.message)
  res.json(data.map((r) => r.category_id))
})

app.use((err, req, res, next) => {
  if (err?.message === 'Not allowed by CORS') return fail(res, 403, 'Origin not allowed')
  console.error(err)
  fail(res, 500, 'Internal server error')
})

app.listen(PORT, () => {
  console.log(`EduSolve API listening on port ${PORT}`)
})
