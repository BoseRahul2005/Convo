import React from 'react'
import Login from './pages/authPages/Login'
import Register from './pages/authPages/Register'
import ResetPass from './pages/authPages/ResetPass'
import Home from './pages/userPages/Home'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  setTimeout(()=>{
    setIsLoading(false);
  },2500);

  if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950">
                <img
                    src="/convo-logo.svg"
                    alt="Convo Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 animate-[zoomPulse_1.8s_ease-in-out_infinite] object-contain drop-shadow-[0_0_20px_rgba(236,200,221,0.4)]"
                />
                <p className="text-gray-400 text-sm italic tracking-wide">
                    Nature does not hurry, yet everything is accomplished. — Lao Tzu
                </p>
            </div>
        )
    }
  return (
    <div>
      <ToastContainer />
      <Routes>
        
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/reset-password' element={<ResetPass />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
