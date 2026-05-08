import { Link } from 'react-router-dom'

const tools = [
  {
    to: '/card-maker',
    name: 'Card-Maker',
    description: 'Design printable cards for tabletop RPGs. Edit fronts and backs, organize them into collections, export as PNG or PDF.',
  },
  {
    to: '/journal',
    name: 'Journal Sheet',
    description: 'Design a printable journal page with the sections and subsections you want — characters, NPCs, places, rumours, and more. Export the blank form to PDF and bring fresh copies to every session.',
  },
  {
    to: '/dice',
    name: 'Dice',
    description: 'Roll any expression — 2d6+3, 1d20kh1 (advantage), 4d6dl1 (ability scores). Save your common rolls as named presets and keep a running history.',
  },
  {
    to: '/initiative',
    name: 'Initiative',
    description: 'Track combat order, HP, and round count. Roll initiative for new combatants with a tap, advance turns, and resume mid-combat across reloads.',
  },
  {
    to: '/tables',
    name: 'Random Tables',
    description: 'Build weighted random tables for NPC quirks, loot, encounters, anything. Roll once, see the result, keep a history. Great for prep and improv at the table.',
  },
]

export default function Home() {
  return (
    <div className="home">
      <h1 className="home__title">RPG Toolkit</h1>
      <p className="home__lede">A small toolbox for tabletop game prep.</p>
      <ul className="home__grid">
        {tools.map((t) => (
          <li key={t.to} className="home__tile">
            <Link to={t.to} className="home__tile-link">
              <h2>{t.name}</h2>
              <p>{t.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
