export type ScreenId =
  | "analyze"
  | "dashboard"
  | "plan"
  | "investors"
  | "deck"
  | "improve";

export type TabId = Extract<ScreenId, "analyze" | "dashboard" | "investors">;

export type GoFn = (screen: ScreenId) => void;

export type SignalStatus = "Strong" | "Good" | "Needs work" | "Missing";

export type DataRoomStatus = "Done" | "Missing" | "Suggested";

export type UseOfFundsSegment = {
  label: string;
  v: number;
  c: string;
};

export type ScoreBreakdownItem = {
  label: string;
  v: number;
  reason?: string;
};

export type RevenueMetric = {
  label: string;
  value: string;
  trend?: string;
  missing?: boolean;
  warning?: boolean;
};

export type CompanyProfile = {
  name: string;
  initials: string;
  category: string;
  stage: string;
  status: string;
  businessModel: string;
  mainMarket: string;
  teamSize: string;
  tractionSignal: string;
  fundingSignal: string;
  sizeSignal: string;
  summary: string;
};

export type FundraisingPlan = {
  round: string;
  raiseAmount: string;
  valuation: string;
  dilution: string;
  runway: string;
  narrative: string;
  useOfFunds: UseOfFundsSegment[];
  valuationLogic: { t: string; ok: boolean | "neutral" }[];
};

export type InvestorMatch = {
  name: string;
  fit: number;
  initials: string;
  color: string;
  stage: string;
  activity: string;
  why: string[];
  firm?: string;
  role?: string;
  location?: string;
  geography?: "Local" | "Regional" | "Thesis fit";
  sectors?: string[];
  checkSize?: string;
  tier?: "Best local targets" | "Warm intro candidates" | "Regional thesis fit";
  sources?: {
    label: string;
    url?: string;
  }[];
  contactPath?: string;
  riskNotes?: string[];
  recommendedAction?: string;
  pipelineStatus?: "Draft ready" | "Needs intro" | "Shortlisted" | "Researching";
  outreachDraft?: {
    type: "Cold email" | "Warm intro request" | "Follow-up";
    approvalStatus: "Ready for founder approval" | "Needs founder edits";
    angle: string;
    subject: string;
    body: string;
  };
};

export type DeckSlide = {
  n: number;
  t: string;
  s: SignalStatus;
};

export type GeneratedDeckSlide = {
  n: number;
  t: string;
  headline: string;
  speakerNotes: string;
  sourceFacts: string[];
};

export type DeckGeneration = {
  status: "idle" | "generating" | "complete";
  slides: GeneratedDeckSlide[];
  activeSlideNumber?: number;
};

export type DataRoomItem = {
  t: string;
  s: DataRoomStatus;
};

export type ImprovementAction = {
  t: string;
  impact: number;
  d: string;
  icon: "coins" | "refresh" | "globe" | "target";
};

export type RaiseSignalAnalysis = {
  url: string;
  score: number;
  readinessLabel: string;
  scoreSummary: string;
  breakdown: ScoreBreakdownItem[];
  issues: string[];
  company: CompanyProfile;
  revenueMetrics: RevenueMetric[];
  criticalMetric: {
    label: string;
    message: string;
  };
  plan: FundraisingPlan;
  investors: InvestorMatch[];
  deck: {
    readiness: number;
    slides: DeckSlide[];
    dataRoom: DataRoomItem[];
  };
  improvements: ImprovementAction[];
};
