import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Clock,
  Leaf,
  Mail,
  MapPin,
  Scan,
  Wheat,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetDashboard,
  useGetMyCropScans,
  useGetMyProfile,
} from "../hooks/useQueries";

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: dashboard, isLoading: dashboardLoading } = useGetDashboard();
  const { data: scans, isLoading: scansLoading } = useGetMyCropScans();

  if (!identity) {
    return (
      <div className="py-24 px-4 text-center">
        <Leaf className="w-12 h-12 mx-auto text-primary mb-4" />
        <h2 className="font-display font-bold text-2xl text-farm-text mb-2">
          Sign in to access your Dashboard
        </h2>
        <p className="text-muted-foreground">
          Please log in with your farmer account to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-farm-text mb-1">
              Farm Dashboard
            </h1>
            <p className="text-muted-foreground">
              {profile?.name
                ? `Welcome, ${profile.name}!`
                : "Welcome back, Farmer!"}
            </p>
          </div>

          {/* Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card
              className="shadow-card border-0 lg:col-span-1"
              data-ocid="dashboard.card"
            >
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Farm Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profileLoading ? (
                  <>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </>
                ) : profile ? (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Farm Name
                      </p>
                      <p className="font-semibold text-farm-text">
                        {profile.farmName || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {profile.location || "Location not set"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {profile.contactEmail || "Email not set"}
                    </div>
                    {profile.crops?.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Main Crops
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {profile.crops.map((crop) => (
                            <Badge
                              key={crop}
                              variant="secondary"
                              className="rounded-full text-xs"
                            >
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="text-center py-4"
                    data-ocid="dashboard.empty_state"
                  >
                    <p className="text-sm text-muted-foreground">
                      No profile set up yet.
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 rounded-full bg-primary text-primary-foreground"
                      onClick={() => onNavigate("home")}
                      data-ocid="dashboard.primary_button"
                    >
                      Set Up Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <Card className="shadow-card border-0" data-ocid="dashboard.card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.92 0.04 155)" }}
                    >
                      <Scan className="w-5 h-5 text-farm-green" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Total Scans
                    </span>
                  </div>
                  {scansLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-bold text-3xl text-farm-text">
                      {scans?.length ?? 0}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card border-0" data-ocid="dashboard.card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.92 0.04 155)" }}
                    >
                      <Mail className="w-5 h-5 text-farm-green" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Messages
                    </span>
                  </div>
                  {dashboardLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-bold text-3xl text-farm-text">
                      {Number(dashboard?.messageCount ?? 0)}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card border-0" data-ocid="dashboard.card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.92 0.04 155)" }}
                    >
                      <Wheat className="w-5 h-5 text-farm-green" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Crops Tracked
                    </span>
                  </div>
                  {profileLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-bold text-3xl text-farm-text">
                      {profile?.crops?.length ?? 0}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card border-0" data-ocid="dashboard.card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.92 0.04 155)" }}
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Active Issues
                    </span>
                  </div>
                  {scansLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="font-bold text-3xl text-farm-text">
                      {scans?.filter(
                        (s) => s.diagnosis && s.diagnosis !== "Healthy",
                      ).length ?? 0}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Scans */}
          <Card className="shadow-card border-0" data-ocid="dashboard.table">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Crop Scans
                </span>
                <Button
                  size="sm"
                  onClick={() => onNavigate("disease")}
                  className="rounded-full bg-primary text-primary-foreground text-xs"
                  data-ocid="dashboard.primary_button"
                >
                  New Scan
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scansLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : !scans || scans.length === 0 ? (
                <div
                  className="text-center py-8"
                  data-ocid="dashboard.empty_state"
                >
                  <Scan className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No scans yet. Start by scanning a crop.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scans.slice(0, 6).map((scan, i) => (
                    <div
                      key={scan.timestamp.toString()}
                      className="flex items-center gap-4 p-3 rounded-xl"
                      style={{ background: "oklch(0.97 0.01 155)" }}
                      data-ocid={`dashboard.item.${i + 1}`}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "oklch(0.92 0.04 155)" }}
                      >
                        <Wheat className="w-4 h-4 text-farm-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-farm-text">
                          {scan.cropType}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {scan.diagnosis}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(scan.timestamp)}
                        </p>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs mt-0.5"
                          style={{
                            background: scan.diagnosis
                              ?.toLowerCase()
                              .includes("healthy")
                              ? "oklch(0.92 0.04 155)"
                              : "oklch(0.95 0.10 60)",
                          }}
                        >
                          {scan.diagnosis?.toLowerCase().includes("healthy")
                            ? "Healthy"
                            : "Issue Found"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate("disease")}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-14"
              data-ocid="dashboard.primary_button"
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan New Crop
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("buyers")}
              className="rounded-full border-primary text-primary hover:bg-secondary font-semibold h-14"
              data-ocid="dashboard.secondary_button"
            >
              <Mail className="w-5 h-5 mr-2" />
              Browse Buyers Directory
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
