import { useNotification } from "NotificationContext";


const NotificationDropdown = () => {
  const { open, notifications } = useNotification();

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl p-4 z-50">
      <h3 className="font-semibold mb-3">Notifications</h3>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="border-b py-2 text-sm">
            <p className="font-medium">{n.name}</p>
            <p className="text-gray-500 text-xs">
              {n.createdAt}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;