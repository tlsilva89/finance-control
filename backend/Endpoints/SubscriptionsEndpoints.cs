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
        group.MapPut("/{id:guid}", UpdateSubscription);
        group.MapDelete("/{id:guid}", DeleteSubscription);
    }
    private static async Task<IResult> GetSubscriptions(
        string? monthReference,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var query = context.Subscriptions.Where(s => s.UserId == userId);
            if (!string.IsNullOrEmpty(monthReference))
            {
                query = query.Where(s => s.MonthReference == monthReference);
            }
            var subscriptions = await query.OrderBy(s => s.Name).ToListAsync();
            return Results.Ok(subscriptions);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao buscar assinaturas" });
        }
    }
    private static async Task<IResult> CreateSubscription(
        Subscription subscription,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            subscription.Id = Guid.NewGuid();
            subscription.UserId = userId;
            subscription.CreatedAt = DateTime.UtcNow;
            context.Subscriptions.Add(subscription);
            await context.SaveChangesAsync();
            return Results.Created($"/api/subscriptions/{subscription.Id}", subscription);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao criar assinatura" });
        }
    }
    private static async Task<IResult> UpdateSubscription(
        Guid id,
        Subscription updatedSubscription,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var subscription = await context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (subscription == null)
            {
                return Results.NotFound(new { error = "Assinatura não encontrada" });
            }
            subscription.Name = updatedSubscription.Name;
            subscription.Amount = updatedSubscription.Amount;
            subscription.RenewalDate = updatedSubscription.RenewalDate;
            subscription.Category = updatedSubscription.Category;
            subscription.MonthReference = updatedSubscription.MonthReference;
            await context.SaveChangesAsync();
            return Results.Ok(subscription);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao atualizar assinatura" });
        }
    }
    private static async Task<IResult> DeleteSubscription(
        Guid id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
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
        catch
        {
            return Results.BadRequest(new { error = "Erro ao remover assinatura" });
        }
    }
}
