using System;

namespace Mxstrong.Dtos
{
  public class PostDto
  {
    public string PostId { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
    public string Topic { get; set; }
    public string UserId { get; set; }
    public string Author { get; set; }
    public string CreatedAt { get; set; }
  }
}