'use client';

import React from 'react';
import { Sparkles, ArrowRight, Monitor, Smartphone, Globe } from 'lucide-react';
import { IdeaBlueprint } from '@/types/blueprint';

interface StudioHeaderProps {
  step: 1 | 2 | 3;
  setStep: (step: 1 | 2 | 3) => void;
  blueprint: IdeaBlueprint | null;
  viewport: 'desktop' | 'mobile';
  setViewport: (v: 'desktop' | 'mobile') => void;
  onPublish: () => void;
}

export function StudioHeader({
  step,
  setStep,
  blueprint,
  viewport,
  setViewport,
  onPublish,
}: StudioHeaderProps) {
  const steps = [
    { num: 1 as const, label: '1. Business Model' },
    { num: 2 as const, label: '2. Blueprint Gate' },
    { num: 3 as const, label: '3. Agent Studio' },
  ];

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-white text-base">IdeaProject</span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
            useideaproject.com
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <button
              onClick={() => (s.num === 1 || blueprint) && setStep(s.num)}
              disabled={s.num > 1 && !blueprint}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                step === s.num
                  ? 'bg-indigo-600 text-white shadow'
                  : blueprint || s.num === 1
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              {s.label}
            </button>
            {idx < 2 && <ArrowRight className="w-3 h-3 text-slate-700" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {blueprint && (
          <>
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 mr-2">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-md ${
                  viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-md ${
                  viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={onPublish}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-lg shadow-emerald-600/20"
            >
              <Globe className="w-3.5 h-3.5" />
              Publish Site
            </button>
          </>
        )}
      </div>
    </header>
  );
}
