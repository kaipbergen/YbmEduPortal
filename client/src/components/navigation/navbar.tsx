import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LinkButton } from "@/components/ui/link-button";

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();

  const links = [
    { to: "/", label: t("navigation.home") },
    { to: "/courses", label: t("navigation.courses") },
    { to: "/materials", label: t("navigation.materials") },
    { to: "/university-guide", label: t("navigation.universityGuide") },
    { to: "/contact", label: t("navigation.contact") },
  ];

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
          {/* Right: Language switcher, Login & Register */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <LinkButton to="/login" variant="link">
              {t("navigation.login", "Войти")}
            </LinkButton>
            <LinkButton to="/register" variant="default">
              {t("navigation.register", "Регистрация")}
            </LinkButton>
          </div>
        </div>
      </div>
    </nav>
  );
}