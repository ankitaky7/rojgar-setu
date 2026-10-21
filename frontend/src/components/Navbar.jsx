import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">

        {/* Logo / App Name */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-amber-600">
            Rojgar<span className="text-slate-900">Setu</span>
          </span>
        </Link>

        {/* Action Button */}
        <Link
          to="/post-job"
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
        >
         Post a Job + 
        </Link>

        <Link
          to="/post-job"
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
        >
         I'm a Worker 
        </Link>

      </div>
    </header>
  )
}

export default Navbar