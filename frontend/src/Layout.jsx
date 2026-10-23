import React from 'react'
import { Outlet } from 'react-router'
import Navbar from './components/Navbar'

function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}

export default Layout