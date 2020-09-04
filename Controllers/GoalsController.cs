using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Models;
using Mxstrong.Dtos;
using System;

namespace Mxstrong.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class GoalsController : ControllerBase
  {
    private readonly MxstrongContext _context;

    public GoalsController(MxstrongContext context)
    {
      _context = context;
    }

    // GET: api/Goals
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoalDto>>> GetGoals()
    {
      var goals = await _context.Goals.ToListAsync();
      var goalDtos = goals.Select(g => ConvertGoalToDto(g)).ToList();
      return goalDtos;
    }

    // GET: api/Goals/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GoalDto>> GetGoal(string id)
    {
      var goal = await _context.Goals.FindAsync(id);

      if (goal == null)
      {
        return NotFound();
      }

      var goalDto = ConvertGoalToDto(goal);

      return goalDto;
    }

    // PUT: api/Goals/5
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPut("{id}")]
    public async Task<IActionResult> PutGoal(string id, EditGoalDto goalDto)
    {
      if (id != goalDto.GoalId || (goalDto.Type != GoalType.CheckBox && goalDto.Type != GoalType.ProgressBar))
      {
        return BadRequest();
      }

      var goal = await _context.Goals.FindAsync(id);

      goal.Text = goalDto.Text;
      goal.Type = goalDto.Type;

      _context.Entry(goal).State = EntityState.Modified;

      try
      {
          await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!GoalExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/Goals
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
    public async Task<ActionResult<Goal>> PostGoal(AddGoalDto goalDto)
    {
      var goal = new Goal
      {
        GoalId = Guid.NewGuid().ToString(),
        Text = goalDto.Text,
        Type = goalDto.Type,
        Progress = 0,
        ParentGoalId = goalDto.ParentGoalId
      };

      _context.Goals.Add(goal);
      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (GoalExists(goal.GoalId))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }

      return CreatedAtAction("AddGoal", goal);
    }

    // DELETE: api/Goals/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Goal>> DeleteGoal(string id)
    {
      var goal = await _context.Goals.FindAsync(id);
      if (goal == null)
      {
        return NotFound();
      }

      _context.Goals.Remove(goal);
      await _context.SaveChangesAsync();

      return goal;
    }

    private bool GoalExists(string id)
    {
      return _context.Goals.Any(e => e.GoalId == id);
    }

    private static GoalDto ConvertGoalToDto(Goal goal)
    {
      return new GoalDto
      {
        GoalId = goal.GoalId,
        Text = goal.Text,
        Type = goal.Type,
        Progress = goal.Progress,
        ParentGoalId = goal.ParentGoalId,
        SubGoals = goal.SubGoals?.Select(g => ConvertGoalToDto(g)).ToList(),
      };
    }
  }
}
