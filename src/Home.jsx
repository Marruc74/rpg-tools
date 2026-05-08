import { Link } from 'react-router-dom'

const tools = [
  {
    to: '/card-maker',
    name: 'Card-Maker',
    description: 'Design printable cards for tabletop RPGs. Edit fronts and backs, organize them into collections, export as PNG or PDF.',
  },
  {
    to: '/journal',
    name: 'Session Journal',
    description: 'Take printable session notes. Build entries from sections you choose — characters, NPCs, places, rumours, and more — and export each session to PDF.',
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
