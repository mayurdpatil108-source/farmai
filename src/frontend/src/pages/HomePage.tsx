import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Camera,
  Leaf,
  Scan,
  Search,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import ProfileSetupModal from "../components/ProfileSetupModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetDashboard, useGetMyProfile } from "../hooks/useQueries";

const sampleBuyers = [
  {
    id: 1,
    name: "Marcus Thompson",
    company: "FreshHarvest Co.",
    location: "California, USA",
    crops: ["Wheat", "Corn"],
  },
  {
    id: 2,
    name: "Priya Patel",
    company: "AgriLink Markets",
    location: "Texas, USA",
    crops: ["Tomatoes", "Peppers"],
  },
  {
    id: 3,
    name: "James Okafor",
    company: "GreenTrade Export",
    location: "Iowa, USA",
    crops: ["Soybeans", "Sunflower"],
  },
];

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetMyProfile();
  const { data: dashboard } = useGetDashboard();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (identity && profile === null) {
      setShowProfileModal(true);
    }
  }, [identity, profile]);

  const isLoggedIn = !!identity;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-farm-field.dim_1920x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, oklch(0.15 0.07 155 / 0.90) 0%, oklch(0.15 0.07 155 / 0.70) 50%, transparent 100%)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl text-white"
          >
            <Badge
              className="mb-4 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "oklch(0.49 0.13 155 / 0.4)",
                color: "white",
                border: "1px solid oklch(0.60 0.13 155)",
              }}
            >
              AI-Powered Agriculture
            </Badge>
            <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight mb-4">
              Smart Farming
              <br />
              Starts Here
            </h1>
            <p className="text-lg mb-8 text-white/80">
              Detect crop diseases instantly with AI, connect with trusted
              buyers, and transform your farm's productivity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => onNavigate("disease")}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                data-ocid="hero.primary_button"
              >
                <Scan className="w-5 h-5 mr-2" />
                Scan Crop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("buyers")}
                className="rounded-full bg-transparent border-white text-white hover:bg-white/10 font-semibold px-8"
                data-ocid="hero.secondary_button"
              >
                <Users className="w-5 h-5 mr-2" />
                Find Buyers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Cards (logged in) */}
      {isLoggedIn && (
        <section
          className="py-12 px-4"
          style={{ background: "oklch(0.95 0.02 155)" }}
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display font-bold text-2xl text-farm-text mb-1">
                Your Farm Dashboard
              </h2>
              <p className="text-muted-foreground mb-6">
                Welcome back, {profile?.name || "Farmer"}! Here's your latest
                activity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="shadow-card border-0"
                  data-ocid="dashboard.card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.92 0.04 155)" }}
                      >
                        <Scan className="w-5 h-5 text-farm-green" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Latest Crop Scan
                      </span>
                    </div>
                    <p className="font-bold text-xl text-farm-text">
                      {dashboard?.recentScans?.length
                        ? dashboard.recentScans[0].cropType
                        : "No scans yet"}
                    </p>
                    {dashboard?.recentScans?.[0] && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {dashboard.recentScans[0].diagnosis}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card
                  className="shadow-card border-0"
                  data-ocid="dashboard.card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.92 0.04 155)" }}
                      >
                        <Leaf className="w-5 h-5 text-farm-green" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Field Status
                      </span>
                    </div>
                    <p className="font-bold text-xl text-farm-text">
                      {profile?.farmName || "Not set up"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile?.location || "Add your farm details"}
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="shadow-card border-0"
                  data-ocid="dashboard.card"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.92 0.04 155)" }}
                      >
                        <Users className="w-5 h-5 text-farm-green" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Buyer Messages
                      </span>
                    </div>
                    <p className="font-bold text-xl text-farm-text">
                      {dashboard ? Number(dashboard.messageCount) : 0}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Messages received
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Crop Disease Feature */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="/assets/generated/farmer-phone-crops.dim_600x500.jpg"
                alt="Farmer using FarmAI on phone"
                className="rounded-2xl w-full object-cover shadow-card"
                style={{ maxHeight: 420 }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-3 rounded-full px-3 py-1 text-xs font-semibold bg-secondary text-farm-green">
                Crop Disease Detection
              </Badge>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-farm-text mb-4">
                Instant AI Crop Disease Diagnosis
              </h2>
              <p className="text-muted-foreground mb-6">
                Describe your crop's symptoms and let our AI analyze and
                diagnose diseases instantly, with expert treatment
                recommendations.
              </p>
              <Button
                size="lg"
                onClick={() => onNavigate("disease")}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 mb-8"
                data-ocid="feature.primary_button"
              >
                <Scan className="w-5 h-5 mr-2" />
                Scan New Crop
              </Button>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Camera, label: "Snap a Photo", step: "1" },
                  { icon: Brain, label: "Analyze with AI", step: "2" },
                  {
                    icon: Stethoscope,
                    label: "Get Expert Treatment",
                    step: "3",
                  },
                ].map(({ icon: Icon, label, step }) => (
                  <div key={step} className="text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-farm-green font-display"
                      style={{
                        background: "oklch(0.92 0.04 155)",
                        border: "2px solid oklch(0.88 0.06 155)",
                      }}
                    >
                      {step}
                    </div>
                    <Icon className="w-5 h-5 mx-auto mb-1 text-farm-green" />
                    <p className="text-xs font-medium text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Buyers Directory Preview */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.95 0.02 155)" }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl text-farm-text mb-2">
              Buyers Directory
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect with trusted crop buyers in your area.
            </p>

            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search buyers by name or crop..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => onNavigate("buyers")}
                readOnly
                data-ocid="buyers.search_input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {sampleBuyers.map((buyer, i) => (
                <Card
                  key={buyer.id}
                  className="shadow-card border-0"
                  data-ocid={`buyers.item.${i + 1}`}
                >
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-farm-text">
                      {buyer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {buyer.company} · {buyer.location}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {buyer.crops.map((crop) => (
                        <Badge
                          key={crop}
                          variant="secondary"
                          className="rounded-full text-xs"
                        >
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={() => onNavigate("buyers")}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                data-ocid="buyers.primary_button"
              >
                View All Buyers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <ProfileSetupModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
