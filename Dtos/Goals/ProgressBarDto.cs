using System.Collections.Generic;

namespace Mxstrong.Dtos
{
  public class ProgressBarDto : GoalDto
  {
    public int Progress { get; set; }
    public List<CheckBoxDto> SubGoals { get; set; }
    public List<ProgressBarDto> ChildBars { get; set; }
  }
}
