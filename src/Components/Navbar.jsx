import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import Button from '@mui/material/Button';
const Navbar = () => {
  const [page,setPage] = useState("")
  useEffect(()=>{
    const pathSegments = window.location.pathname.split("/");
    const page = pathSegments[pathSegments.length - 1]; // "home"
    setPage(page)
  },[])
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const handleLoginClick  = ()=>{
    navigate("/signin")
  }
  return (
    <nav className="bg-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/"><img src={logo} alt="logo" width={150} height={100}/></Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/products" className={`${page==='products' ? 'text-[#00756A]' :''}`}>Products</Link>
            <Link to="/pricing" className={`${page==='pricing' ? 'text-[#00756A]' :''}`}>Pricing</Link>
            <Link to="/signin">
              <p className='rounded-full  px-8 py-1.5  bg-[#00756A] text-white'>Login</p>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              // Cross Icon (X)
              <div className="text-2xl">X</div>
            ) : (
              // Hamburger Icon (☰)
              <div className="flex flex-col space-y-1">
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-white px-8 py-4 flex flex-col gap-4`}>
        <div className='pl-2'>
            <Link to="/products" className={`${page==='products' ? 'text-[#00756A]' :''}`}>Products</Link>
        </div>
        <div className='pl-2'>
          <Link to="/pricing" className={`${page==='pricing' ? 'text-[#00756A]' :''}`}>Pricing</Link>
        </div>
        <div className=''>
          <Button variant='contained' onClick={handleLoginClick}  style={{ padding: '10px 20px', borderRadius: '50px',backgroundColor:'#00756A' }} className='w-[100%] bg-[#00756A] text-white font-semibold'>
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
