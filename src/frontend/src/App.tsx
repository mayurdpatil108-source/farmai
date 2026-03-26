import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import BuyersDirectoryPage from "./pages/BuyersDirectoryPage";
import CropDiseasePage from "./pages/CropDiseasePage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient();

export type Page = "home" | "disease" | "buyers" | "dashboard";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === "disease" && <CropDiseasePage />}
        {currentPage === "buyers" && <BuyersDirectoryPage />}
        {currentPage === "dashboard" && (
          <DashboardPage onNavigate={setCurrentPage} />
        )}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <InternetIdentityProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </InternetIdentityProvider>
  );
}
