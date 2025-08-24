using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using FinanceControl.Api.Data;
using FinanceControl.Api.Services;
using FinanceControl.Api.Endpoints;
using Npgsql; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://192.168.3.15:8080",
                "http://truenas.spark.local:8080",
                "http://localhost:8080"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

AuthEndpoints.Map(app);
IncomeEndpoints.Map(app);
CreditCardsEndpoints.Map(app);
CreditCardExpensesEndpoints.Map(app);
SubscriptionsEndpoints.Map(app);
ServicesEndpoints.Map(app);


var logger = app.Services.GetRequiredService<ILogger<Program>>();
var maxRetries = 10;
var delay = TimeSpan.FromSeconds(5);

for (var i = 1; i <= maxRetries; i++)
{
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            logger.LogInformation("A tentar ligar à base de dados e aplicar migrações... (Tentativa {i}/{maxRetries})", i, maxRetries);
            context.Database.Migrate();
            logger.LogInformation("Migração da base de dados bem-sucedida.");
            break; 
        }
    }
    catch (NpgsqlException ex)
    {
        logger.LogWarning(ex, "Não foi possível ligar à base de dados. Nova tentativa em {delay} segundos...", delay.TotalSeconds);
        if (i == maxRetries)
        {
            logger.LogError("Número máximo de tentativas atingido. Não foi possível ligar à base de dados.");
            throw; 
        }
        await Task.Delay(delay); 
    }
}



app.Run();
