 "use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Mock data for applications
const initialApplications = [
  {
    id: 1,
    programTitle: "STEM Summer Camp",
    applicantName: "Sarah Johnson",
    childName: "Alex Johnson",
    childAge: 10,
    status: "Pending",
    submissionDate: "2024-06-10",
  },
  {
    id: 2,
    programTitle: "Art for Kids",
    applicantName: "James Lee",
    childName: "Samantha Lee",
    childAge: 8,
    status: "Accepted",
    submissionDate: "2024-06-12",
  },
  {
    id: 3,
    programTitle: "Soccer Stars",
    applicantName: "Priya Singh",
    childName: "Rohan Singh",
    childAge: 12,
    status: "Rejected",
    submissionDate: "2024-06-15",
  },
  // Add more mock applications as needed
];

function statusColor(status: string) {
  if (status === "Accepted") return "text-green-600 bg-green-100";
  if (status === "Pending") return "text-yellow-700 bg-yellow-100";
  if (status === "Rejected") return "text-red-600 bg-red-100";
  return "text-gray-600 bg-gray-100";
}

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      setApplications(initialApplications);
      setLoading(false);
    }, 800);
  }, []);

  const handleAction = (id: number, action: "Accepted" | "Rejected") => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: action } : app
      )
    );
  };

  // Get unique program titles for filter dropdown
  const programTitles = Array.from(new Set(applications.map((a) => a.programTitle)));

  // Filtered applications
  const filteredApps = applications.filter((app) =>
    (statusFilter ? app.status === statusFilter : true) &&
    (programFilter ? app.programTitle === programFilter : true)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-green-700">All Applications</h2>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={programFilter}
          onChange={e => setProgramFilter(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Programs</option>
          {programTitles.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading applications...</div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No applications found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Program</th>
                <th className="px-4 py-2 text-left">Applicant</th>
                <th className="px-4 py-2 text-left">Child</th>
                <th className="px-4 py-2 text-left">Age</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Submitted</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-2 font-semibold">{app.programTitle}</td>
                  <td className="px-4 py-2">{app.applicantName}</td>
                  <td className="px-4 py-2">{app.childName}</td>
                  <td className="px-4 py-2">{app.childAge}</td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{app.submissionDate}</td>
                  <td className="px-4 py-2">
                    {app.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(app.id, "Accepted")}
                          className="px-3 py-1 rounded bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(app.id, "Rejected")}
                          className="px-3 py-1 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}