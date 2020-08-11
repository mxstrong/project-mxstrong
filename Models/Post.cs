using System;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class Post
  {
    [Required]
    public string PostId { get; set; }
    [Required]
    public string Title { get; set; }
    [Required]
    public string Body { get; set; }
    [Required]
    public DateTime CreatedAt { get; set; }
    [Required]
    public string UserId { get; set; }
    public User User { get; set; }
    [Required]
    public string TopicId { get; set; }
    public Topic Topic { get; set; }
  }
}
