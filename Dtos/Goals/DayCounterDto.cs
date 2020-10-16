using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mxstrong.Dtos
{
  public class DayCounterDto : GoalDto
  {
    public string StartingDate { get; set; }
    public int DayGoal { get; set; }
  }
}
