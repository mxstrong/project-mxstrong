using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mxstrong.Dtos
{
  public class GoalDto
  {
    public string GoalId { get; set; }
    public string Text { get; set; }
    public string ParentGoalId { get; set; }
  }
}
