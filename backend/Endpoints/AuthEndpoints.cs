using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FinanceControl.Api.Data;
using FinanceControl.Api.Models;
using FinanceControl.Api.Dtos;
using FinanceControl.Api.Services;

namespace FinanceControl.Api.Endpoints;

public static class AuthEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/register", Register).AllowAnonymous();
        group.MapPost("/login", Login).AllowAnonymous();
        group.MapPost("/check-username", CheckUsername).AllowAnonymous();
        group.MapPost("/forgot-password", ForgotPassword).AllowAnonymous();
        group.MapPost("/reset-password", ResetPassword).AllowAnonymous();
    }

    private static async Task<IResult> Register(
        RegisterRequest request,
        AppDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        try
        {
            // Validar se username já existe
            if (await context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return Results.BadRequest(new { error = "Nome de usuário já existe" });
            }

            // Validar data de nascimento
            if (!DateOnly.TryParse(request.BirthDate, out var birthDate))
            {
                return Results.BadRequest(new { error = "Data de nascimento inválida" });
            }

            // Criar novo usuário
            var user = new User
            {
                Username = request.Username,
                Name = request.Name,
                BirthDate = birthDate,
                PasswordHash = passwordHasher.HashPassword(request.Password),
                SecurityQuestion = request.SecurityQuestion,
                SecurityAnswerHash = passwordHasher.HashPassword(request.SecurityAnswer.ToLowerInvariant())
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Gerar token
            var token = tokenService.GenerateToken(user);

            var userDto = new UserDto(user.Id, user.Username, user.Name);
            return Results.Ok(new AuthResponse(userDto, token));
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro interno do servidor" });
        }
    }

    private static async Task<IResult> Login(
        LoginRequest request,
        AppDbContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        try
        {
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Results.BadRequest(new { error = "Usuário ou senha inválidos" });
            }

            var token = tokenService.GenerateToken(user);
            var userDto = new UserDto(user.Id, user.Username, user.Name);

            return Results.Ok(new AuthResponse(userDto, token));
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro interno do servidor" });
        }
    }

    private static async Task<IResult> CheckUsername(
        CheckUsernameRequest request,
        AppDbContext context)
    {
        try
        {
            var exists = await context.Users.AnyAsync(u => u.Username == request.Username);
            
            return Results.Ok(new CheckUsernameResponse(
                !exists,
                exists ? "Nome de usuário não está disponível" : "Nome de usuário disponível"
            ));
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao verificar nome de usuário" });
        }
    }

    private static async Task<IResult> ForgotPassword(
        ForgotPasswordRequest request,
        AppDbContext context)
    {
        try
        {
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return Results.Ok(new ForgotPasswordResponse(false));
            }

            return Results.Ok(new ForgotPasswordResponse(true, user.SecurityQuestion));
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao verificar usuário" });
        }
    }

    private static async Task<IResult> ResetPassword(
        ResetPasswordRequest request,
        AppDbContext context,
        IPasswordHasher passwordHasher)
    {
        try
        {
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return Results.BadRequest(new { error = "Usuário não encontrado" });
            }

            // Validar data de nascimento
            if (!DateOnly.TryParse(request.BirthDate, out var birthDate) || user.BirthDate != birthDate)
            {
                return Results.BadRequest(new { error = "Data de nascimento incorreta" });
            }

            // Validar resposta de segurança
            if (!passwordHasher.VerifyPassword(request.SecurityAnswer.ToLowerInvariant(), user.SecurityAnswerHash))
            {
                return Results.BadRequest(new { error = "Resposta de segurança incorreta" });
            }

            // Atualizar senha
            user.PasswordHash = passwordHasher.HashPassword(request.NewPassword);
            await context.SaveChangesAsync();

            return Results.Ok(new { message = "Senha redefinida com sucesso" });
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = "Erro ao redefinir senha" });
        }
    }
}
