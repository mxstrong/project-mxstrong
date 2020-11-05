using System;

namespace Mxstrong.Dtos
{
  public class EditDayCounterDto : EditGoalDto
  {
    public DateTime StartingDate { get; set; }
    public string DayGoal { get; set; }
  }
}
