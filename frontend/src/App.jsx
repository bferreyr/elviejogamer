import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import AlbumView from './pages/AlbumView'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/galeria/:id" element={<AlbumView />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
