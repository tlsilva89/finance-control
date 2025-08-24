using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;

namespace FinanceControl.Api.Endpoints;

public static class ServicesEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/services")
            .WithTags("Services")
            .RequireAuthorization();

        group.MapGet("", GetServices);
        group.MapPost("", CreateService);
        group.MapPut("/{id:int}", UpdateService);
        group.MapDelete("/{id:int}", DeleteService);
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

    private static async Task<IResult> GetServices(
        AppDbContext context,
        HttpContext httpContext,
        string? monthReference = null)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var query = context.Services.Where(s => s.UserId == userId);
            
            if (!string.IsNullOrEmpty(monthReference))
            {
                query = query.Where(s => s.MonthReference == monthReference);
            }
            
            var services = await query.OrderBy(s => s.Name).ToListAsync();
            return Results.Ok(services);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao buscar serviços", details = ex.Message });
        }
    }

    private static async Task<IResult> CreateService(
        Service service,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(service.Name))
                return Results.BadRequest(new { error = "Nome do serviço é obrigatório" });
                
            if (service.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });
                
            if (service.DueDate < 1 || service.DueDate > 31)
                return Results.BadRequest(new { error = "Data de vencimento deve estar entre 1 e 31" });
                
            if (string.IsNullOrWhiteSpace(service.Category))
                return Results.BadRequest(new { error = "Categoria é obrigatória" });
                
            if (string.IsNullOrWhiteSpace(service.MonthReference))
                return Results.BadRequest(new { error = "Referência do mês é obrigatória" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            service.UserId = userId;
            service.CreatedAt = DateTime.UtcNow;
            
            context.Services.Add(service);
            await context.SaveChangesAsync();
            
            return Results.Created($"/api/services/{service.Id}", service);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao criar serviço", details = ex.Message });
        }
    }

    private static async Task<IResult> UpdateService(
        int id,
        Service updatedService,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(updatedService.Name))
                return Results.BadRequest(new { error = "Nome do serviço é obrigatório" });
                
            if (updatedService.Amount <= 0)
                return Results.BadRequest(new { error = "Valor deve ser maior que zero" });
                
            if (updatedService.DueDate < 1 || updatedService.DueDate > 31)
                return Results.BadRequest(new { error = "Data de vencimento deve estar entre 1 e 31" });
                
            if (string.IsNullOrWhiteSpace(updatedService.Category))
                return Results.BadRequest(new { error = "Categoria é obrigatória" });
                
            if (string.IsNullOrWhiteSpace(updatedService.MonthReference))
                return Results.BadRequest(new { error = "Referência do mês é obrigatória" });

            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var service = await context.Services
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
                
            if (service == null)
            {
                return Results.NotFound(new { error = "Serviço não encontrado" });
            }
            
            service.Name = updatedService.Name;
            service.Amount = updatedService.Amount;
            service.DueDate = updatedService.DueDate;
            service.Category = updatedService.Category;
            service.MonthReference = updatedService.MonthReference;
            
            await context.SaveChangesAsync();
            return Results.Ok(service);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao atualizar serviço", details = ex.Message });
        }
    }

    private static async Task<IResult> DeleteService(
        int id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = int.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var service = await context.Services
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
                
            if (service == null)
            {
                return Results.NotFound(new { error = "Serviço não encontrado" });
            }
            
            context.Services.Remove(service);
            await context.SaveChangesAsync();
            
            return Results.Ok(new { message = "Serviço removido com sucesso" });
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao remover serviço", details = ex.Message });
        }
    }
}
