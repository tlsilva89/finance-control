using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;

namespace FinanceControl.Api.Endpoints;

public static class ReportEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/reports")
            .WithTags("Reports")
            .RequireAuthorization();

        group.MapGet("/financial", GetFinancialReport);
    }

    private static async Task<IResult> GetFinancialReport(
        HttpContext httpContext,
        AppDbContext context,
        DateTime startDate,
        DateTime endDate)
    {
        var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var incomes = await context.Incomes
            .Where(i => i.UserId == userId && i.Date >= startDate && i.Date <= endDate)
            .ToListAsync();

        var creditCardExpenses = await context.CreditCardExpenses
            .Where(e => e.UserId == userId && e.PurchaseDate >= startDate && e.PurchaseDate <= endDate)
            .ToListAsync();

        var subscriptions = await context.Subscriptions
            .Where(s => s.UserId == userId && s.RenewalDate >= startDate && s.RenewalDate <= endDate)
            .ToListAsync();

        var services = await context.Services
            .Where(s => s.UserId == userId && s.DueDate >= startDate.Day && s.DueDate <= endDate.Day)
            .ToListAsync();

        var totalIncomes = incomes.Sum(i => i.Amount);
        var totalCardExpenses = creditCardExpenses.Sum(e => e.InstallmentAmount);
        var totalSubscriptions = subscriptions.Sum(s => s.Amount);
        var totalServices = services.Sum(s => s.Amount);

        var totalExpenses = totalCardExpenses + totalSubscriptions + totalServices;

        var report = new FinancialReport
        {
            StartDate = startDate,
            EndDate = endDate,
            TotalIncomes = totalIncomes,
            TotalExpenses = totalExpenses,
            Balance = totalIncomes - totalExpenses,
            Incomes = incomes,
            CreditCardExpenses = creditCardExpenses,
            Subscriptions = subscriptions,
            Services = services
        };

        return Results.Ok(report);
    }
}