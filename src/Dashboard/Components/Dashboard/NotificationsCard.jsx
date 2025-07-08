import React from "react";
import { Clock } from "lucide-react";
import { getTimeAgo } from "../../../utils/dateUtils";

// Skeleton loader component
const NotificationSkeleton = () => (
  <div className="animate-pulse px-2 py-4 space-y-2">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
  </div>
);

const NotificationItem = ({ notification, onClick }) => {
  const { title, message, created_at } = notification;


  return (
    <button
      className="flex justify-between items-start w-full text-left px-2 py-4 hover:bg-gray-50 rounded-lg transition"
      onClick={() => onClick(notification)}
    >
      <div className="flex-1 pr-2">
        <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
        <p className="text-sm text-gray-600 leading-snug">{message}</p>
      </div>
      <div className="flex items-center gap-1 text-gray-500 text-xs min-w-fit mt-[2px] whitespace-nowrap">
        <Clock className="w-3 h-3" />
        {getTimeAgo(created_at)}
      </div>
    </button>
  );
};

const NotificationsCard = ({ notifications, onNotificationClick, isLoading }) => {
  const displayNotifications = notifications.slice(0, 5); // show only 5

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-2 px-2">Notifications</h2>
      <hr className="-mx-6 border-t border-gray-200 my-2" />

      {isLoading ? (
        <>
          {[...Array(3)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </>
      ) : displayNotifications.length === 0 ? (
        <p className="text-sm text-center text-gray-400">No notifications</p>
      ) : (
        displayNotifications.map((n, i) => (
          <div key={n.id}>
            <NotificationItem
              notification={n}
              onClick={onNotificationClick}
            />
            {i < displayNotifications.length - 1 && (
              <hr className="border-t border-gray-200 mx-2" />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsCard;
