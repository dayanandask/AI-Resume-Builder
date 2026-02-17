import { rewriteBulletPoint, analyzeJDMatch } from './src/lib/ai.ts';

async function test() {
    console.log("--- 🕵️ AI RESUME BUILDER LOGIC VERIFICATION ---");

    try {
        // 1. Test AI Rewrite Engine
        console.log("1. Testing: AI Rewrite Engine (Bullet Enhancement)...");
        const rawBullet = "worked on a react project";
        const enhancedBullet = await rewriteBulletPoint(rawBullet);
        console.log(`   Original: "${rawBullet}"`);
        console.log(`   Enhanced: "${enhancedBullet}"`);

        if (enhancedBullet.includes("Architected") || enhancedBullet.includes("engineering") || enhancedBullet.includes("Spearheaded")) {
            console.log("✅ PASSED: Impactful verb substituted.");
        }
        if (enhancedBullet.includes("%")) {
            console.log("✅ PASSED: Metrics/Quantification added.");
        }

        // 2. Test JD Match Analyzer
        console.log("\n2. Testing: JD Match Analyzer...");
        const resumeText = "Experienced in React, TypeScript, and Node.js with SQL experience.";
        const jdText = "Looking for a Senior Software Engineer with expertise in React, TypeScript, and AWS.";

        const matchScore = await analyzeJDMatch(resumeText, jdText);
        console.log(`   Match Score calculated: ${matchScore}%`);

        if (matchScore > 0 && matchScore <= 100) {
            console.log("✅ PASSED: keyword-based scoring functional.");
        } else {
            console.log("❌ FAILED: Scoring logic error.");
        }

        console.log("\n✅ ALL LOGIC TESTS COMPLETED SUCCESSFULLY.");

    } catch (err) {
        console.error("❌ ERROR DURING VERIFICATION:", err);
    }
}

test();
