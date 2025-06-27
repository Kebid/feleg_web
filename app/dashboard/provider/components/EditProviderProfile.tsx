"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Schema and Type
const providerProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  organization_name: z.string().min(2, 'Organization name is required'),
  location: z.string().min(2, 'Location is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  profile_image_url: z.string().optional().or(z.literal("")),
  specialties: z.array(z.string()).optional(),
  facebook_url: z.string().url('Invalid URL').optional().or(z.literal("")),
  instagram_url: z.string().url('Invalid URL').optional().or(z.literal("")),
  twitter_url: z.string().url('Invalid URL').optional().or(z.literal("")),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal("")),
});

type ProviderProfileForm = z.infer<typeof providerProfileSchema>;

export default function EditProviderProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProviderProfileForm>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: '',
      organization_name: '',
      location: '',
      bio: '',
      website: '',
      phone: '',
      profile_image_url: '',
      specialties: [],
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      linkedin_url: '',
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          reset({
            name: data.name || "",
            organization_name: data.organization_name || "",
            location: data.location || "",
            bio: data.bio || "",
            website: data.website || "",
            phone: data.phone || "",
            profile_image_url: data.profile_image_url || "",
            specialties: data.specialties || [],
            facebook_url: data.facebook_url || "",
            instagram_url: data.instagram_url || "",
            twitter_url: data.twitter_url || "",
            linkedin_url: data.linkedin_url || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, reset]);

  async function handleImageUpload(file: File) {
    if (!user) return;
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from("profile-images").getPublicUrl(fileName);
      setValue("profile_image_url", data.publicUrl);
    }
  }

  const onSubmit = async (form: ProviderProfileForm) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (!error) {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center animated-gradient-bg overflow-hidden p-4">
        {/* Floating blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl backdrop-blur-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen animated-gradient-bg overflow-hidden">
      {/* Floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/80 dark:bg-gray-900/80 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Name" {...register("name")} error={errors.name} />
                <Input label="Organization Name" {...register("organization_name")} error={errors.organization_name} />
                <Input label="Location" {...register("location")} error={errors.location} />
                <Input label="Phone" {...register("phone")} error={errors.phone} />
              </div>

              <textarea
                {...register("bio")}
                rows={5}
                placeholder="About your organization"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
              {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Website" {...register("website")} error={errors.website} />
                <Input label="Profile Image URL" {...register("profile_image_url")} />
                <Input label="Facebook" {...register("facebook_url")} />
                <Input label="Instagram" {...register("instagram_url")} />
                <Input label="Twitter" {...register("twitter_url")} />
                <Input label="LinkedIn" {...register("linkedin_url")} />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                }}
              />

              <div className="text-right">
                <Button type="submit" loading={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}