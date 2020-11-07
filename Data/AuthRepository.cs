using Microsoft.EntityFrameworkCore;
using Mxstrong.Dtos;
using Mxstrong.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
      if (user == null || !user.Registered)
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
      user.CreatedAt = DateTime.Now;
      user.UpdatedAt = DateTime.Now;

      await _context.Users.AddAsync(user); 
      await _context.SaveChangesAsync();

      return user;
    }

    public async Task<User> RegisterExistingUser(User user, string password)
    {
      CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

      user.PasswordHash = passwordHash;
      user.PasswordSalt = passwordSalt;
      user.Registered = true;
      user.UpdatedAt = DateTime.Now;

      await _context.SaveChangesAsync();

      return user;
    }

    public async Task<User> CreateUserWithoutRegistration(User user)
    {
      user.UserId = Guid.NewGuid().ToString();
      user.PasswordHash = null;
      user.PasswordSalt = null;
      user.CreatedAt = DateTime.Now;
      user.UpdatedAt = DateTime.Now;

      await _context.Users.AddAsync(user);
      await _context.SaveChangesAsync();

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
        CreatedAt = DateTime.Now,
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
      return await _context.Users.AnyAsync(x => x.Email == email && x.Activated);
    }

    public async Task<User> FindUser(string id)
    {
      return await _context.Users.FindAsync(id);
    }

    public async Task<List<User>> GetUsers()
    {
      return await _context.Users.ToListAsync();
    }

    public async Task<User> UpdateUser(string id, UserProfileDto userProfile)
    {
      if (id != userProfile.UserId)
      {
        return null;
      }
      var user = await _context.Users.FirstOrDefaultAsync(user => user.UserId == id);
      user.Email = userProfile.Email;
      user.FullName = userProfile.FullName;
      user.Role = userProfile.Role;
      user.UpdatedAt = DateTime.Now;
      await _context.SaveChangesAsync();
      return user;
    }

    public async Task<User> GetExistingUser(string email)
    {
      var user = await _context.Users.FirstAsync(user => user.Email == email);

      return user;
    }
  }
}
