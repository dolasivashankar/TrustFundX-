import { z } from 'zod';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  CLOSED = 'CLOSED',
}

export enum DisasterType {
  FLOOD = 'FLOOD',
  EARTHQUAKE = 'EARTHQUAKE',
  CYCLONE = 'CYCLONE',
  WILDFIRE = 'WILDFIRE',
  TSUNAMI = 'TSUNAMI',
  LANDSLIDE = 'LANDSLIDE',
  PANDEMIC = 'PANDEMIC',
  DROUGHT = 'DROUGHT',
  VOLCANO = 'VOLCANO',
  HURRICANE = 'HURRICANE',
  TORNADO = 'TORNADO',
  OTHER = 'OTHER',
}

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const CampaignCreateSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  shortDescription: z.string().optional(),
  disasterType: z.nativeEnum(DisasterType),
  country: z.string().min(2, 'Country is required'),
  state: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bannerImage: z.string().url('Invalid image URL').optional(),
  goalAmount: z.number().positive('Goal amount must be positive'),
  beneficiaryWallet: z.string().min(58, 'Valid Algorand wallet address required'),
  expiryDate: z.string().or(z.date()),
  aiCategory: z.string().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

export const DonationInitiateSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID required'),
  amount: z.number().positive('Amount must be greater than 0'),
  donorWallet: z.string().min(58, 'Valid Algorand wallet address required'),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().optional(),
});

export const DonationVerifySchema = z.object({
  donationId: z.string().min(1, 'Donation ID required'),
  algorandTxId: z.string().min(50, 'Valid Algorand Transaction ID required'),
});
