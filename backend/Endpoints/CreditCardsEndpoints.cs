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

            var query = context.CreditCards.Where(c => c.UserId == userId);

            if (!string.IsNullOrEmpty(monthReference))
            {
                query = query.Where(c => c.MonthReference == monthReference);
            }

            var creditCards = await query.OrderBy(c => c.Name).ToListAsync();

            return Results.Ok(creditCards);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar cartões" });
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

            context.CreditCards.Add(creditCard);
            await context.SaveChangesAsync();

            return Results.Created($"/api/credit-cards/{creditCard.Id}", creditCard);
        }
        catch (Exception ex)
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
            creditCard.CurrentDebt = updatedCreditCard.CurrentDebt;
            creditCard.DueDate = updatedCreditCard.DueDate;
            creditCard.MonthReference = updatedCreditCard.MonthReference;

            await context.SaveChangesAsync();

            return Results.Ok(creditCard);
        }
        catch (Exception ex)
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
            return Results.BadRequest(new { error = "Erro ao remover cartão" });
        }
    }
}
