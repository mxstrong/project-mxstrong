using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public abstract class Goal
  {
    [Required]
    public string GoalId { get; set; }
    [Required]
    public string Text { get; set; }
    [Required]
    public string UserId { get; set; }
    public string ParentGoalId { get; set; }
    public ProgressBar ParentGoal { get; set; }
  }
}
