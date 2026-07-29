import React from 'react'
import Login from './pages/authPages/Login'
import Register from './pages/authPages/Register'
import ResetPass from './pages/authPages/ResetPass'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/reset-password' element={<ResetPass />} />
      </Routes>
    </div>
  )
}

export default App
