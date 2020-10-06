using System;

namespace Mxstrong.Models
{
  public class DayCounter : Goal
  {
    public DateTime StartingDate { get; set; }
    public int DayGoal { get; set; }
  }
}
