import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const features = [
  {
    title: "Investor Discovery & Matching",
    description:
      "Match your startup against investor stage, sector, check size, geography, thesis, and portfolio context.",
  },
  {
    title: "Pitch Deck Analyzer",
    description:
      "Get feedback on the story investors evaluate: problem, market, traction, team, ask, and narrative strength.",
  },
  {
    title: "Investor Outreach Generator",
    description:
      "Create cold emails, warm intro requests, and follow-ups that use investor-specific context.",
  },
  {
    title: "Fundraising Q&A Coach",
    description:
      "Practice hard VC questions and improve the substance, clarity, and delivery of your answers.",
  },
  {
    title: "Investor Research Agent",
    description:
      "Prepare for meetings with a concise brief on portfolio fit, conversation hooks, and likely objections.",
  },
];

const planSteps = [
  {
    title: "Share your startup context",
    description:
      "Add your company description, stage, sector, traction, geography, and fundraising goals.",
  },
  {
    title: "Build your investor strategy",
    description:
      "Get matched with relevant investors, analyze your deck, generate outreach, and research targets.",
  },
  {
    title: "Raise with confidence",
    description:
      "Enter investor conversations with a sharper story, stronger answers, and a clearer next step.",
  },
];

const avoidList = [
  "Wasting weeks researching the wrong investors",
  "Sending generic cold emails that get ignored",
  "Walking into meetings without investor-specific context",
  "Discovering pitch weaknesses only after investor calls",
];

const gainList = [
  "A focused investor target list",
  "A clearer fundraising narrative",
  "More relevant outreach",
  "Better meeting prep",
  "Confidence in the next investor conversation",
];

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.variable} min-h-screen bg-[#f7f3ea] text-zinc-950`}
    >
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-3 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-sm text-white shadow-lg shadow-zinc-950/10">
            RS
          </span>
          <span className="text-lg tracking-tight">RaiseSignal</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
          <a href="#features" className="transition hover:text-zinc-950">
            Features
          </a>
          <a href="#plan" className="transition hover:text-zinc-950">
            Plan
          </a>
          <a href="#outcomes" className="transition hover:text-zinc-950">
            Outcomes
          </a>
        </nav>
        <a
          href="#start"
          className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-950/15 transition hover:-translate-y-0.5 hover:bg-zinc-800"
        >
          Start your plan
        </a>
      </header>

      <main id="top">
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28 lg:pt-16">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-amber-300/70 bg-white/70 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
              Fundraising clarity for ambitious founders
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl">
              Raise smarter with investor research, pitch feedback, and
              outreach built for founders.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 sm:text-xl">
              RaiseSignal helps you find the right investors, improve your
              pitch, personalize outreach, and prepare for the questions VCs
              will actually ask.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#start"
                className="rounded-full bg-zinc-950 px-7 py-4 text-center text-sm font-semibold text-white shadow-xl shadow-zinc-950/20 transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                Start your fundraising plan
              </a>
              <a
                href="#features"
                className="rounded-full border border-zinc-300 bg-white/70 px-7 py-4 text-center text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:border-zinc-950"
              >
                Analyze your deck
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-zinc-950 p-4 shadow-2xl shadow-zinc-950/20">
            <div className="rounded-[1.5rem] bg-[#111827] p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-zinc-400">Fundraising signal</p>
                  <p className="mt-1 text-xl font-semibold">
                    Seed round readiness
                  </p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
                  84%
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Investor fit", "43 strong matches"],
                  ["Deck narrative", "2 weak slides flagged"],
                  ["Outreach", "12 personalized drafts"],
                  ["VC prep", "8 hard questions queued"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-400">{label}</span>
                      <span className="text-sm font-semibold text-white">
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-amber-300 p-5 text-zinc-950">
                <p className="font-semibold">Next best move</p>
                <p className="mt-2 text-sm leading-6">
                  Tighten the market-size slide before contacting climate and
                  infrastructure seed funds.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200/80 bg-white/65">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                The problem
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Stop fundraising in the dark.
              </h2>
            </div>
            <div className="text-lg leading-8 text-zinc-700">
              <p>
                Most founders spend too much time guessing which investors to
                contact, what to say, and whether their pitch is strong enough.
                RaiseSignal turns scattered fundraising work into a guided
                process.
              </p>
              <p className="mt-5">
                Great founders should not lose momentum because fundraising
                knowledge is fragmented, relationship-driven, and hard to
                access.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              What RaiseSignal does
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything you need to prepare for better investor conversations.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/10"
              >
                <h3 className="text-xl font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-7 text-zinc-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="plan" className="bg-zinc-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                The plan
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                A simple path from fundraising guesswork to focused execution.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {planSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <span className="font-mono text-sm text-amber-300">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-4 leading-7 text-zinc-300">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="outcomes" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-zinc-200 bg-white/75 p-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Avoid the fundraising traps that slow founders down.
              </h2>
              <ul className="mt-8 space-y-4 text-zinc-700">
                {avoidList.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-rose-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] bg-amber-300 p-8 text-zinc-950">
              <h2 className="text-3xl font-semibold tracking-tight">
                Walk into every investor conversation prepared.
              </h2>
              <ul className="mt-8 space-y-4">
                {gainList.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-zinc-950" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="start" className="px-6 pb-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-zinc-950 px-6 py-14 text-center text-white shadow-2xl shadow-zinc-950/20 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Ready when the round is
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Build a fundraising plan before the next investor conversation.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-zinc-300">
              Start with your startup context, then use RaiseSignal to focus
              your investor list, sharpen your pitch, and prepare for the hard
              questions.
            </p>
            <a
              href="#top"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-4 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-amber-100"
            >
              Start your fundraising plan
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
