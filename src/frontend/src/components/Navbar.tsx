import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Leaf, LogOut, User } from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetMyProfile } from "../hooks/useQueries";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: profile } = useGetMyProfile();
  const isLoggedIn = !!identity;

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Crop Disease Detection", page: "disease" },
    { label: "Buyers Directory", page: "buyers" },
  ];

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FA";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-display font-bold text-xl text-farm-green"
          data-ocid="nav.link"
        >
          <Leaf className="w-6 h-6" />
          FarmAI
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => onNavigate(link.page)}
              data-ocid="nav.link"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-secondary text-farm-green font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              data-ocid="nav.primary_button"
            >
              <User className="w-4 h-4 mr-2" />
              {isLoggingIn ? "Logging in..." : "Farmer Login"}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2"
                  data-ocid="nav.toggle"
                >
                  <Avatar className="w-9 h-9 border-2 border-primary">
                    <AvatarFallback className="bg-secondary text-farm-green font-bold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onNavigate("dashboard")}
                  data-ocid="nav.link"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clear}
                  className="text-destructive"
                  data-ocid="nav.link"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
