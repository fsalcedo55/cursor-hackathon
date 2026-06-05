import type { GeneratedDeckSlide, RaiseSignalAnalysis } from "../types";

const PAGE_WIDTH = 1600;
const PAGE_HEIGHT = 900;

function sanitizeFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function headlineParts(headline: string) {
  const [lead, ...rest] = headline.split(":");
  return {
    lead: lead.trim(),
    detail: rest.join(":").trim(),
  };
}

export async function exportDeckPdf(
  analysis: RaiseSignalAnalysis,
  slides: GeneratedDeckSlide[],
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [PAGE_WIDTH, PAGE_HEIGHT],
  });

  slides.forEach((slide, index) => {
    if (index > 0) {
      doc.addPage([PAGE_WIDTH, PAGE_HEIGHT], "landscape");
    }

    const parts = headlineParts(slide.headline);
    const facts = slide.sourceFacts.slice(0, 4);
    const progress = Math.round((slide.n / slides.length) * 100);

    doc.setFillColor(11, 17, 32);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
    doc.setFillColor(49, 64, 206);
    doc.circle(230, 150, 230, "F");
    doc.setFillColor(41, 191, 206);
    doc.circle(1370, 110, 190, "F");
    doc.setFillColor(24, 33, 58);
    doc.circle(1260, 760, 290, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(96, 74, 64, 64, 16, 16, "F");
    doc.setTextColor(49, 64, 206);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(analysis.company.initials || analysis.company.name.slice(0, 2), 128, 115, {
      align: "center",
    });

    doc.setTextColor(190, 199, 255);
    doc.setFontSize(17);
    doc.text(analysis.company.name.toUpperCase(), 184, 94);
    doc.setTextColor(231, 235, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`${analysis.company.stage} - ${analysis.plan.round}`, 184, 124);

    doc.setDrawColor(255, 255, 255);
    doc.setFillColor(255, 255, 255);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(
      `${String(slide.n).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`,
      PAGE_WIDTH - 126,
      112,
      { align: "center" },
    );

    doc.setFillColor(42, 50, 82);
    doc.roundedRect(96, 318, 180, 42, 21, 21, "F");
    doc.setTextColor(184, 194, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(slide.t.toUpperCase(), 122, 345);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(60);
    const leadLines = doc.splitTextToSize(parts.lead, 780).slice(0, 4);
    doc.text(leadLines, 96, 432, { lineHeightFactor: 0.92 });

    if (parts.detail) {
      doc.setTextColor(220, 226, 245);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(26);
      const detailLines = doc.splitTextToSize(parts.detail, 720).slice(0, 3);
      doc.text(detailLines, 96, 432 + leadLines.length * 56 + 36, {
        lineHeightFactor: 1.2,
      });
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(1010, 346, 410, 330, 28, 28, "F");
    doc.setTextColor(109, 92, 240);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("KEY PROOF", 1050, 396);
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(1336, 374, 52, 28, 14, 14, "F");
    doc.setTextColor(49, 64, 206);
    doc.setFontSize(14);
    doc.text(`${progress}%`, 1362, 393, { align: "center" });

    const proofItems = facts.length > 0 ? facts : ["Investor-ready narrative from the latest analysis."];
    proofItems.forEach((fact, factIndex) => {
      const y = 430 + factIndex * 54;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(1050, y, 330, 42, 14, 14, "F");
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const factLines = doc.splitTextToSize(fact, 300).slice(0, 2);
      doc.text(factLines, 1070, y + 26, { lineHeightFactor: 1.1 });
    });

    doc.setFillColor(62, 70, 100);
    doc.roundedRect(96, 776, 960, 10, 5, 5, "F");
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(96, 776, 960 * (progress / 100), 10, 5, 5, "F");

    doc.setTextColor(190, 198, 214);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    const notes = doc.splitTextToSize(slide.speakerNotes, 480).slice(0, 2);
    doc.text(notes, 1048, 778, { lineHeightFactor: 1.15 });
  });

  doc.save(`${sanitizeFilename(analysis.company.name) || "investor"}-deck.pdf`);
}
