import { Try } from '@mui/icons-material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { changeTitle } from '../../utils/changeTitle'

const Dashboard = ({username}) => {
    useEffect(()=>{
        changeTitle('Dashboard')
    },[])
    const navigate = useNavigate()
    const handleLogout = async()=>{
        try {
            let response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/logout`)
            console.log("response ",response)
            navigate("/")
        } catch (error) {
            console.log("error",error)
        }
    }
  return (
    <div className='flex flex-col items-center justify-start bg-[#F3F3F3] min-h-[100vh]'>
        {/* <DashboardNavbar /> */}
        <div className='flex bg-white w-[100%] items-center justify-start px-32 py-4 border-b-2 shadow-sm shadow-gray-100 border-gray-200'>
            <p className='text-xl font-medium'>Hello {localStorage.getItem('email').split("@")[0]} !</p>
        </div>
        <div className='w-[100%] grid grid-cols-12 gap-14 px-32 py-8'>
            <div className='col-span-9 h-96 w-[100%] bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'></div>
            <div className='col-span-3 h-96 w-[100%] bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'></div>
        </div>
        {/* <div className='w-[100%] grid grid-cols-12 gap-14 px-32 py-8'>
            <div className='col-span-9 h-96 w-[100%] bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'></div>
            <div className='col-span-3 h-96 w-[100%] bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'></div>
        </div>
        <div className='w-[100%] grid grid-cols-12 gap-14 px-32 py-8'>
            <div className='col-span-9 h-96 w-[100%] bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'></div>
            <div className='col-span-3 h-96 w-[100%] bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'></div>
        </div> */}
        {/* <p className='text-black text-xl'>Bipani Dashboard</p> */}
    </div>
  )
}

export default Dashboard
