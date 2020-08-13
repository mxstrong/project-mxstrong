using Mxstrong.Models;
using System;
using System.Collections.Generic;

namespace Mxstrong.Dtos
{
  public class CommentDto
  {
    public string CommentId { get; set; }
    public string Text { get; set; }
    public string CreatedAt { get; set; }
    public List<CommentDto> Children { get; set; }
    public string PostId { get; set; }
    public string UserId { get; set; }
    public string Author { get; set; }
  }
}
