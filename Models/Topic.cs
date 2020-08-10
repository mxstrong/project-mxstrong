using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class Topic
  {
    [Required]
    public string TopicId { get; set; }
    [Required]
    public string Name { get; set; }
    public List<Post> Posts { get; set; }
  }
}
