"use client";

import { useEffect, useState } from "react";

import { AppShell } from "./layout/AppShell";
import { BottomNav, type TabId } from "./layout/BottomNav";
import { TopNav } from "./layout/TopNav";
import { AnalyzeOverlay } from "./screens/AnalyzeOverlay";
import { AnalyzeScreen } from "./screens/AnalyzeScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { DeckScreen } from "./screens/DeckScreen";
import { ImproveScreen } from "./screens/ImproveScreen";
import { InvestorsScreen } from "./screens/InvestorsScreen";
import { PlanScreen } from "./screens/PlanScreen";
import type { RaiseSignalAnalysis, ScreenId } from "./types";

const TABS: TabId[] = ["analyze", "dashboard", "investors"];

export function RaiseSignalApp() {
  const [hist, setHist] = useState<ScreenId[]>(["analyze"]);
  const [dir, setDir] = useState<"fwd" | "back" | "tab">("fwd");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RaiseSignalAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [url, setUrl] = useState("https://cursor.com");
  const [connected, setConnected] = useState<Record<string, boolean>>({
    Stripe: true,
  });

  const screen = hist[hist.length - 1];

  useEffect(() => {
    const id = setTimeout(() => {
      document
        .querySelectorAll(".rise, .anim-fwd, .anim-back, .anim-tab")
        .forEach((el) => {
          el.classList.remove("rise", "anim-fwd", "anim-back", "anim-tab");
        });
    }, 700);
    return () => clearTimeout(id);
  }, [screen, analyzing]);

  function go(to: ScreenId) {
    if (to === screen) return;
    if (TABS.includes(to as TabId)) {
      setDir("tab");
      setHist([to]);
    } else {
      setDir("fwd");
      setHist((h) => [...h, to]);
    }
  }

  function toggleConnector(name: string) {
    setConnected((c) => ({ ...c, [name]: !c[name] }));
  }

  async function analyzeStartup() {
    setAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/raise-signal/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url,
          connectors: Object.entries(connected)
            .filter(([, isConnected]) => isConnected)
            .map(([name]) => name),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to analyze this startup.");
      }

      setAnalysis(payload.analysis);
      setDir("fwd");
      setHist(["dashboard"]);
    } catch (error) {
      setAnalysisError(
        error instanceof Error ? error.message : "Unable to analyze this startup.",
      );
    } finally {
      setAnalyzing(false);
    }
  }

  function renderScreen() {
    switch (screen) {
      case "analyze":
        return (
          <AnalyzeScreen
            url={url}
            setUrl={setUrl}
            connected={connected}
            toggleConnector={toggleConnector}
            onAnalyze={analyzeStartup}
            analyzing={analyzing}
            error={analysisError}
          />
        );
      case "dashboard":
        return analysis ? (
          <DashboardScreen go={go} analysis={analysis} onAnalysisChange={setAnalysis} />
        ) : (
          <AnalyzeScreen
            url={url}
            setUrl={setUrl}
            connected={connected}
            toggleConnector={toggleConnector}
            onAnalyze={analyzeStartup}
            analyzing={analyzing}
            error={analysisError}
          />
        );
      case "plan":
        return analysis ? <PlanScreen go={go} analysis={analysis} /> : null;
      case "investors":
        return analysis ? <InvestorsScreen go={go} analysis={analysis} /> : null;
      case "deck":
        return analysis ? <DeckScreen go={go} analysis={analysis} /> : null;
      case "improve":
        return analysis ? <ImproveScreen go={go} analysis={analysis} /> : null;
      default:
        return (
          <AnalyzeScreen
            url={url}
            setUrl={setUrl}
            connected={connected}
            toggleConnector={toggleConnector}
            onAnalyze={analyzeStartup}
            analyzing={analyzing}
            error={analysisError}
          />
        );
    }
  }

  const animClass =
    dir === "fwd" ? "anim-fwd" : dir === "back" ? "anim-back" : "anim-tab";

  let activeTab: TabId = "dashboard";
  for (let i = hist.length - 1; i >= 0; i--) {
    if (TABS.includes(hist[i] as TabId)) {
      activeTab = hist[i] as TabId;
      break;
    }
  }

  const showNav = screen !== "analyze";

  return (
    <div
      id="rs-root"
      data-screen={screen}
      data-active={activeTab}
      className="font-sans"
    >
      <AppShell wide={showNav}>
        {showNav && <TopNav active={activeTab} onNav={go} />}
        <div
          key={screen}
          className={`${animClass} flex min-h-0 flex-1 flex-col`}
        >
          {renderScreen()}
        </div>
        {showNav && <BottomNav active={activeTab} onNav={go} />}
        {analyzing && <AnalyzeOverlay url={url} />}
      </AppShell>
    </div>
  );
}
