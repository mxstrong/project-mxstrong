using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class ProgressBar : Goal
  {
    [Required]
    public int Progress { get; set; }
    public List<CheckBox> SubGoals { get; set; }
    public List<ProgressBar> ChildBars { get; set; }
  }
}
