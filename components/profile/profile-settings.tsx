"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { UpdateProfileData } from "@/lib/types/data.interface";

interface ProfileSettingsProps {
  userId: string;
  onClose: () => void;
}

export function ProfileSettings({ userId, onClose }: ProfileSettingsProps) {
  const { user: currentUser } = useAuth();
  const { getProfile, updateProfile } = useUser();
  const { data: user, isLoading } = getProfile(userId);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log("user:", user);
  console.log("currentUser:", currentUser);

  const [profileForm, setProfileForm] = useState<UpdateProfileData>(() => ({
    name: user?.name || "",
    bio: user?.bio || "",
    country: user?.country || "",
    twitterAcc: user?.twitterAcc || "",
    githubAcc: user?.githubAcc || "",
    linkedinAcc: user?.linkedinAcc || "",
    anotherAcc: user?.anotherAcc || "",
  }));

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(
    user?.avatar || null
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileForm((prev) => ({ ...prev, avatar: file }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update handleProfileUpdate to ensure proper JSON handling
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const formData = new FormData();

      // Add all fields
      formData.append("name", profileForm.name);
      formData.append("bio", profileForm.bio);
      formData.append("country", profileForm.country);
      formData.append("twitterAcc", profileForm.twitterAcc);
      formData.append("githubAcc", profileForm.githubAcc);
      formData.append("linkedinAcc", profileForm.linkedinAcc);
      formData.append("anotherAcc", profileForm.anotherAcc);

      // Add avatar if present
      if (profileForm.avatar) {
        formData.append("avatar", profileForm.avatar);
      }

      await updateProfile.mutateAsync(profileForm);
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || currentUser?.id !== userId) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          You don't have permission to access these settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewAvatar || user?.avatar} />
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profileForm.country}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, country: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Social Links</Label>
                <Input
                  placeholder="Twitter URL"
                  value={profileForm.twitterAcc}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      twitterAcc: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="GitHub URL"
                  value={profileForm.githubAcc}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      githubAcc: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={profileForm.linkedinAcc}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      linkedinAcc: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Other URL"
                  value={profileForm.anotherAcc}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      anotherAcc: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
