using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mxstrong.Models
{
  public class ProgressBar : Goal
  {
    public List<DayCounter> DayCounters { get; set; }
    public List<CheckBox> SubGoals { get; set; }
    public List<ProgressBar> ChildBars { get; set; }
  }
}
