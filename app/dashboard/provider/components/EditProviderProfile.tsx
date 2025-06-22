"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ProviderProfileForm {
  name: string;
  organization_name: string;
  location: string;
  bio: string;
  website: string;
  phone: string;
  profile_image_url?: string;
}

export default function EditProviderProfile() {
  const [form, setForm] = useState<ProviderProfileForm>({
    name: "",
    organization_name: "",
    location: "",
    bio: "",
    website: "",
    phone: "",
    profile_image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ProviderProfileForm>>({});
  const [user, setUser] = useState<any>(null);

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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile");
        } else if (data) {
          setForm({
            name: data.name || "",
            organization_name: data.organization_name || "",
            location: data.location || "",
            bio: data.bio || "",
            website: data.website || "",
            phone: data.phone || "",
            profile_image_url: data.profile_image_url || ""
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProviderProfileForm> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.organization_name.trim()) {
      newErrors.organization_name = "Organization name is required";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (form.website && !isValidUrl(form.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    if (form.phone && !isValidPhone(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name.trim(),
          organization_name: form.organization_name.trim(),
          location: form.location.trim(),
          bio: form.bio.trim(),
          website: form.website.trim() || null,
          phone: form.phone.trim() || null,
          profile_image_url: form.profile_image_url?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to save profile: " + error.message);
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProviderProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
        />
        <div className="text-gray-600 text-lg font-medium">Loading your profile...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Provider Profile</h2>
        <p className="text-gray-600 text-lg">
          Update your profile information to help parents learn more about your organization.
        </p>
      </div>

      <Card variant="elevated" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">👤</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Provider Name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                required
                icon="👤"
              />

              <Input
                label="Organization Name"
                value={form.organization_name}
                onChange={(e) => handleChange('organization_name', e.target.value)}
                error={errors.organization_name}
                required
                icon="🏢"
              />

              <Input
                label="Location"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={errors.location}
                required
                icon="📍"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                icon="📞"
              />
            </div>
          </div>

          {/* Contact & Web Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Contact & Web</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Website"
                type="url"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                error={errors.website}
                icon="🔗"
              />

              <Input
                label="Profile Image URL"
                type="url"
                value={form.profile_image_url || ""}
                onChange={(e) => handleChange('profile_image_url', e.target.value)}
                icon="🖼️"
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">About Your Organization</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={6}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all duration-300 resize-none font-medium"
                placeholder="Tell parents about your organization, your mission, and what makes your programs special..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Share your story and what parents can expect from your programs
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-8 border-t border-gray-200">
            <Button
              type="submit"
              loading={saving}
              size="lg"
              className="min-w-[200px]"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
} 