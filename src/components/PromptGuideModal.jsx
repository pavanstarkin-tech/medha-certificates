import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Layers, Lightbulb, Image as ImageIcon } from 'lucide-react';

export default function PromptGuideModal({ isOpen, onClose }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!isOpen) return null;

  const prompts = [
    {
      title: 'GGU MEDHA 2026 - 59th Engineers Day Official Background (Exact Match)',
      style: 'Official University Event / Tech Blueprint',
      prompt: 'Official technical event award certificate template background for MEDHA 2026 and 59th Engineers Day by Godavari Global University, clean white parchment paper, modern technological aesthetic with subtle translucent blue architectural bridge watermark and circuit engineering gear lines in background, golden corner brackets, top banner with red and orange MEDHA Engineers Day badge, completely empty blank fillable center area with blank underlines for recipient name and college, blank placeholder lines, 4 blank signature lines at the bottom with registrar and vice chancellor titles, ultra high resolution, crisp vector graphic style, landscape orientation --ar 16:9 --no text inside name lines',
      tips: 'Exact match for GGU MEDHA 2026 National Level Technical Event certificate.'
    },
    {
      title: 'Blank Certificate with Underlined Fillable Fields (General Purpose)',
      style: 'Universal Fillable Template',
      prompt: 'Blank professional certificate of achievement template, crisp white background, elegant geometric gold and navy blue corner accents, top university header area, clear printed text "Certificate of Achievement" and "This Certificate is proudly presented to", with wide empty horizontal dotted underline placeholders for "Ms./Mr. ___________", "studying at ___________", "for securing ________ Place in ________", clear empty space for custom text insertion, four signature lines at bottom, high resolution, 8k, landscape --ar 16:9',
      tips: 'Perfect if you want AI to generate the underline layout while leaving empty spaces for participant data.'
    },
    {
      title: 'Dark Luxury Gold & Navy Hackathon Frame',
      style: 'Modern Tech & Executive',
      prompt: 'Award certificate template for hackathon tech event, elegant modern luxury design, dark obsidian navy blue and royal gold geometric borders, abstract tech wave line art in the corners, blank clean parchment center with vast empty negative space, no text, no letters, no typography, completely empty placeholder area in middle for name and college details, gold foil ribbon seal in bottom corner, professional certificate borders, 8k resolution, crisp vector style, clean symmetrical layout, landscape orientation --ar 16:9 --no text, words, watermark, signature',
      tips: 'Best for prestigious prize winners, hackathons, and corporate tech challenges.'
    },
    {
      title: 'Cyber Emerald Green & Circuit Board Frame',
      style: 'Futuristic AI / Cyber / Code',
      prompt: 'Modern technological hackathon certificate template background, deep emerald green and dark teal with futuristic sleek circuit lines, gold and silver minimalist borders, perfectly blank clear off-white parchment center with ample empty space for text insertion, no text, no letters, no typography, ultra high quality, clean layout, landscape orientation --ar 16:9 --no text, words, watermark',
      tips: 'Best for cybersecurity, AI coding sprints, and robotics competitions.'
    }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 780 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>AI Certificate Generation Prompt Studio</h3>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', gap: '0.75rem' }}>
            <Lightbulb size={24} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              <strong>Prompting Tip for Perfect Empty Placeholders:</strong><br />
              To get empty blank underlines where student names and colleges can be cleanly injected from Excel, prompt the AI image model with terms like <code>"empty horizontal underline placeholders", "blank negative space for recipient name", "no pre-filled name text"</code>.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {prompts.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(0, 0, 0, 0.35)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Style: {item.style}</span>
                  </div>
                  <button 
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                    onClick={() => handleCopy(item.prompt, idx)}
                  >
                    {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedIdx === idx ? 'Copied Prompt!' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontFamily: 'monospace', color: '#cbd5e1', lineHeight: 1.45, border: '1px solid rgba(255,255,255,0.05)', userSelect: 'all' }}>
                  {item.prompt}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  💡 {item.tips}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
