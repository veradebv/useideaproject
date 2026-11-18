'use client';

import React, { useState } from 'react';
import { Lock, RefreshCw, Sparkles, CheckCircle2, Star } from 'lucide-react';
import { IdeaBlueprint } from '@/types/blueprint';
import { EmbeddedChatWidget } from './EmbeddedChatWidget';

interface LiveSitePreviewProps {
  blueprint: IdeaBlueprint | null;
  viewport: 'desktop' | 'mobile';
  isBuilding: boolean;
  sandboxPreviewUrl?: string;
}

export function LiveSitePreview({
  blueprint,
  viewport,
  isBuilding,
  sandboxPreviewUrl,
}: LiveSitePreviewProps) {
  const [annualBilling, setAnnualBilling] = useState(false);
  const [calcValue, setCalcValue] = useState(12);
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  if (!blueprint) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-base font-bold text-white">Your Generated Venture Appears Here</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Select a business model on the left and enter your idea. Our Strategist and Builder agents will generate a
          complete, conversion-ready website.
        </p>
      </div>
    );
  }

  const slug = blueprint.projectName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'venture';
  const isSectionEnabled = (type: string) =>
    blueprint.sections.find((s) => s.type === type)?.enabled ?? true;

  return (
    <div
      className={`mx-auto h-full flex flex-col bg-white rounded-xl shadow-2xl border border-slate-800 overflow-hidden transition-all duration-300 ${
        viewport === 'mobile' ? 'w-[390px]' : 'w-full max-w-5xl'
      }`}
    >
      <div className="h-9 bg-slate-100 border-b border-slate-200 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-3 py-0.5 text-[11px] text-slate-600">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>{sandboxPreviewUrl || `https://${slug}.useideaproject.com`}</span>
        </div>
        <div className="text-[10px] font-medium text-slate-400">
          {isBuilding ? 'Compiling...' : sandboxPreviewUrl ? 'E2B MicroVM' : 'Live Preview'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white text-slate-900 relative">
        {isBuilding && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm z-40 flex flex-col items-center justify-center text-white">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
            <p className="text-sm font-semibold">Builder Agents Compiling Application...</p>
          </div>
        )}

        {sandboxPreviewUrl ? (
          <iframe src={sandboxPreviewUrl} title={blueprint.projectName} className="w-full h-full border-0" />
        ) : (
          <>
            <nav className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: blueprint.brand.primaryHex }}
                >
                  {blueprint.projectName.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-bold text-sm tracking-tight">{blueprint.projectName}</span>
              </div>
              <button
                onClick={() => setSelectedPlanModal(blueprint.pricingTiers[1]?.name || 'Starter')}
                className="text-xs font-semibold text-white px-3.5 py-2 rounded-lg shadow-sm"
                style={{ backgroundColor: blueprint.brand.primaryHex }}
              >
                {blueprint.valueProposition.primaryCtaText}
              </button>
            </nav>

            {isSectionEnabled('HERO') && (
              <section className="px-6 py-12 text-center max-w-2xl mx-auto">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {blueprint.valueProposition.headline}
                </h1>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {blueprint.valueProposition.subheadline}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedPlanModal(blueprint.pricingTiers[1]?.name || 'Starter')}
                    className="px-5 py-3 rounded-xl text-white font-semibold text-xs shadow-lg"
                    style={{ backgroundColor: blueprint.brand.primaryHex }}
                  >
                    {blueprint.valueProposition.primaryCtaText}
                  </button>
                  {blueprint.showWhatsAppButton && (
                    <button
                      onClick={() => setSelectedPlanModal('WhatsApp Direct Concierge')}
                      className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-lg"
                    >
                      Order via WhatsApp
                    </button>
                  )}
                </div>
              </section>
            )}

            {isSectionEnabled('INTERACTIVE_CALCULATOR') && (
              <section className="px-6 py-8 bg-slate-50 border-y border-slate-100">
                <div className="max-w-xl mx-auto bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800">
                      {blueprint.businessModel === 'ECOMMERCE_D2C'
                        ? 'Monthly Cup & Savings Estimator'
                        : 'Monthly Cashflow Recovery Estimator'}
                    </span>
                    <span className="text-xs font-bold" style={{ color: blueprint.brand.primaryHex }}>
                      {calcValue} {blueprint.businessModel === 'ECOMMERCE_D2C' ? 'cups / week' : 'invoices / mo'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={calcValue}
                    onChange={(e) => setCalcValue(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </section>
            )}

            {isSectionEnabled('PRICING_TABLE') && (
              <section className="px-6 py-12 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900">Transparent Plans</h2>
                  {blueprint.showAnnualToggle && (
                    <button
                      onClick={() => setAnnualBilling(!annualBilling)}
                      className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700"
                    >
                      {annualBilling ? 'Annual Billing Active (20% Off)' : 'Switch to Annual (Save 20%)'}
                    </button>
                  )}
                </div>
                <div className={`grid gap-4 ${viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                  {blueprint.pricingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between ${
                        tier.highlighted ? 'border-2 shadow-lg' : 'border-slate-200'
                      }`}
                      style={tier.highlighted ? { borderColor: blueprint.brand.primaryHex } : {}}
                    >
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{tier.name}</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-slate-900">{tier.price}</span>
                          <span className="text-xs text-slate-500">{tier.cycle}</span>
                        </div>
                        <ul className="mt-4 space-y-2">
                          {tier.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2
                                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                style={{ color: blueprint.brand.primaryHex }}
                              />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => setSelectedPlanModal(tier.name)}
                        className="mt-6 w-full py-2 rounded-xl text-xs font-semibold"
                        style={
                          tier.highlighted
                            ? { backgroundColor: blueprint.brand.primaryHex, color: '#fff' }
                            : { backgroundColor: '#f1f5f9', color: '#0f172a' }
                        }
                      >
                        Select {tier.name}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isSectionEnabled('SOCIAL_PROOF') && (
              <section className="px-6 py-8 bg-slate-900 text-white text-center">
                <div className="flex justify-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  “Launched and validated our entire customer flow in days instead of months.”
                </p>
              </section>
            )}

            <EmbeddedChatWidget blueprint={blueprint} />

            {selectedPlanModal && (
              <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-900 shadow-2xl">
                  <h4 className="font-bold text-base">Conversion Flow Triggered</h4>
                  <p className="text-xs text-slate-600 mt-1.5">
                    Selected: <span className="font-semibold">{selectedPlanModal}</span> on{' '}
                    <span className="font-semibold">{blueprint.projectName}</span>.
                  </p>
                  <button
                    onClick={() => setSelectedPlanModal(null)}
                    className="mt-4 w-full py-2 rounded-xl text-white text-xs font-semibold"
                    style={{ backgroundColor: blueprint.brand.primaryHex }}
                  >
                    Close Preview Modal
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
