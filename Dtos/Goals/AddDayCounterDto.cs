using System;

namespace Mxstrong.Dtos
{
  public class AddDayCounterDto : AddGoalDto
  {
    public DateTime StartingDate { get; set; }
    public int DayGoal { get; set; }
  }
}
