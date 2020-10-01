using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mxstrong.Dtos
{
  public class EditCommentDto
  {
    public string CommentId { get; set; }
    public string Text { get; set; }
    public string PostId { get; set; }
    public string UserId { get; set; }
  }
}
