// Tiny dice-notation parser/evaluator.
//
// Supports terms separated by + / -:
//   NdM             — N M-sided dice (N defaults to 1)
//   NdMkhX / NdMklX — keep highest / lowest X
//   NdMdhX / NdMdlX — drop highest / lowest X
//   K               — flat integer modifier
// Examples: 2d6+3, 1d20+5, 4d6dl1, 1d20kh2 (advantage), d20-2

const TERM_RE = /([+-]?)(\d*d\d+(?:k[hl]\d+|d[hl]\d+)?|\d+)/gi

function parseTerm(sign, body) {
  const sgn = sign === '-' ? -1 : 1
  if (/^\d+$/.test(body)) {
    return { kind: 'mod', value: sgn * Number(body) }
  }
  const dm = body.match(/^(\d*)d(\d+)(k[hl]\d+|d[hl]\d+)?$/i)
  if (!dm) throw new Error(`Bad term: "${body}"`)
  const n = Number(dm[1] || '1')
  const sides = Number(dm[2])
  if (n < 1 || n > 100) throw new Error(`Dice count out of range: ${n}`)
  if (sides < 2 || sides > 1000) throw new Error(`Sides out of range: ${sides}`)
  let mod = null
  if (dm[3]) {
    const op = dm[3][0].toLowerCase() // k or d
    const hl = dm[3][1].toLowerCase() // h or l
    const cnt = Number(dm[3].slice(2))
    if (cnt < 1 || cnt >= n) {
      throw new Error(`${op}${hl}${cnt} requires 1 ≤ count < dice count`)
    }
    mod = { op, side: hl, count: cnt }
  }
  return { kind: 'dice', sign: sgn, n, sides, mod }
}

export function parseExpression(input) {
  const cleaned = input.trim().replace(/\s+/g, '').toLowerCase()
  if (!cleaned) throw new Error('Enter a dice expression.')
  const terms = []
  let m
  TERM_RE.lastIndex = 0
  while ((m = TERM_RE.exec(cleaned)) !== null) {
    terms.push(parseTerm(m[1], m[2]))
  }
  if (terms.length === 0) throw new Error('Could not parse expression.')
  return terms
}

function rollDie(sides) {
  return 1 + Math.floor(Math.random() * sides)
}

export function rollExpression(input) {
  const terms = parseExpression(input)
  let total = 0
  const breakdown = []

  for (const t of terms) {
    if (t.kind === 'mod') {
      total += t.value
      breakdown.push({
        kind: 'mod',
        label: (t.value >= 0 ? '+' : '') + t.value,
        value: t.value,
      })
      continue
    }

    const rolls = []
    for (let i = 0; i < t.n; i++) rolls.push(rollDie(t.sides))

    let kept = rolls.slice()
    let dropped = []
    if (t.mod) {
      const sortedAsc = rolls
        .map((v, i) => ({ v, i }))
        .sort((a, b) => a.v - b.v || a.i - b.i)
      const dropIdx = new Set()
      if (t.mod.op === 'k') {
        // keep N — the others get dropped
        const keepIdx =
          t.mod.side === 'h'
            ? sortedAsc.slice(-t.mod.count).map((x) => x.i)
            : sortedAsc.slice(0, t.mod.count).map((x) => x.i)
        const keep = new Set(keepIdx)
        for (let i = 0; i < rolls.length; i++) if (!keep.has(i)) dropIdx.add(i)
      } else {
        const drop =
          t.mod.side === 'h'
            ? sortedAsc.slice(-t.mod.count).map((x) => x.i)
            : sortedAsc.slice(0, t.mod.count).map((x) => x.i)
        for (const i of drop) dropIdx.add(i)
      }
      kept = rolls.filter((_, i) => !dropIdx.has(i))
      dropped = rolls.filter((_, i) => dropIdx.has(i))
    }

    const subSum = kept.reduce((s, v) => s + v, 0)
    const signed = subSum * t.sign
    total += signed

    breakdown.push({
      kind: 'dice',
      label:
        (t.sign < 0 ? '-' : breakdown.length > 0 ? '+' : '') +
        `${t.n}d${t.sides}` +
        (t.mod ? `${t.mod.op}${t.mod.side}${t.mod.count}` : ''),
      n: t.n,
      sides: t.sides,
      rolls,
      kept,
      dropped,
      value: signed,
    })
  }

  return { total, breakdown }
}

// Quick check used by the input — returns null if ok, error message otherwise.
export function validateExpression(input) {
  try {
    parseExpression(input)
    return null
  } catch (err) {
    return err.message
  }
}
