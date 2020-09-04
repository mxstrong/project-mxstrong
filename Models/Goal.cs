using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class Goal
  {
    [Required]
    public string GoalId { get; set; }
    [Required]
    public string Text { get; set; }
    [Required]
    public string Type { get; set; }
    [Required]
    public int Progress { get; set; }
    public string ParentGoalId { get; set; }
    public Goal ParentGoal { get; set; }
    public List<Goal> SubGoals { get; set; }
  }
}
