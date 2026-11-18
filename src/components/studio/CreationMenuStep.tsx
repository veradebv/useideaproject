'use client';

import React from 'react';
import { Layers, Bot, Wand2, RefreshCw } from 'lucide-react';
import { BUSINESS_MODELS } from '@/constants/presets';
import { BusinessModelId } from '@/types/blueprint';

interface CreationMenuStepProps {
  selectedModel: BusinessModelId;
  onSelectModel: (id: BusinessModelId, defaultColor: string, sampleIdea: string) => void;
  ideaPrompt: string;
  setIdeaPrompt: (val: string) => void;
  brandColor: string;
  setBrandColor: (hex: string) => void;
  enableEmbeddedAgent: boolean;
  setEnableEmbeddedAgent: (val: boolean) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const SWATCHES = ['#2563EB', '#D97706', '#059669', '#7C3AED', '#E11D48', '#0F172A'];

export function CreationMenuStep({
  selectedModel,
  onSelectModel,
  ideaPrompt,
  setIdeaPrompt,
  brandColor,
  setBrandColor,
  enableEmbeddedAgent,
  setEnableEmbeddedAgent,
  isGenerating,
  onGenerate,
}: CreationMenuStepProps) {
  const handleHexChange = (raw: string) => {
    const cleaned = raw.replace(/[^#0-9A-Fa-f]/g, '').slice(0, 7);
    const normalized = cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
    setBrandColor(normalized.toUpperCase());
  };

  const isValidHex = /^#[0-9A-F]{6}$/i.test(brandColor) || /^#[0-9A-F]{3}$/i.test(brandColor);

  return (
    <div className="p-5 space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
          Step 1 • Venture Intake
        </span>
        <h2 className="text-lg font-bold text-white mt-0.5">Choose a Business Model</h2>
        <p className="text-xs text-slate-400 mt-1">
          Our Strategist Agent structures pages, pricing, and interactive widgets around your revenue model.
        </p>
      </div>

      <div className="space-y-2.5">
        {BUSINESS_MODELS.map((model) => {
          const active = selectedModel === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onSelectModel(model.id, model.defaultColor, model.sampleIdea)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                active
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Layers className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="text-sm font-semibold text-white">{model.name}</span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {model.tag}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{model.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200">Describe Your Business Idea</label>
          <button
            onClick={() => {
              const current = BUSINESS_MODELS.find((m) => m.id === selectedModel);
              if (current) setIdeaPrompt(current.sampleIdea);
            }}
            className="text-[11px] text-indigo-400 hover:text-indigo-300"
          >
            Reset sample
          </button>
        </div>
        <textarea
          rows={3}
          value={ideaPrompt}
          onChange={(e) => setIdeaPrompt(e.target.value)}
          className="w-full rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none p-3 text-xs text-slate-100 leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <span className="text-[11px] font-medium text-slate-400 block">Primary Brand Color</span>
          <div className="flex items-center gap-1.5">
            {SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setBrandColor(hex)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  brandColor.toUpperCase() === hex.toUpperCase()
                    ? 'scale-110 ring-2 ring-white'
                    : 'opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 focus-within:border-indigo-500 rounded-lg px-2 py-1">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-700"
              style={{ backgroundColor: isValidHex ? brandColor : '#2563EB' }}
            />
            <input
              type="text"
              value={brandColor}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#059669"
              maxLength={7}
              className="w-full bg-transparent text-[11px] font-mono text-white uppercase focus:outline-none"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              Site AI Agent
            </span>
            <input
              type="checkbox"
              checked={enableEmbeddedAgent}
              onChange={(e) => setEnableEmbeddedAgent(e.target.checked)}
              className="accent-indigo-500 w-4 h-4 cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1">
            Embeds a trained sales/support bot on your generated site.
          </span>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !ideaPrompt.trim() || !isValidHex}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Strategist Agent Analyzing Model...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            Generate Business Blueprint
          </>
        )}
      </button>
    </div>
  );
}
