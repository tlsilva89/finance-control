using Microsoft.EntityFrameworkCore;
using FinanceControl.Api.Models;

namespace FinanceControl.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Income> Incomes { get; set; } = null!;
    public DbSet<CreditCard> CreditCards { get; set; } = null!;
    public DbSet<CreditCardExpense> CreditCardExpenses { get; set; } = null!;
    public DbSet<Subscription> Subscriptions { get; set; } = null!;
    public DbSet<Service> Services { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.SecurityQuestion).IsRequired();
            entity.Property(e => e.SecurityAnswerHash).IsRequired();
        });

        modelBuilder.Entity<Income>(entity =>
        {
            entity.Property(e => e.Amount).HasColumnType("numeric(18,2)");
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CreditCard>(entity =>
        {
            entity.Property(e => e.Limit).HasColumnType("numeric(18,2)");
            entity.Property(e => e.CurrentDebt).HasColumnType("numeric(18,2)");
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(e => e.Expenses)
                .WithOne(e => e.CreditCard)
                .HasForeignKey(e => e.CreditCardId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CreditCardExpense>(entity =>
        {
            entity.Property(e => e.Amount).HasColumnType("numeric(18,2)");
            entity.Property(e => e.InstallmentAmount).HasColumnType("numeric(18,2)");
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.CreditCard)
                .WithMany(c => c.Expenses)
                .HasForeignKey(e => e.CreditCardId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.Property(e => e.Amount).HasColumnType("numeric(18,2)");
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.Property(e => e.Amount).HasColumnType("numeric(18,2)");
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
