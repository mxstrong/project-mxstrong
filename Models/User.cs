using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class User
  {
    [Required]
    public string UserId { get; set; }
    [Required]
    public string FullName { get; set; }
    [Required]
    public string Email { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    [Required]
    public bool Activated { get; set; }
    [Required]
    public string Role { get; set; }
    public List<Post> Posts { get; set; }
  }
}
