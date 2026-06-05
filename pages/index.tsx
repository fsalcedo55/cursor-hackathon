import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const agentRun = [
  {
    label: "Investor pipeline",
    value: "64 ranked targets",
    detail: "Stage, thesis, check size, geography, and portfolio fit scored.",
  },
  {
    label: "Narrative review",
    value: "3 deck fixes",
    detail: "Market urgency, traction proof, and ask clarity flagged before outreach.",
  },
  {
    label: "Outreach queue",
    value: "18 drafts ready",
    detail: "Personalized cold emails, intro requests, and follow-ups awaiting approval.",
  },
  {
    label: "Meeting prep",
    value: "7 briefs built",
    detail: "Conversation hooks, likely objections, and partner-specific notes prepared.",
  },
];

const features = [
  {
    title: "Build the target list",
    description:
      "The agent ranks investors by stage, sector, thesis, check size, geography, and portfolio context so the raise starts with the right names.",
  },
  {
    title: "Fix the story before outreach",
    description:
      "Upload your deck and get practical notes on the investor narrative: problem, market, traction, team, ask, and the slides likely to create objections.",
  },
  {
    title: "Draft investor-specific messages",
    description:
      "Generate cold emails, warm intro requests, and follow-ups that reference the investor's thesis, portfolio, and recent public context.",
  },
  {
    title: "Prepare every meeting",
    description:
      "Before each call, get a concise brief with why this investor fits, what they may push on, and how to frame the next step.",
  },
  {
    title: "Keep the process moving",
    description:
      "Track statuses, next actions, reminders, meeting notes, and follow-up drafts in one fundraising workflow.",
  },
  {
    title: "Keep founder approval in the loop",
    description:
      "RaiseSignal can do the heavy lifting, but high-stakes external messages and decisions stay under founder control.",
  },
];

const planSteps = [
  {
    title: "Tell the agent what you are raising",
    description:
      "Add your company, stage, traction, sector, geography, raise amount, and what an ideal investor looks like.",
  },
  {
    title: "Let RaiseSignal build the raise",
    description:
      "The agent builds the investor pipeline, analyzes the deck, drafts outreach, researches targets, and organizes next steps.",
  },
  {
    title: "Approve, meet, and follow up",
    description:
      "Review recommendations, approve messages, walk into meetings prepared, and keep every follow-up moving.",
  },
];

const avoidList = [
  "Wasting weeks researching the wrong investors",
  "Sending generic cold emails that get ignored",
  "Walking into meetings without investor-specific context",
  "Discovering pitch weaknesses only after investor calls",
  "Letting follow-ups slip because the raise lives across too many tools",
];

const gainList = [
  "A ranked investor pipeline",
  "A sharper fundraising narrative",
  "Investor-specific outreach and follow-up drafts",
  "Meeting briefs before every call",
  "A more automated capital-raise workflow",
];

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.variable} min-h-screen bg-[#f8f1e5] text-zinc-950`}
    >
      <Head>
        <title>RaiseSignal | The most automated way to raise capital</title>
        <meta
          name="description"
          content="RaiseSignal is the fundraising agent that builds your investor strategy, improves your pitch, drafts outreach, prepares meetings, and keeps your raise moving."
        />
      </Head>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-3 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-sm text-white shadow-lg shadow-zinc-950/10">
            RS
          </span>
          <span className="text-lg tracking-tight">RaiseSignal</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
          <a href="#features" className="transition hover:text-zinc-950">
            Agent
          </a>
          <a href="#plan" className="transition hover:text-zinc-950">
            How it works
          </a>
          <a href="#outcomes" className="transition hover:text-zinc-950">
            Outcomes
          </a>
        </nav>
        <Link
          href="/demo"
          className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-950/15 transition hover:-translate-y-0.5 hover:bg-zinc-800"
        >
          Start my raise
        </Link>
      </header>

      <main id="top">
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-28 lg:pt-16">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-amber-300/70 bg-white/75 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
              Fundraising agent for ambitious founders
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-6xl lg:text-7xl">
              The most automated way to raise capital.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 sm:text-xl">
              Tell RaiseSignal what you are building and what you want to
              raise. The agent builds your investor strategy, improves your
              pitch, drafts personalized outreach, prepares you for meetings,
              and keeps the raise moving.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 text-sm font-medium text-zinc-700 sm:grid-cols-3">
              {["Investor pipeline", "Deck + narrative", "Outreach + follow-up"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-zinc-200 bg-white/65 px-4 py-3 shadow-sm"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demo"
                className="rounded-full bg-zinc-950 px-7 py-4 text-center text-sm font-semibold text-white shadow-xl shadow-zinc-950/20 transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                Start my raise
              </Link>
              <a
                href="#plan"
                className="rounded-full border border-zinc-300 bg-white/70 px-7 py-4 text-center text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:border-zinc-950"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-zinc-950 p-4 shadow-2xl shadow-zinc-950/20">
            <div className="rounded-[1.5rem] bg-[#111827] p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-zinc-400">Agent run</p>
                  <p className="mt-1 text-xl font-semibold">
                    Raise $2.5M seed round
                  </p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
                  Active
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {agentRun.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-400">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {item.value}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-amber-300 p-5 text-zinc-950">
                <p className="font-semibold">Next action for approval</p>
                <p className="mt-2 text-sm leading-6">
                  Send 6 warm intro requests after tightening the market-size
                  slide for infrastructure seed funds.
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
                Stop operating your raise by hand.
              </h2>
            </div>
            <div className="text-lg leading-8 text-zinc-700">
              <p>
                Most founders spend too much time guessing which investors to
                contact, what to say, what to fix in the deck, and what to do
                next. RaiseSignal turns scattered fundraising work into an
                agent-led process.
              </p>
              <p className="mt-5">
                Great founders should not lose momentum because raising capital
                requires too much manual work, fragmented knowledge, and hidden
                process.
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
              Give the agent the raise. Stay in control of the decisions.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-700">
              RaiseSignal is designed to move the work forward: building the
              list, sharpening the story, drafting the messages, preparing the
              meetings, and surfacing the next action.
            </p>
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
                How it works
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                From raise capital for me to an active investor process.
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
                Keep the raise moving without making it your whole job.
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
              Tell the agent what you are raising. Let it build the process.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-zinc-300">
              Start with your startup context, then let RaiseSignal create the
              investor pipeline, deck notes, outreach drafts, meeting prep, and
              follow-up workflow.
            </p>
            <Link
              href="/demo"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-4 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-amber-100"
            >
              Start my raise
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
