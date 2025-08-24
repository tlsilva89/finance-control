namespace FinanceControl.Api.Models;

public class FinancialReport
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalIncomes { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance { get; set; }
    public ICollection<Income> Incomes { get; set; } = new List<Income>();
    public ICollection<CreditCardExpense> CreditCardExpenses { get; set; } = new List<CreditCardExpense>();
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    public ICollection<Service> Services { get; set; } = new List<Service>();
}
