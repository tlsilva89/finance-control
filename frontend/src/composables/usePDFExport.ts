import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuthStore } from "../stores/auth";
import type { FinancialReport } from "../stores/finance";

export function usePDFExport() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || !dateString.includes("-")) return dateString;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
  };

  const exportReportAsPDF = (report: FinancialReport, startDate: string, endDate: string) => {
    const authStore = useAuthStore();
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    doc.setFillColor("#111827");
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#FFFFFF");
    doc.text("FinanceControl", margin, 22);

    doc.setFontSize(10);
    doc.setTextColor("#06B6D4");
    doc.text("Relatório Financeiro Detalhado", margin, 28);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#D1D5DB");
    const periodText = `Período: ${formatDate(report.startDate)} a ${formatDate(
      report.endDate
    )}`;
    doc.text(periodText, pageWidth - margin, 22, { align: "right" });
    const userText = `Usuário: @${authStore.user?.username || "N/A"}`;
    doc.text(userText, pageWidth - margin, 28, { align: "right" });

    autoTable(doc, {
      startY: 40,
      head: [["Resumo", "Valor"]],
      body: [
        ["Total de Entradas", formatCurrency(report.totalIncomes)],
        ["Total de Despesas", formatCurrency(report.totalExpenses)],
        ["Saldo Final", formatCurrency(report.balance)],
      ],
      theme: "grid",
      headStyles: {
        fillColor: "#0E7490",
        textColor: "#FFFFFF",
        fontStyle: "bold",
      },
      styles: {
        fillColor: "#1F2937",
        textColor: "#E5E7EB",
        lineColor: "#374151",
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: "#374151",
      },
      bodyStyles: {
        fontStyle: "bold",
        cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
            if (data.row.index === 0) data.cell.styles.textColor = '#4ADE80';
            if (data.row.index === 1) data.cell.styles.textColor = '#F87171';
            if (data.row.index === 2) data.cell.styles.textColor = report.balance >= 0 ? '#60A5FA' : '#F59E0B';
        }
      }
    });

    const sections = [
      { title: 'Entradas', items: report.incomes, columns: ["Data", "Descrição", "Valor"] },
      { title: 'Despesas de Cartão', items: report.creditCardExpenses, columns: ["Data", "Descrição", "Valor"] },
      { title: 'Assinaturas', items: report.subscriptions, columns: ["Data Renov.", "Nome", "Valor"] },
      { title: 'Serviços', items: report.services, columns: ["Vencimento", "Nome", "Valor"] }
    ];

    sections.forEach(section => {
        if (section.items.length > 0) {
            const lastTable = (doc as any).lastAutoTable;
            const startY = lastTable ? lastTable.finalY + 15 : 40;

            autoTable(doc, {
                startY,
                head: [section.columns],
                body: section.items.map((item: any) => [
                    formatDate(item.date || item.purchaseDate || item.renewalDate || `Dia ${item.dueDate}`),
                    item.description || item.name,
                    formatCurrency(item.amount || item.installmentAmount)
                ]),
                theme: "grid",
                headStyles: { fillColor: "#374151", textColor: "#FFFFFF" },
                styles: { textColor: "#D1D5DB", lineColor: "#4B5563" },
                didDrawPage: (data) => {
                    if(data.cursor) {
                        doc.setFontSize(14);
                        doc.setTextColor("#E5E7EB");
                        doc.text(section.title, margin, data.cursor.y - 10);
                    }
                }
            });
        }
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor("#9CA3AF");
      const text = `Página ${i} de ${pageCount} | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`;
      doc.text(text, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    doc.save(`Relatorio_Financeiro_${startDate}_a_${endDate}.pdf`);
  };

  return { exportReportAsPDF };
}
