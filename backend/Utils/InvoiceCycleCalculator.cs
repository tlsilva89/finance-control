namespace FinanceControl.Api.Utils;

public static class InvoiceCycleCalculator
{
    public static (DateTime StartDate, DateTime EndDate) GetInvoicePeriod(int closingDay, DateTime monthReference)
    {
        var refUtc = monthReference.Kind == DateTimeKind.Utc
            ? monthReference
            : DateTime.SpecifyKind(new DateTime(monthReference.Year, monthReference.Month, monthReference.Day), DateTimeKind.Utc);

        var firstOfMonthUtc = new DateTime(refUtc.Year, refUtc.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var endDay = Math.Min(closingDay, DateTime.DaysInMonth(firstOfMonthUtc.Year, firstOfMonthUtc.Month));
        var endDate = new DateTime(firstOfMonthUtc.Year, firstOfMonthUtc.Month, endDay, 23, 59, 59, 999, DateTimeKind.Utc);

        var prevMonth = firstOfMonthUtc.AddMonths(-1);
        var startDay = Math.Min(closingDay, DateTime.DaysInMonth(prevMonth.Year, prevMonth.Month)) + 1;
        DateTime startDate;
        if (startDay > DateTime.DaysInMonth(prevMonth.Year, prevMonth.Month))
        {
            startDate = new DateTime(firstOfMonthUtc.Year, firstOfMonthUtc.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        }
        else
        {
            startDate = new DateTime(prevMonth.Year, prevMonth.Month, startDay, 0, 0, 0, DateTimeKind.Utc);
        }

        return (startDate, endDate);
    }
}
