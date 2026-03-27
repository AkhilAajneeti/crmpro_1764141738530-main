import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "NotificationContext";
import { useState, useRef, useEffect } from "react";
import Button from "./ui/Button";

const NotificationDropdown = () => {
  const audioRef = useRef(null);
  const prevCountRef = useRef(0);
  const [activeTab, setActiveTab] = useState("all");
  const [visible, setVisible] = useState(5);
  const { open, notifications } = useNotification();
  useEffect(() => {
    if (notifications.length > prevCountRef.current) {
      audioRef.current?.play();
    }
    prevCountRef.current = notifications.length;
  }, [notifications]);

  if (!open) return null;

  const getMessage = (n) => {
    switch (n.type) {
      case "EventAttendee":
        return "invited you";
      case "LeadUpdate":
        return "updated lead";
      case "Task":
        return "assigned task";
      case "Comment":
        return "commented on";
      case "Like":
        return "liked";
      case "Generated":
        return "is generated";
      default:
        return "performed an action";
    }
  };

  const parseNotification = (n) => {
    return {
      user: n.userName,
      action: getMessage(n),
      title: n.data?.entityName || n.data?.parentName || "",
      subtitle: n.data?.status || n.message || "",
      entity: n.data?.entityType,
      time: n.createdAt,
      read: n.read,
      id: n.id,
      type: n.type,
    };
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (now - d) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

    return d.toLocaleDateString();
  };

  // notification filter
  const filterNotification =
    activeTab == "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;
  // visible notification
  const visibleNotification = filterNotification.slice(0, visible);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-2xl z-50 border overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-800">Notifications</h3>

            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setVisible(5);
                }}
                className={`px-2 py-1 rounded-full ${activeTab === "all" ? "bg-gray-100" : "text-gray-500"}`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setActiveTab("unread");
                  setVisible(5);
                }}
                className={`px-2 py-1 rounded-full ${activeTab === "unread" ? "bg-gray-100" : "text-gray-500"}`}
              >
                Unread
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-96 overflow-y-auto">
            {filterNotification.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-sm text-gray-500">
                  {activeTab === "unread"
                    ? "You're all caught up 🎉"
                    : "No notifications yet"}
                </p>
              </div>
            ) : (
              visibleNotification.map((n) => {
                const item = parseNotification(n);
                const isUnread = !item.read;
                <audio ref={audioRef} src="/notification.mp3" preload="auto" />;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-3 px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                      isUnread ? "bg-gray-50" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                        {item.user?.[0]}
                      </div>

                      {/* small badge */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Line 1 */}
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{item.user}</span>{" "}
                        {item.action}{" "}
                        <span className="font-medium">{item.title}</span>
                      </p>

                      {/* Line 2 */}
                      {item.subtitle && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.subtitle}
                          {item.entity}
                        </p>
                      )}

                      {/* Time */}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(item.time)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {isUnread && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    )}
                  </motion.div>
                );
              })
            )}
            {visible < filterNotification.length && (
              <div className="p-3 text-center">
                <Button
                  onClick={() => setVisible((prev) => prev + 5)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Show More
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
