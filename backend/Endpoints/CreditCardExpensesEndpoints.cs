using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;

namespace FinanceControl.Api.Endpoints;

public static class CreditCardExpensesEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/credit-card-expenses")
            .WithTags("Credit Card Expenses")
            .RequireAuthorization();

        group.MapGet("", GetExpenses);
        group.MapGet("/card/{cardId:int}", GetExpensesByCard);
        group.MapGet("/card/{cardId:int}/active", GetActiveExpensesByCard);
        group.MapPost("", CreateExpense);
        group.MapPost("/with-installments", CreateExpenseWithInstallments);
        group.MapPost("/existing-with-installments", CreateExistingExpenseWithInstallments);
        group.MapPut("/{id:int}", UpdateExpense);
        group.MapDelete("/{id:int}", DeleteExpense);
        group.MapPatch("/{id:int}/pay", MarkAsPaid);
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

    private static async Task<IResult> GetExpenses(
        AppDbContext context,
        HttpContext httpContext,
        string? monthReference = null,
        string? category = null,
        bool? isPaid = null)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var query = context.CreditCardExpenses
                .Where(e => e.UserId == userId);

            if (!string.IsNullOrEmpty(monthReference))
            {
                if (DateTime.TryParseExact(monthReference, "yyyy-MM", null, System.Globalization.DateTimeStyles.None, out var date))
                {
                    var startDate = new DateTime(date.Year, date.Month, 1);
                    var endDate = startDate.AddMonths(1).AddDays(-1);
                    query = query.Where(e => e.PurchaseDate >= startDate && e.PurchaseDate <= endDate);
                }
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(e => e.Category == category);
            }

            if (isPaid.HasValue)
            {
                query = query.Where(e => e.IsPaid == isPaid.Value);
            }

            var expenses = await query
                .OrderByDescending(e => e.PurchaseDate)
                .ThenBy(e => e.Description)
                .ToListAsync();

            return Results.Ok(expenses);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar gastos", details = ex.Message });
        }
    }

    private static async Task<IResult> GetExpensesByCard(
        int cardId,
        AppDbContext context,
        HttpContext httpContext,
        string? monthReference = null)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var query = context.CreditCardExpenses
                .Where(e => e.UserId == userId && e.CreditCardId == cardId);

            if (!string.IsNullOrEmpty(monthReference))
            {
                if (DateTime.TryParseExact(monthReference, "yyyy-MM", null, System.Globalization.DateTimeStyles.None, out var date))
                {
                    var startDate = new DateTime(date.Year, date.Month, 1);
                    var endDate = startDate.AddMonths(1).AddDays(-1);
                    query = query.Where(e => e.PurchaseDate >= startDate && e.PurchaseDate <= endDate);
                }
            }

            var expenses = await query
                .OrderByDescending(e => e.PurchaseDate)
                .ThenBy(e => e.Description)
                .ToListAsync();

            return Results.Ok(expenses);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar gastos do cartão", details = ex.Message });
        }
    }

    private static async Task<IResult> GetActiveExpensesByCard(
        int cardId,
        AppDbContext context,
        HttpContext httpContext,
        string? periodMonth = null)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var query = context.CreditCardExpenses
                .Where(e => e.UserId == userId && e.CreditCardId == cardId && !e.IsPaid);
            
            if (string.IsNullOrEmpty(periodMonth))
            {
                var allExpenses = await query.OrderBy(e => e.PurchaseDate).ToListAsync();
                return Results.Ok(allExpenses);
            }

            if (DateTime.TryParseExact(periodMonth, "yyyy-MM", null, System.Globalization.DateTimeStyles.None, out var targetPeriod))
            {
                // CORREÇÃO: A lógica foi simplificada para filtrar diretamente pelo mês da PurchaseDate.
                // A PurchaseDate de uma parcela já representa o mês de vencimento daquela parcela.
                var startDate = new DateTime(targetPeriod.Year, targetPeriod.Month, 1, 0, 0, 0, DateTimeKind.Utc);
                var endDate = startDate.AddMonths(1).AddTicks(-1);

                var activeInPeriod = await query
                    .Where(e => e.PurchaseDate >= startDate && e.PurchaseDate <= endDate)
                    .OrderBy(e => e.PurchaseDate)
                    .ToListAsync();

                return Results.Ok(activeInPeriod);
            }

            var defaultExpenses = await query.OrderBy(e => e.PurchaseDate).ToListAsync();
            return Results.Ok(defaultExpenses);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar parcelas ativas", details = ex.Message });
        }
    }

    private static async Task<IResult> CreateExpense(
        CreditCardExpense expense,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(expense.Description))
                return Results.BadRequest(new { error = "Descrição é obrigatória" });
                
            if (expense.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == expense.CreditCardId && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.BadRequest(new { error = "Cartão não encontrado" });
            }

            expense.UserId = userId;
            expense.CreatedAt = DateTime.UtcNow;
            expense.PurchaseDate = EnsureUtc(expense.PurchaseDate);

            if (expense.CurrentInstallment <= 0)
            {
                expense.CurrentInstallment = 1;
            }

            if (expense.Installments > 1)
            {
                expense.InstallmentAmount = Math.Round(expense.Amount / expense.Installments, 2);
            }
            else
            {
                expense.InstallmentAmount = expense.Amount;
                expense.CurrentInstallment = 1;
            }

            context.CreditCardExpenses.Add(expense);
            await context.SaveChangesAsync();

            return Results.Created($"/api/credit-card-expenses/{expense.Id}", expense);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao criar gasto", details = ex.Message });
        }
    }

    private static async Task<IResult> CreateExpenseWithInstallments(
        CreateExpenseWithInstallmentsRequest request,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Description))
                return Results.BadRequest(new { error = "Descrição é obrigatória" });
                
            if (request.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });
                
            if (request.InstallmentAmount <= 0)
                return Results.BadRequest(new { error = "Valor da parcela deve ser maior que zero" });
                
            if (request.Installments <= 0)
                return Results.BadRequest(new { error = "Número de parcelas deve ser maior que zero" });
                
            if (string.IsNullOrWhiteSpace(request.Category))
                return Results.BadRequest(new { error = "Categoria é obrigatória" });

            if (!DateTime.TryParse(request.PurchaseDate, out var baseDate))
                return Results.BadRequest(new { error = "Data de compra inválida" });

            baseDate = EnsureUtc(baseDate);

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == request.CreditCardId && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.BadRequest(new { error = "Cartão não encontrado" });
            }

            var expenses = new List<CreditCardExpense>();

            for (int i = 1; i <= request.Installments; i++)
            {
                var installmentDate = EnsureUtc(baseDate.AddMonths(i - 1));

                var expense = new CreditCardExpense
                {
                    UserId = userId,
                    CreditCardId = request.CreditCardId,
                    Description = request.Description,
                    Amount = request.Amount,
                    InstallmentAmount = request.InstallmentAmount,
                    PurchaseDate = installmentDate,
                    Installments = request.Installments,
                    CurrentInstallment = i,
                    Category = request.Category,
                    IsPaid = false,
                    CreatedAt = DateTime.UtcNow
                };

                expenses.Add(expense);
                context.CreditCardExpenses.Add(expense);
            }

            await context.SaveChangesAsync();

            return Results.Created("/api/credit-card-expenses/with-installments", expenses);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao criar gastos parcelados", details = ex.Message });
        }
    }

    private static async Task<IResult> CreateExistingExpenseWithInstallments(
        CreateExistingExpenseRequest request,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Description))
                return Results.BadRequest(new { error = "Descrição é obrigatória" });
                
            if (request.TotalAmount <= 0)
                return Results.BadRequest(new { error = "Valor total deve ser maior que zero" });
                
            if (request.InstallmentAmount <= 0)
                return Results.BadRequest(new { error = "Valor da parcela deve ser maior que zero" });
                
            if (request.TotalInstallments <= 0)
                return Results.BadRequest(new { error = "Total de parcelas deve ser maior que zero" });
                
            if (request.CurrentInstallment <= 0)
                return Results.BadRequest(new { error = "Parcela atual deve ser maior que zero" });

            if (!DateTime.TryParse(request.OriginalPurchaseDate, out var originalDate))
                return Results.BadRequest(new { error = "Data original de compra inválida" });

            originalDate = EnsureUtc(originalDate);

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == request.CreditCardId && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.BadRequest(new { error = "Cartão não encontrado" });
            }

            var expenses = new List<CreditCardExpense>();

            for (int i = request.CurrentInstallment; i <= request.TotalInstallments; i++)
            {
                var installmentDate = EnsureUtc(originalDate.AddMonths(i - 1));

                var expense = new CreditCardExpense
                {
                    UserId = userId,
                    CreditCardId = request.CreditCardId,
                    Description = request.Description,
                    Amount = request.TotalAmount,
                    InstallmentAmount = request.InstallmentAmount,
                    PurchaseDate = installmentDate,
                    Installments = request.TotalInstallments,
                    CurrentInstallment = i,
                    Category = request.Category,
                    IsPaid = false,
                    CreatedAt = DateTime.UtcNow
                };

                expenses.Add(expense);
                context.CreditCardExpenses.Add(expense);
            }

            await context.SaveChangesAsync();

            return Results.Created("/api/credit-card-expenses/existing-with-installments", expenses);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao criar compra existente parcelada", details = ex.Message });
        }
    }

    private static async Task<IResult> UpdateExpense(
        int id,
        CreditCardExpense updatedExpense,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(updatedExpense.Description))
                return Results.BadRequest(new { error = "Descrição é obrigatória" });
                
            if (updatedExpense.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var expense = await context.CreditCardExpenses
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
            {
                return Results.NotFound(new { error = "Gasto não encontrado" });
            }

            expense.Description = updatedExpense.Description;
            expense.Amount = updatedExpense.Amount;
            expense.PurchaseDate = EnsureUtc(updatedExpense.PurchaseDate);
            expense.Installments = updatedExpense.Installments;
            expense.CurrentInstallment = updatedExpense.CurrentInstallment;
            expense.Category = updatedExpense.Category;

            if (expense.Installments > 1)
            {
                expense.InstallmentAmount = Math.Round(expense.Amount / expense.Installments, 2);
            }
            else
            {
                expense.InstallmentAmount = expense.Amount;
                expense.CurrentInstallment = 1;
            }

            await context.SaveChangesAsync();

            return Results.Ok(expense);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao atualizar gasto", details = ex.Message });
        }
    }

    private static async Task<IResult> DeleteExpense(
        int id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var expense = await context.CreditCardExpenses
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
            {
                return Results.NotFound(new { error = "Gasto não encontrado" });
            }

            context.CreditCardExpenses.Remove(expense);
            await context.SaveChangesAsync();

            return Results.Ok(new { message = "Gasto removido com sucesso" });
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao remover gasto", details = ex.Message });
        }
    }

    private static async Task<IResult> MarkAsPaid(
        int id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var expense = await context.CreditCardExpenses
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
            {
                return Results.NotFound(new { error = "Gasto não encontrado" });
            }

            expense.IsPaid = !expense.IsPaid;
            await context.SaveChangesAsync();

            return Results.Ok(expense);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao atualizar status do pagamento", details = ex.Message });
        }
    }
}

public record CreateExpenseWithInstallmentsRequest(
    string Description,
    decimal Amount,
    decimal InstallmentAmount,
    string PurchaseDate,
    int Installments,
    string Category,
    int CreditCardId);

public record CreateExistingExpenseRequest(
    string Description,
    string OriginalPurchaseDate,
    decimal TotalAmount,
    decimal InstallmentAmount,
    int TotalInstallments,
    int CurrentInstallment,
    string Category,
    int CreditCardId);