export async function rewriteBulletPoint(bullet: string): Promise<string> {
    // In a real app, this would call OpenAI
    // For this B2B demo, we'll use a rule-based enhancer if no API key is present

    const rules = [
        { regex: /helped/i, replacement: 'Spearheaded' },
        { regex: /worked on/i, replacement: 'Architected' },
        { regex: /did/i, replacement: 'Executed' },
        { regex: /made/i, replacement: 'Engineered' },
        { regex: /fixed/i, replacement: 'Optimized' },
    ];

    let enhanced = bullet;
    rules.forEach(rule => {
        enhanced = enhanced.replace(rule.regex, rule.replacement);
    });

    // simulate adding metrics
    if (!enhanced.includes('%') && !enhanced.includes('$')) {
        enhanced += ' leading to a 20% increase in operational efficiency.';
    }

    return enhanced;
}

export async function analyzeJDMatch(resumeText: string, jdText: string): Promise<number> {
    const resumeLower = resumeText.toLowerCase();
    const jdKeywords = jdText.toLowerCase().split(/\W+/).filter(w => w.length > 4);

    let matches = 0;
    const uniqueKeywords = Array.from(new Set(jdKeywords)).slice(0, 20);

    uniqueKeywords.forEach(kw => {
        if (resumeLower.includes(kw)) matches++;
    });

    if (uniqueKeywords.length === 0) return 0;
    return Math.round((matches / uniqueKeywords.length) * 100);
}
