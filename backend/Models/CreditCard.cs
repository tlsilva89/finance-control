using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceControl.Api.Models;

public class CreditCard
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Limit { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal CurrentDebt { get; set; }
    
    [Range(1, 31)]
    public int DueDate { get; set; }
    
    [Required]
    [StringLength(7)] // YYYY-MM
    public string MonthReference { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
