using Mxstrong.Dtos;
using Mxstrong.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mxstrong.Data
{
  public interface IAuthRepository
  {
    Task<User> Register(User user, string password);
    Task<User> RegisterExistingUser(User user, string password);
    Task<ActivationToken> GenerateActivationToken(string UserId);
    Task<User> ActivateUser(string tokenId);
    Task<User> Login(string email, string password);
    Task<User> CreateUserWithoutRegistration(User user);
    Task<bool> UserExists(string email);
    Task<User> FindUser(string id);
    Task<User> GetExistingUser(string email);
    Task<List<User>> GetUsers();
    Task<User> UpdateUser(string id, UserProfileDto user);
  }
}
