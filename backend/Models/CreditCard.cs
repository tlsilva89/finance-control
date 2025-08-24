using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceControl.Api.Models;

public class CreditCard
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }  // Era Guid

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Limit { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal CurrentDebt { get; set; }

    [NotMapped]
    public decimal TotalConsumption { get; set; }

    [Range(1, 31)]
    public int DueDate { get; set; }

    [Required]
    [StringLength(7)]
    public string MonthReference { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; } 
    public User User { get; set; } = null!;

    public ICollection<CreditCardExpense> Expenses { get; set; } = new List<CreditCardExpense>();
}
