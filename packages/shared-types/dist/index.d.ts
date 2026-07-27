import { z } from 'zod';
export declare enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare enum CampaignStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
    CLOSED = "CLOSED"
}
export declare enum DisasterType {
    FLOOD = "FLOOD",
    EARTHQUAKE = "EARTHQUAKE",
    CYCLONE = "CYCLONE",
    WILDFIRE = "WILDFIRE",
    TSUNAMI = "TSUNAMI",
    LANDSLIDE = "LANDSLIDE",
    PANDEMIC = "PANDEMIC",
    DROUGHT = "DROUGHT",
    VOLCANO = "VOLCANO",
    HURRICANE = "HURRICANE",
    TORNADO = "TORNADO",
    OTHER = "OTHER"
}
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    username?: string | undefined;
}, {
    email: string;
    password: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    username?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const CampaignCreateSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    shortDescription: z.ZodOptional<z.ZodString>;
    disasterType: z.ZodNativeEnum<typeof DisasterType>;
    country: z.ZodString;
    state: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    bannerImage: z.ZodOptional<z.ZodString>;
    goalAmount: z.ZodNumber;
    beneficiaryWallet: z.ZodString;
    expiryDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    aiCategory: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    disasterType: DisasterType;
    country: string;
    goalAmount: number;
    beneficiaryWallet: string;
    expiryDate: string | Date;
    shortDescription?: string | undefined;
    state?: string | undefined;
    city?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    bannerImage?: string | undefined;
    aiCategory?: string | undefined;
    priority?: number | undefined;
}, {
    name: string;
    description: string;
    disasterType: DisasterType;
    country: string;
    goalAmount: number;
    beneficiaryWallet: string;
    expiryDate: string | Date;
    shortDescription?: string | undefined;
    state?: string | undefined;
    city?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    bannerImage?: string | undefined;
    aiCategory?: string | undefined;
    priority?: number | undefined;
}>;
export declare const DonationInitiateSchema: z.ZodObject<{
    campaignId: z.ZodString;
    amount: z.ZodNumber;
    donorWallet: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    campaignId: string;
    amount: number;
    donorWallet: string;
    message?: string | undefined;
    isAnonymous?: boolean | undefined;
}, {
    campaignId: string;
    amount: number;
    donorWallet: string;
    message?: string | undefined;
    isAnonymous?: boolean | undefined;
}>;
export declare const DonationVerifySchema: z.ZodObject<{
    donationId: z.ZodString;
    algorandTxId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    donationId: string;
    algorandTxId: string;
}, {
    donationId: string;
    algorandTxId: string;
}>;
