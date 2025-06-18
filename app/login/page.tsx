"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Login user
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (loginError || !data.user) {
      setError(loginError?.message || "Login failed");
      setLoading(false);
      return;
    }
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    if (profileError || !profile) {
      setError(profileError?.message || "Profile not found");
      setLoading(false);
      return;
    }
    // Redirect based on role
    if (profile.role === "parent") {
      router.push("/dashboard/parent");
    } else if (profile.role === "provider") {
      router.push("/dashboard/provider");
    } else {
      setError("Unknown role");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500">{error}</div>}
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-sm mt-2">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </div>
      </form>
    </div>
  );
} 