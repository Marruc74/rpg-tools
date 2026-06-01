import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { EQUIPMENT_GROUPS, EQUIPMENT_NOTE } from '../lib/dodData.js'

const kg = (v) => `${String(v).replace('.', ',')} kg`

// Kompakt statussträng som sparas i inventariet och visas på rollformuläret.
function statOf(group, item) {
  switch (group.type) {
    case 'weapon': case 'shield': return `${item.kp}/${item.sp}`
    case 'ranged': return `${item.kp}/${item.sp} · ${item.rackv}`
    case 'armour': return `abs ${item.absKp}/${item.absSp}`
    case 'v4weapon': return `${item.skada}`
    case 'v4ranged': return `${item.skada} · ${item.rackvidd}`
    case 'v4shield': return `BV ${item.bv}`
    case 'v4armour': return `abs ${item.absorbering}`
    default: return ''
  }
}
// Mer detaljerad rad i katalogen.
function detailOf(group, item) {
  switch (group.type) {
    case 'weapon': case 'shield':
      return `KP ${item.kp} / SP ${item.sp} · ${kg(item.vikt)}${item.bv != null ? ` · BV ${item.bv}` : ''}`
    case 'ranged':
      return `KP ${item.kp} / SP ${item.sp} · ${item.rackv} · ${kg(item.vikt)}`
    case 'armour':
      return `abs KP ${item.absKp} / SP ${item.absSp} · ${kg(item.vikt)}${item.hb ? ` · HB ${item.hb}` : ''}`
    case 'v4weapon':
      return `Skada ${item.skada} · STY ${item.sty}${item.vikt != null ? ` · ${kg(item.vikt)}` : ''}${item.bv != null ? ` · BV ${item.bv}` : ''}`
    case 'v4ranged':
      return `Skada ${item.skada} · STY ${item.sty} · ${item.rackvidd}${item.laddn && item.laddn !== '—' ? ` · ${item.laddn}` : ''} · ${kg(item.vikt)}`
    case 'v4shield':
      return `STY ${item.sty} · BV ${item.bv} · ${kg(item.vikt)}`
    case 'v4armour':
      return `Absorbering ${item.absorbering} · ${kg(item.vikt)}`
    default:
      return item.vikt != null ? kg(item.vikt) : ''
  }
}
function typeOf(group) {
  if (group.type === 'gear') return 'gear'
  if (group.type === 'armour' || group.type === 'v4armour' || group.type === 'v4shield') return 'rustning'
  return 'vapen'
}
function srcOf(group) {
  if (group.src) return group.src
  const type = group.type
  if (type && type.startsWith('v4')) return 'V4'
  if (['weapon', 'ranged', 'shield', 'armour'].includes(type)) return 'KH'
  return null
}

export default function EquipmentStep({ state, update, derived }) {
  const [custom, setCustom] = useState({ namn: '', pris: '', stat: '' })
  const inv = state.inventory || []
  const { slutKapital, silverKvar } = derived

  const addItem = (group, item) => {
    const existing = inv.find((x) => x.srcId === item.id)
    if (existing) {
      update({ inventory: inv.map((x) => (x.id === existing.id ? { ...x, qty: x.qty + 1 } : x)) })
    } else {
      update({
        inventory: [...inv, {
          id: uuid(), srcId: item.id, namn: item.namn, typ: typeOf(group),
          stat: statOf(group, item), pris: item.pris, qty: 1,
        }],
      })
    }
  }

  const setQty = (id, qty) => {
    if (qty <= 0) update({ inventory: inv.filter((x) => x.id !== id) })
    else update({ inventory: inv.map((x) => (x.id === id ? { ...x, qty } : x)) })
  }

  const addCustom = () => {
    const namn = custom.namn.trim()
    const pris = parseInt(custom.pris, 10)
    if (!namn || Number.isNaN(pris) || pris < 0) return
    update({ inventory: [...inv, { id: uuid(), srcId: null, namn, typ: 'custom', stat: custom.stat.trim(), pris, qty: 1 }] })
    setCustom({ namn: '', pris: '', stat: '' })
  }

  return (
    <div className="cc-step">
      <h2>Utrustning</h2>
      <p className="cc-step__lede">
        Köp utrustning för ditt startkapital. Närstridsvapen får dessutom din
        skadebonus ({derived.derived.skadebonus}) ovanpå sin grundskada.
      </p>
      <p className="cc-ext-note">⚠ {EQUIPMENT_NOTE}</p>

      <div className="cc-silver-bar">
        <div><span className="cc-silver__lbl">Startkapital</span><span className="cc-silver__val">{slutKapital != null ? `${slutKapital.toLocaleString('sv-SE')} sm` : '— (slå startkapital i Bakgrund)'}</span></div>
        <div><span className="cc-silver__lbl">Spenderat</span><span className="cc-silver__val">{derived.utrustningKostnad.toLocaleString('sv-SE')} sm</span></div>
        <div><span className="cc-silver__lbl">Kvar</span><span className={`cc-silver__val ${silverKvar != null && silverKvar < 0 ? 'is-neg' : ''}`}>{silverKvar != null ? `${silverKvar.toLocaleString('sv-SE')} sm` : '—'}</span></div>
      </div>
      {silverKvar != null && silverKvar < 0 && <p className="cc-warn">Du har handlat för {(-silverKvar).toLocaleString('sv-SE')} sm mer än du har.</p>}

      <div className="cc-eq-grid">
        {/* Katalog */}
        <div className="cc-eq-catalog">
          {EQUIPMENT_GROUPS.map((g) => (
            <div key={g.id} className="cc-eq-group">
              <h3>{g.namn}{srcOf(g) && <span className="cc-src-badge">{srcOf(g)}</span>}</h3>
              <ul className="cc-eq-list">
                {g.items.map((it) => (
                  <li key={it.id} className="cc-eq-item">
                    <span className="cc-eq-item__name">{it.namn}</span>
                    <span className="cc-eq-item__stat">{detailOf(g, it)}</span>
                    <span className="cc-eq-item__pris">{it.pris} sm</span>
                    <button className="cc-btn cc-btn--sm" onClick={() => addItem(g, it)}>+</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="cc-eq-group">
            <h3>Eget föremål</h3>
            <div className="cc-custom">
              <input placeholder="Namn" value={custom.namn} onChange={(e) => setCustom({ ...custom, namn: e.target.value })} />
              <input placeholder="Skada/abs (valfritt)" value={custom.stat} onChange={(e) => setCustom({ ...custom, stat: e.target.value })} />
              <input placeholder="Pris (sm)" type="number" min="0" value={custom.pris} onChange={(e) => setCustom({ ...custom, pris: e.target.value })} />
              <button className="cc-btn cc-btn--sm" onClick={addCustom}>Lägg till</button>
            </div>
          </div>
        </div>

        {/* Inventarie */}
        <div className="cc-eq-inv">
          <h3>Bärs / ägs</h3>
          {inv.length === 0 ? (
            <p className="cc-note">Inget köpt ännu.</p>
          ) : (
            <ul className="cc-inv-list">
              {inv.map((it) => (
                <li key={it.id} className="cc-inv-item">
                  <div className="cc-inv-item__main">
                    <span className="cc-inv-item__name">{it.namn}{it.stat ? ` (${it.stat})` : ''}</span>
                    <span className="cc-inv-item__pris">{(it.pris * it.qty).toLocaleString('sv-SE')} sm</span>
                  </div>
                  <div className="cc-stepper cc-stepper--sm">
                    <button onClick={() => setQty(it.id, it.qty - 1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(it.id, it.qty + 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
