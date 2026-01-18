import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Meet from './pages/Meet.jsx'
import Settings from './pages/Settings.jsx'
import History from './pages/History.jsx'
import Room from './pages/Room.jsx'


const App = () => {
  return (
   <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/meet' element={<Meet/>}/>
      <Route path='/settings' element={<Settings/>}/>
      <Route path='/history' element={<History/>}/>
      <Route path='/room/:roomId' element={<Room/>}/>
    </Routes>
    </BrowserRouter>
   </>
  )
}
export default App