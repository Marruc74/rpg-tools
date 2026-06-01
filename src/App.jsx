import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import Home from './Home.jsx'
import CardMakerPage from './tools/card-maker/CardMakerPage.jsx'
import JournalPage from './tools/journal/JournalPage.jsx'
import DicePage from './tools/dice/DicePage.jsx'
import InitiativePage from './tools/initiative/InitiativePage.jsx'
import TablesPage from './tools/tables/TablesPage.jsx'
import NpcGeneratorPage from './tools/npc-generator/NpcGeneratorPage.jsx'
import CharacterCreatorPage from './tools/character-creator/CharacterCreatorPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="card-maker" element={<CardMakerPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="dice" element={<DicePage />} />
        <Route path="initiative" element={<InitiativePage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="npc-generator" element={<NpcGeneratorPage />} />
        <Route path="character-creator" element={<CharacterCreatorPage />} />
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
          <NavLink to="/dice">Dice</NavLink>
          <NavLink to="/initiative">Initiative</NavLink>
          <NavLink to="/tables">Tables</NavLink>
          <NavLink to="/npc-generator">NPC Generator</NavLink>
          <NavLink to="/character-creator">Character Creator</NavLink>
        </nav>
      </header>
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
