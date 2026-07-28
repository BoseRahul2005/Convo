import React from 'react'
import Login from './pages/authPages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import ResetPassword from './pages/authPages/ResetPass.jsx'

const App = () => {
  return (
    <div>
      <ToastContainer />
        <Routes>
          <Route path='/' element={<Login />} />
          {/* <Route path='/reset-password' element={<ResetPassword />} /> */}
        </Routes>
    </div>
  )
}

export default App
