import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/materials", label: "Study Materials" },
    { href: "/university-guide", label: "University Guide" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <img 
                  src="/ybm_logo.png" 
                  alt="YBM Logo" 
                  className="h-10 w-auto"
                />
              </a>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md",
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}