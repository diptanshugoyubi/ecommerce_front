
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className=' h-screen flex flex-col'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}