import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  profile: {
    id: string;
    email: string;
    // Add additional fields as needed
  };
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData["profile"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<ProfileData>("/api/profile", { withCredentials: true })
      .then((res: AxiosResponse<ProfileData>) => {
        setProfile(res.data.profile);
      })
      .catch((err: any) => {
        console.error(err);
        setError("Unauthorized, please log in.");
        navigate("/login");
      });
  }, [navigate]);

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p>
        <strong>ID:</strong> {profile.id}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      {/* Render additional profile fields as needed */}
    </div>
  );
}