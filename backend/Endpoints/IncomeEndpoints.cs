using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;

namespace FinanceControl.Api.Endpoints;

public static class IncomeEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/incomes")
            .WithTags("Incomes")
            .RequireAuthorization();

        group.MapGet("", GetIncomes);
        group.MapPost("", CreateIncome);
        group.MapPut("/{id:guid}", UpdateIncome);
        group.MapDelete("/{id:guid}", DeleteIncome);
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

    private static async Task<IResult> GetIncomes(
        AppDbContext context,
        HttpContext httpContext,
        string? monthReference = null)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var query = context.Incomes.Where(i => i.UserId == userId);
            
            if (!string.IsNullOrEmpty(monthReference))
            {
                query = query.Where(i => i.MonthReference == monthReference);
            }
            
            var incomes = await query.OrderByDescending(i => i.Date).ToListAsync();
            return Results.Ok(incomes);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar entradas", details = ex.Message });
        }
    }

    private static async Task<IResult> CreateIncome(
        Income income,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(income.Description))
                return Results.BadRequest(new { error = "Descrição é obrigatória" });
                
            if (income.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });
                
            if (string.IsNullOrWhiteSpace(income.MonthReference))
                return Results.BadRequest(new { error = "Referência do mês é obrigatória" });

            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            income.Id = Guid.NewGuid();
            income.UserId = userId;
            income.CreatedAt = DateTime.UtcNow;
            income.Date = EnsureUtc(income.Date);
            
            context.Incomes.Add(income);
            await context.SaveChangesAsync();
            
            return Results.Created($"/api/incomes/{income.Id}", income);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao criar entrada", details = ex.Message });
        }
    }

    private static async Task<IResult> UpdateIncome(
        Guid id,
        Income updatedIncome,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(updatedIncome.Description))
                return Results.BadRequest(new { error = "Descrição é obrigatória" });
                
            if (updatedIncome.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });
                
            if (string.IsNullOrWhiteSpace(updatedIncome.MonthReference))
                return Results.BadRequest(new { error = "Referência do mês é obrigatória" });

            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var income = await context.Incomes
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
                
            if (income == null)
            {
                return Results.NotFound(new { error = "Entrada não encontrada" });
            }
            
            income.Description = updatedIncome.Description;
            income.Amount = updatedIncome.Amount;
            income.Date = EnsureUtc(updatedIncome.Date);
            income.MonthReference = updatedIncome.MonthReference;
            
            await context.SaveChangesAsync();
            return Results.Ok(income);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao atualizar entrada", details = ex.Message });
        }
    }

    private static async Task<IResult> DeleteIncome(
        Guid id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var income = await context.Incomes
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
                
            if (income == null)
            {
                return Results.NotFound(new { error = "Entrada não encontrada" });
            }
            
            context.Incomes.Remove(income);
            await context.SaveChangesAsync();
            
            return Results.Ok(new { message = "Entrada removida com sucesso" });
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao remover entrada", details = ex.Message });
        }
    }
}
