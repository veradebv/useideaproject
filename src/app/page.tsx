'use client';

import React, { useState } from 'react';
import { BUSINESS_MODELS, createFallbackBlueprint } from '@/constants/presets';
import { BuildLogEntry, BusinessModelId, ChatMessage, IdeaBlueprint } from '@/types/blueprint';
import { StudioHeader } from '@/components/layout/StudioHeader';
import { CreationMenuStep } from '@/components/studio/CreationMenuStep';
import { BlueprintEditorStep } from '@/components/studio/BlueprintEditorStep';
import { AgentWorkspaceStep } from '@/components/studio/AgentWorkspaceStep';
import { LiveSitePreview } from '@/components/preview/LiveSitePreview';
import { PublishModal } from '@/components/studio/PublishModal';

export default function IdeaProjectStudioPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedModel, setSelectedModel] = useState<BusinessModelId>('ECOMMERCE_D2C');
  const [ideaPrompt, setIdeaPrompt] = useState(BUSINESS_MODELS[1].sampleIdea);
  const [brandColor, setBrandColor] = useState(BUSINESS_MODELS[1].defaultColor);
  const [enableEmbeddedAgent, setEnableEmbeddedAgent] = useState(true);

  const [blueprint, setBlueprint] = useState<IdeaBlueprint | null>(null);
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);
  const [isBuildingSite, setIsBuildingSite] = useState(false);
  const [buildLogs, setBuildLogs] = useState<BuildLogEntry[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [sandboxPreviewUrl, setSandboxPreviewUrl] = useState<string>('');
  const [sandboxId, setSandboxId] = useState<string | undefined>(undefined);

  const handleGenerateBlueprint = async () => {
    setIsGeneratingBlueprint(true);
    try {
      const res = await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessModel: selectedModel,
          ideaPrompt,
          primaryHex: brandColor,
          enableEmbeddedAgent,
        }),
      });
      const data = await res.json();
      setBlueprint(
        data.blueprint || createFallbackBlueprint(selectedModel, ideaPrompt, brandColor, enableEmbeddedAgent)
      );
      setStep(2);
    } catch {
      setBlueprint(createFallbackBlueprint(selectedModel, ideaPrompt, brandColor, enableEmbeddedAgent));
      setStep(2);
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  const runAgentBuildStream = async (activeBlueprint: IdeaBlueprint, instruction?: string) => {
    setIsBuildingSite(true);
    setBuildLogs([
      { id: `${Date.now()}-init`, agent: 'Architect', message: 'Connecting to agentic build pipeline...', status: 'running' },
    ]);

    try {
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint: activeBlueprint,
          userInstruction: instruction,
          sandboxId,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const payload = JSON.parse(line.replace('data: ', ''));
          setBuildLogs((prev) => [
            ...prev.filter((item) => item.status !== 'running'),
            {
              id: `${Date.now()}-${Math.random()}`,
              agent: payload.agent,
              message: payload.message,
              status: payload.status,
            },
          ]);
          if (payload.previewUrl) setSandboxPreviewUrl(payload.previewUrl);
          if (payload.sandboxId) setSandboxId(payload.sandboxId);
        }
      }
    } finally {
      setIsBuildingSite(false);
    }
  };

  const handleApproveAndBuild = async () => {
    if (!blueprint) return;
    setStep(3);
    await runAgentBuildStream(blueprint);
    setChatHistory([
      {
        role: 'agent',
        text: `Your ${blueprint.projectName} site is live! Ask me to tweak colors, pricing, or conversion widgets.`,
      },
    ]);
  };

  const handleAgentCommand = async (prompt: string) => {
    if (!blueprint) return;
    setChatHistory((prev) => [...prev, { role: 'user', text: prompt }]);
    const lower = prompt.toLowerCase();
    const updated: IdeaBlueprint = JSON.parse(JSON.stringify(blueprint));

    if (lower.includes('green') || lower.includes('emerald')) updated.brand.primaryHex = '#059669';
    if (lower.includes('annual') || lower.includes('discount')) updated.showAnnualToggle = true;
    if (lower.includes('whatsapp')) updated.showWhatsAppButton = true;

    setBlueprint(updated);
    await runAgentBuildStream(updated, prompt);
    setChatHistory((prev) => [
      ...prev,
      { role: 'agent', text: `Applied "${prompt}" and updated the preview.` },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <StudioHeader
        step={step}
        setStep={setStep}
        blueprint={blueprint}
        viewport={viewport}
        setViewport={setViewport}
        onPublish={() => setIsPublishOpen(true)}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-[440px] xl:w-[480px] bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto shrink-0">
          {step === 1 && (
            <CreationMenuStep
              selectedModel={selectedModel}
              onSelectModel={(id, color, sample) => {
                setSelectedModel(id);
                setBrandColor(color);
                setIdeaPrompt(sample);
              }}
              ideaPrompt={ideaPrompt}
              setIdeaPrompt={setIdeaPrompt}
              brandColor={brandColor}
              setBrandColor={setBrandColor}
              enableEmbeddedAgent={enableEmbeddedAgent}
              setEnableEmbeddedAgent={setEnableEmbeddedAgent}
              isGenerating={isGeneratingBlueprint}
              onGenerate={handleGenerateBlueprint}
            />
          )}

          {step === 2 && blueprint && (
            <BlueprintEditorStep
              blueprint={blueprint}
              setBlueprint={setBlueprint}
              onBack={() => setStep(1)}
              onApproveAndBuild={handleApproveAndBuild}
            />
          )}

          {step === 3 && (
            <AgentWorkspaceStep
              buildLogs={buildLogs}
              isBuilding={isBuildingSite}
              chatHistory={chatHistory}
              onSendCommand={handleAgentCommand}
              onEditBlueprint={() => setStep(2)}
            />
          )}
        </aside>

        <section className="flex-1 bg-slate-950 p-4 lg:p-6 overflow-y-auto">
          <LiveSitePreview
            blueprint={blueprint}
            viewport={viewport}
            isBuilding={isBuildingSite}
            sandboxPreviewUrl={sandboxPreviewUrl}
          />
        </section>
      </main>
          {blueprint && (
        <PublishModal
          isOpen={isPublishOpen}
          onClose={() => setIsPublishOpen(false)}
          blueprint={blueprint}
        />
      )}
</div>
  );
}
