import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface DashboardData {
    farmerProfile?: FarmerProfile;
    messageCount: bigint;
    recentScans: Array<CropScan>;
}
export type BuyerId = bigint;
export interface CropScan {
    treatmentAdvice: string;
    diagnosis: string;
    timestamp: Time;
    cropType: string;
    image: ExternalBlob;
    farmer: Principal;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Buyer {
    id: BuyerId;
    cropsBought: Array<string>;
    name: string;
    company: string;
    contactEmail: string;
    location: string;
    contactPhone: string;
}
export interface FarmerProfile {
    farmName: string;
    name: string;
    crops: Array<string>;
    contactEmail: string;
    location: string;
}
export interface ContactMessage {
    farmerContactEmail: string;
    message: string;
    buyerId: BuyerId;
    timestamp: Time;
    farmer: Principal;
    farmerName: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface AiDiagnosis {
    treatmentAdvice: string;
    diagnosis: string;
    symptoms: string;
    cropType: string;
    confidence: bigint;
    preventionTips: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Add a new buyer (admin only)
     */
    addBuyer(name: string, company: string, location: string, cropsBought: Array<string>, contactEmail: string, contactPhone: string): Promise<void>;
    /**
     * / Analyze symptoms and return a diagnosis (simulated)
     */
    analyzeSymptoms(cropType: string, symptoms: string): Promise<AiDiagnosis>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    fetchExternalData(url: string): Promise<string>;
    /**
     * / Get all crop scans (admin only)
     */
    getAllCropScans(): Promise<Array<CropScan>>;
    /**
     * / Get all farmer profiles (admin only)
     */
    getAllFarmerProfiles(): Promise<Array<FarmerProfile>>;
    /**
     * / Get all messages (admin only)
     */
    getAllMessages(): Promise<Array<ContactMessage>>;
    /**
     * / Get all buyers (users only)
     */
    getBuyers(): Promise<Array<Buyer>>;
    /**
     * / Get your own farmer profile
     */
    getCallerUserProfile(): Promise<FarmerProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Get crop scans for a specific farmer
     */
    getCropScansForFarmer(farmer: Principal): Promise<Array<CropScan>>;
    /**
     * / Get recent activity for a farmer (profile, recent scans, message count)
     */
    getDashboardData(principal: Principal): Promise<DashboardData>;
    /**
     * / Get all messages for a specific farmer
     */
    getMessagesForFarmer(): Promise<Array<ContactMessage>>;
    /**
     * / Get another farmer's profile (by owner or admin)
     */
    getUserProfile(user: Principal): Promise<FarmerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Save a new crop scan record (requires token and profile)
     */
    recordCropScan(scan: CropScan): Promise<void>;
    /**
     * / Register or update a farmer profile (requires user role)
     */
    saveCallerUserProfile(profile: FarmerProfile): Promise<void>;
    /**
     * / Send a message to a buyer (requires profile)
     */
    sendContactMessage(buyerId: BuyerId, message: string): Promise<void>;
    storeExternalBlob(blob: ExternalBlob): Promise<ExternalBlob>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
