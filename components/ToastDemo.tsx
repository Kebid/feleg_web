"use client";
import toast from "react-hot-toast";

export default function ToastDemo() {
  const showSuccessToast = () => {
    toast.success("This is a success message!");
  };

  const showErrorToast = () => {
    toast.error("This is an error message!");
  };

  const showLoadingToast = () => {
    toast.loading("Loading...", {
      duration: 3000,
    });
  };

  const showCustomToast = () => {
    toast("This is a custom message!", {
      icon: "🎉",
      duration: 4000,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Toast Notification Demo</h2>
      <div className="space-y-3">
        <button
          onClick={showSuccessToast}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Show Success Toast
        </button>
        <button
          onClick={showErrorToast}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Show Error Toast
        </button>
        <button
          onClick={showLoadingToast}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Loading Toast
        </button>
        <button
          onClick={showCustomToast}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Show Custom Toast
        </button>
      </div>
    </div>
  );
} 