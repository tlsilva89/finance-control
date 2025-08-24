using System.ComponentModel.DataAnnotations;

namespace FinanceControl.Api.Dtos;

public record LoginRequest(
    [Required] string Username,
    [Required] string Password
);

public record RegisterRequest(
    [Required] [StringLength(20, MinimumLength = 3)] string Username,
    [Required] [StringLength(100)] string Name,
    [Required] string BirthDate,
    [Required] [StringLength(100, MinimumLength = 6)] string Password,
    [Required] string SecurityQuestion,
    [Required] string SecurityAnswer
);

public record CheckUsernameRequest([Required] string Username);

public record ForgotPasswordRequest([Required] string Username);

public record ResetPasswordRequest(
    [Required] string Username,
    [Required] string BirthDate,
    [Required] string SecurityAnswer,
    [Required] [StringLength(100, MinimumLength = 6)] string NewPassword
);

public record AuthResponse(UserDto User, string Token);

public record UserDto(int Id, string Username, string Name);

public record CheckUsernameResponse(bool Available, string Message);

public record ForgotPasswordResponse(bool HasUser, string? SecurityQuestion = null);
