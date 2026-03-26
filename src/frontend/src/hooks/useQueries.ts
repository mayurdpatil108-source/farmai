import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AiDiagnosis,
  Buyer,
  CropScan,
  DashboardData,
  FarmerProfile,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetBuyers() {
  const { actor, isFetching } = useActor();
  return useQuery<Buyer[]>({
    queryKey: ["buyers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBuyers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<FarmerProfile | null>({
    queryKey: ["myProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetDashboard() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<DashboardData | null>({
    queryKey: ["dashboard", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getDashboardData(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetMyCropScans() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<CropScan[]>({
    queryKey: ["myScans", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getCropScansForFarmer(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: FarmerProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAnalyzeSymptoms() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      cropType,
      symptoms,
    }: { cropType: string; symptoms: string }): Promise<AiDiagnosis> => {
      if (!actor) throw new Error("Not connected");
      return actor.analyzeSymptoms(cropType, symptoms);
    },
  });
}

export function useRecordCropScan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scan: CropScan) => {
      if (!actor) throw new Error("Not connected");
      await actor.recordCropScan(scan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myScans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useSendContactMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      buyerId,
      message,
    }: { buyerId: bigint; message: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.sendContactMessage(buyerId, message);
    },
  });
}
