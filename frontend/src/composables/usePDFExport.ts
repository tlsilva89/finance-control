import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { useAuthStore } from "../stores/auth";
import type { FinancialReport } from "../stores/finance";

export function usePDFExport() {
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

  const drawHeader = (
    doc: jsPDF,
    title: string,
    subtitle: string,
    userLine: string,
    margin: number
  ) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 36, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text(title, margin, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(subtitle, margin, 24);

    doc.setTextColor(55, 65, 81);
    doc.text(userLine, pageWidth - margin, 16, { align: "right" });
  };

  const drawFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      const text = `Página ${i} de ${pageCount} • Gerado em ${new Date().toLocaleDateString(
        "pt-BR"
      )}`;
      doc.text(text, pageWidth / 2, pageHeight - 8, { align: "center" });
    }
  };

  const sectionTitle = (
    doc: jsPDF,
    text: string,
    y: number,
    margin: number
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(31, 41, 55);
    doc.text(text, margin, y);
    return y + 6;
  };

  const exportReportAsPDF = (
    report: FinancialReport,
    startDate: string,
    endDate: string
  ) => {
    const authStore = useAuthStore();
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 36;

    const periodText = `Período: ${formatDate(report.startDate)} a ${formatDate(
      report.endDate
    )}`;
    const userText = `Usuário: @${authStore.user?.username || "N/A"}`;

    drawHeader(doc, "FinanceControl", periodText, userText, margin);

    autoTable(doc, {
      startY: 52,
      styles: {
        font: "helvetica",
        fontSize: 10,
        textColor: [31, 41, 55],
        lineColor: [229, 231, 235],
        lineWidth: 0.5,
        halign: "left",
        valign: "middle",
        cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
      },
      headStyles: {
        fillColor: [14, 116, 144],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {},
      alternateRowStyles: { fillColor: [249, 250, 251] },
      theme: "grid",
      head: [["Resumo", "Valor"]],
      body: [
        ["Total de Entradas", formatCurrency(report.totalIncomes)],
        ["Total de Despesas", formatCurrency(report.totalExpenses)],
        ["Saldo Final", formatCurrency(report.balance)],
      ],
      columnStyles: {
        0: { cellWidth: pageWidth * 0.55 },
        1: { cellWidth: pageWidth * 0.25, halign: "right" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          if (data.row.index === 0) data.cell.styles.textColor = [22, 163, 74];
          if (data.row.index === 1) data.cell.styles.textColor = [220, 38, 38];
          if (data.row.index === 2)
            data.cell.styles.textColor =
              report.balance >= 0 ? [37, 99, 235] : [234, 88, 12];
          data.cell.styles.fontStyle = "bold";
        }
      },
      margin: { left: margin, right: margin },
      tableWidth: pageWidth - margin * 2,
    });

    let cursorY = (doc as any).lastAutoTable.finalY + 18;

    const sections: Array<{
      title: string;
      rows: RowInput[];
    }> = [
      {
        title: "Entradas",
        rows: report.incomes.map((i) => [
          formatDate(i.date),
          i.description,
          formatCurrency(i.amount),
        ]),
      },
      {
        title: "Despesas de Cartão",
        rows: report.creditCardExpenses.map((e) => [
          formatDate(e.purchaseDate),
          e.description,
          formatCurrency(e.installmentAmount),
        ]),
      },
      {
        title: "Assinaturas",
        rows: report.subscriptions.map((s) => [
          formatDate(s.renewalDate),
          s.name,
          formatCurrency(s.amount),
        ]),
      },
      {
        title: "Serviços",
        rows: report.services.map((s) => [
          `Dia ${s.dueDate}`,
          s.name,
          formatCurrency(s.amount),
        ]),
      },
    ];

    sections.forEach((section) => {
      const remaining = doc.internal.pageSize.getHeight() - cursorY - 120;
      if (remaining < 80) {
        doc.addPage();
        drawHeader(doc, "FinanceControl", periodText, userText, margin);
        cursorY = 52;
      }

      cursorY = sectionTitle(doc, `${section.title}`, cursorY, margin) + 6;

      autoTable(doc, {
        startY: cursorY,
        styles: {
          font: "helvetica",
          fontSize: 9.5,
          textColor: [31, 41, 55],
          lineColor: [229, 231, 235],
          lineWidth: 0.5,
          cellPadding: { top: 5, right: 6, bottom: 5, left: 6 },
          halign: "left",
          valign: "middle",
        },
        headStyles: {
          fillColor: [55, 65, 81],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "left",
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        theme: "grid",
        head: [["Data", "Descrição", "Valor"]],
        body: section.rows,
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
          }
        },
        didDrawPage: () => {
          drawHeader(doc, "FinanceControl", periodText, userText, margin);
        },
      });

      cursorY = (doc as any).lastAutoTable.finalY + 18;
    });

    drawFooter(doc);
    doc.save(`Relatorio_Financeiro_${startDate}_a_${endDate}.pdf`);
  };

  return { exportReportAsPDF };
}
