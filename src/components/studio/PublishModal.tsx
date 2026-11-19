'use client';

import React, { useEffect, useState } from 'react';
import { Globe, ExternalLink, Copy, Check, Loader2, Download, X, KeyRound } from 'lucide-react';
import { IdeaBlueprint } from '@/types/blueprint';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: IdeaBlueprint;
}

export function PublishModal({ isOpen, onClose, blueprint }: PublishModalProps) {
  const [status, setStatus] = useState<'idle' | 'deploying' | 'live' | 'error'>('idle');
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [customToken, setCustomToken] = useState<string>('');
  const [exportedHtml, setExportedHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const triggerDeploy = async (tokenOverride?: string) => {
    setStatus('deploying');
    setErrorMsg('');
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint,
          customToken: tokenOverride ?? customToken,
        }),
      });
      const data = await res.json();
      if (data.html) setExportedHtml(data.html);

      if (!res.ok) {
        setErrorMsg(data.error || 'Deployment failed');
        setStatus('error');
        return;
      }

      setLiveUrl(data.url);
      setStatus('live');
    } catch {
      setErrorMsg('Network error while deploying site.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      triggerDeploy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    if (!exportedHtml) return;
    const blob = new Blob([exportedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blueprint.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'site'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Publish {blueprint.projectName}</h3>
              <p className="text-[11px] text-slate-400">Live Global Edge Deployment</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === 'deploying' && (
          <div className="py-8 flex flex-col items-center text-center space-y-3">
            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
            <div className="text-sm font-medium">Compiling & deploying live site...</div>
            <p className="text-xs text-slate-400">Provisioning SSL & edge CDN URL via Vercel API</p>
          </div>
        )}

        {status === 'live' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 space-y-2">
              <div className="text-xs font-semibold text-emerald-400">✓ Your site is live!</div>
              <div className="flex items-center justify-between gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-300 hover:underline truncate"
                >
                  {liveUrl}
                </a>
                <button onClick={copyUrl} className="text-slate-400 hover:text-white shrink-0">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Live Site
              </a>
              {exportedHtml && (
                <button
                  onClick={downloadHtml}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  HTML
                </button>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
              {errorMsg}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                Paste Free Vercel Token (from vercel.com/account/tokens)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={customToken}
                  onChange={(e) => setCustomToken(e.target.value)}
                  placeholder="vcp_..."
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={() => triggerDeploy(customToken)}
                  disabled={!customToken.trim()}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-semibold transition"
                >
                  Deploy
                </button>
              </div>
            </div>

            {exportedHtml && (
              <button
                onClick={downloadHtml}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Standalone Site (.html) Instead
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
