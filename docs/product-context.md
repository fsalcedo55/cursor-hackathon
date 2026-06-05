# Product Context: Fundraising Features

This repository is evolving toward RaiseSignal, a founder-facing fundraising agent. The product should help startups hand off as much of the capital-raise workflow as possible: identifying the right investors, preparing stronger fundraising materials, generating personalized outreach, prepping meetings, and keeping follow-ups moving.

Use this document as planning context for future implementation work. It is not a finalized spec, but it captures the major feature areas and the product intent behind them: the most automated way for a founder to raise capital without promising guaranteed funding or removing founder approval from high-stakes decisions.

## Core Feature Areas

### Fundraising Agent Orchestration

The core product experience should feel like a founder can tell RaiseSignal: "Here is my company. Raise capital for me."

The agent should translate that instruction into a structured fundraising workflow:

- Understand the startup, raise amount, stage, sector, traction, geography, and ideal investor profile
- Build and maintain a prioritized investor pipeline
- Recommend what to fix in the deck and narrative before outreach
- Draft investor-specific outreach, warm intro requests, follow-ups, and meeting prep
- Track investor status, next steps, and recommended actions across the raise
- Ask the founder for approval before external communication or other high-stakes actions

The founder remains the decision-maker, but the product should reduce the manual operating load of fundraising as much as possible.

### Investor Discovery & Matching

Given a startup's description, stage, and sector, surface the most relevant investors from a curated investor database.

Potential data sources:

- Crunchbase data
- Airtable or internal lists of known VCs
- Curated investor profiles maintained by the RaiseSignal team

Matching and filtering should account for:

- Check size
- Geography
- Investment thesis
- Stage focus
- Sector focus
- Portfolio overlap
- Existing investments in direct or adjacent competitors

The goal is to prioritize investors who are both likely to be interested and strategically appropriate for the startup, then turn those matches into an actionable pipeline the agent can help move forward.

### Pitch Deck Generator / Analyzer

Allow founders to upload a pitch deck and receive AI feedback against the criteria investors care about most.

The analyzer should evaluate:

- Clarity of the problem
- Market size and urgency
- Strength of the solution narrative
- Traction and evidence
- Team credibility
- Fundraising ask
- Overall narrative strength

Expected outputs:

- Slide-level critique
- Weak-slide flags
- Suggested rewrites
- Narrative strength score
- Recommendations for missing or underdeveloped sections

### Investor Email / Outreach Agent

Given an investor profile and startup context, generate personalized investor outreach and recommend when to send it.

The message should be usable for:

- Cold emails
- Warm intro requests
- Follow-up notes after an initial meeting

Personalization inputs may include:

- Investor portfolio companies
- Recent posts, tweets, podcasts, or public comments
- Stated investment thesis
- Relevant prior investments
- Startup stage, sector, traction, and fundraising ask

The output should feel specific to the investor, not like a generic fundraising template. The agent should keep founder approval in the loop before sending or queuing external messages.

### Fundraising Q&A Coach

Simulate a VC partner asking hard fundraising questions and provide feedback on the founder's answers.

Example questions:

- What happens if Google enters your market?
- Why is now the right time?
- What evidence shows customers urgently need this?
- Why will this become venture-scale?
- What is the biggest risk in the business?

Feedback should cover:

- Substance of the answer
- Clarity and concision
- Investor-readiness
- Confidence and delivery
- Follow-up points the founder should prepare

### Investor Research & Meeting Prep Agent

Given a target investor's name, generate a briefing memo before a meeting.

The agent should research:

- Current and past portfolio companies
- Recent investments
- Public posts, tweets, podcasts, interviews, or essays
- Stated thesis and sector preferences
- Shared network or warm intro paths when available

Expected output:

- "Why them, why now" brief
- Key portfolio overlaps
- Relevant conversation hooks
- Potential objections or questions the investor may raise
- Suggested meeting strategy

### Fundraising Workflow Tracker

Maintain the operational layer of the raise so founders do not have to manage every investor interaction manually.

The tracker should support:

- Investor pipeline stages
- Recommended next action per investor
- Follow-up reminders and drafts
- Meeting prep status
- Notes from calls
- Open questions, objections, and unresolved diligence items

The tracker should help the agent decide what to recommend next, not just store CRM data.

## Product Principles

- Prefer curated, high-signal investor data over broad but noisy scraping.
- Make outputs actionable for founders, not just descriptive.
- Explain the reasoning behind recommendations when possible.
- Treat fundraising communication as high-stakes: preserve founder voice and avoid overclaiming.
- Be careful with competitor detection and portfolio-overlap logic, since false positives can hide useful investors.
- Keep generated outreach concise, specific, and easy for a founder to edit.
- Optimize for autonomous workflow progress, but require founder approval for external communication and consequential decisions.
- Frame the product as an agent that runs the fundraising process, not a passive copilot that only answers questions.

## Future Implementation Notes

- Investor matching will likely need a structured investor profile model with fields for stage, sector, geography, check size, thesis, and portfolio.
- Deck analysis will need file upload and parsing support before AI critique can be useful.
- Outreach generation should separate reusable startup context from investor-specific research.
- Research-agent outputs should cite sources whenever browsing or external data is used.
- Q&A coaching may benefit from storing practice sessions so founders can track improvement over time.
- The agent workflow will likely need persistent fundraising state: investor pipeline records, statuses, next actions, meeting notes, approval history, and follow-up reminders.
