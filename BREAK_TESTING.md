# 🔨 BREAK TESTING & VERIFICATION GUIDE

## 🔎 Functional Verification Checklist
1. **AI Rewrite**: Enter a very short bullet point (e.g., "did it"). System should enhance it with metrics.
2. **JD Matching**: Paste a JD that has zero overlap with your skills. Match % should be low.
3. **PDF Export**: Fill 50% of the form and click "Export PDF". Check for layout consistency.
4. **Template Switch**: Ensure the 3 templates display data correctly (Layout stability).

## 🎨 UI Design Compliance
- Verification: `node verify-ui.js`
- Spacing Scale: Only `8/16/24/40/64` allowed.
- Typography: Serif for all H1/H2 elements.

## 🚀 Break Tests
- **Pasting Trash**: Paste 10,000 words of Lorem Ipsum into the experience description.
- **Malformed Personal Data**: Enter special characters (emoji, symbols) in the Name field.
- **Empty Steps**: Try to export a PDF with zero data entered.
- **Rapid Navigation**: Click "Prev" and "Next" repeatedly in the wizard.
