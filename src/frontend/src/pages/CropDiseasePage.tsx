import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Loader2,
  Scan,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { AiDiagnosis } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAnalyzeSymptoms, useRecordCropScan } from "../hooks/useQueries";

export default function CropDiseasePage() {
  const [cropType, setCropType] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<AiDiagnosis | null>(null);
  const { identity } = useInternetIdentity();
  const analyzeSymptoms = useAnalyzeSymptoms();
  const recordScan = useRecordCropScan();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropType || !symptoms) return;
    try {
      const diagnosis = await analyzeSymptoms.mutateAsync({
        cropType,
        symptoms,
      });
      setResult(diagnosis);

      // Save scan if logged in
      if (identity) {
        try {
          await recordScan.mutateAsync({
            cropType,
            diagnosis: diagnosis.diagnosis,
            treatmentAdvice: diagnosis.treatmentAdvice,
            timestamp: BigInt(Date.now()) * BigInt(1_000_000),
            image: ExternalBlob.fromURL(""),
            farmer: identity.getPrincipal(),
          });
        } catch {
          // Scan save is best-effort
        }
      }
    } catch {
      toast.error("Analysis failed. Please try again.");
    }
  };

  const confidencePct = result ? Number(result.confidence) : 0;

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <Badge className="mb-3 rounded-full px-3 py-1 text-xs bg-secondary text-farm-green">
              AI Disease Detection
            </Badge>
            <h1 className="font-display font-bold text-4xl text-farm-text mb-3">
              Crop Disease Detector
            </h1>
            <p className="text-muted-foreground">
              Describe your crop type and the symptoms you're observing. Our AI
              will diagnose and suggest treatments.
            </p>
          </div>

          <Card className="shadow-card border-0 mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Input
                    id="cropType"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="e.g. Tomato, Wheat, Corn..."
                    required
                    data-ocid="disease.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="symptoms">Describe the Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Yellow spots on leaves, wilting stems, dark patches on fruit..."
                    rows={4}
                    required
                    data-ocid="disease.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={analyzeSymptoms.isPending || !cropType || !symptoms}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3"
                  data-ocid="disease.submit_button"
                >
                  {analyzeSymptoms.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" /> Analyze Symptoms
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {analyzeSymptoms.isPending && (
            <div
              className="text-center py-12"
              data-ocid="disease.loading_state"
            >
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary mb-3" />
              <p className="text-muted-foreground">
                AI is analyzing your crop symptoms...
              </p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
                data-ocid="disease.success_state"
              >
                <h2 className="font-display font-bold text-2xl text-farm-text">
                  Analysis Results
                </h2>

                {/* Diagnosis */}
                <Card
                  className="border-0 shadow-card"
                  style={{ borderLeft: "4px solid oklch(0.49 0.13 155)" }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-farm-text text-lg">
                      {result.diagnosis}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.symptoms}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Confidence:
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${confidencePct}%`,
                            background:
                              confidencePct > 70
                                ? "oklch(0.49 0.13 155)"
                                : "oklch(0.7 0.15 60)",
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-farm-green">
                        {confidencePct}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Treatment */}
                <Card className="border-0 shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="w-5 h-5 text-farm-green" />
                      Treatment Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-farm-text">{result.treatmentAdvice}</p>
                  </CardContent>
                </Card>

                {/* Prevention */}
                <Card className="border-0 shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                      Prevention Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-farm-text">{result.preventionTips}</p>
                  </CardContent>
                </Card>

                {/* Lightbulb */}
                <Card
                  className="border-0 shadow-card"
                  style={{ background: "oklch(0.95 0.02 155)" }}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      For best results, consult with a local agricultural
                      extension officer and consider soil testing alongside this
                      AI diagnosis.
                    </p>
                  </CardContent>
                </Card>

                <Button
                  onClick={() => {
                    setResult(null);
                    setCropType("");
                    setSymptoms("");
                  }}
                  variant="outline"
                  className="w-full rounded-full"
                  data-ocid="disease.secondary_button"
                >
                  Scan Another Crop
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
