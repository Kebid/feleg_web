export default function ProviderDashboard() {
  // In a real app, fetch user info from context or Supabase
  const userName = "Provider User";
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 px-2">
      <div className="w-full max-w-3xl mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-1">Welcome, {userName}!</h1>
            <p className="text-green-700 text-sm">This is your Provider Dashboard. Post new programs, manage your listings, and view applications from parents.</p>
          </div>
          <div className="hidden sm:block text-5xl text-green-200">🏫</div>
        </div>
      </div>
      {/* Add more provider dashboard content here, e.g., quick links or stats */}
    </div>
  );
} 