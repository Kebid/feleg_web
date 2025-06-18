"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "parent",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Sign up user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message || "Signup failed");
      setLoading(false);
      return;
    }
    // Insert profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name: form.name,
      email: form.email,
      role: form.role,
    });
    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
    setSuccess("Signup successful! Please check your email to verify your account.");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="parent">Parent</option>
          <option value="provider">Provider</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="text-center text-sm mt-2">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
} 