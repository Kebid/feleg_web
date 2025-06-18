"use client";
import { useEffect, useState } from "react";

const mockApplications = [
  {
    id: 1,
    programTitle: "STEM Summer Camp",
    submissionDate: "2024-06-10",
    status: "Pending",
    childName: "Alex Johnson",
  },
  {
    id: 2,
    programTitle: "Art for Kids",
    submissionDate: "2024-06-12",
    status: "Accepted",
    childName: "Samantha Lee",
  },
  {
    id: 3,
    programTitle: "Soccer Stars",
    submissionDate: "2024-06-15",
    status: "Rejected",
    childName: "Alex Johnson",
  },
];

function statusColor(status: string) {
  if (status === "Accepted") return "text-green-600 bg-green-100";
  if (status === "Pending") return "text-yellow-700 bg-yellow-100";
  if (status === "Rejected") return "text-red-600 bg-red-100";
  return "text-gray-600 bg-gray-100";
}

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return <div className="text-center py-8 text-gray-500">No applications submitted yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Program Title</th>
            <th className="px-4 py-2 text-left">Submission Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Child Name</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-t">
              <td className="px-4 py-2">{app.programTitle}</td>
              <td className="px-4 py-2">{app.submissionDate}</td>
              <td className="px-4 py-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(app.status)}`}>
                  {app.status}
                </span>
              </td>
              <td className="px-4 py-2">{app.childName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 