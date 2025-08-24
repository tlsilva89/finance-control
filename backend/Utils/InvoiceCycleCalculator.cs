namespace FinanceControl.Api.Utils;

public static class InvoiceCycleCalculator
{
    public static (DateTime StartDate, DateTime EndDate) GetInvoicePeriod(int closingDay, DateTime invoiceDueDate)
    {
        var closingDate = new DateTime(
            invoiceDueDate.AddMonths(-1).Year,
            invoiceDueDate.AddMonths(-1).Month,
            closingDay,
            23, 59, 59, 999, DateTimeKind.Utc
        );

        var startDate = closingDate.AddMonths(-1).AddDays(1);
        startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0, 0, DateTimeKind.Utc);

        return (startDate, closingDate);
    }
}