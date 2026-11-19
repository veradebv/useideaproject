import { NextResponse } from 'next/server';
import { IdeaBlueprint } from '@/types/blueprint';

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

function buildStandaloneHtml(bp: IdeaBlueprint): string {
  const primary = bp.brand.primaryHex || '#2563EB';
  const name = escapeHtml(bp.projectName);
  const headline = escapeHtml(bp.valueProposition.headline);
  const subheadline = escapeHtml(bp.valueProposition.subheadline);
  const cta = escapeHtml(bp.valueProposition.primaryCtaText);
  const initials = name.slice(0, 2).toUpperCase() || 'IP';

  const enabledTypes = new Set(bp.sections.filter((s) => s.enabled).map((s) => s.type));

  const tiersHtml = bp.pricingTiers
    .map((tier) => {
      const features = tier.features
        .map(
          (f) =>
            `<li class="flex items-start gap-2 text-sm text-slate-600"><span style="color:${primary}" class="font-bold">✓</span><span>${escapeHtml(f)}</span></li>`
        )
        .join('');
      const borderClass = tier.highlighted
        ? `border-2 shadow-xl scale-[1.02]`
        : `border border-slate-200 shadow-sm`;
      const borderStyle = tier.highlighted ? `style="border-color:${primary}"` : '';
      const btnStyle = tier.highlighted
        ? `style="background-color:${primary};color:#fff"`
        : `class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition"`;

      return `
        <div class="bg-white rounded-2xl p-6 flex flex-col justify-between ${borderClass}" ${borderStyle}>
          <div>
            <div class="text-sm font-bold text-slate-900">${escapeHtml(tier.name)}</div>
            <div class="mt-3 flex items-baseline gap-1">
              <span class="text-3xl font-extrabold text-slate-900 tier-price" data-base="${escapeHtml(tier.price)}">${escapeHtml(tier.price)}</span>
              <span class="text-xs text-slate-500">${escapeHtml(tier.cycle || '/month')}</span>
            </div>
            <ul class="mt-5 space-y-2.5">${features}</ul>
          </div>
          <button onclick="openSignup('${escapeHtml(tier.name)}')" ${
        tier.highlighted
          ? `style="background-color:${primary}" class="mt-6 w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm shadow-md hover:opacity-90 transition"`
          : `class="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition"`
      }>
            Select ${escapeHtml(tier.name)}
          </button>
        </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} — ${headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
  <!-- Navbar -->
  <header class="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div style="background-color:${primary}" class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs">${initials}</div>
        <span class="font-bold text-slate-900 text-base">${name}</span>
      </div>
      <div class="flex items-center gap-3">
        ${
          bp.showWhatsAppButton
            ? `<a href="https://wa.me/?text=${encodeURIComponent(`Hi ${bp.projectName}! I'd like to learn more.`)}" target="_blank" class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition">WhatsApp Us</a>`
            : ''
        }
        <button onclick="openSignup('Starter')" style="background-color:${primary}" class="px-4 py-2 rounded-lg text-white text-xs font-semibold shadow hover:opacity-90 transition">
          ${cta}
        </button>
      </div>
    </div>
  </header>

  ${
    enabledTypes.has('HERO')
      ? `<section class="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">${headline}</h1>
          <p class="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">${subheadline}</p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onclick="openSignup('Pro')" style="background-color:${primary}" class="px-6 py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:opacity-90 transition">
              ${cta}
            </button>
          </div>
        </section>`
      : ''
  }

  ${
    enabledTypes.has('INTERACTIVE_CALCULATOR')
      ? `<section class="max-w-2xl mx-auto px-6 py-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div class="flex items-center justify-between text-sm font-semibold mb-3">
              <span>Monthly Volume & Savings Estimator</span>
              <span id="calc-label" style="color:${primary}">15 units / mo</span>
            </div>
            <input id="calc-slider" type="range" min="1" max="100" value="15" class="w-full cursor-pointer" style="accent-color:${primary}" oninput="updateCalc(this.value)" />
            <div class="mt-3 text-xs text-slate-500 flex justify-between">
              <span>Estimated monthly value unlocked:</span>
              <span id="calc-value" class="font-bold text-slate-900">$450 / mo</span>
            </div>
          </div>
        </section>`
      : ''
  }

  ${
    enabledTypes.has('PRICING_TABLE')
      ? `<section id="pricing" class="max-w-5xl mx-auto px-6 py-14">
          <div class="text-center mb-10">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Transparent Plans</h2>
            ${
              bp.showAnnualToggle
                ? `<button id="annual-btn" onclick="toggleAnnual()" class="mt-3 inline-flex items-center px-3.5 py-1.5 rounded-full bg-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition">
                    Switch to Annual (Save 20%)
                  </button>`
                : ''
            }
          </div>
          <div class="grid md:grid-cols-3 gap-6">${tiersHtml}</div>
        </section>`
      : ''
  }

  ${
    enabledTypes.has('SOCIAL_PROOF')
      ? `<footer class="bg-slate-900 text-white py-12 px-6 text-center mt-10">
          <div class="text-amber-400 text-sm tracking-widest mb-2">★★★★★</div>
          <p class="text-sm text-slate-300 max-w-xl mx-auto">"Launched and validated our entire customer flow with ${name} in days instead of months."</p>
          <p class="text-xs text-slate-500 mt-4">© ${new Date().getFullYear()}${name}. Built with IdeaProject.</p>
        </footer>`
      : ''
  }

  ${
    bp.embeddedAgentConfig?.enabled
      ? `<div class="fixed bottom-5 right-5 z-40">
          <div id="chat-box" class="hidden mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div style="background-color:${primary}" class="px-4 py-3 text-white font-semibold text-xs flex justify-between items-center">
              <span>${escapeHtml(bp.embeddedAgentConfig.agentName)}</span>
              <button onclick="toggleChat()" class="opacity-80 hover:opacity-100">✕</button>
            </div>
            <div id="chat-messages" class="p-3 h-52 overflow-y-auto space-y-2 text-xs bg-slate-50">
              <div class="bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700">${escapeHtml(bp.embeddedAgentConfig.greeting)}</div>
            </div>
            <form onsubmit="sendChat(event)" class="p-2 border-t border-slate-200 flex gap-1.5 bg-white">
              <input id="chat-input" placeholder="Ask about pricing or features..." class="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none" />
              <button type="submit" style="background-color:${primary}" class="px-3 py-1.5 rounded-lg text-white text-xs font-semibold">Send</button>
            </form>
          </div>
          <button onclick="toggleChat()" style="background-color:${primary}" class="ml-auto flex items-center gap-2 px-4 py-3 rounded-full text-white text-xs font-semibold shadow-xl hover:opacity-95 transition">
            💬 ${escapeHtml(bp.embeddedAgentConfig.agentName)}
          </button>
        </div>`
      : ''
  }

  <!-- Signup Modal -->
  <div id="signup-modal" class="hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-base text-slate-900">Get Started with ${name}</h3>
        <button onclick="closeSignup()" class="text-slate-400 hover:text-slate-700">✕</button>
      </div>
      <p id="signup-plan" class="text-xs text-slate-500 mb-4">Selected plan: Pro</p>
      <form onsubmit="submitLead(event)" class="space-y-3">
        <input required type="email" placeholder="you@company.com" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none" />
        <button type="submit" style="background-color:${primary}" class="w-full py-2.5 rounded-lg text-white text-xs font-semibold">Continue</button>
      </form>
      <p id="signup-success" class="hidden mt-3 text-xs text-emerald-600 font-semibold">✓ Request received! We'll reach out shortly.</p>
    </div>
  </div>

  <script>
    let annual = false;
    function updateCalc(v) {
      document.getElementById('calc-label').innerText = v + ' units / mo';
      document.getElementById('calc-value').innerText = '$' + (v * 30).toLocaleString() + ' / mo';
    }
    function toggleAnnual() {
      annual = !annual;
      document.getElementById('annual-btn').innerText = annual ? 'Annual Billing Active (20% Off)' : 'Switch to Annual (Save 20%)';
    }
    function openSignup(plan) {
      document.getElementById('signup-plan').innerText = 'Selected plan: ' + plan;
      document.getElementById('signup-success').classList.add('hidden');
      document.getElementById('signup-modal').classList.remove('hidden');
    }
    function closeSignup() {
      document.getElementById('signup-modal').classList.add('hidden');
    }
    function submitLead(e) {
      e.preventDefault();
      document.getElementById('signup-success').classList.remove('hidden');
    }
    function toggleChat() {
      document.getElementById('chat-box').classList.toggle('hidden');
    }
    function sendChat(e) {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const msg = input.value.trim();
      if (!msg) return;
      const box = document.getElementById('chat-messages');
      box.innerHTML += '<div class="bg-slate-900 text-white rounded-xl p-2.5 ml-6">' + msg.replace(/</g, '<') + '</div>';
      input.value = '';
      setTimeout(() => {
        box.innerHTML += '<div class="bg-white border border-slate-200 rounded-xl p-2.5 mr-4 text-slate-700">${escapeHtml(bp.embeddedAgentConfig?.knowledgeSummary || bp.valueProposition.subheadline)}</div>';
        box.scrollTop = box.scrollHeight;
      }, 400);
    }
  </script>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const { blueprint, customToken }: { blueprint: IdeaBlueprint; customToken?: string } = await req.json();

    if (!blueprint) {
      return NextResponse.json({ error: 'Missing blueprint' }, { status: 400 });
    }

    const html = buildStandaloneHtml(blueprint);
    const token = (customToken || process.env.VERCEL_TOKEN || '').trim().replace(/^["']|["']$/g, '');

    if (!token) {
      return NextResponse.json(
        {
          error: 'No VERCEL_TOKEN configured. Add VERCEL_TOKEN to .env.local or paste one below.',
          needsToken: true,
          html,
        },
        { status: 400 }
      );
    }

    const slug =
      blueprint.projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'ideaproject-site';

    const deployRes = await fetch('https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `ideaproject-${slug}`.slice(0, 52),
        files: [
          {
            file: 'index.html',
            data: html,
          },
        ],
        projectSettings: {
          framework: null,
        },
        target: 'production',
      }),
    });

    const data = await deployRes.json();

    if (!deployRes.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || 'Vercel deployment failed',
          html,
        },
        { status: deployRes.status }
      );
    }

    const liveUrl = data.url ? `https://${data.url}` : `https://${data.alias?.[0]}`;
    return NextResponse.json({
      url: liveUrl,
      deploymentId: data.id,
      html,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected publish error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
