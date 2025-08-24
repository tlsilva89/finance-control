import { jsPDF } from "jspdf";
import autoTable, { RowInput, Color } from "jspdf-autotable";
import { useAuthStore } from "../stores/auth";
import type { FinancialReport } from "../stores/finance";

type RGB = [number, number, number];

export function usePDFExport() {
  const colors: Record<string, RGB> = {
    dark900: [15, 23, 42],
    dark800: [30, 41, 59],
    dark700: [51, 65, 85],
    dark600: [71, 85, 105],
    gray400: [148, 163, 184],
    gray300: [203, 213, 225],
    gray200: [226, 232, 240],
    white: [255, 255, 255],
    primary400: [96, 165, 250],
    primary500: [59, 130, 246],
    primary600: [37, 99, 235],
    green400: [74, 222, 128],
    green500: [34, 197, 94],
    red400: [248, 113, 113],
    red500: [239, 68, 68],
    blue500: [59, 130, 246],
    amber500: [245, 158, 11],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value || 0));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    if (/^Dia\s+\d+$/i.test(dateString)) return dateString;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const drawGradientUnderline = (
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    height = 2
  ) => {
    const steps = 20;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const alpha = 1 - t;
      doc.setFillColor(
        colors.primary400[0],
        colors.primary400[1],
        colors.primary400[2]
      );
      (doc as any).setGState(new (doc as any).GState({ opacity: alpha }));
      const segW = width / steps;
      doc.rect(x + i * segW, y, segW + 0.2, height, "F");
    }
    (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
  };

  const drawHeader = (
    doc: jsPDF,
    periodText: string,
    userLine: string,
    margin: number,
    isFirstPage: boolean
  ) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(...colors.dark900);
    doc.rect(0, 0, pageWidth, 68, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...colors.white);
    doc.text("Finance", margin, 28);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.primary400);
    doc.text("Control", margin + doc.getTextWidth("Finance ") - 2, 28);

    drawGradientUnderline(doc, margin, 34, 120, 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.gray400);
    doc.text(periodText, margin, 50);

    doc.setTextColor(...colors.gray300);
    doc.text(userLine, pageWidth - margin, 26, { align: "right" });

    doc.setDrawColor(...colors.dark800);
    doc.setLineWidth(0.6);
    doc.line(0, 68, pageWidth, 68);

    if (!isFirstPage) {
      doc.setFillColor(...colors.primary500);
      (doc as any).setGState(new (doc as any).GState({ opacity: 0.15 }));
      doc.rect(0, 68, 6, doc.internal.pageSize.getHeight() - 68, "F");
      (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
    }
  };

  const drawFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(...colors.dark800);
      doc.setLineWidth(0.6);
      doc.line(0, pageHeight - 36, pageWidth, pageHeight - 36);

      doc.setFontSize(8);
      doc.setTextColor(...colors.gray400);
      const text = `Página ${i} de ${pageCount} • Gerado em ${new Date().toLocaleDateString(
        "pt-BR"
      )}`;
      doc.text(text, pageWidth / 2, pageHeight - 20, { align: "center" });
    }
  };

  const sectionTitle = (
    doc: jsPDF,
    text: string,
    y: number,
    margin: number
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(...colors.white);
    doc.text(text, margin, y);
    doc.setDrawColor(...colors.primary600);
    doc.setLineWidth(1);
    doc.line(margin, y + 4, margin + 40, y + 4);
    return y + 10;
  };

  const exportReportAsPDF = (
    report: FinancialReport,
    startDate: string,
    endDate: string
  ) => {
    const authStore = useAuthStore();
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;

    doc.setFillColor(...colors.dark900);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    (doc as any).setGState(new (doc as any).GState({ opacity: 0.06 }));
    doc.setFillColor(...colors.primary500);
    doc.rect(0, 0, pageWidth, 140, "F");
    (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));

    const periodText = `Período: ${formatDate(
      report.startDate as unknown as string
    )} a ${formatDate(report.endDate as unknown as string)}`;
    const userText = `@${authStore.user?.username || "usuario"}`;

    drawHeader(doc, periodText, `Usuário: ${userText}`, margin, true);

    const cardX = margin;
    const cardY = 84;
    const cardW = pageWidth - margin * 2;
    const cardH = 110;

    (doc as any).setGState(new (doc as any).GState({ opacity: 0.12 }));
    doc.setFillColor(0, 0, 0);
    doc.rect(cardX + 2, cardY + 2, cardW, cardH, "F");
    (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));

    doc.setFillColor(...colors.dark800);
    doc.setDrawColor(40, 50, 65);
    doc.setLineWidth(0.8);
    doc.roundedRect(cardX, cardY, cardW, cardH, 8, 8, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...colors.gray300);
    doc.text("Resumo do Período", cardX + 12, cardY + 20);

    autoTable(doc, {
      startY: cardY + 30,
      styles: {
        font: "helvetica",
        fontSize: 10.5,
        textColor: colors.gray200 as unknown as Color,
        lineColor: [50, 60, 75] as Color,
        lineWidth: 0.4,
        halign: "left",
        valign: "middle",
        cellPadding: { top: 8, right: 8, bottom: 8, left: 8 },
        fillColor: [28, 37, 55] as Color,
      },
      headStyles: {
        fillColor: colors.dark700 as unknown as Color,
        textColor: colors.white as unknown as Color,
        fontStyle: "bold",
        halign: "left",
        lineWidth: 0.4,
        lineColor: [50, 60, 75] as Color,
      },
      alternateRowStyles: { fillColor: [24, 32, 48] as Color },
      theme: "grid",
      head: [["Resumo", "Valor"]],
      body: [
        ["Total de Entradas", formatCurrency(report.totalIncomes)],
        ["Total de Despesas", formatCurrency(report.totalExpenses)],
        ["Saldo Final", formatCurrency(report.balance)],
      ],
      columnStyles: {
        0: { cellWidth: cardW * 0.55 },
        1: { cellWidth: cardW * 0.25, halign: "right" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          if (data.row.index === 0)
            data.cell.styles.textColor = colors.green400 as unknown as Color;
          if (data.row.index === 1)
            data.cell.styles.textColor = colors.red400 as unknown as Color;
          if (data.row.index === 2)
            data.cell.styles.textColor = (report.balance >= 0
              ? colors.blue500
              : ([234, 88, 12] as RGB)) as unknown as Color;
          data.cell.styles.fontStyle = "bold";
        }
      },
      margin: { left: cardX + 8, right: pageWidth - (cardX + cardW) + 8 },
      tableWidth: cardW - 16,
    });

    let cursorY = (doc as any).lastAutoTable.finalY + 22;

    const sections: Array<{ title: string; rows: RowInput[] }> = [
      {
        title: "Entradas",
        rows: (report.incomes || []).map((i) => [
          formatDate(i.date),
          i.description,
          formatCurrency(i.amount),
        ]),
      },
      {
        title: "Despesas de Cartão",
        rows: (report.creditCardExpenses || []).map((e) => [
          formatDate(e.purchaseDate),
          e.description,
          formatCurrency(e.installmentAmount),
        ]),
      },
      {
        title: "Assinaturas",
        rows: (report.subscriptions || []).map((s: any) => [
          `Dia ${s.dueDate}`,
          s.name,
          formatCurrency(s.amount),
        ]),
      },
      {
        title: "Serviços",
        rows: (report.services || []).map((s) => [
          `Dia ${s.dueDate}`,
          s.name,
          formatCurrency(s.amount),
        ]),
      },
    ];

    const drawSectionTable = (
      startY: number,
      section: { title: string; rows: RowInput[] }
    ) => {
      let y = startY;
      const remaining = doc.internal.pageSize.getHeight() - y - 120;
      if (remaining < 100) {
        doc.addPage();
        doc.setFillColor(...colors.dark900);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        drawHeader(doc, periodText, `Usuário: ${userText}`, margin, false);
        y = 84;
      }

      y = sectionTitle(doc, section.title, y, margin);

      autoTable(doc, {
        startY: y + 8,
        styles: {
          font: "helvetica",
          fontSize: 10,
          textColor: colors.gray200 as unknown as Color,
          lineColor: [50, 60, 75] as Color,
          lineWidth: 0.4,
          cellPadding: { top: 7, right: 8, bottom: 7, left: 8 },
          halign: "left",
          valign: "middle",
          fillColor: [26, 34, 52] as Color,
        },
        headStyles: {
          fillColor: colors.dark700 as unknown as Color,
          textColor: colors.white as unknown as Color,
          fontStyle: "bold",
          halign: "left",
          lineWidth: 0.4,
          lineColor: [50, 60, 75] as Color,
        },
        alternateRowStyles: { fillColor: [22, 30, 48] as Color },
        theme: "grid",
        head: [["Data", "Descrição", "Valor"]],
        body: section.rows.length
          ? section.rows
          : [["-", "Sem registros no período", "-"]],
        columnStyles: {
          0: { cellWidth: pageWidth * 0.18, halign: "center" },
          1: { cellWidth: pageWidth * 0.52 },
          2: { cellWidth: pageWidth * 0.18, halign: "right" },
        },
        margin: { left: margin, right: margin },
        tableWidth: pageWidth - margin * 2,
        willDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 2) {
            data.cell.styles.fontStyle = "bold";
            const raw = Array.isArray(data.row.raw) ? data.row.raw[2] : "";
            if (typeof raw === "string") {
              if (raw.includes("-"))
                data.cell.styles.textColor = colors.red500 as unknown as Color;
              else
                data.cell.styles.textColor =
                  colors.green500 as unknown as Color;
            }
          }
        },
        didDrawPage: () => {
          const isFirst =
            (doc as any).internal.getCurrentPageInfo().pageNumber === 1;
          drawHeader(doc, periodText, `Usuário: ${userText}`, margin, isFirst);
        },
      });

      return (doc as any).lastAutoTable.finalY + 22;
    };

    sections.forEach((section) => {
      cursorY = drawSectionTable(cursorY, section);
    });

    drawFooter(doc);
    doc.save(`Relatorio_Financeiro_${startDate}_a_${endDate}.pdf`);
  };

  return { exportReportAsPDF };
}
