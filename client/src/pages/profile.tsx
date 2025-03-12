// src/pages/Profile.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/** Data Models */
interface StudyProgram {
  id: string;
  name: string;
  progress: number;
  examDate?: string;
}

export interface TestScore {
  id: string;
  testType: string;
  score: number;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface TargetUniversity {
  id: string;
  name: string;
  program: string;
  applicationDeadline: string;
}

interface ProfileData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
  studyPrograms?: StudyProgram[];
  testScores?: TestScore[];
  achievements?: Achievement[];
  targetUniversities?: TargetUniversity[];
}

/** Define possible tabs */
type Tab = "general" | "studyPrograms" | "testScores" | "achievements" | "targetUniversities";

/** Edit mode state for each tab */
interface EditModeState {
  general: boolean;
  studyPrograms: boolean;
  testScores: boolean;
  achievements: boolean;
  targetUniversities: boolean;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [editMode, setEditMode] = useState<EditModeState>({
    general: false,
    studyPrograms: false,
    testScores: false,
    achievements: false,
    targetUniversities: false,
  });
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await axios.get<{ profile: ProfileData }>("/api/profile", {
        withCredentials: true,
      });
      setProfile(res.data.profile);
      setFormData(res.data.profile);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Unauthorized, please log in.");
      setLoading(false);
      navigate("/login");
    }
  }

  function handleEditToggle(tab: Tab) {
    setEditMode((prev) => ({ ...prev, [tab]: !prev[tab] }));
    if (!editMode[tab] && profile) {
      // Reset formData to the latest profile when toggling into edit mode
      setFormData({ ...profile });
    }
  }

  function handleCancel(tab: Tab) {
    if (profile) {
      setFormData({ ...profile });
    }
    setEditMode((prev) => ({ ...prev, [tab]: false }));
  }

  async function handleSave(tab: Tab) {
    if (!formData) return;
    try {
      const endpoint = tab === "general" ? "/api/profile/general" : `/api/profile/${tab}`;
      await axios.put(endpoint, formData, { withCredentials: true });
      setProfile(formData);
      setEditMode((prev) => ({ ...prev, [tab]: false }));
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    }
  }

  /** Add an item to an array-based tab */
  function handleAddItem(tab: Exclude<Tab, "general">, newItem: any) {
    if (!formData) return;
    const updated = { ...formData };
    switch (tab) {
      case "studyPrograms":
        updated.studyPrograms = [...(updated.studyPrograms || []), newItem];
        break;
      case "testScores":
        updated.testScores = [...(updated.testScores || []), newItem];
        break;
      case "achievements":
        updated.achievements = [...(updated.achievements || []), newItem];
        break;
      case "targetUniversities":
        updated.targetUniversities = [...(updated.targetUniversities || []), newItem];
        break;
    }
    setFormData(updated);
  }

  /** Remove an item from an array-based tab by ID */
  function handleRemoveItem(tab: Exclude<Tab, "general">, id: string) {
    if (!formData) return;
    const updated = { ...formData };
    switch (tab) {
      case "studyPrograms":
        updated.studyPrograms = updated.studyPrograms?.filter((p) => p.id !== id);
        break;
      case "testScores":
        updated.testScores = updated.testScores?.filter((s) => s.id !== id);
        break;
      case "achievements":
        updated.achievements = updated.achievements?.filter((a) => a.id !== id);
        break;
      case "targetUniversities":
        updated.targetUniversities = updated.targetUniversities?.filter((u) => u.id !== id);
        break;
    }
    setFormData(updated);
  }

  /** Handle avatar photo change */
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("photo", file);
    try {
      // Update the photo on the backend (ensure /api/profile/photo is implemented)
      const res = await axios.put<{ photoUrl: string }>("/api/profile/photo", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Update the local state with the new photo URL
      setProfile((prev) => (prev ? { ...prev, photoUrl: res.data.photoUrl } : prev));
      setFormData((prev) => (prev ? { ...prev, photoUrl: res.data.photoUrl } : prev));
    } catch (err) {
      console.error(err);
      alert("Failed to update photo.");
    }
  };

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  if (!profile || !formData) {
    return <div className="p-4 text-center">No profile data.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        className="hidden"
      />
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gray-800 text-white p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* Avatar */}
            <div className="relative mr-6 mb-4 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src={profile.photoUrl || "/images/ava.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full"
                title="Change photo"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            {/* User Info */}
            <div>
              <h1 className="text-2xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-300 mb-2">ID: {profile.id}</p>
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {profile.email}
              </div>
              {profile.phone && (
                <div className="flex items-center text-sm mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {profile.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <TabButton label="General Information" active={activeTab === "general"} onClick={() => setActiveTab("general")} />
            <TabButton label="Study Programs" active={activeTab === "studyPrograms"} onClick={() => setActiveTab("studyPrograms")} />
            <TabButton label="Test Scores" active={activeTab === "testScores"} onClick={() => setActiveTab("testScores")} />
            <TabButton label="Achievements" active={activeTab === "achievements"} onClick={() => setActiveTab("achievements")} />
            <TabButton label="Target Universities" active={activeTab === "targetUniversities"} onClick={() => setActiveTab("targetUniversities")} />
          </div>
        </div>
                {/* Tab Content */}
                <div className="p-6">
          {activeTab === "general" && (
            <GeneralTab
              editMode={editMode.general}
              formData={formData}
              onEdit={() => handleEditToggle("general")}
              onSave={() => handleSave("general")}
              onCancel={() => handleCancel("general")}
              onChange={(e) => {
                if (!formData) return;
                const { name, value } = e.target;
                setFormData({ ...formData, [name]: value });
              }}
            />
          )}
          {activeTab === "studyPrograms" && (
            <StudyProgramsTab
              editMode={editMode.studyPrograms}
              programs={formData.studyPrograms || []}
              onEdit={() => handleEditToggle("studyPrograms")}
              onSave={() => handleSave("studyPrograms")}
              onCancel={() => handleCancel("studyPrograms")}
              onRemove={(id: string) => handleRemoveItem("studyPrograms", id)}
              onAddItem={(item) => handleAddItem("studyPrograms", item)}
            />
          )}
          {activeTab === "testScores" && (
            <TestScoresTab
              editMode={editMode.testScores}
              scores={formData.testScores || []}
              onEdit={() => handleEditToggle("testScores")}
              onSave={() => handleSave("testScores")}
              onCancel={() => handleCancel("testScores")}
              onRemove={(id: string) => handleRemoveItem("testScores", id)}
              onAddItem={(item) => handleAddItem("testScores", item)}
            />
          )}
          {activeTab === "achievements" && (
            <AchievementsTab
              editMode={editMode.achievements}
              achievements={formData.achievements || []}
              onEdit={() => handleEditToggle("achievements")}
              onSave={() => handleSave("achievements")}
              onCancel={() => handleCancel("achievements")}
              onRemove={(id: string) => handleRemoveItem("achievements", id)}
              onAddItem={(item) => handleAddItem("achievements", item)}
            />
          )}
          {activeTab === "targetUniversities" && (
            <TargetUniversitiesTab
              editMode={editMode.targetUniversities}
              universities={formData.targetUniversities || []}
              onEdit={() => handleEditToggle("targetUniversities")}
              onSave={() => handleSave("targetUniversities")}
              onCancel={() => handleCancel("targetUniversities")}
              onRemove={(id: string) => handleRemoveItem("targetUniversities", id)}
              onAddItem={(item) => handleAddItem("targetUniversities", item)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** Simple Tab Button Component */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`px-4 py-2 font-medium text-sm ${
        active ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/** GeneralTab Component */
function GeneralTab({
  editMode,
  formData,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: {
  editMode: boolean;
  formData: ProfileData;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">General Information</h2>
        {!editMode ? (
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onEdit}>
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium" onClick={onCancel}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onSave}>
              Save
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          {editMode ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={onChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{formData.firstName || "Not provided"}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          {editMode ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={onChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{formData.lastName || "Not provided"}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-900">{formData.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          {editMode ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={onChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{formData.phone || "Not provided"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** StudyProgramsTab Component */
function StudyProgramsTab({
  editMode,
  programs,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onAddItem,
}: {
  editMode: boolean;
  programs: StudyProgram[];
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: (id: string) => void;
  onAddItem: (item: StudyProgram) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newProgress, setNewProgress] = useState(0);
  const [newExamDate, setNewExamDate] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Study Programs</h2>
        {!editMode ? (
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onEdit}>
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium" onClick={onCancel}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onSave}>
              Save
            </button>
          </div>
        )}
      </div>
      {programs.length > 0 ? (
        <div className="space-y-4">
          {programs.map((program) => (
            <div key={program.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <h3 className="font-medium">{program.name}</h3>
                {editMode && (
                  <button onClick={() => onRemove(program.id)} className="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                )}
              </div>
              <div className="mt-2 text-sm">
                Progress: {program.progress}%
                {program.examDate && <span className="ml-2 text-gray-500">Exam Date: {program.examDate}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No study programs added yet.</p>
        </div>
      )}
      {editMode && (
        <div className="mt-4 border p-4 rounded-lg">
          <h3 className="font-medium mb-3">Add New Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date (Optional)</label>
              <input
                type="date"
                value={newExamDate}
                onChange={(e) => setNewExamDate(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => {
              const newItem: StudyProgram = {
                id: Date.now().toString(),
                name: newName || "New Program",
                progress: newProgress,
                examDate: newExamDate || undefined,
              };
              onAddItem(newItem);
              setNewName("");
              setNewProgress(0);
              setNewExamDate("");
            }}
          >
            Add Program
          </button>
        </div>
      )}
    </div>
  );
}

/** TestScoresTab Component */
function TestScoresTab({
  editMode,
  scores,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onAddItem,
}: {
  editMode: boolean;
  scores: TestScore[];
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: (id: string) => void;
  onAddItem: (item: TestScore) => void;
}) {
  const [newTestType, setNewTestType] = useState("SAT");
  const [newScore, setNewScore] = useState(0);
  const [newDate, setNewDate] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test Scores</h2>
        {!editMode ? (
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onEdit}>
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium" onClick={onCancel}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onSave}>
              Save
            </button>
          </div>
        )}
      </div>
      {scores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                {editMode && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scores.map((score) => (
                <tr key={score.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{score.testType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{score.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{score.date}</td>
                  {editMode && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onRemove(score.id)} className="text-red-600 hover:text-red-900">
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No test scores added yet.</p>
        </div>
      )}
      {editMode && (
        <div className="mt-4 border p-4 rounded-lg">
          <h3 className="font-medium mb-3">Add New Test Score</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
              <select
                value={newTestType}
                onChange={(e) => setNewTestType(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SAT">SAT</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
                <option value="ACT">ACT</option>
                <option value="GRE">GRE</option>
                <option value="GMAT">GMAT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(Number(e.target.value))}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => {
              const newItem: TestScore = {
                id: Date.now().toString(),
                testType: newTestType,
                score: newScore,
                date: newDate || new Date().toISOString().split("T")[0],
              };
              onAddItem(newItem);
              setNewTestType("SAT");
              setNewScore(0);
              setNewDate("");
            }}
          >
            Add Score
          </button>
        </div>
      )}
    </div>
  );
}

/** AchievementsTab Component */
function AchievementsTab({
  editMode,
  achievements,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onAddItem,
}: {
  editMode: boolean;
  achievements: Achievement[];
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: (id: string) => void;
  onAddItem: (item: Achievement) => void;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Achievements</h2>
        {!editMode ? (
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onEdit}>
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium" onClick={onCancel}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onSave}>
              Save
            </button>
          </div>
        )}
      </div>
      {achievements.length > 0 ? (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <h3 className="font-medium">{achievement.title}</h3>
                {editMode && (
                  <button onClick={() => onRemove(achievement.id)} className="text-red-500 hover:text-red-900">
                    Remove
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{achievement.date}</p>
              <p className="mt-2 text-gray-700">{achievement.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No achievements added yet.</p>
        </div>
      )}
      {editMode && (
        <div className="mt-4 border p-4 rounded-lg">
          <h3 className="font-medium mb-3">Add New Achievement</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => {
              const newItem: Achievement = {
                id: Date.now().toString(),
                title: newTitle,
                date: newDate || new Date().toISOString().split("T")[0],
                description: newDescription,
              };
              onAddItem(newItem);
              setNewTitle("");
              setNewDate("");
              setNewDescription("");
            }}
          >
            Add Achievement
          </button>
        </div>
      )}
    </div>
  );
}

/** TargetUniversitiesTab Component */
function TargetUniversitiesTab({
  editMode,
  universities,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onAddItem,
}: {
  editMode: boolean;
  universities: TargetUniversity[];
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: (id: string) => void;
  onAddItem: (item: TargetUniversity) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Target Universities</h2>
        {!editMode ? (
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onEdit}>
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium" onClick={onCancel}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium" onClick={onSave}>
              Save
            </button>
          </div>
        )}
      </div>
      {universities.length > 0 ? (
        <div className="space-y-4">
          {universities.map((uni) => (
            <div key={uni.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <h3 className="font-medium">{uni.name}</h3>
                {editMode && (
                  <button onClick={() => onRemove(uni.id)} className="text-red-500 hover:text-red-900">
                    Remove
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Program: {uni.program}</p>
              <p className="text-sm text-gray-500">Application Deadline: {uni.applicationDeadline}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No target universities added yet.</p>
        </div>
      )}
      {editMode && (
        <div className="mt-4 border p-4 rounded-lg">
          <h3 className="font-medium mb-3">Add New Target University</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <input
                type="text"
                value={newProgram}
                onChange={(e) => setNewProgram(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={() => {
              const newItem: TargetUniversity = {
                id: Date.now().toString(),
                name: newName,
                program: newProgram,
                applicationDeadline: newDeadline || new Date().toISOString().split("T")[0],
              };
              onAddItem(newItem);
              setNewName("");
              setNewProgram("");
              setNewDeadline("");
            }}
          >
            Add University
          </button>
        </div>
      )}
    </div>
  );
}