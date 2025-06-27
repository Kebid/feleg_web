// app/dashboard/parent/components/Notifications.tsx
import { BellIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function Notifications() {
  // Placeholder: In a real app, fetch notifications from API or props
  const notifications: { id: number; message: string; date: string }[] = [];

  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow"
      >
        <BellIcon className="w-12 h-12 text-blue-400 mb-4" />
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No new notifications</div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">You're all caught up!</div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notif, i) => (
        <motion.div
          key={notif.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * i }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 flex items-center gap-4 border border-blue-100 dark:border-gray-800"
        >
          <BellIcon className="w-7 h-7 text-blue-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{notif.message}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.date}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}