using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class ActivationToken
  {
    [Required]
    public string Id { get; set; }
    [Required]
    public string UserId { get; set; }
  }
}
