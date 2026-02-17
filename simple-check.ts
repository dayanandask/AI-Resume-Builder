import { rewriteBulletPoint, analyzeJDMatch } from './src/lib/ai.ts';

async function test() {
    console.log("--- 🕵️ AI RESUME BUILDER LOGIC VERIFICATION ---");

    try {
        const raw = "managed team";
        const res = await rewriteBulletPoint(raw);
        console.log(`✅ AI Rewrite: "${raw}" -> "${res}"`);

        const score = await analyzeJDMatch("react node", "react python");
        console.log(`✅ JD Match: Score ${score}%`);

        console.log("✅ ALL TESTS PASSED");
    } catch (e) {
        console.error("❌ TEST FAILED:", e);
        process.exit(1);
    }
}
test();
