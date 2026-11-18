'use client';

import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { IdeaBlueprint } from '@/types/blueprint';

export function EmbeddedChatWidget({ blueprint }: { blueprint: IdeaBlueprint }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'bot' | 'visitor'; text: string }[]>([
    { from: 'bot', text: blueprint.embeddedAgentConfig.greeting },
  ]);

  if (!blueprint.embeddedAgentConfig.enabled) return null;

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      { from: 'visitor', text: q },
      {
        from: 'bot',
        text: `Based on ${blueprint.projectName}'s plans (${blueprint.pricingTiers
          .map((t) => `${t.name}: ${t.price}`)
          .join(', ')}), ${blueprint.embeddedAgentConfig.knowledgeSummary}`,
      },
    ]);
  };

  return (
    <div className="sticky bottom-4 float-right mr-4 z-30">
      {open ? (
        <div className="w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
          <div
            className="px-3.5 py-2.5 text-white flex items-center justify-between"
            style={{ backgroundColor: blueprint.brand.primaryHex }}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span className="text-xs font-bold">{blueprint.embeddedAgentConfig.agentName}</span>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4 opacity-80 hover:opacity-100" />
            </button>
          </div>
          <div className="p-3 h-48 overflow-y-auto space-y-2 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl max-w-[85%] ${
                  m.from === 'bot' ? 'bg-white border border-slate-200 text-slate-700' : 'ml-auto text-white'
                }`}
                style={m.from === 'visitor' ? { backgroundColor: blueprint.brand.primaryHex } : {}}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleAsk} className="p-2 border-t border-slate-200 flex gap-1.5 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pricing or plans..."
              className="flex-1 text-xs px-2.5 py-1.5 bg-slate-100 rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg text-white"
              style={{ backgroundColor: blueprint.brand.primaryHex }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold shadow-xl hover:scale-105 transition"
          style={{ backgroundColor: blueprint.brand.primaryHex }}
        >
          <Bot className="w-4 h-4" />
          Ask {blueprint.embeddedAgentConfig.agentName}
        </button>
      )}
    </div>
  );
}
