import React from 'react'
import { Outlet } from 'react-router'

function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}

export default Layout