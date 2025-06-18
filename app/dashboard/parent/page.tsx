import FindPrograms from "./components/FindPrograms";
import ApplicationTracker from "./components/ApplicationTracker";

export default function ParentDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Parent Dashboard</h1>
      <FindPrograms />
      <h2 className="text-2xl font-semibold mt-12 mb-4">My Applications</h2>
      <ApplicationTracker />
    </div>
  );
} 