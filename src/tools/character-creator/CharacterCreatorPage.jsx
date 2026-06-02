import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './characterCreator.css'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import { SYSTEMS, systemById } from './systems/index.js'
import RosterBar from './components/RosterBar.jsx'

const SYSTEM_KEY = 'character-creator-system'
const clone = (x) => JSON.parse(JSON.stringify(x))
const CHARACTER_KIND = 'rpg-tools-character'
const safeFile = (s) => ((s || 'character').replace(/[^\w\-åäöÅÄÖ]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'character')

function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Per-system creator: owns the character state for one game system and renders
// the step wizard. Mounted with key={system.id} so switching systems re-runs
// useIndexedDBState cleanly against that system's own storage key.
function SystemRunner({ system, pendingImport, onConsumePending, onCrossImport }) {
  const [state, setState, ready] = useIndexedDBState(
    system.storageKey, system.emptyState(), system.migrateState,
  )
  // Saved-character roster: a separate store per system so it never disturbs
  // the live working character's state shape.
  const [roster, setRoster, rosterReady] = useIndexedDBState(`${system.storageKey}:roster`, [])
  const [loadedId, setLoadedId] = useState(null)
  const [stepIdx, setStepIdx] = useState(0)
  const derived = useMemo(() => system.deriveCharacter(state), [system, state])

  // Import a parsed payload into THIS system (state already known to match).
  const importHere = (payload) => {
    const st = system.migrateState(clone(payload.state))
    const id = uuid()
    setRoster((rs) => [{
      id,
      name: payload.name || (system.getName(st) || '').trim() || 'Imported',
      summary: payload.summary || system.getSummary(st, system.deriveCharacter(st)),
      savedAt: Date.now(),
      state: clone(st),
    }, ...rs])
    setState(st)
    setLoadedId(id)
    setStepIdx(0)
  }

  // Cross-system import: once this runner mounts for the target system, apply it.
  useEffect(() => {
    if (!ready || !rosterReady || !pendingImport) return
    if (pendingImport.system !== system.id) return
    importHere(pendingImport)
    onConsumePending()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, rosterReady, pendingImport])

  if (!ready || !rosterReady) {
    return <main className="cc__main"><p className="hint">Laddar…</p></main>
  }

  const update = (patch) => setState((s) => ({ ...s, ...patch }))
  const steps = system.steps
  const Active = steps[stepIdx].Comp
  const Budgets = system.Budgets

  // ── Roster operations ───────────────────────────────────────────────────
  const snapshot = () => ({
    name: (system.getName(state) || '').trim() || 'Unnamed',
    summary: system.getSummary(state, derived),
    savedAt: Date.now(),
    state: clone(state),
  })
  const loadedItem = roster.find((r) => r.id === loadedId) || null
  const dirty = loadedItem ? JSON.stringify(loadedItem.state) !== JSON.stringify(state) : false

  const handleSave = () => {
    const snap = snapshot()
    if (loadedId && loadedItem) {
      setRoster((rs) => rs.map((r) => (r.id === loadedId ? { ...r, ...snap } : r)))
    } else {
      const id = uuid()
      setRoster((rs) => [{ id, ...snap }, ...rs])
      setLoadedId(id)
    }
  }
  const handleSaveCopy = () => {
    const id = uuid()
    setRoster((rs) => [{ id, ...snapshot() }, ...rs])
    setLoadedId(id)
  }
  const handleNew = () => {
    if (!confirm(system.resetConfirm)) return
    setState(system.emptyState())
    setLoadedId(null)
    setStepIdx(0)
  }
  const handleLoad = (id) => {
    const item = roster.find((r) => r.id === id)
    if (!item) return
    if (dirty && !confirm('Load this character? Unsaved changes to the current one will be replaced.')) return
    setState(clone(item.state))
    setLoadedId(id)
    setStepIdx(0)
  }
  const handleRename = (id, name) => setRoster((rs) => rs.map((r) => (r.id === id ? { ...r, name } : r)))
  const handleDelete = (id) => {
    setRoster((rs) => rs.filter((r) => r.id !== id))
    if (id === loadedId) setLoadedId(null)
  }

  // ── JSON export / import ──────────────────────────────────────────────────
  const charPayload = (st) => ({
    kind: CHARACTER_KIND,
    system: system.id,
    systemName: system.name,
    version: 1,
    exportedAt: new Date().toISOString(),
    name: (system.getName(st) || '').trim() || 'Unnamed',
    summary: system.getSummary(st, system.deriveCharacter(st)),
    state: clone(st),
  })
  const handleExport = () => {
    const p = charPayload(state)
    downloadJSON(`${safeFile(p.name)}.${system.id}.json`, p)
  }
  const handleExportItem = (id) => {
    const item = roster.find((r) => r.id === id)
    if (!item) return
    const p = charPayload(item.state)
    downloadJSON(`${safeFile(item.name || p.name)}.${system.id}.json`, p)
  }
  // Validate + route a payload (possibly to another system's tab).
  const handleImport = (payload) => {
    if (!payload || payload.kind !== CHARACTER_KIND || !payload.state || !payload.system) {
      alert('That file is not a valid character export.')
      return
    }
    if (!systemById(payload.system) || payload.system !== systemById(payload.system).id) {
      alert(`Unknown game system "${payload.system}" in that file.`)
      return
    }
    if (payload.system !== system.id) {
      onCrossImport(payload) // switch tabs, then import there
      return
    }
    if (dirty && !confirm('Importing will replace the current unsaved character. Continue?')) return
    importHere(payload)
  }

  return (
    <>
      <div className="cc__subbar">
        <p className="cc__sub">{system.subtitle}</p>
        <RosterBar
          roster={roster} loadedId={loadedId} dirty={dirty}
          onSave={handleSave} onSaveCopy={handleSaveCopy} onNew={handleNew}
          onLoad={handleLoad} onRename={handleRename} onDelete={handleDelete}
          onExport={handleExport} onExportItem={handleExportItem} onImport={handleImport}
        />
      </div>

      <main className="cc__main">
        <aside className="cc__side">
          <nav className="cc-steps">
            {steps.map((s, i) => (
              <button
                key={s.id}
                className={`cc-steps__item ${i === stepIdx ? 'is-active' : ''} ${system.stepDone(s.id, state, derived) ? 'is-done' : ''}`}
                onClick={() => setStepIdx(i)}
              >
                <span className="cc-steps__no">{i + 1}</span>
                <span className="cc-steps__label">{s.label}</span>
                {system.stepDone(s.id, state, derived) && <span className="cc-steps__check">✓</span>}
              </button>
            ))}
          </nav>

          <div className="cc-budgets">
            <Budgets state={state} derived={derived} />
          </div>
        </aside>

        <section className="cc__pane">
          <Active state={state} update={update} setState={setState} derived={derived} />
          <div className="cc__nav">
            <button className="cc-btn cc-btn--ghost" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>
              ← Föregående / Back
            </button>
            <button className="cc-btn" disabled={stepIdx === steps.length - 1} onClick={() => setStepIdx((i) => i + 1)}>
              Nästa / Next →
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default function CharacterCreatorPage() {
  const [systemId, setSystemId, ready] = useIndexedDBState(SYSTEM_KEY, 'dod')
  const [pendingImport, setPendingImport] = useState(null)
  const system = systemById(systemId)

  // A character imported for another system: switch to its tab, then the target
  // SystemRunner applies it on mount.
  const handleCrossImport = (payload) => {
    setPendingImport(payload)
    setSystemId(payload.system)
  }

  return (
    <div className="cc">
      <header className="cc__header">
        <div>
          <h1>Rollperson / Character</h1>
          <p className="cc__sub">Build a character — pick your game system</p>
        </div>
        <div className="cc-system-switch">
          {SYSTEMS.map((s) => (
            <button
              key={s.id}
              className={`cc-system-switch__btn ${s.id === system.id ? 'is-active' : ''}`}
              onClick={() => setSystemId(s.id)}
            >
              {s.short}
            </button>
          ))}
        </div>
      </header>

      {ready && (
        <SystemRunner
          key={system.id}
          system={system}
          pendingImport={pendingImport}
          onConsumePending={() => setPendingImport(null)}
          onCrossImport={handleCrossImport}
        />
      )}
    </div>
  )
}
