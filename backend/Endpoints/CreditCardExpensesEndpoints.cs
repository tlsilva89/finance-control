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
        group.MapGet("/card/{cardId:guid}", GetExpensesByCard);
        group.MapPost("", CreateExpense);
        group.MapPost("/with-installments", CreateExpenseWithInstallments);
        group.MapPost("/existing-with-installments", CreateExistingExpenseWithInstallments);
        group.MapPut("/{id:guid}", UpdateExpense);
        group.MapDelete("/{id:guid}", DeleteExpense);
        group.MapPatch("/{id:guid}/pay", MarkAsPaid);
    }

    private static async Task<IResult> GetExpenses(
        string? monthReference,
        string? category,
        bool? isPaid,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var query = context.CreditCardExpenses
                .Include(e => e.CreditCard)
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
        catch
        {
            return Results.BadRequest(new { error = "Erro ao buscar gastos" });
        }
    }

    private static async Task<IResult> GetExpensesByCard(
        Guid cardId,
        string? monthReference,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var query = context.CreditCardExpenses
                .Include(e => e.CreditCard)
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
        catch
        {
            return Results.BadRequest(new { error = "Erro ao buscar gastos do cartão" });
        }
    }

    private static async Task<IResult> CreateExpense(
        CreditCardExpense expense,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == expense.CreditCardId && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.BadRequest(new { error = "Cartão não encontrado" });
            }

            expense.Id = Guid.NewGuid();
            expense.UserId = userId;
            expense.CreatedAt = DateTime.UtcNow;
            
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
            
            creditCard.CurrentDebt += expense.InstallmentAmount;
            
            await context.SaveChangesAsync();

            return Results.Created($"/api/credit-card-expenses/{expense.Id}", expense);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao criar gasto" });
        }
    }

    private static async Task<IResult> CreateExpenseWithInstallments(
        CreateExpenseWithInstallmentsRequest request,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == request.CreditCardId && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.BadRequest(new { error = "Cartão não encontrado" });
            }

            var expenses = new List<CreditCardExpense>();
            var baseDate = DateTime.Parse(request.PurchaseDate);

            for (int i = 1; i <= request.Installments; i++)
            {
                var installmentDate = baseDate.AddMonths(i - 1);
                
                var expense = new CreditCardExpense
                {
                    Id = Guid.NewGuid(),
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
        catch
        {
            return Results.BadRequest(new { error = "Erro ao criar gastos parcelados" });
        }
    }

    private static async Task<IResult> CreateExistingExpenseWithInstallments(
        CreateExistingExpenseRequest request,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var creditCard = await context.CreditCards
                .FirstOrDefaultAsync(c => c.Id == request.CreditCardId && c.UserId == userId);

            if (creditCard == null)
            {
                return Results.BadRequest(new { error = "Cartão não encontrado" });
            }

            var expenses = new List<CreditCardExpense>();
            var originalDate = DateTime.Parse(request.OriginalPurchaseDate);

            for (int i = request.CurrentInstallment; i <= request.TotalInstallments; i++)
            {
                var installmentDate = originalDate.AddMonths(i - 1);
                
                var expense = new CreditCardExpense
                {
                    Id = Guid.NewGuid(),
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
        catch
        {
            return Results.BadRequest(new { error = "Erro ao criar compra existente parcelada" });
        }
    }

    private static async Task<IResult> UpdateExpense(
        Guid id,
        CreditCardExpense updatedExpense,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var expense = await context.CreditCardExpenses
                .Include(e => e.CreditCard)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
            {
                return Results.NotFound(new { error = "Gasto não encontrado" });
            }

            var oldInstallmentAmount = expense.InstallmentAmount;

            expense.Description = updatedExpense.Description;
            expense.Amount = updatedExpense.Amount;
            expense.PurchaseDate = updatedExpense.PurchaseDate;
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

            expense.CreditCard.CurrentDebt = expense.CreditCard.CurrentDebt - oldInstallmentAmount + expense.InstallmentAmount;

            await context.SaveChangesAsync();

            return Results.Ok(expense);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao atualizar gasto" });
        }
    }

    private static async Task<IResult> DeleteExpense(
        Guid id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var expense = await context.CreditCardExpenses
                .Include(e => e.CreditCard)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
            {
                return Results.NotFound(new { error = "Gasto não encontrado" });
            }

            expense.CreditCard.CurrentDebt -= expense.InstallmentAmount;

            context.CreditCardExpenses.Remove(expense);
            await context.SaveChangesAsync();

            return Results.Ok(new { message = "Gasto removido com sucesso" });
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao remover gasto" });
        }
    }

    private static async Task<IResult> MarkAsPaid(
        Guid id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            
            var expense = await context.CreditCardExpenses
                .Include(e => e.CreditCard)
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (expense == null)
            {
                return Results.NotFound(new { error = "Gasto não encontrado" });
            }

            expense.IsPaid = !expense.IsPaid;
            
            if (!expense.IsPaid)
            {
                expense.CreditCard.CurrentDebt += expense.InstallmentAmount;
            }
            else
            {
                expense.CreditCard.CurrentDebt -= expense.InstallmentAmount;
            }

            await context.SaveChangesAsync();

            return Results.Ok(expense);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao atualizar status do pagamento" });
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
    Guid CreditCardId);

public record CreateExistingExpenseRequest(
    string Description,
    string OriginalPurchaseDate,
    decimal TotalAmount,
    decimal InstallmentAmount,
    int TotalInstallments,
    int CurrentInstallment,
    string Category,
    Guid CreditCardId);
