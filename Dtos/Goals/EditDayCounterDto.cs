using System;

namespace Mxstrong.Dtos
{
  public class EditDayCounterDto : EditGoalDto
  {
    public DateTime StartingDate { get; set; }
    public int DayGoal { get; set; }
  }
}
