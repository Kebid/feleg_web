"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const mockPrograms = [
  {
    id: "1",
    title: "STEM Summer Camp",
  },
  {
    id: "2",
    title: "Art for Kids",
  },
  {
    id: "3",
    title: "Soccer Stars",
  },
];

export default function ApplyPage() {
  const { id } = useParams();
  const [program, setProgram] = useState<any>(null);
  const [form, setForm] = useState({
    childName: "",
    childAge: "",
    interests: "",
    document: null as File | null,
  });
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const found = mockPrograms.find((p) => p.id === id);
    setProgram(found);
  }, [id]);

  const validate = () => {
    const errs: any = {};
    if (!form.childName) errs.childName = "Child's name is required.";
    if (!form.childAge) errs.childAge = "Child's age is required.";
    if (!form.interests) errs.interests = "Interests are required.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "document") {
      setForm({ ...form, document: files[0] || null });
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
    // Simulate async submission
    setTimeout(() => {
      setSuccess(true);
      setForm({ childName: "", childAge: "", interests: "", document: null });
      setSubmitting(false);
    }, 1200);
  };

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500">Program not found.</div>
        <Link href={`/programs/${id}`} className="mt-4 text-blue-600 hover:underline">Back to Program</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <Link href={`/programs/${id}`} className="text-blue-600 hover:underline">&larr; Back to Program</Link>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Apply to {program.title}</h1>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Application submitted successfully!</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Child's Full Name *</label>
            <input
              type="text"
              name="childName"
              value={form.childName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            {errors.childName && <div className="text-red-500 text-sm mt-1">{errors.childName}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Child's Age *</label>
            <input
              type="number"
              name="childAge"
              value={form.childAge}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              min={1}
            />
            {errors.childAge && <div className="text-red-500 text-sm mt-1">{errors.childAge}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Interests *</label>
            <textarea
              name="interests"
              value={form.interests}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
              required
            />
            {errors.interests && <div className="text-red-500 text-sm mt-1">{errors.interests}</div>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Document Upload (optional)</label>
            <input
              type="file"
              name="document"
              onChange={handleChange}
              className="w-full"
              accept=".pdf,.jpg,.png,.doc,.docx"
            />
            {form.document && <div className="text-sm text-gray-600 mt-1">Selected: {form.document.name}</div>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
} 