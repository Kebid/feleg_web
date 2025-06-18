import FindPrograms from "./components/FindPrograms";
import ApplicationTracker from "./components/ApplicationTracker";

export default function ParentDashboard() {
  // In a real app, fetch user info from context or Supabase
  const userName = "Parent User";
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 px-2">
      <div className="w-full max-w-3xl mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">Welcome, {userName}!</h1>
            <p className="text-blue-700 text-sm">This is your Parent Dashboard. Find and apply to programs for your child, and track your applications below.</p>
          </div>
          <div className="hidden sm:block text-5xl text-blue-200">👨‍👩‍👧‍👦</div>
        </div>
      </div>
      <div className="w-full max-w-3xl mb-10">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Find Programs</h2>
          <FindPrograms />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">My Applications</h2>
          <ApplicationTracker />
        </div>
      </div>
    </div>
  );
} 