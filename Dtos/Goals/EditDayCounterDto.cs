using System;

namespace Mxstrong.Dtos.Goals
{
  public class EditDayCounterDto : EditGoalDto
  {
    public DateTime StartingDate { get; set; }
    public int DayGoal { get; set; }
  }
}
