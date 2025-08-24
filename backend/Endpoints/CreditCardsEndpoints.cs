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
        group.MapGet("/{id:int}", GetCreditCard);
        group.MapPost("", CreateCreditCard);
        group.MapPut("/{id:int}", UpdateCreditCard);
        group.MapDelete("/{id:int}", DeleteCreditCard);
    }

    private static DateTime EnsureUtc(DateTime dateTime)
    {
        return dateTime.Kind switch
        {
            DateTimeKind.Unspecified => DateTime.SpecifyKind(dateTime, DateTimeKind.Utc),
            DateTimeKind.Local => dateTime.ToUniversalTime(),
            _ => dateTime
        };
    }

    private static async Task<IResult> GetCreditCards(
        AppDbContext context,
        HttpContext httpContext,
        string? monthReference = null)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var creditCards = await context.CreditCards
                .Where(c => c.UserId == userId)
                .OrderBy(c => c.Name)
                .ToListAsync();

            DateTime startDate, endDate;
            if (!string.IsNullOrEmpty(monthReference) &&
                DateTime.TryParseExact(monthReference, "yyyy-MM", null, System.Globalization.DateTimeStyles.None, out var date))
            {
                startDate = EnsureUtc(new DateTime(date.Year, date.Month, 1));
                endDate = EnsureUtc(startDate.AddMonths(1).AddDays(-1));
            }
            else
            {
                var now = DateTime.UtcNow;
                startDate = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
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

            return Results.Ok(creditCards);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar cartões", details = ex.Message });
        }
    }

    private static async Task<IResult> GetCreditCard(
        int id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.NotFound(new { error = "Cartão não encontrado" });
            }

            var now = DateTime.UtcNow;
            var startDate = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
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
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar cartão", details = ex.Message });
        }
    }

    private static async Task<IResult> CreateCreditCard(
        CreditCard creditCard,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(creditCard.Name))
                return Results.BadRequest(new { error = "Nome do cartão é obrigatório" });
                
            if (creditCard.Limit <= 0)
                return Results.BadRequest(new { error = "Limite deve ser maior que zero" });
                
            if (creditCard.DueDate < 1 || creditCard.DueDate > 31)
                return Results.BadRequest(new { error = "Data de vencimento deve estar entre 1 e 31" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            creditCard.UserId = userId;
            creditCard.CreatedAt = DateTime.UtcNow;
            creditCard.CurrentDebt = 0;

            if (string.IsNullOrEmpty(creditCard.MonthReference))
            {
                creditCard.MonthReference = DateTime.UtcNow.ToString("yyyy-MM");
            }

            context.CreditCards.Add(creditCard);
            await context.SaveChangesAsync();

            return Results.Created($"/api/credit-cards/{creditCard.Id}", creditCard);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao criar cartão", details = ex.Message });
        }
    }

    private static async Task<IResult> UpdateCreditCard(
        int id,
        CreditCard updatedCreditCard,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(updatedCreditCard.Name))
                return Results.BadRequest(new { error = "Nome do cartão é obrigatório" });
                
            if (updatedCreditCard.Limit <= 0)
                return Results.BadRequest(new { error = "Limite deve ser maior que zero" });
                
            if (updatedCreditCard.DueDate < 1 || updatedCreditCard.DueDate > 31)
                return Results.BadRequest(new { error = "Data de vencimento deve estar entre 1 e 31" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
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

            var now = DateTime.UtcNow;
            var startDate = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
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
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao atualizar cartão", details = ex.Message });
        }
    }

    private static async Task<IResult> DeleteCreditCard(
        int id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
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
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao remover cartão", details = ex.Message });
        }
    }
}
