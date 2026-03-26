import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, MapPin, Phone, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Buyer } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetBuyers, useSendContactMessage } from "../hooks/useQueries";

const FALLBACK_BUYERS: Buyer[] = [
  {
    id: BigInt(1),
    name: "Marcus Thompson",
    company: "FreshHarvest Co.",
    location: "California, USA",
    cropsBought: ["Wheat", "Corn", "Barley"],
    contactEmail: "marcus@freshharvest.com",
    contactPhone: "+1 (555) 201-3847",
  },
  {
    id: BigInt(2),
    name: "Priya Patel",
    company: "AgriLink Markets",
    location: "Texas, USA",
    cropsBought: ["Tomatoes", "Peppers", "Onions"],
    contactEmail: "priya@agrilink.com",
    contactPhone: "+1 (555) 492-7163",
  },
  {
    id: BigInt(3),
    name: "James Okafor",
    company: "GreenTrade Export",
    location: "Iowa, USA",
    cropsBought: ["Soybeans", "Sunflower", "Canola"],
    contactEmail: "james@greentrade.com",
    contactPhone: "+1 (555) 738-9204",
  },
  {
    id: BigInt(4),
    name: "Sofia Mendez",
    company: "NaturaCrop Partners",
    location: "Florida, USA",
    cropsBought: ["Citrus", "Strawberries", "Avocado"],
    contactEmail: "sofia@naturacrop.com",
    contactPhone: "+1 (555) 614-5582",
  },
  {
    id: BigInt(5),
    name: "David Kim",
    company: "Pacific Grain Alliance",
    location: "Oregon, USA",
    cropsBought: ["Rice", "Wheat", "Oats"],
    contactEmail: "david@pacificgrain.com",
    contactPhone: "+1 (555) 387-1190",
  },
  {
    id: BigInt(6),
    name: "Amara Diallo",
    company: "GlobalHarvest Trading",
    location: "New York, USA",
    cropsBought: ["Legumes", "Millet", "Sorghum"],
    contactEmail: "amara@globalharvest.com",
    contactPhone: "+1 (555) 876-4431",
  },
];

export default function BuyersDirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [message, setMessage] = useState("");
  const { data: fetchedBuyers, isLoading } = useGetBuyers();
  const { identity } = useInternetIdentity();
  const sendMessage = useSendContactMessage();

  const buyers = fetchedBuyers?.length ? fetchedBuyers : FALLBACK_BUYERS;

  const filtered = buyers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.company.toLowerCase().includes(search.toLowerCase()) ||
      b.cropsBought.some((c) => c.toLowerCase().includes(search.toLowerCase())),
  );

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please log in to contact buyers.");
      return;
    }
    if (!selectedBuyer || !message) return;
    try {
      await sendMessage.mutateAsync({ buyerId: selectedBuyer.id, message });
      toast.success("Message sent successfully!");
      setSelectedBuyer(null);
      setMessage("");
    } catch {
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="py-12 px-4" style={{ background: "oklch(0.95 0.02 155)" }}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <Badge className="mb-3 rounded-full px-3 py-1 text-xs bg-secondary text-farm-green">
              Buyers Network
            </Badge>
            <h1 className="font-display font-bold text-4xl text-farm-text mb-3">
              Buyers Directory
            </h1>
            <p className="text-muted-foreground">
              Connect directly with trusted crop buyers across the country.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, or crop..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="buyers.search_input"
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12" data-ocid="buyers.loading_state">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
              <p className="text-muted-foreground">Loading buyers...</p>
            </div>
          )}

          {/* Buyers Grid */}
          {!isLoading && (
            <div>
              {filtered.length === 0 ? (
                <div
                  className="text-center py-12"
                  data-ocid="buyers.empty_state"
                >
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No buyers match your search.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((buyer, i) => (
                    <motion.div
                      key={buyer.id.toString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      data-ocid={`buyers.item.${i + 1}`}
                    >
                      <Card className="shadow-card border-0 hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-5">
                          <div className="mb-3">
                            <h3 className="font-semibold text-farm-text text-base">
                              {buyer.name}
                            </h3>
                            <p className="text-sm font-medium text-primary">
                              {buyer.company}
                            </p>
                          </div>
                          <div className="space-y-1 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              {buyer.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                {buyer.contactEmail}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                              {buyer.contactPhone}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {buyer.cropsBought.map((crop) => (
                              <Badge
                                key={crop}
                                variant="secondary"
                                className="rounded-full text-xs"
                              >
                                {crop}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedBuyer(buyer)}
                            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                            data-ocid="buyers.open_modal_button"
                          >
                            Contact Buyer
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Contact Modal */}
      <Dialog
        open={!!selectedBuyer}
        onOpenChange={(v) => !v && setSelectedBuyer(null)}
      >
        <DialogContent className="sm:max-w-md" data-ocid="buyers.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Contact {selectedBuyer?.name}
            </DialogTitle>
            <DialogDescription>
              Send a message to {selectedBuyer?.company}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContact} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="contactMessage">Your Message</Label>
              <Textarea
                id="contactMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and describe what crops you're selling..."
                rows={4}
                required
                data-ocid="buyers.textarea"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedBuyer(null)}
                className="flex-1 rounded-full"
                data-ocid="buyers.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sendMessage.isPending || !message}
                className="flex-1 rounded-full bg-primary text-primary-foreground"
                data-ocid="buyers.submit_button"
              >
                {sendMessage.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Send Message
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
