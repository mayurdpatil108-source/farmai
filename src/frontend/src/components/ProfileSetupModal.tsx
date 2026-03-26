import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileSetupModal({
  open,
  onClose,
}: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [cropsInput, setCropsInput] = useState("");
  const [email, setEmail] = useState("");
  const saveProfile = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !farmName) return;
    try {
      await saveProfile.mutateAsync({
        name,
        farmName,
        location,
        crops: cropsInput
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        contactEmail: email,
      });
      toast.success("Profile saved successfully!");
      onClose();
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="profile.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Set Up Your Farm Profile
          </DialogTitle>
          <DialogDescription>
            Tell us about your farm to get personalized recommendations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              data-ocid="profile.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="farmName">Farm Name</Label>
            <Input
              id="farmName"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Green Valley Farm"
              required
              data-ocid="profile.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="California, USA"
              data-ocid="profile.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="crops">Main Crops (comma-separated)</Label>
            <Input
              id="crops"
              value={cropsInput}
              onChange={(e) => setCropsInput(e.target.value)}
              placeholder="Wheat, Corn, Tomatoes"
              data-ocid="profile.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@farm.com"
              data-ocid="profile.input"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full"
              data-ocid="profile.cancel_button"
            >
              Skip for now
            </Button>
            <Button
              type="submit"
              disabled={saveProfile.isPending}
              className="flex-1 rounded-full bg-primary text-primary-foreground"
              data-ocid="profile.submit_button"
            >
              {saveProfile.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
