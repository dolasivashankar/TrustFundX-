"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const database_1 = __importDefault(require("@trustfundx/database"));
const logger_1 = require("../utils/logger");
const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        throw new Error('GEMINI_API_KEY not configured');
    return new generative_ai_1.GoogleGenerativeAI(apiKey);
};
const getModel = (client) => {
    return client.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
};
exports.aiService = {
    async analyzeAndVerifyCampaign(campaignId) {
        const campaign = await database_1.default.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign)
            throw new Error('Campaign not found');
        logger_1.logger.info(`AI analyzing campaign: ${campaign.name}`);
        let verificationStatus = 'VERIFIED';
        let riskScore = 5.0;
        let urgencyScore = 5.0;
        let duplicateFlag = false;
        let fraudFlag = false;
        let summary = '';
        let textAnalysis = '';
        let confidence = 0.8;
        let flags = [];
        let recommendations = [];
        let estimatedFunding = campaign.goalAmount;
        try {
            const client = getAiClient();
            const model = getModel(client);
            // Check for duplicates
            const existingCampaigns = await database_1.default.campaign.findMany({
                where: { id: { not: campaignId }, isPublished: true },
                select: { id: true, name: true, description: true, disasterType: true, country: true },
            });
            const duplicateCheckPrompt = `
You are an AI fraud and duplicate detection system for a disaster relief platform.
Analyze the following campaign and existing campaigns to detect duplicates or fraud.

NEW CAMPAIGN:
Name: ${campaign.name}
Description: ${campaign.description}
Disaster Type: ${campaign.disasterType}
Country: ${campaign.country}
Goal Amount: ${campaign.goalAmount} ALGO

EXISTING CAMPAIGNS:
${existingCampaigns.map(c => `- ${c.name} (${c.disasterType}, ${c.country}): ${c.description.slice(0, 100)}...`).join('\n')}

Respond in JSON format:
{
  "isDuplicate": boolean,
  "isFraudulent": boolean,
  "riskScore": number (0-10, 10=highest risk),
  "urgencyScore": number (0-10, 10=most urgent),
  "verificationStatus": "VERIFIED" | "FLAGGED" | "REJECTED" | "REVIEW_REQUIRED",
  "confidence": number (0-1),
  "flags": string[],
  "recommendations": string[],
  "summary": string (2-3 sentences for public display),
  "textAnalysis": string (detailed analysis for admin),
  "estimatedFunding": number (realistic funding estimate in USD)
}
`;
            const result = await model.generateContent(duplicateCheckPrompt);
            const responseText = result.response.text();
            // Extract JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                duplicateFlag = parsed.isDuplicate || false;
                fraudFlag = parsed.isFraudulent || false;
                riskScore = parsed.riskScore || 5.0;
                urgencyScore = parsed.urgencyScore || 5.0;
                verificationStatus = parsed.verificationStatus || 'VERIFIED';
                confidence = parsed.confidence || 0.8;
                flags = parsed.flags || [];
                recommendations = parsed.recommendations || [];
                summary = parsed.summary || '';
                textAnalysis = parsed.textAnalysis || '';
                estimatedFunding = parsed.estimatedFunding || campaign.goalAmount;
            }
        }
        catch (aiError) {
            logger_1.logger.error('AI analysis failed, using defaults:', aiError);
            // Provide intelligent defaults based on disaster type
            const urgencyMap = {
                EARTHQUAKE: 9.5, TSUNAMI: 9.8, CYCLONE: 8.5, FLOOD: 8.0,
                WILDFIRE: 7.5, PANDEMIC: 8.8, LANDSLIDE: 7.0, DROUGHT: 6.0,
                VOLCANO: 9.0, HURRICANE: 9.0, TORNADO: 8.0, OTHER: 5.0,
            };
            urgencyScore = urgencyMap[campaign.disasterType] || 5.0;
            riskScore = 3.0; // Default low risk
            verificationStatus = 'REVIEW_REQUIRED';
            summary = `This campaign addresses a ${campaign.disasterType.toLowerCase()} disaster in ${campaign.country}. Manual review recommended.`;
            flags = ['AI_ANALYSIS_UNAVAILABLE'];
        }
        // Save AI analysis
        const analysis = await database_1.default.aiAnalysis.create({
            data: {
                campaignId,
                verificationStatus,
                riskScore,
                urgencyScore,
                estimatedFunding,
                duplicateFlag,
                fraudFlag,
                summary,
                textAnalysis,
                flags,
                recommendations,
                confidence,
                modelUsed: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
            },
        });
        // Update campaign AI fields
        await database_1.default.campaign.update({
            where: { id: campaignId },
            data: {
                aiVerified: verificationStatus === 'VERIFIED',
                aiVerificationStatus: verificationStatus,
                aiRiskScore: riskScore,
                aiUrgencyScore: urgencyScore,
                aiEstimatedFunding: estimatedFunding,
                aiSummary: summary,
                aiFlags: flags,
            },
        });
        // Create AI alert if high risk
        if (riskScore >= 7 || fraudFlag || duplicateFlag) {
            await database_1.default.aiAlert.create({
                data: {
                    campaignId,
                    severity: riskScore >= 9 || fraudFlag ? 'CRITICAL' : riskScore >= 7 ? 'HIGH' : 'MEDIUM',
                    type: fraudFlag ? 'FRAUD_DETECTED' : duplicateFlag ? 'DUPLICATE_DETECTED' : 'HIGH_RISK',
                    title: fraudFlag ? '⚠️ Potential Fraud Detected' : duplicateFlag ? '🔄 Duplicate Campaign Detected' : '⚠️ High Risk Campaign',
                    description: `Campaign "${campaign.name}" flagged: Risk Score ${riskScore}/10. ${flags.join(', ')}`,
                    metadata: { campaignId, riskScore, flags, analysis },
                },
            });
        }
        logger_1.logger.info(`AI analysis complete for campaign ${campaignId}: ${verificationStatus}, risk: ${riskScore}`);
        return analysis;
    },
    async generateCampaignSummary(campaignId) {
        const campaign = await database_1.default.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign)
            throw new Error('Campaign not found');
        try {
            const client = getAiClient();
            const model = getModel(client);
            const result = await model.generateContent(`Write a compelling 2-3 sentence public summary for this disaster relief campaign:\n\nName: ${campaign.name}\nDisaster: ${campaign.disasterType}\nLocation: ${campaign.city || ''} ${campaign.state || ''} ${campaign.country}\nDescription: ${campaign.description.slice(0, 500)}\n\nMake it emotional yet factual, suitable for donors.`);
            return result.response.text();
        }
        catch (err) {
            logger_1.logger.error('Summary generation failed:', err);
            return campaign.shortDescription || campaign.description.slice(0, 200);
        }
    },
    async analyzeImage(imageUrl, context) {
        try {
            const client = getAiClient();
            // Use text model with URL reference since direct image fetching requires multimodal input
            const model = getModel(client);
            const result = await model.generateContent(`Analyze this disaster image URL for authenticity. Context: ${context}. Image URL: ${imageUrl}. Describe what type of disaster evidence would be expected and whether the description matches. Provide a brief analysis.`);
            return result.response.text();
        }
        catch (err) {
            logger_1.logger.error('Image analysis failed:', err);
            return 'Image analysis unavailable';
        }
    },
};
//# sourceMappingURL=ai.service.js.map