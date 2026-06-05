"use client";

import { useMemo, useState } from "react";

import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { bodyPad, pageX, ScreenScroll } from "../layout/ScreenScroll";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardTitle } from "../ui/CardTitle";
import { FitBadge } from "../ui/FitBadge";
import type { GoFn, InvestorMatch, RaiseSignalAnalysis } from "../types";

type InvestorsScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
};

const filters = [
  "All",
  "Stage",
  "Geography",
  "Industry",
  "Ticket size",
  "Recent activity",
] as const;

const tiers: NonNullable<InvestorMatch["tier"]>[] = [
  "Best local targets",
  "Warm intro candidates",
  "Regional thesis fit",
];

function filterInvestor(inv: InvestorMatch, filter: (typeof filters)[number]) {
  if (filter === "All") return true;
  if (filter === "Geography") return inv.geography === "Local";
  if (filter === "Stage") return inv.stage.toLowerCase().includes("seed");
  if (filter === "Industry") {
    return (inv.sectors || []).some((sector) =>
      ["SaaS", "AI", "Enterprise", "Fintech"].includes(sector),
    );
  }
  if (filter === "Ticket size") return Boolean(inv.checkSize && !inv.checkSize.includes("Network"));
  return inv.activity.toLowerCase().includes("active") || inv.activity.toLowerCase().includes("local");
}

function statusTone(status?: InvestorMatch["pipelineStatus"]) {
  if (status === "Draft ready") {
    return { color: "var(--success)", bg: "var(--success-soft)" };
  }

  if (status === "Needs intro") {
    return { color: "var(--warning)", bg: "var(--warning-soft)" };
  }

  return { color: "var(--primary-700)", bg: "var(--primary-soft)" };
}

function SourceBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-[var(--bg)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--ink-2)]">
      {label}
    </span>
  );
}

function InvestorCard({
  inv,
  selected,
  saved,
  onSelect,
  onSave,
}: {
  inv: InvestorMatch;
  selected: boolean;
  saved: boolean;
  onSelect: () => void;
  onSave: () => void;
}) {
  const tone = statusTone(inv.pipelineStatus);

  return (
    <Card
      className="rise cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
      pad={16}
      onClick={onSelect}
      style={{
        borderColor: selected ? "color-mix(in srgb, var(--primary), #fff 38%)" : undefined,
        boxShadow: selected ? "0 12px 32px rgba(120,53,15,0.14)" : undefined,
      }}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] font-bold text-white"
          style={{
            background: inv.color,
            fontSize: inv.initials.length > 2 ? 15 : 17,
            letterSpacing: "-0.02em",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          {inv.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold tracking-[-0.01em] text-[var(--ink)]">
            {inv.name}
          </div>
          <div className="text-[12.5px] leading-normal text-[var(--ink-3)]">
            {inv.role || "Investor"} · {inv.location || inv.activity}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
              style={{ color: tone.color, background: tone.bg }}
            >
              {inv.pipelineStatus || "Shortlisted"}
            </span>
            <SourceBadge label={inv.checkSize || inv.stage} />
          </div>
        </div>
        <FitBadge value={inv.fit} />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        {inv.why.slice(0, 3).map((w) => (
          <div key={w} className="flex items-center gap-2">
            <Icon name="check" size={15} color="var(--success)" />
            <span className="text-[13px] font-medium text-[var(--ink-2)]">{w}</span>
          </div>
        ))}
      </div>

      {inv.riskNotes?.[0] && (
        <div className="mb-3 rounded-[13px] bg-[var(--warning-soft)] px-3 py-2.5 text-[12.5px] leading-[1.35] text-[#735008]">
          <strong>Watch:</strong> {inv.riskNotes[0]}
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-1.5">
        {(inv.sources || []).slice(0, 2).map((source) => (
          <SourceBadge key={source.label} label={source.label} />
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" full icon="mail" onClick={onSelect}>
          Review outreach
        </Button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSave();
          }}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px]"
          style={{
            border: saved ? "none" : "1px solid var(--hairline)",
            background: saved ? "var(--primary-soft)" : "var(--card)",
            color: saved ? "var(--primary-700)" : "var(--ink-3)",
          }}
        >
          <Icon name={saved ? "check" : "bookmark"} size={18} />
        </button>
      </div>
    </Card>
  );
}

export function InvestorsScreen({ analysis }: InvestorsScreenProps) {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [selectedName, setSelectedName] = useState<string | null>(analysis.investors[0]?.name || null);
  const [draftEdits, setDraftEdits] = useState<Record<string, { subject: string; body: string }>>({});

  const filteredInvestors = useMemo(
    () => analysis.investors.filter((inv) => filterInvestor(inv, activeFilter)),
    [activeFilter, analysis.investors],
  );
  const selected =
    analysis.investors.find((inv) => inv.name === selectedName) ||
    filteredInvestors[0] ||
    analysis.investors[0];
  const draft = selected?.outreachDraft;
  const editedDraft = selected
    ? draftEdits[selected.name] || {
        subject: draft?.subject || "",
        body: draft?.body || "",
      }
    : { subject: "", body: "" };
  const localCount = analysis.investors.filter((inv) => inv.geography === "Local").length;
  const draftsReady = analysis.investors.filter((inv) => inv.outreachDraft).length;
  const approvedCount = Object.values(approved).filter(Boolean).length;
  const topMatches = analysis.investors.slice(0, 5);

  return (
    <ScreenScroll>
      <AppHeader
        title="Investor Pipeline"
        sub="Best matches first, outreach under founder control"
      />

      <div className={bodyPad}>
        <Card
          className="rise mb-3.5 overflow-hidden"
          pad={18}
          style={{
            background:
              "linear-gradient(145deg, var(--agent) 0%, var(--ink) 100%)",
            border: "none",
            boxShadow: "0 18px 44px rgba(24,24,27,0.18)",
          }}
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-300 px-2.5 py-1 text-[12px] font-bold text-zinc-950 shadow-[var(--shadow-sm)]">
                <Icon name="spark" size={14} />
                Agent run complete
              </div>
              <h2 className="m-0 text-[22px] font-bold tracking-[-0.03em] text-white">
                Found {localCount} local targets and drafted {draftsReady} outreach drafts
              </h2>
              <p className="mt-2 mb-0 max-w-2xl text-sm leading-[1.45] text-zinc-300">
                Ranked for {analysis.company.name} using Miami/South Florida proximity,
                stage fit, thesis overlap, check size, and likely intro path.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-[15px] bg-white/10 px-3 py-2.5">
                <div className="num text-lg font-semibold text-white">{localCount}</div>
                <div className="text-[10.5px] font-semibold text-zinc-400">LOCAL</div>
              </div>
              <div className="rounded-[15px] bg-white/10 px-3 py-2.5">
                <div className="num text-lg font-semibold text-white">{draftsReady}</div>
                <div className="text-[10.5px] font-semibold text-zinc-400">DRAFTS</div>
              </div>
              <div className="rounded-[15px] bg-white/10 px-3 py-2.5">
                <div className="num text-lg font-semibold text-white">{approvedCount}</div>
                <div className="text-[10.5px] font-semibold text-zinc-400">APPROVED</div>
              </div>
            </div>
          </div>
        </Card>

        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between px-1">
            <div>
              <h2 className="m-0 text-base font-bold tracking-[-0.02em] text-[var(--ink)]">
                Top matches to review first
              </h2>
              <p className="mt-0.5 mb-0 text-[12.5px] text-[var(--ink-3)]">
                Ranked by fit, local access, stage, thesis, and likely intro path.
              </p>
            </div>
            <span className="num text-xs font-semibold text-[var(--ink-3)]">
              {topMatches.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {topMatches.map((inv) => (
              <InvestorCard
                key={`top-${inv.name}`}
                inv={inv}
                selected={selected?.name === inv.name}
                saved={Boolean(saved[inv.name])}
                onSelect={() => setSelectedName(inv.name)}
                onSave={() => setSaved((current) => ({ ...current, [inv.name]: !current[inv.name] }))}
              />
            ))}
          </div>
        </section>

        <div className="mb-3">
          <div className="mb-2 px-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-3)]">
            Refine the list
          </div>
          <div className={`rs-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 ${pageX}`}>
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--hairline)] bg-[var(--card)] px-3 py-2 text-[13px] font-[550] whitespace-nowrap text-[var(--ink-2)] shadow-[var(--shadow-sm)]"
                style={{
                  background: activeFilter === f ? "var(--primary)" : "var(--card)",
                  color: activeFilter === f ? "#fff" : "var(--ink-2)",
                  borderColor: activeFilter === f ? "var(--primary)" : "var(--hairline)",
                }}
              >
                {f}
                {f !== "All" && (
                  <Icon
                    name="chevDown"
                    size={14}
                    color={activeFilter === f ? "rgba(255,255,255,0.82)" : "var(--ink-4)"}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div className="flex flex-col gap-4">
            {tiers.map((tier) => {
              const investors = filteredInvestors.filter((inv) => inv.tier === tier);
              if (!investors.length) return null;

              return (
                <section key={tier}>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <h3 className="m-0 text-sm font-bold tracking-[-0.01em] text-[var(--ink)]">
                      {tier}
                    </h3>
                    <span className="num text-xs font-semibold text-[var(--ink-3)]">
                      {investors.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {investors.map((inv) => (
                      <InvestorCard
                        key={inv.name}
                        inv={inv}
                        selected={selected?.name === inv.name}
                        saved={Boolean(saved[inv.name])}
                        onSelect={() => setSelectedName(inv.name)}
                        onSave={() => setSaved((current) => ({ ...current, [inv.name]: !current[inv.name] }))}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {selected && draft && (
            <Card className="rise lg:sticky lg:top-24" pad={18}>
              <CardTitle
                icon="mail"
                right={
                  <span
                    className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                    style={{
                      color: approved[selected.name] ? "var(--success)" : "var(--primary-700)",
                      background: approved[selected.name]
                        ? "var(--success-soft)"
                        : "var(--primary-soft)",
                    }}
                  >
                    {approved[selected.name] ? "Approved" : draft.approvalStatus}
                  </span>
                }
              >
                Outreach review
              </CardTitle>

              <div className="mb-3.5 rounded-[15px] bg-[var(--bg)] px-3.5 py-3">
                <div className="text-[13.5px] font-bold text-[var(--ink)]">
                  {selected.name}
                </div>
                <p className="mt-1 mb-2 text-[12.5px] leading-[1.4] text-[var(--ink-2)]">
                  {draft.angle}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <SourceBadge label={draft.type} />
                  <SourceBadge label={selected.contactPath || "Founder-routed outreach"} />
                </div>
              </div>

              <label className="mb-1 block text-[11.5px] font-semibold text-[var(--ink-3)]">
                Subject
              </label>
              <input
                value={editedDraft.subject}
                onChange={(event) =>
                  setDraftEdits((current) => ({
                    ...current,
                    [selected.name]: {
                      subject: event.target.value,
                      body: editedDraft.body,
                    },
                  }))
                }
                className="mb-3 w-full rounded-[12px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2.5 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[var(--primary)] focus:bg-white"
              />

              <label className="mb-1 block text-[11.5px] font-semibold text-[var(--ink-3)]">
                Outreach draft
              </label>
              <textarea
                value={editedDraft.body}
                rows={12}
                onChange={(event) =>
                  setDraftEdits((current) => ({
                    ...current,
                    [selected.name]: {
                      subject: editedDraft.subject,
                      body: event.target.value,
                    },
                  }))
                }
                className="w-full resize-none rounded-[12px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2.5 text-[13px] leading-[1.45] text-[var(--ink-2)] outline-none focus:border-[var(--primary)] focus:bg-white"
              />

              <div className="mt-3.5 rounded-[13px] border border-[var(--hairline)] bg-white px-3 py-2.5 text-[12.5px] leading-[1.4] text-[var(--ink-2)]">
                <strong className="text-[var(--ink)]">Founder control:</strong> RaiseSignal drafts
                this message, but nothing is sent until you approve it.
              </div>

              <Button
                full
                size="sm"
                icon={approved[selected.name] ? "check" : "checkCircle"}
                onClick={() =>
                  setApproved((current) => ({ ...current, [selected.name]: !current[selected.name] }))
                }
                style={{ marginTop: 12 }}
              >
                {approved[selected.name] ? "Approved for demo" : "Approve outreach"}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </ScreenScroll>
  );
}
