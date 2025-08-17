"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Briefcase,
  Mic,
  BookOpen,
  FileText,
  Copyright,
  Rocket,
  DollarSign,
  ImageIcon,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { TestimonialsManagement } from "@/components/testimonials-management";
import { ExperienceManagement } from "@/components/experience-management";
import { TalksManagement } from "@/components/talks-management";
import { PublicationsManagement } from "@/components/publications-management";
import { PatentsManagement } from "@/components/patents-management";
import { CopyrightsManagement } from "@/components/copyrights-management";
import { StartupsManagement } from "@/components/startups-management";
import { ResearchGrantsManagement } from "@/components/research-grants-management";
import { GalleryManagement } from "@/components/gallery-management";
import PhdGuideForm from "@/components/phdGuide";
import LearningResourcesManagement from "@/components/learningResources";
import { useRouter } from "next/navigation";

const navigationItems = [
  {
    id: "testimonials",
    label: "Testimonials",
    icon: User,
    description: "Manage client testimonials",
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    description: "Work experience timeline",
  },
  {
    id: "talks",
    label: "Talks Delivered",
    icon: Mic,
    description: "Speaking engagements",
  },
  {
    id: "publications",
    label: "Publications",
    icon: BookOpen,
    description: "Research publications",
  },
  {
    id: "patents",
    label: "Patents",
    icon: FileText,
    description: "Patent applications",
  },
  {
    id: "copyrights",
    label: "Copyrights",
    icon: Copyright,
    description: "Copyright registrations",
  },
  {
    id: "startups",
    label: "Startups",
    icon: Rocket,
    description: "Startup ventures",
  },
  {
    id: "grants",
    label: "Research Grants",
    icon: DollarSign,
    description: "Funding and grants",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: ImageIcon,
    description: "Image gallery",
  },
  {
    id: "phdguide",
    label: "PhD Guide",
    icon: BookOpen,
    description:
      "Manage PhD guide entries",
  },
  {
    id: "learningresources",
    label: "Learning Resources",
    icon: FileText,
    description: "Manage learning resources (videos, drive links, etc.)",
  },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("testimonials");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  function isLoginExpired(loginInfo: { time: string }) {
    const loginTime = new Date(loginInfo.time).getTime();
    const now = Date.now();
    return now - loginTime > 3600000;
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("loginInfo");
      if (stored) {
        try {
          const info = JSON.parse(stored);
          if (info && info.time && isLoginExpired(info)) {
            localStorage.removeItem("loginInfo");
            router.replace("/login");
          }
        } catch {}
      } else {
        router.push("/login");
      }
    }
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("loginInfo");
      router.replace("/login");
    }
    router.push("/login");
  }

  const activeItem = navigationItems.find((item) => item.id === activeSection);

  const renderContent = () => {
    switch (activeSection) {
      case "testimonials":
        return <TestimonialsManagement />;
      case "experience":
        return <ExperienceManagement />;
      case "talks":
        return <TalksManagement />;
      case "publications":
        return <PublicationsManagement />;
      case "patents":
        return <PatentsManagement />;
      case "copyrights":
        return <CopyrightsManagement />;
      case "startups":
        return <StartupsManagement />;
      case "grants":
        return <ResearchGrantsManagement />;
      case "gallery":
        return <GalleryManagement />;
      case "phdguide":
        return <PhdGuideForm />;
      case "learningresources":
        return <LearningResourcesManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-6">
              <nav className="space-y-2 px-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 transition-all duration-200",
                        isActive && "bg-secondary shadow-sm"
                      )}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 h-full max-h-[calc(100vh-4rem)] overflow-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                {activeItem && <activeItem.icon className="h-6 w-6" />}
                <h2 className="text-2xl font-bold">{activeItem?.label}</h2>
              </div>
              <p className="text-muted-foreground">{activeItem?.description}</p>
              <Separator className="mt-4" />
            </div>

            {/* Content Area */}
            <div className="space-y-6">{renderContent()}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
