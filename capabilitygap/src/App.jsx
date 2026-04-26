import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { supabase } from './supabase'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import About from './Pages/About'
import Process from './Pages/Process'
import Pricing from './Pages/Pricing'
import PricingPage from './Pages/PricingPage'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import Assessment from './Pages/Assessment'
import Roadmap from './Pages/Roadmap'
import ResumeAnalysis from './Pages/ResumeAnalysis'
import Profile from './Pages/Profile'
import CreditHistory from './Pages/CreditHistory'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const hideNavbar = ['/login', '/signup', '/dashboard', '/assessment', '/roadmap', '/resume-analysis', '/profile', '/credit-history', '/buy-credits'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<Process />} />
        <Route path="/pricing" element={<PricingPage session={session} />} />
        <Route
          path="/buy-credits"
          element={session ? <Pricing session={session} /> : <Navigate to="/login" />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={session ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route
          path="/dashboard"
          element={session ? <Dashboard session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/assessment"
          element={session ? <Assessment session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/roadmap"
          element={session ? <Roadmap session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/resume-analysis"
          element={session ? <ResumeAnalysis session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={session ? <Profile session={session} /> : <Navigate to="/login" />}
        />
        <Route
          path="/credit-history"
          element={session ? <CreditHistory session={session} /> : <Navigate to="/login" />}
        />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  )
}

export default App
