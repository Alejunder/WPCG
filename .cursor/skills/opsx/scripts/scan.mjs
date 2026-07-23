#!/usr/bin/env node
// opsx static verifier — mechanical governance checks for the WPCG codebase.
// Usage: node .cursor/skills/opsx/scripts/scan.mjs [--root src] [--json] [--only category,...]
//
// This script ONLY reports signal. It never edits files. Judgment-based checks
// (duplicate logic, business rules, design-system intent) are left to the agent.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep, basename } from 'node:path'

const args = process.argv.slice(2)
const getArg = (flag, def) => {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : def
}
const ROOT = getArg('--root', 'src')
const JSON_OUT = args.includes('--json')
const ONLY = (getArg('--only', '') || '').split(',').map((s) => s.trim()).filter(Boolean)

const CATEGORIES = {
  TYPESCRIPT: 'TypeScript safety',
  CLIENT: 'Unnecessary use client',
  COMPONENT_DATA: 'Component data/CMS access',
  BUSINESS_LOGIC: 'Business logic in components',
  FETCH_VALIDATION: 'Fetch without validation',
  DESIGN_SYSTEM: 'Design system',
  SEO: 'SEO',
  A11Y: 'Accessibility',
  PERFORMANCE: 'Performance',
  ARCHITECTURE: 'Architecture / placement',
}

const findings = []
const add = (category, severity, file, line, message) => {
  if (ONLY.length && !ONLY.includes(category)) return
  findings.push({ category, severity, file, line, message })
}

const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage'])
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE_DIRS.has(name)) continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}

if (!existsSync(ROOT)) {
  console.error(`opsx: root "${ROOT}" not found (run from repo root).`)
  process.exit(2)
}

const files = walk(ROOT)
const rel = (f) => relative(process.cwd(), f).split(sep).join('/')
const isTsx = (f) => f.endsWith('.tsx')
const isTs = (f) => f.endsWith('.ts') || f.endsWith('.tsx')
const isCssModule = (f) => f.endsWith('.module.css')
const inDir = (f, frag) => ('/' + rel(f)).includes(frag)
const isTest = (f) => /(__tests__|\.test\.|\.spec\.)/.test(rel(f))
const isComponent = (f) => isTsx(f) && (inDir(f, '/components/') || inDir(f, '/src/app/'))
const isPage = (f) => /\/src\/app\/.*\/page\.tsx$/.test('/' + rel(f)) || rel(f).endsWith('src/app/page.tsx')
const isService = (f) => /\.service\.ts$/.test(f)

const lineOf = (text, idx) => text.slice(0, idx).split('\n').length

// Spacing scale tokens (from globals.css). A hardcoded spacing value is a
// DESIGN_SYSTEM violation only when the design system provides a matching token.
const SPACING_TOKENS = { '0.5rem': '--space-xs', '1rem': '--space-sm', '1.5rem': '--space-md', '2.5rem': '--space-lg', '4rem': '--space-xl' }

// A file may declare a documented design-system exception (e.g. a deliberate
// sub-theme palette, framework error boundary, or dead/dev-only file) with an
// `opsx-allow design-system: <reason>` comment. Such files are skipped for the
// DESIGN_SYSTEM category (the reason documents the deviation in-place).
const hasDsException = (t) => /opsx-allow\s+design-system/.test(t)

// Track component basenames for duplicate detection.
const componentNames = new Map()

for (const file of files) {
  if (!isTs(file) && !isCssModule(file)) continue
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  const r = rel(file)

  // ---- CSS Modules: design system ----
  if (isCssModule(file)) {
    if (hasDsException(text)) continue
    lines.forEach((ln, i) => {
      const stripped = ln.replace(/\/\*.*?\*\//g, '')
      // Solid colors: hex (3/6-digit) and rgb()/hsl(). Alpha overlays via
      // rgba()/hsla()/8-digit hex are exempt — the design system has no alpha
      // color token, so they cannot originate from it without expanding it.
      const solid = stripped.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|\brgb\s*\(|\bhsl\s*\(/)
      if (solid && !/var\(/.test(stripped)) {
        add('DESIGN_SYSTEM', 'warn', r, i + 1, `Hardcoded color "${solid[0]}" — use a CSS variable token.`)
      }
      // Spacing: margin/padding/gap value that matches an existing --space-* token.
      if (/\b(margin|padding|gap)\b\s*:/.test(stripped)) {
        for (const [val, tok] of Object.entries(SPACING_TOKENS)) {
          const re = new RegExp(`(^|[\\s:(])${val.replace('.', '\\.')}(?=$|[\\s;)])`)
          if (re.test(stripped)) {
            add('DESIGN_SYSTEM', 'info', r, i + 1, `Hardcoded spacing "${val}" — use var(${tok}).`)
          }
        }
      }
    })
    continue
  }

  if (isTest(file)) continue

  // ---- TypeScript safety ----
  lines.forEach((ln, i) => {
    if (/(:\s*any\b|\bas\s+any\b|<any>|\bany\[\]|Array<any>)/.test(ln)) {
      add('TYPESCRIPT', 'error', r, i + 1, '`any` usage — use explicit types or unknown + validation.')
    }
    if (/@ts-ignore/.test(ln)) add('TYPESCRIPT', 'error', r, i + 1, '@ts-ignore is forbidden.')
    if (/@ts-expect-error/.test(ln)) add('TYPESCRIPT', 'warn', r, i + 1, '@ts-expect-error — justify or remove.')
    if (/\bas\s+unknown\s+as\b/.test(ln)) add('TYPESCRIPT', 'warn', r, i + 1, 'Unsafe double assertion `as unknown as`.')
  })

  // ---- Architecture / placement ----
  if (/\/src\/components\//.test('/' + r)) {
    add('ARCHITECTURE', 'warn', r, 1, 'File in src/components/ — feature code belongs under src/features/*.')
  }
  if (isTsx(file) && /export\s+default\s+function|export\s+function\s+[A-Z]/.test(text) && /return\s*\(?\s*</.test(text)) {
    const placedOk = inDir(file, '/components/') || inDir(file, '/src/app/') || inDir(file, '/motion/')
    if (!placedOk) add('ARCHITECTURE', 'warn', r, 1, 'Component-like file outside a components/ directory — check placement.')
  }
  if (isTsx(file) && inDir(file, '/components/')) {
    const name = basename(file)
    componentNames.set(name, (componentNames.get(name) || []).concat(r))
  }

  // ---- Client component detection ----
  const head = lines.slice(0, 4).join('\n')
  const isClient = /^['"]use client['"]/m.test(head)
  if (isClient) {
    const interactivity = /(use(State|Reducer|Effect|LayoutEffect|Ref|Context|Memo|Callback|Transition|Translations|Router|Pathname|Params|SearchParams|FormStatus|Scroll|Transform|InView|Animate)|createContext|on[A-Z]\w+=|addEventListener|window\.|document\.|navigator\.|localStorage|motion\.|AnimatePresence|useForm)/.test(text)
    if (!interactivity) {
      add('CLIENT', 'warn', r, 1, 'Has "use client" but no detectable interactivity — likely can be a Server Component.')
    }
  }

  // ---- Component data/CMS access ----
  if (isComponent(file) && !isPage(file)) {
    if (/\bfetch\s*\(/.test(text)) add('COMPONENT_DATA', 'error', r, 1, 'fetch() inside a component — move to a service.')
    if (/@\/lib\/sanity\/client|sanityClient|createClient\s*\(/.test(text)) {
      add('COMPONENT_DATA', 'error', r, 1, 'Direct Sanity client access in a component — use a feature service.')
    }
    if (isClient && /from\s+['"][^'"]*\.service['"]/.test(text)) {
      add('COMPONENT_DATA', 'error', r, 1, 'Client component imports a *.service file — services are server-only.')
    }
    // business-logic heuristics
    lines.forEach((ln, i) => {
      if (/\.(reduce|sort)\s*\(/.test(ln)) {
        add('BUSINESS_LOGIC', 'info', r, i + 1, 'Data transformation (reduce/sort) in component — consider a service/hook.')
      }
    })
  }

  // ---- Page-level data access (pages may orchestrate but not fetch directly) ----
  if (isPage(file)) {
    if (/\bfetch\s*\(/.test(text)) add('COMPONENT_DATA', 'warn', r, 1, 'Raw fetch() in a page — prefer a feature service.')
    if (/@\/lib\/sanity\/client/.test(text)) add('COMPONENT_DATA', 'error', r, 1, 'Direct Sanity client in a page — use a feature service.')
  }

  // ---- Fetch without validation (services) ----
  if (isService(file)) {
    const doesFetch = /fetchFromSanity|\.fetch\s*\(/.test(text)
    const validates = /validate\s*\(|safeParse|Schema\b/.test(text)
    if (doesFetch && !validates) {
      add('FETCH_VALIDATION', 'warn', r, 1, 'Service fetches data but no Zod validation detected.')
    }
  }

  // ---- SEO (routes) ----
  if (isPage(file) && !/sanity-studio/.test(r) && r !== 'src/app/page.tsx') {
    const hasMeta = /export\s+(const|async\s+function|function)\s+(metadata|generateMetadata)\b/.test(text)
    if (!hasMeta) {
      add('SEO', 'error', r, 1, 'Route has no metadata / generateMetadata export.')
    } else {
      if (!/alternates|canonical/.test(text)) add('SEO', 'warn', r, 1, 'Metadata missing canonical/alternates.')
      if (!/openGraph/.test(text)) add('SEO', 'warn', r, 1, 'Metadata missing Open Graph.')
      if (!/twitter/.test(text)) add('SEO', 'info', r, 1, 'Metadata missing Twitter card.')
    }
  }

  // ---- Accessibility & performance ----
  if (isTsx(file)) {
    let m
    // blank out block comments (incl. {/* ... */}) so matches inside comments are ignored
    const noComments = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    const imgRe = /<img\b/g
    while ((m = imgRe.exec(noComments))) {
      add('PERFORMANCE', 'warn', r, lineOf(noComments, m.index), 'Raw <img> — use next/image.')
    }
    const tagRe = /<(img|Image)\b[^>]*?>/gs
    while ((m = tagRe.exec(noComments))) {
      // skip when alt is present or may arrive via spread props
      if (!/\balt\s*=/.test(m[0]) && !/\{\.\.\./.test(m[0])) {
        add('A11Y', 'error', r, lineOf(noComments, m.index), `<${m[1]}> missing alt attribute.`)
      }
    }
    // Inline styles: flag only STATIC, unjustified ones. Dynamic styles are
    // justified per the rule ("inline styles without justification"): CSS custom
    // properties, framer-motion values, viewTransitionName, computed expressions,
    // and spreads cannot live in a static CSS module.
    if (!hasDsException(text)) {
      let idx = 0
      while ((idx = text.indexOf('style={{', idx)) !== -1) {
        const objStart = idx + 'style='.length
        let depth = 0
        let j = objStart
        for (; j < text.length; j++) {
          if (text[j] === '{') depth++
          else if (text[j] === '}') { depth--; if (depth === 0) break }
        }
        const inner = text.slice(objStart + 1, j)
        const blanked = inner.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, "''")
        const dynamic =
          /--[a-zA-Z]/.test(inner) ||
          /viewTransitionName/.test(inner) ||
          /\.\.\./.test(blanked) ||
          /[?[]/.test(blanked) ||
          /:\s*[A-Za-z_$]/.test(blanked) ||
          /\{\s*[A-Za-z_$][\w$]*\s*[,}]/.test('{' + blanked + '}')
        // Only static inline styles that hardcode a DESIGN VALUE (color, or
        // spacing on margin/padding/gap) are violations. Purely structural
        // styles (position, inset, transform-origin, perspective, dimensions)
        // are justified — they encode layout, not design-system tokens.
        const designValue =
          /#[0-9a-fA-F]{3,8}\b/.test(inner) ||
          /\b(?:rgb|hsl)a?\s*\(/.test(inner) ||
          /(?:margin|padding|gap)\w*\s*:\s*['"][^'"]*\d/.test(inner)
        if (!dynamic && designValue) {
          add('DESIGN_SYSTEM', 'warn', r, lineOf(text, idx), 'Inline style hardcodes a design value — use CSS Modules + tokens.')
        }
        idx = j + 1
      }
    }
  }
}

// duplicate component basenames across features
for (const [name, paths] of componentNames) {
  if (paths.length > 1) {
    add('ARCHITECTURE', 'info', paths.join(', '), 1, `Duplicate component name "${name}" in ${paths.length} locations — check for duplication.`)
  }
}

// ---- Output ----
const order = ['error', 'warn', 'info']
const sevRank = { error: 0, warn: 1, info: 2 }
findings.sort((a, b) => sevRank[a.severity] - sevRank[b.severity] || a.category.localeCompare(b.category))

if (JSON_OUT) {
  console.log(JSON.stringify({ root: ROOT, total: findings.length, findings }, null, 2))
  process.exit(0)
}

const counts = { error: 0, warn: 0, info: 0 }
findings.forEach((f) => (counts[f.severity] += 1))

const byCat = {}
for (const f of findings) (byCat[f.category] ||= []).push(f)

console.log(`\nopsx static scan — root: ${ROOT}`)
console.log(`files scanned: ${files.length}`)
console.log(`findings: ${findings.length}  (errors: ${counts.error}, warnings: ${counts.warn}, info: ${counts.info})\n`)

for (const cat of Object.keys(CATEGORIES)) {
  const list = byCat[cat]
  if (!list || !list.length) continue
  console.log(`## ${CATEGORIES[cat]} (${list.length})`)
  for (const f of list) {
    const loc = f.line ? `${f.file}:${f.line}` : f.file
    console.log(`  [${f.severity.toUpperCase()}] ${loc}\n        ${f.message}`)
  }
  console.log('')
}

if (!findings.length) console.log('No mechanical violations detected. Proceed with judgment-based checks.\n')

// non-zero exit when hard errors exist, so the loop can gate on it
process.exit(counts.error > 0 ? 1 : 0)
