using Npgsql.TypeHandlers.DateTimeHandlers;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class ActivationToken
  {
    [Required]
    public string Id { get; set; }
    [Required]
    public string UserId { get; set; }
    [Required]
    public DateTime CreatedAt { get; set; }
  }
}
