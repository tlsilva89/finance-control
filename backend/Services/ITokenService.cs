using FinanceControl.Api.Models;

namespace FinanceControl.Api.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
