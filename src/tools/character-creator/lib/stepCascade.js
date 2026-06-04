// Step-cascade reset for the creator wizards. Steps form a dependency chain:
// changing a choice in one step invalidates everything built on it. Each
// system declares `stepFields` (stepId → the state fields that step owns) and
// `noCascadeFields` (free-text/flavour fields that reset with their step but
// never trigger a cascade — text inputs change on every keystroke). When a
// change touches a field owned by the step the user is currently on, every
// LATER step's fields are reset to their empty-state defaults. Changes coming
// from a later step that write an earlier step's field (e.g. WFRP career
// change during Advancement) do not cascade.
const clone = (x) => JSON.parse(JSON.stringify(x))

export function cascadeReset(system, stepIdx, prev, next) {
  const map = system.stepFields
  if (!map || next === prev) return next
  const order = system.steps.map((s) => s.id)
  const noCascade = new Set(system.noCascadeFields || [])
  const differs = (a, b) => JSON.stringify(a ?? null) !== JSON.stringify(b ?? null)
  const own = (map[order[stepIdx]] || []).filter((f) => !noCascade.has(f))
  if (!own.some((f) => differs(prev[f], next[f]))) return next
  const empty = system.emptyState()
  let out = next
  for (let i = stepIdx + 1; i < order.length; i += 1) {
    for (const f of map[order[i]] || []) {
      if (differs(out[f], empty[f])) {
        if (out === next) out = { ...next }
        out[f] = empty[f] === undefined ? undefined : clone(empty[f])
      }
    }
  }
  return out
}
