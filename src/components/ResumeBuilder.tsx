"use client";

import React, { useState } from 'react';
import {
    User,
    Briefcase,
    GraduationCap,
    Code2,
    Sparkles,
    Download,
    ChevronRight,
    ChevronLeft,
    Search,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { rewriteBulletPoint, analyzeJDMatch } from '@/lib/ai';

export default function ResumeBuilder() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        personal: { name: '', email: '', portfolio: '' },
        experience: [{ company: '', role: '', description: '' }],
        skills: '',
        jd: ''
    });
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [isRewriting, setIsRewriting] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;


    const handleExportPDF = () => {
        const doc = new jsPDF();
        const { personal, experience, skills } = formData;

        doc.setFont('serif');
        doc.setFontSize(22);
        doc.text(personal.name || 'CANDIDATE NAME', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`${personal.email} | ${personal.portfolio}`, 105, 30, { align: 'center' });

        doc.setDrawColor(139, 0, 0); // #8B0000
        doc.line(20, 35, 190, 35);

        let y = 45;
        doc.setFontSize(12);
        doc.setTextColor(139, 0, 0);
        doc.text('EXPERIENCE', 20, y);
        y += 10;

        doc.setTextColor(17, 17, 17);
        doc.setFontSize(10);
        experience.forEach(exp => {
            doc.setFont('serif', 'bold');
            doc.text(exp.company || 'CORPORATION', 20, y);
            doc.setFont('serif', 'normal');
            doc.text(exp.role || 'ROLE', 190, y, { align: 'right' });
            y += 5;
            const splitText = doc.splitTextToSize(exp.description || '', 170);
            doc.text(splitText, 20, y);
            y += (splitText.length * 5) + 5;
        });

        doc.setTextColor(139, 0, 0);
        doc.setFontSize(12);
        doc.text('CAPABILITIES', 20, y);
        y += 10;
        doc.setTextColor(17, 17, 17);
        doc.setFontSize(10);
        doc.text(skills || '', 20, y);

        doc.save(`${personal.name || 'Resume'}_B2B_Optimized.pdf`);
    };

    const handleRewrite = async (index: number) => {
        setIsRewriting(true);
        const currentBullet = formData.experience[index].description;
        const enhanced = await rewriteBulletPoint(currentBullet);
        const newExp = [...formData.experience];
        newExp[index].description = enhanced;
        setFormData({ ...formData, experience: newExp });
        setIsRewriting(false);
    };

    const handleAnalyze = async () => {
        const resumeText = `${formData.skills} ${formData.experience.map(e => e.description).join(' ')}`;
        const score = await analyzeJDMatch(resumeText, formData.jd);
        setMatchScore(score);
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="bg-background border-b border-muted py-8 px-6 sticky top-0 z-10">
                <div className="container-custom flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-accent p-2">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-serif">AI Resume Forge</h1>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`w-8 h-1 ${step >= s ? 'bg-accent' : 'bg-muted'}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleExportPDF}
                            className="btn-primary flex items-center gap-2 uppercase tracking-widest text-xs"
                        >
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>
            </header>

            <main className="container-custom mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Form Area */}
                <div className="lg:col-span-7 space-y-10">
                    {step === 1 && (
                        <div className="space-y-10">
                            <h2 className="text-4xl font-serif">Personal Intelligence</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputGroup label="Full Name" value={formData.personal.name} onChange={(v) => setFormData({ ...formData, personal: { ...formData.personal, name: v } })} />
                                <InputGroup label="Professional Email" value={formData.personal.email} onChange={(v) => setFormData({ ...formData, personal: { ...formData.personal, email: v } })} />
                                <div className="md:col-span-2">
                                    <InputGroup label="Portfolio / LinkedIn" value={formData.personal.portfolio} onChange={(v) => setFormData({ ...formData, personal: { ...formData.personal, portfolio: v } })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10">
                            <h2 className="text-4xl font-serif">Operational Experience</h2>
                            {formData.experience.map((exp, idx) => (
                                <div key={idx} className="border border-muted p-10 space-y-6 bg-white/30">
                                    <InputGroup label="Corporation" value={exp.company} onChange={(v) => {
                                        const newExp = [...formData.experience];
                                        newExp[idx].company = v;
                                        setFormData({ ...formData, experience: newExp });
                                    }} />
                                    <InputGroup label="Designation" value={exp.role} onChange={(v) => {
                                        const newExp = [...formData.experience];
                                        newExp[idx].role = v;
                                        setFormData({ ...formData, experience: newExp });
                                    }} />
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-bold opacity-60">Responsibilities & Metrics</label>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => {
                                                const newExp = [...formData.experience];
                                                newExp[idx].description = e.target.value;
                                                setFormData({ ...formData, experience: newExp });
                                            }}
                                            className="w-full bg-transparent border border-muted p-4 min-h-[150px] focus:outline-none focus:border-accent font-sans text-sm"
                                            placeholder="e.g. Optimized database queries..."
                                        />
                                        <button
                                            onClick={() => handleRewrite(idx)}
                                            disabled={isRewriting || !exp.description}
                                            className="mt-4 flex items-center gap-2 text-accent text-xs uppercase tracking-widest font-bold hover:underline"
                                        >
                                            <Sparkles size={14} /> {isRewriting ? 'Enhancing...' : 'AI Re-write for Impact'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10">
                            <h2 className="text-4xl font-serif">Core Competencies</h2>
                            <textarea
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                className="w-full bg-transparent border border-muted p-8 min-h-[200px] focus:outline-none focus:border-accent font-sans text-lg"
                                placeholder="React, TypeScript, AWS, Node.js..."
                            />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-10">
                            <h2 className="text-4xl font-serif">JD Optimization</h2>
                            <div className="bg-accent/5 border border-accent/20 p-10">
                                <label className="block text-[10px] uppercase tracking-[0.2em] mb-4 font-bold text-accent">Target Job Description</label>
                                <textarea
                                    value={formData.jd}
                                    onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
                                    className="w-full bg-transparent border border-muted p-6 min-h-[300px] focus:outline-none focus:border-accent font-sans text-sm mb-6"
                                    placeholder="Paste the job description here..."
                                />
                                <button
                                    onClick={handleAnalyze}
                                    className="btn-primary w-full py-4 flex justify-center items-center gap-3"
                                >
                                    <Search size={20} /> Analyze Match Percentage
                                </button>
                            </div>

                            {matchScore !== null && (
                                <div className="card text-center py-16">
                                    <div className="text-sm uppercase tracking-widest mb-2">ATS Readiness Score</div>
                                    <div className={`text-7xl font-serif mb-6 ${matchScore > 70 ? 'text-accent' : 'text-muted-foreground'}`}>
                                        {matchScore}%
                                    </div>
                                    <div className="flex justify-center gap-2 items-center text-sm font-sans">
                                        {matchScore > 70 ? (
                                            <span className="flex items-center gap-1 text-accent"><CheckCircle2 size={16} /> Optimized for ATS</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-muted-foreground"><AlertCircle size={16} /> Needs more keywords from JD</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Nav Controls */}
                    <div className="flex justify-between items-center pt-10 border-t border-muted">
                        <button
                            onClick={() => setStep(Math.max(1, step - 1))}
                            disabled={step === 1}
                            className="flex items-center gap-2 text-sm uppercase tracking-widest disabled:opacity-0"
                        >
                            <ChevronLeft size={18} /> Prev
                        </button>
                        <button
                            onClick={() => setStep(Math.min(4, step + 1))}
                            disabled={step === 4}
                            className="btn-primary flex items-center gap-2 uppercase tracking-[0.2em] px-10"
                        >
                            Next Phase <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Live Preview Side (Simplified ATS Template) */}
                <div className="lg:col-span-5 hidden lg:block">
                    <div className="sticky top-40 bg-white shadow-2xl p-16 min-h-[800px] border border-muted transform scale-90 origin-top">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-serif uppercase tracking-widest border-b-2 border-accent pb-4 mb-4">
                                {formData.personal.name || 'CANDIDATE NAME'}
                            </h3>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                {formData.personal.email} • {formData.personal.portfolio}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <div className="text-[10px] uppercase tracking-widest font-bold text-accent mb-2 border-b border-muted">Professional Summary</div>
                                <div className="text-xs text-muted-foreground leading-relaxed italic">
                                    High-performance engineer specializing in scalable systems and industrial-grade software architecture.
                                </div>
                            </section>

                            <section>
                                <div className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4 border-b border-muted">Experience</div>
                                {formData.experience.map((exp, idx) => (
                                    <div key={idx} className="mb-6">
                                        <div className="flex justify-between items-end mb-1">
                                            <div className="font-bold text-sm uppercase">{exp.company || 'CORPORATION'}</div>
                                            <div className="text-[9px] uppercase tracking-widest">{exp.role || 'ROLE'}</div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                                            {exp.description || 'Outline your achievements and core responsibilities here.'}
                                        </p>
                                    </div>
                                ))}
                            </section>

                            <section>
                                <div className="text-[10px] uppercase tracking-widest font-bold text-accent mb-2 border-b border-muted">Capabilities</div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-2 uppercase tracking-tighter">
                                    {formData.skills || 'Your skillset will appear here.'}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InputGroup({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-bold opacity-60">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent border border-muted p-4 focus:outline-none focus:border-accent font-sans text-sm transition-colors"
                placeholder={`Enter ${label.toLowerCase()}...`}
            />
        </div>
    );
}
