// Dependency-free XLSX (Excel Open XML) writer.
// The whole file is a ZIP container built by hand — stored (uncompressed)
// entries plus the minimum set of OOXML parts Excel needs — so the app keeps
// working offline with no npm dependency and no CDN.

const XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
const NS_MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
const NS_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const NS_PKG_REL = 'http://schemas.openxmlformats.org/package/2006/relationships'
const NS_CT = 'http://schemas.openxmlformats.org/package/2006/content-types'
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

// cellXfs indexes inside xl/styles.xml
const STYLE_DEFAULT = 0
const STYLE_HEADER = 1
const STYLE_NOTE = 2
const STYLE_TITLE = 3

const encoder = new TextEncoder()

function utf8(text) {
  return encoder.encode(text)
}

/* ------------------------------------------------------------------ */
/* CRC-32 (IEEE 802.3, reflected) — needed by every ZIP entry        */
/* ------------------------------------------------------------------ */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i += 1) {
    let c = i
    for (let bit = 0; bit < 8; bit += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c >>> 0
  }
  return table
})()

function crc32(bytes) {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i += 1) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

// MS-DOS date/time packing used by the ZIP headers
function dosTime(date) {
  return ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | ((date.getSeconds() >> 1) & 0x1f)
}

function dosDate(date) {
  return (((date.getFullYear() - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0x0f) << 5) | (date.getDate() & 0x1f)
}

/* ------------------------------------------------------------------ */
/* Minimal ZIP writer (method 0 = stored, no compression)            */
/* ------------------------------------------------------------------ */
function zipStore(entries) {
  const chunks = []
  const central = []
  const now = new Date()
  const modTime = dosTime(now)
  const modDate = dosDate(now)
  let offset = 0

  for (const entry of entries) {
    const nameBytes = utf8(entry.name)
    const data = entry.data
    const crc = crc32(data)

    const local = new Uint8Array(30 + nameBytes.length)
    const lv = new DataView(local.buffer)
    lv.setUint32(0, 0x04034b50, true) // local file header signature
    lv.setUint16(4, 20, true) // version needed to extract (2.0)
    lv.setUint16(6, 0x0800, true) // general purpose flag: UTF-8 file names
    lv.setUint16(8, 0, true) // compression method: stored
    lv.setUint16(10, modTime, true)
    lv.setUint16(12, modDate, true)
    lv.setUint32(14, crc, true)
    lv.setUint32(18, data.length, true) // compressed size
    lv.setUint32(22, data.length, true) // uncompressed size
    lv.setUint16(26, nameBytes.length, true)
    lv.setUint16(28, 0, true) // extra field length
    local.set(nameBytes, 30)
    chunks.push(local, data)

    const dir = new Uint8Array(46 + nameBytes.length)
    const dv = new DataView(dir.buffer)
    dv.setUint32(0, 0x02014b50, true) // central directory header signature
    dv.setUint16(4, 20, true) // version made by
    dv.setUint16(6, 20, true) // version needed to extract
    dv.setUint16(8, 0x0800, true)
    dv.setUint16(10, 0, true)
    dv.setUint16(12, modTime, true)
    dv.setUint16(14, modDate, true)
    dv.setUint32(16, crc, true)
    dv.setUint32(20, data.length, true)
    dv.setUint32(24, data.length, true)
    dv.setUint16(28, nameBytes.length, true)
    dv.setUint16(30, 0, true) // extra field length
    dv.setUint16(32, 0, true) // file comment length
    dv.setUint16(34, 0, true) // disk number start
    dv.setUint16(36, 0, true) // internal file attributes
    dv.setUint32(38, 0, true) // external file attributes
    dv.setUint32(42, offset, true) // relative offset of the local header
    dir.set(nameBytes, 46)
    central.push(dir)

    offset += local.length + data.length
  }

  const centralSize = central.reduce((sum, part) => sum + part.length, 0)
  const end = new Uint8Array(22)
  const ev = new DataView(end.buffer)
  ev.setUint32(0, 0x06054b50, true) // end of central directory signature
  ev.setUint16(4, 0, true) // number of this disk
  ev.setUint16(6, 0, true) // disk with the start of the central directory
  ev.setUint16(8, entries.length, true) // entries on this disk
  ev.setUint16(10, entries.length, true) // total entries
  ev.setUint32(12, centralSize, true)
  ev.setUint32(16, offset, true) // offset of the central directory
  ev.setUint16(20, 0, true) // comment length

  let total = centralSize + 22
  for (const chunk of chunks) total += chunk.length

  const out = new Uint8Array(total)
  let pos = 0
  for (const chunk of chunks) {
    out.set(chunk, pos)
    pos += chunk.length
  }
  for (const dir of central) {
    out.set(dir, pos)
    pos += dir.length
  }
  out.set(end, pos)
  return out.buffer
}

/* ------------------------------------------------------------------ */
/* XML helpers                                                         */
/* ------------------------------------------------------------------ */
function escapeXml(value) {
  return String(value)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '') // characters XML 1.0 forbids
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\r/g, '&#13;')
}

function columnLetter(index) {
  let n = index
  let letters = ''
  do {
    letters = String.fromCharCode(65 + (n % 26)) + letters
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return letters
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return ''
  if (Number.isInteger(value) && Math.abs(value) < 1e15) return String(value)
  if (Math.abs(value) < 1e15) {
    const trimmed = value.toFixed(10).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
    return trimmed === '-0' ? '0' : trimmed
  }
  // very large numbers: expand the exponent, Excel does not read 1e+21
  return value.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 })
}

// null / undefined / empty string produce no cell at all
function cellXml(ref, value, style) {
  const s = style ? ` s="${style}"` : ''
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'boolean') return `<c r="${ref}"${s} t="b"><v>${value ? 1 : 0}</v></c>`
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return ''
    return `<c r="${ref}"${s} t="n"><v>${formatNumber(value)}</v></c>`
  }
  return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`
}

/* ------------------------------------------------------------------ */
/* Sheet names                                                         */
/* ------------------------------------------------------------------ */
const INVALID_SHEET_CHARS = /[:\\/?*[\]]/g

function sanitiseSheetName(name, fallback) {
  let text = String(name ?? '').replace(INVALID_SHEET_CHARS, ' ').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) {
    text = String(fallback ?? '').replace(INVALID_SHEET_CHARS, ' ').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim()
  }
  if (!text) text = 'Sheet'
  return text.slice(0, 31)
}

// names handed out by safeSheetName, so a batch never repeats a tab name
const usedSheetNames = new Set()

export function resetSheetNames() {
  usedSheetNames.clear()
}

function dedupeName(base, used) {
  let candidate = base
  let counter = 2
  while (used.has(candidate.toLowerCase())) {
    const suffix = ` (${counter})`
    candidate = base.slice(0, 31 - suffix.length) + suffix
    counter += 1
  }
  return candidate
}

export function safeSheetName(name, fallback = 'Sheet') {
  const candidate = dedupeName(sanitiseSheetName(name, fallback), usedSheetNames)
  usedSheetNames.add(candidate.toLowerCase())
  return candidate
}

function uniqueSheetNames(sheets) {
  const used = new Set()
  return sheets.map((sheet, i) => {
    const candidate = dedupeName(sanitiseSheetName(sheet?.name, `Sheet${i + 1}`), used)
    used.add(candidate.toLowerCase())
    return candidate
  })
}

/* ------------------------------------------------------------------ */
/* OOXML parts                                                         */
/* ------------------------------------------------------------------ */
function stylesXml() {
  return XML_DECL +
    `<styleSheet xmlns="${NS_MAIN}">` +
    '<fonts count="4">' +
    '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>' +
    '<font><b/><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>' +
    '<font><i/><sz val="10"/><color rgb="FF595959"/><name val="Calibri"/><family val="2"/></font>' +
    '<font><b/><sz val="14"/><color rgb="FF1F2937"/><name val="Calibri"/><family val="2"/></font>' +
    '</fonts>' +
    '<fills count="3">' +
    '<fill><patternFill patternType="none"/></fill>' +
    '<fill><patternFill patternType="gray125"/></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FF1F2937"/><bgColor indexed="64"/></patternFill></fill>' +
    '</fills>' +
    '<borders count="2">' +
    '<border><left/><right/><top/><bottom/><diagonal/></border>' +
    '<border>' +
    '<left style="thin"><color rgb="FFD1D5DB"/></left>' +
    '<right style="thin"><color rgb="FFD1D5DB"/></right>' +
    '<top style="thin"><color rgb="FFD1D5DB"/></top>' +
    '<bottom style="thin"><color rgb="FFD1D5DB"/></bottom>' +
    '<diagonal/></border>' +
    '</borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="4">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
    '</cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>'
}

function sheetXml(sheet) {
  const columns = Array.isArray(sheet?.columns) ? sheet.columns : []
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : []
  const title = sheet?.title ? String(sheet.title) : ''
  const note = sheet?.note ? String(sheet.note) : ''
  const headerRow = title ? 2 : 1
  // rows may carry more cells than the header declares: keep every value
  const longest = rows.reduce((max, row) => Math.max(max, Array.isArray(row) ? row.length : 0), 0)
  const colCount = Math.max(columns.length, longest)

  const out = [XML_DECL, `<worksheet xmlns="${NS_MAIN}">`]

  out.push('<sheetViews><sheetView workbookViewId="0">')
  out.push(`<pane ySplit="${headerRow}" topLeftCell="A${headerRow + 1}" activePane="bottomLeft" state="frozen"/>`)
  out.push(`<selection pane="bottomLeft" activeCell="A${headerRow + 1}" sqref="A${headerRow + 1}"/>`)
  out.push('</sheetView></sheetViews>')
  out.push('<sheetFormatPr defaultRowHeight="15"/>')

  if (colCount) {
    out.push('<cols>')
    columns.forEach((column, i) => {
      const width = Number(column?.width)
      const value = Number.isFinite(width) && width > 0 ? width : 18
      out.push(`<col min="${i + 1}" max="${i + 1}" width="${value}" customWidth="1"/>`)
    })
    out.push('</cols>')
  }

  out.push('<sheetData>')
  if (title) {
    out.push(`<row r="1" ht="22" customHeight="1"><c r="A1" s="${STYLE_TITLE}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(title)}</t></is></c></row>`)
  }
  const headerCells = columns.map((column, i) => cellXml(`${columnLetter(i)}${headerRow}`, column?.header ?? '', STYLE_HEADER)).join('')
  out.push(`<row r="${headerRow}">${headerCells}</row>`)
  rows.forEach((row, i) => {
    const ref = headerRow + 1 + i
    const cells = []
    for (let ci = 0; ci < colCount; ci += 1) cells.push(cellXml(`${columnLetter(ci)}${ref}`, row?.[ci], STYLE_DEFAULT))
    out.push(`<row r="${ref}">${cells.join('')}</row>`)
  })
  if (note) {
    const ref = headerRow + 1 + rows.length
    out.push(`<row r="${ref}"><c r="A${ref}" s="${STYLE_NOTE}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(note)}</t></is></c></row>`)
  }
  out.push('</sheetData>')

  if (title && colCount > 1) {
    out.push(`<mergeCells count="1"><mergeCell ref="A1:${columnLetter(colCount - 1)}1"/></mergeCells>`)
  }

  out.push('</worksheet>')
  return out.join('')
}

function corePropsXml(options, now) {
  const creator = options.creator ? String(options.creator) : 'EduSolve AI'
  const title = options.title ? String(options.title) : ''
  const stamp = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
  return XML_DECL +
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
    'xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    (title ? `<dc:title>${escapeXml(title)}</dc:title>` : '') +
    `<dc:creator>${escapeXml(creator)}</dc:creator>` +
    `<cp:lastModifiedBy>${escapeXml(creator)}</cp:lastModifiedBy>` +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${stamp}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${stamp}</dcterms:modified>` +
    '</cp:coreProperties>'
}

function appPropsXml() {
  return XML_DECL +
    '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" ' +
    'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">' +
    '<Application>EduSolve AI</Application>' +
    '</Properties>'
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */
export function createXlsx(sheets, options = {}) {
  // Excel refuses to open a workbook without a single sheet
  const list = Array.isArray(sheets) && sheets.length ? sheets : [{ name: 'Sheet1', columns: [], rows: [] }]
  const names = uniqueSheetNames(list)
  const now = new Date()
  const entries = []

  const sheetOverrides = list
    .map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`)
    .join('')

  entries.push({
    name: '[Content_Types].xml',
    data: utf8(XML_DECL +
      `<Types xmlns="${NS_CT}">` +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
      '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>' +
      sheetOverrides +
      '</Types>'),
  })

  entries.push({
    name: '_rels/.rels',
    data: utf8(XML_DECL +
      `<Relationships xmlns="${NS_PKG_REL}">` +
      `<Relationship Id="rId1" Type="${NS_REL}/officeDocument" Target="xl/workbook.xml"/>` +
      `<Relationship Id="rId2" Type="${NS_PKG_REL}/metadata/core-properties" Target="docProps/core.xml"/>` +
      `<Relationship Id="rId3" Type="${NS_REL}/extended-properties" Target="docProps/app.xml"/>` +
      '</Relationships>'),
  })

  entries.push({
    name: 'xl/workbook.xml',
    data: utf8(XML_DECL +
      `<workbook xmlns="${NS_MAIN}" xmlns:r="${NS_REL}">` +
      '<sheets>' +
      names.map((name, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 2}"/>`).join('') +
      '</sheets>' +
      '</workbook>'),
  })

  const workbookRels = list
    .map((_, i) => `<Relationship Id="rId${i + 2}" Type="${NS_REL}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`)
    .join('')

  entries.push({
    name: 'xl/_rels/workbook.xml.rels',
    data: utf8(XML_DECL +
      `<Relationships xmlns="${NS_PKG_REL}">` +
      `<Relationship Id="rId1" Type="${NS_REL}/styles" Target="styles.xml"/>` +
      workbookRels +
      '</Relationships>'),
  })

  entries.push({ name: 'xl/styles.xml', data: utf8(stylesXml()) })

  list.forEach((sheet, i) => {
    entries.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: utf8(sheetXml(sheet)) })
  })

  entries.push({ name: 'docProps/core.xml', data: utf8(corePropsXml(options || {}, now)) })
  entries.push({ name: 'docProps/app.xml', data: utf8(appPropsXml()) })

  return zipStore(entries)
}

export function downloadXlsx(filename, sheets, options = {}) {
  if (typeof document === 'undefined' || typeof Blob === 'undefined') return
  const buffer = createXlsx(sheets, options)
  const blob = new Blob([buffer], { type: XLSX_MIME })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* ------------------------------------------------------------------ */
/* CSV fallback                                                        */
/* ------------------------------------------------------------------ */
function csvField(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  const text = typeof value === 'number' ? formatNumber(value) : String(value)
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export function sheetToCsv(sheet) {
  const columns = Array.isArray(sheet?.columns) ? sheet.columns : []
  const rows = Array.isArray(sheet?.rows) ? sheet.rows : []
  const longest = rows.reduce((max, row) => Math.max(max, Array.isArray(row) ? row.length : 0), 0)
  const colCount = Math.max(columns.length, longest)
  const lines = []
  if (sheet?.title) lines.push([String(sheet.title)])
  lines.push(columns.map((column) => column?.header ?? ''))
  for (const row of rows) {
    const cells = []
    for (let i = 0; i < colCount; i += 1) cells.push(row?.[i] ?? null)
    lines.push(cells)
  }
  if (sheet?.note) lines.push([String(sheet.note)])
  return lines.map((line) => line.map(csvField).join(',')).join('\r\n')
}
