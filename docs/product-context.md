# Product Context: Fundraising Features

This repository is evolving toward RaiseSignal, a founder-facing fundraising assistant. The product should help startups identify the right investors, prepare stronger fundraising materials, and enter investor conversations with better context.

Use this document as planning context for future implementation work. It is not a finalized spec, but it captures the major feature areas and the product intent behind them.

## Core Feature Areas

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

The goal is to prioritize investors who are both likely to be interested and strategically appropriate for the startup.

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

### Investor Email / Outreach Generator

Given an investor profile and startup context, generate a personalized investor outreach message.

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

The output should feel specific to the investor, not like a generic fundraising template.

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

### Investor Research Agent

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

## Product Principles

- Prefer curated, high-signal investor data over broad but noisy scraping.
- Make outputs actionable for founders, not just descriptive.
- Explain the reasoning behind recommendations when possible.
- Treat fundraising communication as high-stakes: preserve founder voice and avoid overclaiming.
- Be careful with competitor detection and portfolio-overlap logic, since false positives can hide useful investors.
- Keep generated outreach concise, specific, and easy for a founder to edit.

## Future Implementation Notes

- Investor matching will likely need a structured investor profile model with fields for stage, sector, geography, check size, thesis, and portfolio.
- Deck analysis will need file upload and parsing support before AI critique can be useful.
- Outreach generation should separate reusable startup context from investor-specific research.
- Research-agent outputs should cite sources whenever browsing or external data is used.
- Q&A coaching may benefit from storing practice sessions so founders can track improvement over time.
