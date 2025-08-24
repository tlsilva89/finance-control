using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceControl.Api.Models;

public class CreditCardExpense
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }  
    
    [Required]
    [StringLength(200)]
    public string Description { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
    
    public DateTime PurchaseDate { get; set; }
    
    public int Installments { get; set; } = 1;
    
    public int CurrentInstallment { get; set; } = 1;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal InstallmentAmount { get; set; }
    
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;
    
    public bool IsPaid { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int CreditCardId { get; set; }  // Era Guid
    public CreditCard CreditCard { get; set; } = null!;
    
    public int UserId { get; set; }  // Era Guid
    public User User { get; set; } = null!;
}
