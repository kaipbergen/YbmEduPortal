import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LinkButton } from "@/components/ui/link-button";

interface ProfileData {
  id: string;
  email: string;
  avatarUrl?: string; // Added avatarUrl to store the Google profile photo
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for user profile and dropdown
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Navigation links
  const links = [
    { to: "/", label: t("navigation.home") },
    { to: "/courses", label: t("navigation.courses") },
    { to: "/materials", label: t("navigation.materials") },
    { to: "/university-guide", label: t("navigation.universityGuide") },
    { to: "/contact", label: t("navigation.contact") },
  ];

  // Attempt to fetch the user's profile on mount
  useEffect(() => {
    axios
      .get<{ profile: ProfileData }>("/api/profile", { withCredentials: true })
      .then((res) => {
        setProfile(res.data.profile);
      })
      .catch(() => {
        setProfile(null);
      });
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Logout handler: calls the backend logout endpoint and resets state
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      // Handle error if needed
    }
    setProfile(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/ybm_logo.png"
                alt="YBM Logo"
                className="h-14 w-30 cursor-pointer"
              />
            </Link>
          </div>

          {/* Middle: Navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm font-medium rounded-md",
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Language switcher, then either Avatar (with dropdown) or Login/Register */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {profile ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden"
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold uppercase">
                      {profile.email ? profile.email[0] : "U"}
                    </span>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {t("navigation.profile", "Profile")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {t("navigation.logout", "Logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <LinkButton to="/login" variant="link">
                  {t("navigation.login", "Войти")}
                </LinkButton>
                <LinkButton to="/register" variant="default">
                  {t("navigation.register", "Регистрация")}
                </LinkButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}