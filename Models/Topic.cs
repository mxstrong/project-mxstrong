using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mxstrong.Models
{
  public class Topic
  {
    public string TopicId { get; set; }
    public string Name { get; set; }
    public List<Post> Posts { get; set; }
  }
}
