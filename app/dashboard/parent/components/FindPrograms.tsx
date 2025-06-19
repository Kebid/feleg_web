"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="max-w-5xl mx-auto p-0">
      {/* Filter/Search Panel */}
      <motion.form
        onSubmit={handleSearch}
        className="bg-blue-50 rounded-2xl shadow p-4 mb-6 flex flex-col md:flex-row md:items-end gap-4 border-2 border-blue-200"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.input
          type="text"
          name="keyword"
          placeholder="Search by keyword"
          value={filters.keyword}
          onChange={handleChange}
          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg flex-1 p-2 transition-all duration-200 shadow-sm focus:scale-[1.03] focus:shadow-md bg-white"
          whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 #3B82F655' }}
        />
        <motion.select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 transition-all duration-200 shadow-sm focus:scale-[1.03] focus:shadow-md bg-white"
          whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 #3B82F655' }}
        >
          <option value="">Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </motion.select>
        <motion.select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 transition-all duration-200 shadow-sm focus:scale-[1.03] focus:shadow-md bg-white"
          whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 #3B82F655' }}
        >
          <option value="">Program Type</option>
          {programTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </motion.select>
        <motion.select
          name="delivery"
          value={filters.delivery}
          onChange={handleChange}
          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 transition-all duration-200 shadow-sm focus:scale-[1.03] focus:shadow-md bg-white"
          whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 #3B82F655' }}
        >
          <option value="">Delivery Mode</option>
          {deliveryModes.map((mode) => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </motion.select>
        <motion.select
          name="ageGroup"
          value={filters.ageGroup}
          onChange={handleChange}
          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 transition-all duration-200 shadow-sm focus:scale-[1.03] focus:shadow-md bg-white"
          whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 #3B82F655' }}
        >
          <option value="">Age Group</option>
          {ageGroups.map((age) => (
            <option key={age} value={age}>{age}</option>
          ))}
        </motion.select>
        <motion.select
          name="cost"
          value={filters.cost}
          onChange={handleChange}
          className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 transition-all duration-200 shadow-sm focus:scale-[1.03] focus:shadow-md bg-white"
          whileFocus={{ scale: 1.03, boxShadow: '0 2px 12px 0 #3B82F655' }}
        >
          <option value="">Cost</option>
          {costRanges.map((cost) => (
            <option key={cost} value={cost}>{cost}</option>
          ))}
        </motion.select>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 border-2 border-blue-400"
        >
          Search
        </motion.button>
      </motion.form>

      {/* Results Section */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <span className="text-5xl text-blue-200 mb-2">🔍</span>
            <div className="text-center text-gray-500 font-medium">No programs found.<br/>Try adjusting your filters.</div>
          </div>
        )}
        {results.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-lg p-5 flex flex-col relative border border-blue-100 hover:shadow-xl transition-shadow">
            <button
              className={`absolute top-2 right-2 text-xl ${bookmarks.includes(program.id) ? "text-red-500" : "text-gray-300"} transition-colors`}
              onClick={() => toggleBookmark(program.id)}
              aria-label="Bookmark"
              type="button"
            >
              {bookmarks.includes(program.id) ? "♥" : "♡"}
            </button>
            <h3 className="text-lg font-bold mb-2 text-blue-800">{program.title}</h3>
            <div className="mb-1"><span className="font-semibold">Type:</span> {program.type}</div>
            <div className="mb-1"><span className="font-semibold">Location:</span> {program.location}</div>
            <div className="mb-1"><span className="font-semibold">Age Group:</span> {program.ageGroup}</div>
            <div className="mb-1"><span className="font-semibold">Cost:</span> {program.cost}</div>
            <div className="mb-1"><span className="font-semibold">Delivery:</span> {program.delivery}</div>
            <Link
              href={`/programs/${program.id}`}
              className="mt-4 bg-blue-600 text-white px-3 py-2 rounded text-center hover:bg-blue-700 transition-colors font-semibold shadow-sm"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 