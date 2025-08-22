using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;

namespace FinanceControl.Api.Endpoints;

public static class CreditCardsEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/credit-cards")
            .WithTags("Credit Cards")
            .RequireAuthorization();

        group.MapGet("", GetCreditCards);
        group.MapGet("/{id:guid}", GetCreditCard);
        group.MapPost("", CreateCreditCard);
        group.MapPut("/{id:guid}", UpdateCreditCard);
        group.MapDelete("/{id:guid}", DeleteCreditCard);
    }

    private static async Task<IResult> GetCreditCards(
        string? monthReference,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var creditCards = await context.CreditCards
                .Where(c => c.UserId == userId)
                .OrderBy(c => c.Name)
                .ToListAsync();

            DateTime startDate, endDate;
            if (!string.IsNullOrEmpty(monthReference) &&
                DateTime.TryParseExact(monthReference, "yyyy-MM", null, System.Globalization.DateTimeStyles.None, out var date))
            {
                startDate = new DateTime(date.Year, date.Month, 1);
                endDate = startDate.AddMonths(1).AddDays(-1);
            }
            else
            {
                var now = DateTime.Now;
                startDate = new DateTime(now.Year, now.Month, 1);
                endDate = startDate.AddMonths(1).AddDays(-1);
            }

            foreach (var card in creditCards)
            {
                var monthDebt = await context.CreditCardExpenses
                    .Where(e => e.CreditCardId == card.Id &&
                        e.PurchaseDate >= startDate &&
                        e.PurchaseDate <= endDate &&
                        !e.IsPaid)
                    .SumAsync(e => e.InstallmentAmount);

                var futureExpenses = await context.CreditCardExpenses
                    .Where(e => e.CreditCardId == card.Id &&
                                !e.IsPaid &&
                                e.PurchaseDate >= startDate)
                    .GroupBy(e => new { e.Description, e.Amount, e.Installments })
                    .Select(g => g.Sum(e => e.InstallmentAmount))
                    .ToListAsync();

                var totalConsumption = futureExpenses.Sum();

                card.CurrentDebt = monthDebt;
                card.TotalConsumption = totalConsumption;
            }

            if (!string.IsNullOrEmpty(monthReference))
            {
                creditCards = creditCards.Where(c =>
                    c.CurrentDebt > 0 ||
                    c.MonthReference == monthReference
                ).ToList();
            }

            return Results.Ok(creditCards);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao buscar cartões" });
        }
    }

    private static async Task<IResult> GetCreditCard(
        Guid id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.NotFound(new { error = "Cartão não encontrado" });
            }

            var now = DateTime.Now;
            var startDate = new DateTime(now.Year, now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var totalDebt = await context.CreditCardExpenses
                .Where(e => e.CreditCardId == id &&
                            e.PurchaseDate >= startDate &&
                            e.PurchaseDate <= endDate &&
                            !e.IsPaid)
                .SumAsync(e => e.InstallmentAmount);

            var futureExpenses = await context.CreditCardExpenses
                .Where(e => e.CreditCardId == id &&
                            !e.IsPaid &&
                            e.PurchaseDate >= startDate)
                .GroupBy(e => new { e.Description, e.Amount, e.Installments })
                .Select(g => g.Sum(e => e.InstallmentAmount))
                .ToListAsync();

            var totalConsumption = futureExpenses.Sum();

            creditCard.CurrentDebt = totalDebt;
            creditCard.TotalConsumption = totalConsumption;

            return Results.Ok(creditCard);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao buscar cartão" });
        }
    }

    private static async Task<IResult> CreateCreditCard(
        CreditCard creditCard,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            creditCard.Id = Guid.NewGuid();
            creditCard.UserId = userId;
            creditCard.CreatedAt = DateTime.UtcNow;
            creditCard.CurrentDebt = 0;

            if (string.IsNullOrEmpty(creditCard.MonthReference))
            {
                creditCard.MonthReference = DateTime.Now.ToString("yyyy-MM");
            }

            context.CreditCards.Add(creditCard);
            await context.SaveChangesAsync();

            return Results.Created($"/api/credit-cards/{creditCard.Id}", creditCard);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao criar cartão" });
        }
    }

    private static async Task<IResult> UpdateCreditCard(
        Guid id,
        CreditCard updatedCreditCard,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.NotFound(new { error = "Cartão não encontrado" });
            }

            creditCard.Name = updatedCreditCard.Name;
            creditCard.Limit = updatedCreditCard.Limit;
            creditCard.DueDate = updatedCreditCard.DueDate;
            creditCard.MonthReference = updatedCreditCard.MonthReference;

            await context.SaveChangesAsync();

            var now = DateTime.Now;
            var startDate = new DateTime(now.Year, now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var totalDebt = await context.CreditCardExpenses
                .Where(e => e.CreditCardId == id &&
                            e.PurchaseDate >= startDate &&
                            e.PurchaseDate <= endDate &&
                            !e.IsPaid)
                .SumAsync(e => e.InstallmentAmount);

            var futureExpenses = await context.CreditCardExpenses
                .Where(e => e.CreditCardId == id &&
                            !e.IsPaid &&
                            e.PurchaseDate >= startDate)
                .GroupBy(e => new { e.Description, e.Amount, e.Installments })
                .Select(g => g.Sum(e => e.InstallmentAmount))
                .ToListAsync();

            var totalConsumption = futureExpenses.Sum();

            creditCard.CurrentDebt = totalDebt;
            creditCard.TotalConsumption = totalConsumption;

            return Results.Ok(creditCard);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao atualizar cartão" });
        }
    }

    private static async Task<IResult> DeleteCreditCard(
        Guid id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var creditCard = await context.CreditCards
                .Include(c => c.Expenses)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.NotFound(new { error = "Cartão não encontrado" });
            }

            context.CreditCards.Remove(creditCard);
            await context.SaveChangesAsync();

            return Results.Ok(new { message = "Cartão removido com sucesso" });
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao remover cartão" });
        }
    }
}
