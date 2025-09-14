import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import axios from 'axios';
import echo from '../../utils/echo';
import { getTimeAgo } from '../../utils/dateUtils';

const NotificationModal = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => n.read_at === null).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };


  const markAllAsRead = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove all unread notifications from the list
      setNotifications((prev) => prev.filter((n) => n.read_at));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const markOneAsRead = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove only the read notification from the list
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => prev - 1);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };


  useEffect(() => {
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    if (!userId) return;

    const channel = echo.private(`App.Models.User.${userId}`);

    const handleNewNotification = (e) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === e.id)) return prev;
        const updated = [
          {
            id: e.id,
            title: e.title || 'Notification',
            message: e.message || 'New notification',
            created_at: e.created_at || new Date().toISOString(),
            read_at: null,
          },
          ...prev,
        ];
        setUnreadCount(updated.filter((n) => n.read_at === null).length);
        return updated;
      });
    };

    channel.listen('.TimeOffRequested', handleNewNotification);
    channel.listen('.TimeOffStatusChanged', handleNewNotification);

    return () => {
      echo.leave(`private-App.Models.User.${userId}`);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        className={`relative p-2 rounded-full bg-white ${loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'
          } focus:outline-none shadow`}
        onClick={() => !loading && setShowDropdown((prev) => !prev)}
        disabled={loading}
      >
        <Bell className="w-5 h-5 text-black" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>

        )}
      </button>

      {showDropdown && (
        <div className="absolute right-2 top-10 sm:right-0 mt-2 w-[90vw] sm:w-96 bg-white shadow-xl border rounded-lg z-50 max-h-[500px] overflow-y-auto">
          <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
            <span className="font-semibold text-black text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No notifications found.</div>
          ) : (
            <ul className="divide-y">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex justify-between items-start gap-2 px-4 py-3 transition-colors duration-200 ${n.read_at ? 'bg-white text-gray-600' : 'bg-gray-50 text-black'
                    }`}
                >
                  <div className="w-full">
                    <div className="font-medium text-sm truncate">{n.title}</div>
                    <div className="text-xs line-clamp-2">{n.message}</div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {getTimeAgo(n.created_at).toLocaleString()}
                    </div>
                  </div>
                  {!n.read_at && (
                    <button
                      onClick={() => markOneAsRead(n.id)}
                      className="text-blue-600 hover:underline text-xs mt-1 flex items-center gap-1 whitespace-nowrap"
                    >
                      <Check size={14} />
                      Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationModal;
