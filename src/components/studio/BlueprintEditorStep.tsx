'use client';

import React from 'react';
import { Rocket } from 'lucide-react';
import { IdeaBlueprint } from '@/types/blueprint';

interface BlueprintEditorStepProps {
  blueprint: IdeaBlueprint;
  setBlueprint: React.Dispatch<React.SetStateAction<IdeaBlueprint | null>>;
  onBack: () => void;
  onApproveAndBuild: () => void;
}

export function BlueprintEditorStep({
  blueprint,
  setBlueprint,
  onBack,
  onApproveAndBuild,
}: BlueprintEditorStepProps) {
  return (
    <div className="p-5 space-y-5">
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
        <span className="text-[11px] font-semibold text-indigo-400 uppercase">Brand & Value Proposition</span>
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Venture Name</label>
          <input
            value={blueprint.projectName}
            onChange={(e) => setBlueprint({ ...blueprint, projectName: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
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
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
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
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
        <span className="text-[11px] font-semibold text-indigo-400 uppercase">Monetization & Pricing Tiers</span>
        {blueprint.pricingTiers.map((tier, idx) => (
          <div key={tier.id} className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
            <input
              value={tier.name}
              onChange={(e) => {
                const updated = [...blueprint.pricingTiers];
                updated[idx] = { ...tier, name: e.target.value };
                setBlueprint({ ...blueprint, pricingTiers: updated });
              }}
              className="w-1/2 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
            />
            <input
              value={tier.price}
              onChange={(e) => {
                const updated = [...blueprint.pricingTiers];
                updated[idx] = { ...tier, price: e.target.value };
                setBlueprint({ ...blueprint, pricingTiers: updated });
              }}
              className="w-1/2 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-400 font-semibold"
            />
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <span className="text-[11px] font-semibold text-indigo-400 uppercase">Generated Modules</span>
        {blueprint.sections.map((sec, idx) => (
          <label key={sec.id} className="flex items-center justify-between py-1 text-xs text-slate-300 cursor-pointer">
            <span>{sec.label}</span>
            <input
              type="checkbox"
              checked={sec.enabled}
              onChange={(e) => {
                const updated = [...blueprint.sections];
                updated[idx] = { ...sec, enabled: e.target.checked };
                setBlueprint({ ...blueprint, sections: updated });
              }}
              className="accent-indigo-500"
            />
          </label>
        ))}
      </div>

      <button
        onClick={onApproveAndBuild}
        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
      >
        <Rocket className="w-4 h-4" />
        Approve Blueprint & Launch Builder Agents
      </button>
    </div>
  );
}
