using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class Comment
  {
    [Required]
    public string CommentId { get; set; }
    [Required]
    public string Text { get; set; }
    [Required]
    public DateTime CreatedAt { get; set; }
    public string ParentId { get; set; }
    public Comment Parent { get; set; }
    public List<Comment> Children { get; set; }
    [Required]
    public string PostId { get; set; }
    public Post Post { get; set; }
    [Required]
    public string UserId { get; set; }
    public User User { get; set; }
  }
}
