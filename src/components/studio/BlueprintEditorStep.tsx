'use client';

import React from 'react';
import { Rocket } from 'lucide-react';
import { IdeaBlueprint } from '@/types/blueprint';

interface BlueprintEditorStepProps {
  blueprint: IdeaBlueprint;
  setBlueprint: (bp: IdeaBlueprint) => void;
  onBack: () => void;
  onApproveAndBuild: () => void;
}

export function BlueprintEditorStep({
  blueprint,
  setBlueprint,
  onBack,
  onApproveAndBuild,
}: BlueprintEditorStepProps) {
  const updateTier = (idx: number, field: 'name' | 'price', val: string) => {
    const next = [...blueprint.pricingTiers];
    next[idx] = { ...next[idx], [field]: val };
    setBlueprint({ ...blueprint, pricingTiers: next });
  };

  const updateTierFeature = (tierIdx: number, featIdx: number, val: string) => {
    const next = [...blueprint.pricingTiers];
    const nextFeatures = [...next[tierIdx].features];
    nextFeatures[featIdx] = val;
    next[tierIdx] = { ...next[tierIdx], features: nextFeatures };
    setBlueprint({ ...blueprint, pricingTiers: next });
  };

  const toggleSection = (idx: number) => {
    const next = [...blueprint.sections];
    next[idx] = { ...next[idx], enabled: !next[idx].enabled };
    setBlueprint({ ...blueprint, sections: next });
  };

  return (
    <div className="p-5 pb-20 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Step 2 • Human-in-the-Loop Gate
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">Review Business Blueprint</h2>
        </div>
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-white underline">
          Edit Idea
        </button>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
          Brand & Value Proposition
        </div>
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Venture Name</label>
          <input
            value={blueprint.projectName}
            onChange={(e) => {
              const name = e.target.value;
              setBlueprint({
                ...blueprint,
                projectName: name,
                embeddedAgentConfig: {
                  ...blueprint.embeddedAgentConfig,
                  agentName: `${name} Concierge`,
                  greeting: `Hi! Welcome to ${name}. Ask me anything about our plans or how we can help!`,
                },
              });
            }}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Hero Headline</label>
          <textarea
            rows={2}
            value={blueprint.valueProposition.headline}
            onChange={(e) =>
              setBlueprint({
                ...blueprint,
                valueProposition: { ...blueprint.valueProposition, headline: e.target.value },
              })
            }
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Subheadline</label>
          <textarea
            rows={2}
            value={blueprint.valueProposition.subheadline}
            onChange={(e) =>
              setBlueprint({
                ...blueprint,
                valueProposition: { ...blueprint.valueProposition, subheadline: e.target.value },
              })
            }
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Primary CTA Button</label>
          <input
            value={blueprint.valueProposition.primaryCtaText}
            onChange={(e) =>
              setBlueprint({
                ...blueprint,
                valueProposition: { ...blueprint.valueProposition, primaryCtaText: e.target.value },
              })
            }
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
          Monetization & Pricing Tiers
        </div>
        {blueprint.pricingTiers.map((tier, idx) => (
          <div key={tier.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                value={tier.name}
                onChange={(e) => updateTier(idx, 'name', e.target.value)}
                className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white font-medium"
              />
              <input
                value={tier.price}
                onChange={(e) => updateTier(idx, 'price', e.target.value)}
                className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-emerald-400 font-semibold"
              />
            </div>
            <div className="space-y-1">
              {tier.features.map((feat, fIdx) => (
                <input
                  key={fIdx}
                  value={feat}
                  onChange={(e) => updateTierFeature(idx, fIdx, e.target.value)}
                  className="w-full rounded bg-slate-950 border border-slate-800/70 px-2 py-1 text-[11px] text-slate-300 focus:border-indigo-500 focus:outline-none"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
        <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
          Generated Modules
        </div>
        {blueprint.sections.map((sec, idx) => (
          <label
            key={sec.id}
            className="flex items-center justify-between text-xs text-slate-200 py-1 cursor-pointer"
          >
            <span>{sec.label}</span>
            <input
              type="checkbox"
              checked={sec.enabled}
              onChange={() => toggleSection(idx)}
              className="accent-indigo-500 w-4 h-4"
            />
          </label>
        ))}
      </div>

      <button
        onClick={onApproveAndBuild}
        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
      >
        <Rocket className="w-4 h-4" />
        Approve Blueprint & Launch Builder Agents
      </button>
    </div>
  );
}
