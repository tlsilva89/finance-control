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
        group.MapPut("/{id:guid}", UpdateService);
        group.MapDelete("/{id:guid}", DeleteService);
    }
    private static async Task<IResult> GetServices(
        string? monthReference,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var query = context.Services.Where(s => s.UserId == userId);
            if (!string.IsNullOrEmpty(monthReference))
            {
                query = query.Where(s => s.MonthReference == monthReference);
            }
            var services = await query.OrderBy(s => s.Name).ToListAsync();
            return Results.Ok(services);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao buscar serviços" });
        }
    }
    private static async Task<IResult> CreateService(
        Service service,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            service.Id = Guid.NewGuid();
            service.UserId = userId;
            service.CreatedAt = DateTime.UtcNow;
            context.Services.Add(service);
            await context.SaveChangesAsync();
            return Results.Created($"/api/services/{service.Id}", service);
        }
        catch
        {
            return Results.BadRequest(new { error = "Erro ao criar serviço" });
        }
    }
    private static async Task<IResult> UpdateService(
        Guid id,
        Service updatedService,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
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
        catch
        {
            return Results.BadRequest(new { error = "Erro ao atualizar serviço" });
        }
    }
    private static async Task<IResult> DeleteService(
        Guid id,
        AppDbContext context,
        HttpContext httpContext)
    {
        try
        {
            var userId = Guid.Parse(httpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
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
        catch
        {
            return Results.BadRequest(new { error = "Erro ao remover serviço" });
        }
    }
}
