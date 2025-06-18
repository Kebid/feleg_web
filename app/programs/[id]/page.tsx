"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const mockPrograms = [
  {
    id: "1",
    title: "STEM Summer Camp",
    description: "A fun and educational summer camp focused on STEM activities.",
    type: "STEM",
    location: "New York",
    delivery: "In-Person",
    duration: "2 weeks",
    ageGroup: "8-12",
    cost: "Paid",
    date: "2024-07-15",
    media: ["/placeholder1.jpg"],
  },
  {
    id: "2",
    title: "Art for Kids",
    description: "Creative art classes for children to explore their imagination.",
    type: "Arts",
    location: "Los Angeles",
    delivery: "Online",
    duration: "1 month",
    ageGroup: "6-10",
    cost: "Free",
    date: "2024-08-01",
    media: ["/placeholder2.jpg"],
  },
  {
    id: "3",
    title: "Soccer Stars",
    description: "Soccer training program for aspiring young athletes.",
    type: "Sports",
    location: "Chicago",
    delivery: "In-Person",
    duration: "3 weeks",
    ageGroup: "10-14",
    cost: "Paid",
    date: "2024-07-20",
    media: ["/placeholder3.jpg"],
  },
];

export default function ProgramDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching program by id
    const found = mockPrograms.find((p) => p.id === id);
    setProgram(found);
  }, [id]);

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500">Program not found.</div>
        <Link href="/dashboard/parent" className="mt-4 text-blue-600 hover:underline">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/dashboard/parent" className="text-blue-600 hover:underline">&larr; Back to Search</Link>
      </div>
      <div className="bg-white rounded shadow p-6 flex flex-col md:flex-row gap-6">
        {/* Media Section */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center">
          {program.media && program.media.length > 0 ? (
            <img
              src={program.media[0]}
              alt="Program Media"
              className="w-full h-48 object-cover rounded mb-2 bg-gray-100"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-2">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        {/* Details Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{program.title}</h1>
          <p className="mb-4 text-gray-700">{program.description || "No description available."}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div><span className="font-semibold">Type:</span> {program.type}</div>
            <div><span className="font-semibold">Location:</span> {program.location}</div>
            <div><span className="font-semibold">Delivery:</span> {program.delivery}</div>
            <div><span className="font-semibold">Duration:</span> {program.duration || "-"}</div>
            <div><span className="font-semibold">Age Group:</span> {program.ageGroup}</div>
            <div><span className="font-semibold">Cost:</span> {program.cost}</div>
            <div><span className="font-semibold">Date/Deadline:</span> {program.date}</div>
          </div>
          <Link
            href={`/apply/${program.id}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-2"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
} 