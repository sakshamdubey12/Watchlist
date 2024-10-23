import React from 'react'
import Sidebar from './Sidebar'
import MovieList from './MovieList'
import { Outlet } from 'react-router-dom';
export default function Dashborad() {
  return (
    <div className='flex relative w-[100%]'>
      <div className='absolute left-0 top-0 w-[22%]'>
        <Sidebar />
      </div>
      <div className='absolute right-0 w-[77.9%]'>
        <Outlet />
      </div>   
    </div>
  )
}



     