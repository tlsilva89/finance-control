using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;

namespace FinanceControl.Api.Endpoints;

public static class SubscriptionsEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/subscriptions")
            .WithTags("Subscriptions")
            .RequireAuthorization();

        group.MapGet("", GetSubscriptions);
        group.MapPost("", CreateSubscription);
        group.MapPut("/{id:int}", UpdateSubscription);
        group.MapDelete("/{id:int}", DeleteSubscription);
    }

    private static async Task<IResult> GetSubscriptions(
        AppDbContext context,
        HttpContext httpContext,
        string? monthReference = null)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var query = context.Subscriptions.Where(s => s.UserId == userId);
            if (!string.IsNullOrEmpty(monthReference))
            {
                query = query.Where(s => s.MonthReference == monthReference);
            }
            var subscriptions = await query.OrderBy(s => s.Name).ToListAsync();
            return Results.Ok(subscriptions);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar assinaturas", details = ex.Message });
        }
    }

    private static async Task<IResult> CreateSubscription(
        Subscription subscription,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(subscription.Name))
                return Results.BadRequest(new { error = "Nome da assinatura é obrigatório" });
            if (subscription.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });
            if (subscription.DueDate < 1 || subscription.DueDate > 31)
                return Results.BadRequest(new { error = "Dia de renovação deve estar entre 1 e 31" });
            if (string.IsNullOrWhiteSpace(subscription.Category))
                return Results.BadRequest(new { error = "Categoria é obrigatória" });
            if (string.IsNullOrWhiteSpace(subscription.MonthReference))
                return Results.BadRequest(new { error = "Referência do mês é obrigatória" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            subscription.UserId = userId;
            subscription.CreatedAt = DateTime.UtcNow;

            context.Subscriptions.Add(subscription);
            await context.SaveChangesAsync();

            return Results.Created($"/api/subscriptions/{subscription.Id}", subscription);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao criar assinatura", details = ex.Message });
        }
    }

    private static async Task<IResult> UpdateSubscription(
        int id,
        Subscription updatedSubscription,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(updatedSubscription.Name))
                return Results.BadRequest(new { error = "Nome da assinatura é obrigatório" });
            if (updatedSubscription.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });
            if (updatedSubscription.DueDate < 1 || updatedSubscription.DueDate > 31)
                return Results.BadRequest(new { error = "Dia de renovação deve estar entre 1 e 31" });
            if (string.IsNullOrWhiteSpace(updatedSubscription.Category))
                return Results.BadRequest(new { error = "Categoria é obrigatória" });
            if (string.IsNullOrWhiteSpace(updatedSubscription.MonthReference))
                return Results.BadRequest(new { error = "Referência do mês é obrigatória" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var subscription = await context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (subscription == null)
            {
                return Results.NotFound(new { error = "Assinatura não encontrada" });
            }

            subscription.Name = updatedSubscription.Name;
            subscription.Amount = updatedSubscription.Amount;
            subscription.DueDate = updatedSubscription.DueDate;
            subscription.Category = updatedSubscription.Category;
            subscription.MonthReference = updatedSubscription.MonthReference;

            await context.SaveChangesAsync();
            return Results.Ok(subscription);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao atualizar assinatura", details = ex.Message });
        }
    }

    private static async Task<IResult> DeleteSubscription(
        int id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var subscription = await context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (subscription == null)
            {
                return Results.NotFound(new { error = "Assinatura não encontrada" });
            }

            context.Subscriptions.Remove(subscription);
            await context.SaveChangesAsync();

            return Results.Ok(new { message = "Assinatura removida com sucesso" });
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao remover assinatura", details = ex.Message });
        }
    }
}
