using System.Collections.Generic;

namespace Mxstrong.Models
{
  public class User
  {
    public string UserId { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    public bool Activated { get; set; }
    public List<Post> Posts { get; set; }
  }
}
