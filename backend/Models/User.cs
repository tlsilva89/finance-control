using System.ComponentModel.DataAnnotations;

namespace FinanceControl.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [StringLength(20, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    public DateOnly BirthDate { get; set; }
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    public string SecurityQuestion { get; set; } = string.Empty;
    
    [Required]
    public string SecurityAnswerHash { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
