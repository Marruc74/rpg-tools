import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './journalPage.css'
import EntryList from './components/EntryList.jsx'
import EntryEditor from './components/EntryEditor.jsx'
import JournalToolbar from './components/JournalToolbar.jsx'
import PrintArea from './components/PrintArea.jsx'
import { useIndexedDBState } from '../../shared/hooks/useIndexedDBState.js'
import {
  JOURNAL_KEY,
  emptyJournal,
  migrateJournal,
  newEntry,
  downloadJournalJson,
  downloadEntryJson,
  readJsonFile,
} from './lib/journalLibrary.js'
import { exportEntryPdf } from './lib/exportJournalPdf.js'

export default function JournalPage() {
  const [journal, setJournal, isReady] = useIndexedDBState(
    JOURNAL_KEY,
    emptyJournal(),
    migrateJournal,
  )

  const entries = journal.entries
  const activeId = journal.activeEntryId

  const activeEntry = useMemo(
    () => entries.find((e) => e.id === activeId) ?? entries[0] ?? null,
    [entries, activeId],
  )

  // Keep activeEntryId valid if it ever points at a removed entry.
  useEffect(() => {
    if (!activeEntry && entries.length > 0) {
      setJournal({ ...journal, activeEntryId: entries[0].id })
    }
  }, [entries, activeEntry])

  const updateEntry = (next) => {
    setJournal({
      ...journal,
      entries: entries.map((e) => (e.id === next.id ? next : e)),
    })
  }

  const handleSelect = (id) => setJournal({ ...journal, activeEntryId: id })

  const handleNew = () => {
    const entry = newEntry({ title: `Session ${entries.length + 1}` })
    setJournal({
      ...journal,
      entries: [entry, ...entries],
      activeEntryId: entry.id,
    })
  }

  const handleDelete = (id) => {
    const remaining = entries.filter((e) => e.id !== id)
    if (remaining.length === 0) return
    setJournal({
      ...journal,
      entries: remaining,
      activeEntryId: activeId === id ? remaining[0].id : activeId,
    })
  }

  const handleDuplicate = (id) => {
    const original = entries.find((e) => e.id === id)
    if (!original) return
    const copy = {
      ...structuredClone(original),
      id: uuid(),
      title: `${original.title} (copy)`,
      sections: original.sections.map((s) => ({ ...s, id: uuid() })),
    }
    const idx = entries.findIndex((e) => e.id === id)
    const next = [...entries]
    next.splice(idx + 1, 0, copy)
    setJournal({ ...journal, entries: next, activeEntryId: copy.id })
  }

  const handleExportPdf = async () => {
    if (!activeEntry) return
    await exportEntryPdf(activeEntry)
  }

  const handleExportEntryJson = () => {
    if (!activeEntry) return
    downloadEntryJson(activeEntry)
  }

  const handleExportJournalJson = () => downloadJournalJson(journal)

  const handleImportJson = async (file) => {
    try {
      const parsed = await readJsonFile(file)
      if (parsed.kind === 'entry') {
        const entry = {
          ...parsed.entry,
          id: uuid(),
          sections: (parsed.entry.sections ?? []).map((s) => ({ ...s, id: uuid() })),
        }
        setJournal({
          ...journal,
          entries: [entry, ...entries],
          activeEntryId: entry.id,
        })
        return
      }
      if (parsed.kind === 'journal') {
        const choice =
          entries.length === 1 && entries[0].sections.every((s) => !s.content)
            ? 'replace'
            : confirm('Replace your current journal with the imported one? Click Cancel to merge entries.')
              ? 'replace'
              : 'merge'
        if (choice === 'replace') {
          setJournal(parsed.journal)
        } else {
          const existingIds = new Set(entries.map((e) => e.id))
          const merged = [
            ...entries,
            ...parsed.journal.entries.filter((e) => !existingIds.has(e.id)),
          ]
          setJournal({ ...journal, entries: merged })
        }
      }
    } catch (err) {
      alert(`Import failed: ${err.message}`)
    }
  }

  if (!isReady) {
    return (
      <div className="journal">
        <header className="journal__header">
          <h1>Session Journal</h1>
        </header>
        <main className="journal__main journal__main--loading">
          <p className="hint">Loading journal…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="journal">
      <header className="journal__header">
        <h1>Session Journal</h1>
        <JournalToolbar
          onExportPdf={handleExportPdf}
          onExportEntryJson={handleExportEntryJson}
          onExportJournalJson={handleExportJournalJson}
          onImportJson={handleImportJson}
          hasEntry={!!activeEntry}
          entryCount={entries.length}
        />
      </header>

      <main className="journal__main">
        <EntryList
          entries={entries}
          activeId={activeEntry?.id}
          onSelect={handleSelect}
          onNew={handleNew}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />

        {activeEntry ? (
          <EntryEditor entry={activeEntry} onChange={updateEntry} />
        ) : (
          <div className="empty-state">
            <p>No entry selected.</p>
            <button className="primary" onClick={handleNew}>
              + Create your first entry
            </button>
          </div>
        )}
      </main>

      <PrintArea entry={activeEntry} />
    </div>
  )
}
