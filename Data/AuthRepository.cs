using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Models;

namespace Mxstrong.Data
{
  public class AuthRepository : IAuthRepository
  {
    private readonly MxstrongContext _context;
    public AuthRepository(MxstrongContext context)
    {
      _context = context;
    }
    public async Task<User> Login(string email, string password)
    {
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
      if (user == null)
      {
        return null;
      }

      if (!VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
      {
        return null;
      }

      return user;
    }

    private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
    {
      using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
      {
        var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        if (!computedHash.SequenceEqual(passwordHash))
        { 
          return false; 
        }
      }
      return true;
    }

    public async Task<User> Register(User user, string password)
    {
      CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

      user.UserId = Guid.NewGuid().ToString();
      user.PasswordHash = passwordHash;
      user.PasswordSalt = passwordSalt;

      await _context.Users.AddAsync(user); // Adding the user to context of users.
      await _context.SaveChangesAsync(); // Save changes to database.

      return user;
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
      using var hmac = new System.Security.Cryptography.HMACSHA512();
      passwordSalt = hmac.Key;
      passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    }

    public async Task<ActivationToken> GenerateActivationToken(string UserId)
    {
      var token = new ActivationToken()
      {
        Id = Guid.NewGuid().ToString(),
        UserId = UserId,
      };

      await _context.ActivationTokens.AddAsync(token);
      await _context.SaveChangesAsync();
      return token;
    }

    public async Task<User> ActivateUser(string tokenId)
    {
      var token = await _context.ActivationTokens.SingleAsync(a => a.Id == tokenId);
      var user = await _context.Users.FindAsync(token.UserId);
      user.Activated = true;
      _context.ActivationTokens.Remove(token);
      await _context.SaveChangesAsync();
      return user;
    }

    public async Task<bool> UserExists(string email)
    {
      return await _context.Users.AnyAsync(x => x.Email == email);
    }
  }
}
