namespace Mxstrong.Models
{
  public class User
  {
    public string UserId { get; set; }
    public string Email { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
  }
}
