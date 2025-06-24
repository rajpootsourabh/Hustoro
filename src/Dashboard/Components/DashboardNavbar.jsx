import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import UserMenu from './UserMenu';
import { useSnackbar } from './SnackbarContext';
import axios from 'axios';
import Loader from './Loader';

const DashboardNavbar = ({ username, role, companyName, employeeId, companyLogo }) => {

  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  const location = useLocation();
  const [path, setPath] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  const menuItemsByRole = {
    1: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
      { label: 'Reports', path: '#' },
    ],

    2: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
      { label: 'Reports', path: '#' },
    ],

    3: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
      { label: 'Reports', path: '#' },
    ],

    4: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
      { label: 'Reports', path: '#' },
    ],

    5: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
      { label: 'Reports', path: '#' },
    ],
  };


  useEffect(() => {
    const pathname = location.pathname.split("/");
    if (pathname.length > 2) {
      setPath(pathname[2]);
    } else {
      setPath(pathname[1]);
    }
  }, [location.pathname])


  const handleLogout = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/logout`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
        }
      })
      if (response.status === 200) {
        showSnackbar(response.data.message, "success")
        navigate("/signin")
      } else {
        showSnackbar("Error while Logout", "error")
      }
    } catch (error) {
      showSnackbar(error.response.data.message, "error")
    }
    setLoading(false)
  }

  return (
    <div className='w-full bg-black shadow-lg flex justify-center items-center'>
      {
        loading
          ?
          <Loader message={"Getting you logged out..."} />
          :
          <></>
      }
      <div className='max-w-[1700px] w-full text-white h-20 shadow-lg flex justify-between items-center gap-3 px-8'>
        <div className='flex items-center gap-14'>
          <Link to="/dashboard"><img src={logo} alt="logo" width={150} height={100} /></Link>
          <ul className='flex item-center gap-0'>
            {(menuItemsByRole[role] || []).map(item => (
              <Link key={item.label} to={item.path}>
                <li
                  className={`${path === item.path.split("/").pop() ? 'bg-[#00756A]' : ''} px-4 py-1.5 rounded-md cursor-pointer font-light`}
                >
                  {item.label}
                </li>
              </Link>
            ))}
          </ul>

        </div>
        <div className='flex gap-5'>
          {/* search */}
          <div className='flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>

          {/* mail */}
          <div className='flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>

          {/* calendar */}
          <div className='flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          {/* notification */}
          <div className='flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </div>
          {/* avatar */}
          <div className='flex items-center justify-center'>
            <UserMenu
              loading={loading}
              username={username}
              companyName={companyName}
              companyLogo={companyLogo}
              role={role}
              handleLogout={handleLogout}
              handleViewProfile={() => {
                if (employeeId) {
                  navigate(`/dashboard/employee/${employeeId}/edit`);
                } else {
                  showSnackbar("Employee ID not found", "error");
                }
              }}
              handleNavigateToSettings={() => navigate('/dashboard/settings')}
            />
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardNavbar
