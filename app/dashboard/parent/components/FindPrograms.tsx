"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import { AcademicCapIcon, MapPinIcon, DeviceTabletIcon, BookmarkIcon, CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/solid";

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
            <BookmarkIcon className="w-12 h-12 text-blue-200 mb-2" />
            <div className="text-center text-gray-500 font-medium">
              {programs.length === 0 ? "No programs available yet." : "No programs found. Try adjusting your filters."}
            </div>
          </div>
        )}
        {filteredPrograms.map((program, i) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all p-5 flex flex-col border border-blue-100 dark:border-gray-800 relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <AcademicCapIcon className="w-7 h-7 text-blue-500" />
              <div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{program.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{program.location} • {program.delivery_mode}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <DeviceTabletIcon className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">{program.program_type}</span>
              <span className="mx-1">|</span>
              <span>{program.age_group}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPinIcon className="w-4 h-4" />
              <span>{program.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <CurrencyDollarIcon className="w-4 h-4" />
              <span>{program.cost}</span>
              <ClockIcon className="w-4 h-4 ml-2" />
              <span>{program.duration}</span>
            </div>
            <button
              onClick={() => toggleBookmark(program.id)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${bookmarks.includes(program.id) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-blue-50 hover:text-blue-600'}`}
              aria-label={bookmarks.includes(program.id) ? 'Remove bookmark' : 'Add bookmark'}
            >
              <BookmarkIcon className="w-6 h-6" fill={bookmarks.includes(program.id) ? '#2563EB' : 'none'} />
            </button>
            <div className="flex gap-2 mt-4">
              <Link href={`/programs/${program.id}`} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-xl shadow hover:scale-105 transition-transform text-center">
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 