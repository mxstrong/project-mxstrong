using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Dtos
{
  public class RegisterUserDto
  {
    [Required]
    public string FullName { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    [StringLength(20, MinimumLength = 8, ErrorMessage = "You must specify a password between 8 and 20 characters.")]
    public string Password { get; set; }
  }
}
