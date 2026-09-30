import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import AlbumView from './pages/AlbumView'
import Matches from './pages/Matches'
import MatchDetails from './pages/MatchDetails'
import Community from './pages/Community'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/galeria/:id" element={<AlbumView />} />
        <Route path="/partidas" element={<Matches />} />
        <Route path="/partidas/:id" element={<MatchDetails />} />
        <Route path="/jugadores" element={<Community />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/perfil/:steam_id" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
