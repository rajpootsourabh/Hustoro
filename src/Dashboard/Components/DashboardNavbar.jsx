import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_white.png';
import UserMenu from './UserMenu';
import { useSnackbar } from './SnackbarContext';
import axios from 'axios';
import Loader from './Loader';
import NotificationModal from './NotificationModal';

const DashboardNavbar = ({ username, role, companyName, employeeId, companyLogo }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const location = useLocation();
  const [path, setPath] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const menuItemsByRole = {
    1: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
    ],
    4: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
      { label: 'Reports', path: '/dashboard/reports' },
    ],
    5: [
      { label: 'Jobs', path: '/dashboard/jobs' },
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Employee Management', path: '/dashboard/employees' },
      { label: 'Attendance', path: '/dashboard/attendence' },
      { label: 'Files', path: '#' },
      { label: 'Reports', path: '/dashboard/reports' },
    ],
    6: [
      { label: 'Candidates', path: '/dashboard/candidates' },
      { label: 'Files', path: '#' },
    ]
  };

  useEffect(() => {
    const pathname = location.pathname.split('/');
    setPath(pathname.length > 2 ? pathname[2] : pathname[1]);
  }, [location.pathname]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setNotifications(response.data.data);
          const unread = response.data.data.filter((n) => n.read_at === null).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        }
      );
      if (response.status === 200) {
        showSnackbar(response.data.message, 'success');
        navigate('/signin');
      } else {
        showSnackbar('Error while Logout', 'error');
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Logout failed', 'error');
    }
    setLoading(false);
  };

  return (
    <div className='w-full bg-black shadow-lg flex justify-center items-center'>
      {loading && <Loader message={'Getting you logged out...'} />}
      <div className='max-w-[1700px] w-full text-white h-16 shadow-lg flex justify-between items-center gap-3 px-8'>
        {/* Left: Logo + Menu */}
        <div className='flex items-center gap-14'>
          <Link to='#'>
            <img src={logo} alt='logo' width={150} height={100} />
          </Link>
          <ul className='flex items-center gap-0'>
            {(menuItemsByRole[role] || [])
              .filter((item) => {
                let isManager = false;
                try {
                  isManager = JSON.parse(localStorage.getItem('isManager')) === true;
                } catch (e) {}
                return !(item.label === 'Attendance' && !isManager);
              })
              .map((item) => (
                <Link key={item.label} to={item.path}>
                  <li
                    className={`$${
                      path === item.path.split('/').pop() ? 'bg-[#00756A]' : ''
                    } px-4 py-1.5 rounded-md cursor-pointer font-light`}
                  >
                    {item.label}
                  </li>
                </Link>
              ))}
          </ul>
        </div>

        {/* Right: Notification + User */}
        <div className='flex gap-5 items-center'>
          {/* Notification Bell with Dropdown */}
          <NotificationModal
            token={localStorage.getItem('access_token')}
            notifications={notifications}
            setNotifications={setNotifications}
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />

          {/* User Menu */}
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
                showSnackbar('Employee ID not found', 'error');
              }
            }}
            handleNavigateToSettings={() => navigate('/dashboard/settings')}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
