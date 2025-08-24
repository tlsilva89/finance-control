using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;
using FinanceControl.Api.Utils;

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

            DateTime referenceDate;
            if (!string.IsNullOrEmpty(monthReference) && DateTime.TryParseExact(monthReference, "yyyy-MM", null, System.Globalization.DateTimeStyles.None, out var parsedDate))
            {
                referenceDate = new DateTime(parsedDate.Year, parsedDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            }
            else
            {
                referenceDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            }

            foreach (var card in creditCards)
            {
                var (startDate, endDate) = InvoiceCycleCalculator.GetInvoicePeriod(card.ClosingDay, referenceDate);

                var monthDebt = await context.CreditCardExpenses
                    .Where(e => e.CreditCardId == card.Id &&
                                !e.IsPaid &&
                                e.PurchaseDate >= startDate &&
                                e.PurchaseDate <= endDate)
                    .SumAsync(e => e.InstallmentAmount);
                
                var totalConsumption = await context.CreditCardExpenses
                    .Where(e => e.CreditCardId == card.Id && !e.IsPaid)
                    .SumAsync(e => e.InstallmentAmount);

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

            var referenceDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var (startDate, endDate) = InvoiceCycleCalculator.GetInvoicePeriod(creditCard.ClosingDay, referenceDate);

            var currentDebt = await context.CreditCardExpenses
                .Where(e => e.CreditCardId == id &&
                            !e.IsPaid &&
                            e.PurchaseDate >= startDate &&
                            e.PurchaseDate <= endDate)
                .SumAsync(e => e.InstallmentAmount);
            
            var totalConsumption = await context.CreditCardExpenses
                .Where(e => e.CreditCardId == id && !e.IsPaid)
                .SumAsync(e => e.InstallmentAmount);

            creditCard.CurrentDebt = currentDebt;
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

            if (creditCard.ClosingDay < 1 || creditCard.ClosingDay > 31)
                return Results.BadRequest(new { error = "Dia de fechamento deve estar entre 1 e 31" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            creditCard.UserId = userId;
            creditCard.CreatedAt = DateTime.UtcNow;
            creditCard.CurrentDebt = 0;

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
            
            if (updatedCreditCard.ClosingDay < 1 || updatedCreditCard.ClosingDay > 31)
                return Results.BadRequest(new { error = "Dia de fechamento deve estar entre 1 e 31" });

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
            creditCard.ClosingDay = updatedCreditCard.ClosingDay;

            await context.SaveChangesAsync();
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