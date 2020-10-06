using System;
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
    public DateTime CreatedAt { get; set; }
    [Required]
    public DateTime UpdatedAt { get; set; }
    [Required]
    public string UserId { get; set; }
    public User User { get; set; }
    public string ParentGoalId { get; set; }
    public ProgressBar ParentGoal { get; set; }
  }
}
