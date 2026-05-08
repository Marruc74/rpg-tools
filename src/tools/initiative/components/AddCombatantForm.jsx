import { useState } from 'react'
import { rollD20 } from '../lib/initiativeLibrary.js'

export default function AddCombatantForm({ onAdd }) {
  const [name, setName] = useState('')
  const [init, setInit] = useState('')
  const [hp, setHp] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      initiative: init === '' ? 0 : Number(init),
      hp: hp === '' ? null : Number(hp),
      maxHp: hp === '' ? null : Number(hp),
    })
    setName('')
    setInit('')
    setHp('')
  }

  return (
    <form className="add-combatant" onSubmit={submit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="add-combatant__name"
      />
      <input
        type="number"
        value={init}
        onChange={(e) => setInit(e.target.value)}
        placeholder="Init"
        className="add-combatant__init"
      />
      <button
        type="button"
        className="icon-button"
        onClick={() => setInit(String(rollD20()))}
        title="Roll initiative"
      >
        🎲
      </button>
      <input
        type="number"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        placeholder="HP"
        className="add-combatant__hp"
      />
      <button type="submit" className="add-combatant__add" disabled={!name.trim()}>
        + Add
      </button>
    </form>
  )
}
