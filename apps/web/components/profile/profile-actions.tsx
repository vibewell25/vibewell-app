"use client";

import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";

interface ProfileActionsProps {
  profile: any;
}

export function ProfileActions({ profile }: ProfileActionsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card-modern p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
        <ProfileEditForm profile={profile} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleEdit}
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
      >
        Edit Profile
      </button>
    </div>
  );
} 