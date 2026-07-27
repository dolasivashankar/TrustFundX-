"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seed() {
    console.log('🌱 Seeding database...');
    // Create Admin User
    const passwordHash = await bcrypt_1.default.hash('TrustFundX@2026', 12);
    const admin = await client_1.default.user.upsert({
        where: { email: 'admin@trustfundx.com' },
        update: {},
        create: {
            email: 'admin@trustfundx.com',
            username: 'admin',
            passwordHash,
            firstName: 'TrustFundX',
            lastName: 'Admin',
            role: 'ADMIN',
            isEmailVerified: true,
        },
    });
    console.log('✅ Admin created:', admin.email);
    // Create Admin Settings
    await client_1.default.adminSettings.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            twoFactorEnabled: false,
            maintenanceMode: false,
            donationsEnabled: true,
            registrationEnabled: true,
        },
    });
    // Create sample campaigns
    const campaigns = [
        {
            name: 'Kerala Flood Relief 2026',
            slug: 'kerala-flood-relief-2026',
            description: 'Devastating floods have struck Kerala, displacing over 500,000 people. Immediate aid is needed for food, water, shelter, and medical care for affected families. Your donation directly helps survivors rebuild their lives.',
            shortDescription: 'Emergency flood relief for 500K+ displaced people in Kerala',
            disasterType: 'FLOOD',
            country: 'India',
            state: 'Kerala',
            city: 'Kochi',
            latitude: 9.9312,
            longitude: 76.2673,
            bannerImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200',
            galleryImages: [
                'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800',
            ],
            goalAmount: 500000,
            raisedAmount: 125000,
            donorsCount: 342,
            beneficiaryWallet: 'ALGO_WALLET_ADDRESS_REPLACE_WITH_REAL',
            status: 'ACTIVE',
            isPublished: true,
            isFeatured: true,
            priority: 1,
            aiVerified: true,
            aiVerificationStatus: 'VERIFIED',
            aiRiskScore: 8.5,
            aiUrgencyScore: 9.2,
            aiSummary: 'High-urgency verified disaster. Massive flooding affecting coastal regions with confirmed casualties.',
            expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            publishedAt: new Date(),
        },
        {
            name: 'Turkey Earthquake Response',
            slug: 'turkey-earthquake-response-2026',
            description: 'A magnitude 7.8 earthquake has devastated southeastern Turkey, causing widespread destruction of homes, infrastructure, and loss of life. Emergency response teams need immediate funding for search and rescue operations.',
            shortDescription: '7.8 magnitude earthquake emergency response in Turkey',
            disasterType: 'EARTHQUAKE',
            country: 'Turkey',
            state: 'Kahramanmaraş',
            city: 'Kahramanmaraş',
            latitude: 37.5858,
            longitude: 36.9372,
            bannerImage: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=1200',
            galleryImages: [],
            goalAmount: 1000000,
            raisedAmount: 430000,
            donorsCount: 1205,
            beneficiaryWallet: 'ALGO_WALLET_ADDRESS_REPLACE_WITH_REAL',
            status: 'ACTIVE',
            isPublished: true,
            isFeatured: true,
            priority: 2,
            aiVerified: true,
            aiVerificationStatus: 'VERIFIED',
            aiRiskScore: 9.8,
            aiUrgencyScore: 9.9,
            aiSummary: 'Critical earthquake disaster. Verified satellite imagery confirms widespread structural damage.',
            expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            publishedAt: new Date(),
        },
        {
            name: 'California Wildfire Aid',
            slug: 'california-wildfire-aid-2026',
            description: 'Uncontrolled wildfires are spreading rapidly across northern California, forcing thousands of families to evacuate their homes. Emergency funds are needed for temporary housing, food, clothing, and mental health support.',
            shortDescription: 'Wildfire evacuation relief for California families',
            disasterType: 'WILDFIRE',
            country: 'United States',
            state: 'California',
            city: 'Sacramento',
            latitude: 38.5816,
            longitude: -121.4944,
            bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200',
            galleryImages: [],
            goalAmount: 750000,
            raisedAmount: 89000,
            donorsCount: 276,
            beneficiaryWallet: 'ALGO_WALLET_ADDRESS_REPLACE_WITH_REAL',
            status: 'ACTIVE',
            isPublished: true,
            isFeatured: false,
            priority: 3,
            aiVerified: true,
            aiVerificationStatus: 'VERIFIED',
            aiRiskScore: 7.2,
            aiUrgencyScore: 8.1,
            aiSummary: 'Verified wildfire event. Satellite thermal imaging confirms active fire perimeter.',
            expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            publishedAt: new Date(),
        },
    ];
    for (const campaign of campaigns) {
        await client_1.default.campaign.upsert({
            where: { slug: campaign.slug },
            update: {},
            create: campaign,
        });
    }
    console.log('✅ Sample campaigns created');
    console.log('✅ Database seeded successfully!');
}
seed()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await client_1.default.$disconnect();
});
