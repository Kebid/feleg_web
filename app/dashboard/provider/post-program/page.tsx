"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

const programTypes = ["STEM", "Arts", "Sports", "Other"];
const deliveryModes = ["Online", "In-Person"];
const ageGroups = ["5-8", "9-12", "13-15", "16-18"];

export default function PostProgramPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "STEM",
    delivery: "Online",
    duration: "",
    ageGroup: "5-8",
    cost: "",
    date: "",
    media: null as File | null,
  });
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    };
    getUser();
  }, []);

  const validate = () => {
    const errs: any = {};
    if (!form.title) errs.title = "Title is required.";
    if (!form.description) errs.description = "Description is required.";
    if (!form.location) errs.location = "Location is required.";
    if (!form.duration) errs.duration = "Duration is required.";
    if (!form.cost) errs.cost = "Cost is required.";
    if (!form.date) errs.date = "Date/Deadline is required.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "media") {
      setForm({ ...form, media: files[0] || null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // Insert into Supabase
    const { error } = await supabase.from("programs").insert({
      title: form.title,
      description: form.description,
      location: form.location,
      program_type: form.type,
      delivery_mode: form.delivery,
      duration: form.duration,
      age_group: form.ageGroup,
      cost: form.cost,
      provider_id: userId,
    });
    if (error) {
      setErrors({ submit: error.message });
      setSubmitting(false);
      return;
    }
    setSuccess(true);
    setForm({
      title: "",
      description: "",
      location: "",
      type: "STEM",
      delivery: "Online",
      duration: "",
      ageGroup: "5-8",
      cost: "",
      date: "",
      media: null,
    });
    setSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/dashboard/provider/my-programs" className="text-blue-600 hover:underline">View My Programs</Link>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Post a New Program</h1>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Program posted successfully!</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Program Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
              required
            />
            {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Program Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {programTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Delivery Mode *</label>
            <select
              name="delivery"
              value={form.delivery}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {deliveryModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Duration *</label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            {errors.duration && <div className="text-red-500 text-sm mt-1">{errors.duration}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Age Group *</label>
            <select
              name="ageGroup"
              value={form.ageGroup}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {ageGroups.map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Cost *</label>
            <input
              type="text"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            {errors.cost && <div className="text-red-500 text-sm mt-1">{errors.cost}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Date/Deadline *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Media Upload (optional)</label>
            <input
              type="file"
              name="media"
              onChange={handleChange}
              className="w-full"
              accept="image/*,video/*"
            />
            {form.media && <div className="text-sm text-gray-600 mt-1">Selected: {form.media.name}</div>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Post Program"}
          </button>
        </form>
      </div>
    </div>
  );
} 