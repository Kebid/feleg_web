"use client";
import { useState } from "react";
import Link from "next/link";

const mockPrograms = [
  {
    id: 1,
    title: "STEM Summer Camp",
    type: "STEM",
    location: "New York",
    ageGroup: "8-12",
    cost: "Paid",
    delivery: "In-Person",
  },
  {
    id: 2,
    title: "Art for Kids",
    type: "Arts",
    location: "Los Angeles",
    ageGroup: "6-10",
    cost: "Free",
    delivery: "Online",
  },
  {
    id: 3,
    title: "Soccer Stars",
    type: "Sports",
    location: "Chicago",
    ageGroup: "10-14",
    cost: "Paid",
    delivery: "In-Person",
  },
  // Add more mock programs as needed
];

const locations = ["New York", "Los Angeles", "Chicago"];
const programTypes = ["STEM", "Arts", "Sports"];
const deliveryModes = ["Online", "In-Person"];
const ageGroups = ["6-10", "8-12", "10-14"];
const costRanges = ["Free", "Paid"];

export default function FindPrograms() {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    delivery: "",
    ageGroup: "",
    cost: "",
  });
  const [results, setResults] = useState(mockPrograms);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = mockPrograms.filter((p) => {
      return (
        (!filters.keyword || p.title.toLowerCase().includes(filters.keyword.toLowerCase())) &&
        (!filters.location || p.location === filters.location) &&
        (!filters.type || p.type === filters.type) &&
        (!filters.delivery || p.delivery === filters.delivery) &&
        (!filters.ageGroup || p.ageGroup === filters.ageGroup) &&
        (!filters.cost || p.cost === filters.cost)
      );
    });
    setResults(filtered);
  };

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Filter/Search Panel */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded shadow p-4 mb-6 flex flex-col md:flex-row md:items-end gap-4"
      >
        <input
          type="text"
          name="keyword"
          placeholder="Search by keyword"
          value={filters.keyword}
          onChange={handleChange}
          className="border p-2 rounded flex-1"
        />
        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Program Type</option>
          {programTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          name="delivery"
          value={filters.delivery}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Delivery Mode</option>
          {deliveryModes.map((mode) => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
        <select
          name="ageGroup"
          value={filters.ageGroup}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Age Group</option>
          {ageGroups.map((age) => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
        <select
          name="cost"
          value={filters.cost}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Cost</option>
          {costRanges.map((cost) => (
            <option key={cost} value={cost}>{cost}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Results Section */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No programs found.</div>
        )}
        {results.map((program) => (
          <div key={program.id} className="bg-white rounded shadow p-4 flex flex-col relative">
            <button
              className={`absolute top-2 right-2 text-xl ${bookmarks.includes(program.id) ? "text-red-500" : "text-gray-300"}`}
              onClick={() => toggleBookmark(program.id)}
              aria-label="Bookmark"
              type="button"
            >
              {bookmarks.includes(program.id) ? "♥" : "♡"}
            </button>
            <h3 className="text-lg font-bold mb-2">{program.title}</h3>
            <div className="mb-1"><span className="font-semibold">Type:</span> {program.type}</div>
            <div className="mb-1"><span className="font-semibold">Location:</span> {program.location}</div>
            <div className="mb-1"><span className="font-semibold">Age Group:</span> {program.ageGroup}</div>
            <div className="mb-1"><span className="font-semibold">Cost:</span> {program.cost}</div>
            <div className="mb-1"><span className="font-semibold">Delivery:</span> {program.delivery}</div>
            <Link
              href={`/programs/${program.id}`}
              className="mt-4 bg-blue-600 text-white px-3 py-2 rounded text-center hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 