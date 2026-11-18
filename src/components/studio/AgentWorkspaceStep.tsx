'use client';

import React, { useState } from 'react';
import { Terminal, Send, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BuildLogEntry, ChatMessage } from '@/types/blueprint';

interface AgentWorkspaceStepProps {
  buildLogs: BuildLogEntry[];
  isBuilding: boolean;
  chatHistory: ChatMessage[];
  onSendCommand: (prompt: string) => void;
  onEditBlueprint: () => void;
}

const QUICK_COMMANDS = [
  'Change primary color to emerald green',
  'Add a 20% annual discount toggle',
  'Add WhatsApp direct order button',
];

export function AgentWorkspaceStep({
  buildLogs,
  isBuilding,
  chatHistory,
  onSendCommand,
  onEditBlueprint,
}: AgentWorkspaceStepProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendCommand(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            Agentic Sandbox Pipeline
          </span>
          <button onClick={onEditBlueprint} className="text-[11px] text-slate-400 hover:text-white">
            Blueprint
          </button>
        </div>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {buildLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-[11px]">
              {log.status === 'running' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0 mt-0.5" />
              ) : log.status === 'error' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    log.status === 'healed' ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                />
              )}
              <div>
                <span className="font-semibold text-slate-300">[{log.agent}] </span>
                <span className="text-slate-400">{log.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Iterative Builder Copilot
          </span>
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white ml-6'
                  : 'bg-slate-800/90 text-slate-200 mr-4 border border-slate-700'
              }`}
            >
              {msg.role === 'agent' && (
                <span className="text-[10px] font-bold text-indigo-400 block mb-1">Builder Agent</span>
              )}
              {msg.text}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => onSendCommand(cmd)}
                className="text-[10px] px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                + {cmd}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isBuilding}
              placeholder="Ask Builder Agent to modify site..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
            />
            <button
              type="submit"
              disabled={isBuilding || !input.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
