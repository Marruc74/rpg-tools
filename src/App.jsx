import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import Home from './Home.jsx'
import CardMakerPage from './tools/card-maker/CardMakerPage.jsx'
import JournalPage from './tools/journal/JournalPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="card-maker" element={<CardMakerPage />} />
        <Route path="journal" element={<JournalPage />} />
      </Route>
    </Routes>
  )
}

function Shell() {
  return (
    <div className="shell">
      <header className="shell__header">
        <Link to="/" className="shell__brand">RPG Toolkit</Link>
        <nav className="shell__nav">
          <NavLink to="/card-maker">Card-Maker</NavLink>
          <NavLink to="/journal">Journal</NavLink>
        </nav>
      </header>
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
