using System;

namespace Mxstrong.Dtos
{
  public class EditDayCounterDto : EditGoalDto
  {
    public string StartingDate { get; set; }
    public string DayGoal { get; set; }
  }
}
