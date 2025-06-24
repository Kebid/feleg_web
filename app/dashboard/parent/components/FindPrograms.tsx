"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";

export default function FindPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    delivery: "",
    ageGroup: "",
    cost: "",
  });
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // Fetch programs from database
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching programs:", error);
          toast.error("Failed to load programs");
        } else {
          setPrograms(data || []);
          setFilteredPrograms(data || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Get unique values for filter dropdowns
  const locations = Array.from(new Set(programs.map(p => p.location).filter(Boolean)));
  const programTypes = Array.from(new Set(programs.map(p => p.program_type).filter(Boolean)));
  const deliveryModes = Array.from(new Set(programs.map(p => p.delivery_mode).filter(Boolean)));
  const ageGroups = Array.from(new Set(programs.map(p => p.age_group).filter(Boolean)));
  const costRanges = Array.from(new Set(programs.map(p => p.cost).filter(Boolean)));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = programs.filter((p) => {
      return (
        (!filters.keyword || p.title.toLowerCase().includes(filters.keyword.toLowerCase())) &&
        (!filters.location || p.location === filters.location) &&
        (!filters.type || p.program_type === filters.type) &&
        (!filters.delivery || p.delivery_mode === filters.delivery) &&
        (!filters.ageGroup || p.age_group === filters.ageGroup) &&
        (!filters.cost || p.cost === filters.cost)
      );
    });
    setFilteredPrograms(filtered);
  };

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-0">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-5 flex flex-col border border-blue-100 animate-pulse">
              <div className="h-6 w-3/4 bg-blue-100 rounded mb-3" />
              <div className="h-4 w-1/2 bg-blue-50 rounded mb-2" />
              <div className="h-4 w-1/3 bg-blue-50 rounded mb-2" />
              <div className="h-3 w-full bg-blue-50 rounded mb-2" />
              <div className="h-3 w-2/3 bg-blue-50 rounded mb-2" />
              <div className="h-8 w-full bg-blue-100 rounded mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-0">
      {/* Filter/Search Panel */}
      <motion.form
        onSubmit={handleSearch}
        className="bg-blue-50 rounded-2xl shadow p-4 mb-6 flex flex-col md:flex-row md:items-end gap-4 border-2 border-blue-200"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        {filteredPrograms.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <span className="text-5xl text-blue-200 mb-2">🔍</span>
            <div className="text-center text-gray-500 font-medium">
              {programs.length === 0 ? "No programs available yet." : "No programs found.<br/>Try adjusting your filters."}
            </div>
          </div>
        )}
        {filteredPrograms.map((program) => (
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
            <div className="mb-1"><span className="font-semibold">Type:</span> {program.program_type}</div>
            <div className="mb-1"><span className="font-semibold">Location:</span> {program.location}</div>
            <div className="mb-1"><span className="font-semibold">Age Group:</span> {program.age_group}</div>
            <div className="mb-1"><span className="font-semibold">Cost:</span> {program.cost}</div>
            <div className="mb-1"><span className="font-semibold">Delivery:</span> {program.delivery_mode}</div>
            {program.description && (
              <div className="mb-2 text-sm text-gray-600 line-clamp-2">
                {program.description}
              </div>
            )}
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