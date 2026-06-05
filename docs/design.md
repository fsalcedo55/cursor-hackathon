# RaiseSignal Design Guidelines

RaiseSignal should feel like the most automated way to raise capital: calm, competent, high-signal, and founder-controlled. The product is not a generic AI assistant. It is a fundraising agent that turns startup context into an active capital-raise workflow.

## Brand Position

Core promise:

RaiseSignal is the fundraising agent founders can hand their raise to. It builds the investor strategy, prepares the materials, personalizes outreach, prepares meetings, and keeps the process moving.

Design implication:

- The founder is the hero. RaiseSignal is the operator behind the workflow.
- The product should feel more autonomous than advisory.
- Every screen should reduce fundraising drag: fewer open loops, clearer next actions, better investor context.
- The UI should show progress and recommendations without implying guaranteed funding or uncontrolled outreach.

## Visual Direction

The interface should combine founder warmth with investor-grade seriousness.

- Warm, editorial, and focused rather than cold SaaS blue.
- Confident without looking loud or gimmicky.
- Premium but practical: rounded cards, strong hierarchy, concise copy, and visible workflow state.
- Use dark surfaces for agent activity, analysis, and command-center moments.
- Use warm cream and amber to make fundraising feel less sterile and more approachable.

## Color System

Primary palette:

- `#f8f1e5` - Warm page background. Use for landing pages, onboarding, and calm empty states.
- `#18181b` / Tailwind `zinc-950` - Primary text, dark surfaces, and primary CTAs.
- `#111827` - Deep agent panel background. Use for command center, active run, and analysis surfaces.
- `#fcd34d` / Tailwind `amber-300` - Primary accent. Use for highlighted actions, callouts, and key product moments.
- `#b45309` / Tailwind `amber-700` - Section labels and secondary accent text.
- `#064e3b` / `#6ee7b7` - Positive status accents for active, ready, approved, or matched states.
- `#e11d48` / Tailwind `rose-600` - Risk, friction, objection, or warning states.

Neutral palette:

- `#ffffff` - Cards and high-contrast content areas.
- `#f4f4f5` / Tailwind `zinc-100` - Subtle background surfaces.
- `#e4e4e7` / Tailwind `zinc-200` - Borders and dividers.
- `#71717a` / Tailwind `zinc-500` - Secondary text.
- `#3f3f46` / Tailwind `zinc-700` - Body text.

Usage principles:

- Use warm cream as the default environment and dark panels for the agent doing work.
- Use amber sparingly for emphasis, not decoration.
- Use green only for real status: active, approved, ready, matched.
- Use rose only for real risk: weak slides, investor mismatch, objection, overdue follow-up.
- Avoid bright AI gradients as the default brand expression. RaiseSignal should feel precise, not magical.

## Typography

Primary typeface:

- Use `Geist` for product and marketing UI.
- Use `Geist Mono` for step numbers, small metadata, pipeline counts, scores, and system-like labels.

Type style:

- Headlines should be direct, large, and tightly tracked.
- Body copy should be clear and founder-friendly, usually `zinc-700`.
- Labels should be short, uppercase when framing a section, and use wider tracking.
- Avoid long paragraphs inside product surfaces. Prefer short summaries and action-oriented labels.

Example hierarchy:

- Hero headline: `text-5xl` to `text-7xl`, semibold, tight tracking.
- Section headline: `text-3xl` to `text-5xl`, semibold.
- Card title: `text-xl`, semibold.
- Body: `text-base` or `text-lg`, relaxed leading.
- Metadata: `text-sm`, medium weight, often mono or uppercase.

## Layout Principles

- Lead with one clear action or recommendation per screen.
- Use generous spacing and card-based grouping so complex fundraising work feels manageable.
- Favor two-column desktop layouts when showing an explanation beside an agent output.
- Keep mobile layouts linear: context first, action second, detail third.
- Group investor workflow state into recognizable areas: pipeline, deck, outreach, meetings, follow-up.
- Design around next actions, not static reports.

## Component Principles

Cards:

- Use rounded corners between `rounded-2xl` and `rounded-[2rem]`.
- Use subtle borders on light cards: `border-zinc-200`.
- Use translucent white cards on warm backgrounds for lightweight sections.
- Use dark cards for active agent work or important analysis.

Buttons:

- Primary buttons should be dark with white text.
- Secondary buttons should be light, bordered, and calm.
- Button copy should be founder-owned: `Start my raise`, `Approve outreach`, `Review investor list`.
- Avoid vague button labels like `Submit`, `Continue`, or `Generate` when a specific fundraising action is available.

Status pills:

- Use pills for pipeline state, approval state, and agent activity.
- Good labels: `Active`, `Ready for approval`, `Needs review`, `Follow-up due`, `Strong match`.
- Do not use status color without text. The meaning should never rely on color alone.

Agent panels:

- Agent panels should show work in progress and next actions.
- Each panel should answer: What did the agent do? What did it find? What should the founder do next?
- Make approval boundaries visible when the agent drafts external communication.

## UX Principles

1. Start from the founder's intent.
   The ideal interaction is: "Here is my company. Raise capital for me." Product flows should ask for only the context needed to move the raise forward.

2. Make the next step obvious.
   Every workflow screen should surface a recommended next action, why it matters, and what approval is needed.

3. Show the agent's reasoning.
   Recommendations should include concise reasons: investor thesis fit, portfolio overlap, stage alignment, deck weakness, or likely objection.

4. Preserve founder control.
   The agent can draft, rank, prepare, and remind. It should not imply that it sends high-stakes messages, makes claims, or changes investor status without approval.

5. Reduce tab sprawl.
   Bring investor research, outreach, meeting prep, and follow-ups into one workflow instead of forcing founders to manage separate tools.

6. Prefer workflow state over raw data.
   A founder does not only need a list of investors. They need to know who matters, why they matter, what to say, and what to do next.

7. Respect the stakes.
   Fundraising is stressful and reputation-sensitive. The UI should be clear, conservative, and specific rather than playful or overconfident.

## Product Surface Patterns

Use these recurring patterns across the app:

- Agent run summary: shows the active raise goal, current status, completed work, and next action.
- Investor pipeline: ranked investor cards with fit reasons, risk notes, and recommended next action.
- Deck review: slide-level flags, narrative gaps, suggested rewrites, and readiness summary.
- Outreach queue: drafts grouped by cold email, warm intro, follow-up, and post-meeting note.
- Meeting brief: why them, why now, likely objections, conversation hooks, and follow-up plan.
- Approval checkpoint: clear review step before outbound communication or consequential changes.
- Follow-up command center: overdue items, upcoming reminders, suggested notes, and unresolved diligence questions.

## Copy Principles

Voice:

- Clear, direct, and founder-friendly.
- Confident without hype.
- Practical over inspirational.
- Specific about outcomes.
- Respectful of how high-stakes fundraising feels.
- More autonomous than advisory.

Preferred language:

- `agent`
- `raise`
- `capital-raise workflow`
- `investor pipeline`
- `next action`
- `ready for approval`
- `meeting brief`
- `founder approval`
- `ranked targets`

Avoid:

- `copilot`
- `supercharge`
- `revolutionize`
- `guaranteed funding`
- `we get you funded`
- `automatic investor intros`
- Generic AI language that does not explain the fundraising outcome.

Copy should usually name the outcome, not the feature. For example:

- Use `Build my investor list` instead of `Run matching`.
- Use `Approve outreach` instead of `Send`.
- Use `Prepare this meeting` instead of `Generate research`.

## Accessibility And Usability

- Maintain strong contrast between text and backgrounds, especially on amber surfaces.
- Do not communicate state by color alone.
- Keep interactive targets comfortably sized, especially CTAs and approval controls.
- Use clear focus states for keyboard navigation.
- Keep dense investor data scannable with headings, labels, and short reason summaries.
- Avoid modal-heavy flows for core fundraising work; founders should be able to maintain context.

## Design Guardrails

- Do not make the product feel like a toy chatbot.
- Do not over-index on dashboards that report data without recommending action.
- Do not hide founder approval behind automation language.
- Do not imply guaranteed funding, guaranteed replies, or automatic introductions.
- Do not make the agent mysterious. Show enough reasoning for a founder to trust and edit the work.
- Do not create visual clutter around investor data. Prioritization is part of the product value.

## Implementation Notes

- Keep using Tailwind utility classes for now.
- Prefer shared arrays or config objects for repeated marketing content until a component system exists.
- Use `Head` metadata on marketing pages with the primary promise and agent positioning.
- When reusable UI emerges, prioritize components for cards, status pills, CTA buttons, agent panels, investor cards, and approval checkpoints.
- If design tokens are formalized later, start from the color values in this document and map them into CSS variables or Tailwind theme tokens.
