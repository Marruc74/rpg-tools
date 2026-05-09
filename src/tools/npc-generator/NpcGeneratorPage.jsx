import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './npcGeneratorPage.css'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  TABLES_KEY,
  emptyLibrary as emptyTablesLibrary,
  migrateLibrary as migrateTablesLibrary,
} from '../tables/lib/tablesLibrary.js'
import {
  NPC_KEY,
  emptyState,
  migrateState,
  reconcileSlots,
  resolveSlotTable,
  rollAll,
  rollOne,
  addToHistory,
  addToRoster,
  removeFromRoster,
  renameRosterItem,
  clearHistory as clearHistoryState,
} from './lib/npcLibrary.js'
import { sendNpcToCardMaker } from './lib/sendToCardMaker.js'
import ResultPanel from './components/ResultPanel.jsx'
import RosterList from './components/RosterList.jsx'
import HistoryList from './components/HistoryList.jsx'

export default function NpcGeneratorPage() {
  const [state, setState, stateReady] = useIndexedDBState(
    NPC_KEY,
    emptyState(),
    migrateState,
  )
  // Read-only subscription. We never call setTablesLib — the Tables tool
  // is the sole writer for this key.
  const [tablesLib, , tablesReady] = useIndexedDBState(
    TABLES_KEY,
    emptyTablesLibrary(),
    migrateTablesLibrary,
  )
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  // After both libraries hydrate, reconcile slot.tableId against the live
  // tables library (handles first-run, table renames by uuid churn, etc).
  useEffect(() => {
    if (!stateReady || !tablesReady) return
    const reconciled = reconcileSlots(state.slots, tablesLib)
    if (reconciled !== state.slots) {
      setState({ ...state, slots: reconciled })
    }
    // Run only when readiness flips or tables change. State reference is
    // intentionally stale here — reconcileSlots returns the same array if
    // nothing changes, so we won't loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateReady, tablesReady, tablesLib])

  const ready = stateReady && tablesReady

  if (!ready) {
    return (
      <div className="npc">
        <header className="npc__header"><h1>NPC Generator</h1></header>
        <main className="npc__main"><p className="hint">Loading…</p></main>
      </div>
    )
  }

  const tablesEmpty = tablesLib.tables.length === 0
  const canRollAny = state.slots.some((s) => !!resolveSlotTable(s, tablesLib))

  const handleRollAll = () => {
    const fields = rollAll(state.slots, tablesLib, state.current)
    setState(addToHistory({ ...state, current: fields }, fields))
  }

  const handleRollOne = (slotId) => {
    const fields = rollOne(state.slots, tablesLib, slotId, state.current)
    setState(addToHistory({ ...state, current: fields }, fields))
  }

  const handleSlotTableChange = (slotId, tableId) => {
    const matched = tablesLib.tables.find((t) => t.id === tableId)
    setState({
      ...state,
      slots: state.slots.map((s) =>
        s.id === slotId
          ? {
              ...s,
              tableId: tableId || null,
              fallbackTableName: matched ? matched.name : s.fallbackTableName,
            }
          : s,
      ),
    })
  }

  const handleSaveToRoster = () => {
    if (!state.current) return
    const suggested = state.current.name?.trim() || 'Unnamed NPC'
    const name = prompt('Save NPC as:', suggested)
    if (name === null) return
    setState(addToRoster(state, name, state.current))
  }

  const handleSendToCardMaker = async () => {
    if (!state.current || sending) return
    setSending(true)
    setError(null)
    try {
      await sendNpcToCardMaker(state.current)
      navigate('/card-maker')
    } catch (err) {
      setError(err.message || 'Failed to send to Card-Maker.')
      setSending(false)
    }
  }

  const handleRenameRoster = (id, name) =>
    setState(renameRosterItem(state, id, name))

  const handleDeleteRoster = (id) =>
    setState(removeFromRoster(state, id))

  const handleLoadFields = (fields) =>
    setState({ ...state, current: { ...fields } })

  const handleClearHistory = () => {
    if (!confirm('Clear roll history?')) return
    setState(clearHistoryState(state))
  }

  return (
    <div className="npc">
      <header className="npc__header">
        <h1>NPC Generator</h1>
      </header>

      <main className="npc__main">
        <aside className="npc__side">
          <RosterList
            roster={state.roster}
            onRename={handleRenameRoster}
            onDelete={handleDeleteRoster}
            onLoad={handleLoadFields}
          />
          <HistoryList
            history={state.history}
            onLoad={handleLoadFields}
            onClear={handleClearHistory}
          />
        </aside>

        <section className="npc__pane">
          {tablesEmpty ? (
            <div className="empty-state">
              <p>No random tables yet.</p>
              <p className="hint">
                Build at least one in the <Link to="/tables">Random Tables</Link> tool, then come back to roll up an NPC.
              </p>
            </div>
          ) : (
            <ResultPanel
              slots={state.slots}
              current={state.current}
              tablesLib={tablesLib}
              canRollAny={canRollAny}
              onRollAll={handleRollAll}
              onRollOne={handleRollOne}
              onSlotTableChange={handleSlotTableChange}
              onSave={handleSaveToRoster}
              onSendToCardMaker={handleSendToCardMaker}
              sending={sending}
            />
          )}
        </section>
      </main>

      {error && <div className="npc__error">{error}</div>}
    </div>
  )
}
