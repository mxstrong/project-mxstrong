using System.Collections.Generic;

namespace Mxstrong.Dtos
{
  public class GoalDto
  {
    public string GoalId { get; set; }
    public string Text { get; set; }
    public string Type { get; set; }
    public int Progress { get; set; }
    public string ParentGoalId { get; set; }
    public List<GoalDto> SubGoals { get; set; }
  }
}
