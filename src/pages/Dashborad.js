import React,{useState} from 'react'
import Sidebar from '../components/Sidebar'
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import { Outlet } from 'react-router-dom';
export default function Dashborad() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='flex relative w-[100%] overflow-x-hidden'>
      <p onClick={()=>setIsOpen(!isOpen)} className='z-20 m-4 md:-z-10 lg:-z-10'>{isOpen?<RxCross1 />:<RxHamburgerMenu />}</p>
      <div className={`absolute left-0 top-0 md:w-[22%] lg:w-[22%] ${isOpen? 'w-[100%]':'w-0'} `}>
        <Sidebar />
      </div>
      <div className={`absolute right-0 lg:w-[77.9%] md:w-[77.9%] ${isOpen? 'w-0': 'w-[100%]'} `}>
        <Outlet />
      </div>   
    </div>
  )
}



