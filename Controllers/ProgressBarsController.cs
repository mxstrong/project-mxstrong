using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Models;
using Mxstrong.Dtos;
using System;
using System.Security.Claims;

namespace Mxstrong.Controllers
{
  [Route("api/goals/[controller]")]
  [ApiController]
  public class ProgressBarsController : ControllerBase
  {
    private readonly MxstrongContext _context;

    public ProgressBarsController(MxstrongContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProgressBarDto>>> GetProgressBars()
    {
      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      var progressBars = await _context.ProgressBars.Where(pb => pb.UserId == userId).Include(pb => pb.SubGoals).Include(pb => pb.DayCounters).ToListAsync();
      var progressBarDtos = progressBars.Select(pb => ConvertProgressBarToDto(pb)).ToList();
      return progressBarDtos;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditProgressBar(string id, EditGoalDto goalDto)
    {
      if (id != goalDto.GoalId)
      {
        return BadRequest();
      }

      var progressBar = await _context.ProgressBars.FindAsync(id);

      progressBar.Text = goalDto.Text;
      progressBar.UpdatedAt = DateTime.Now;

      _context.Entry(progressBar).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!ProgressBarExists(id))
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

    [HttpPost]
    public async Task<ActionResult<Goal>> AddProgressBar(AddGoalDto goalDto)
    {
      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      var progressBar = new ProgressBar
      {
        GoalId = Guid.NewGuid().ToString(),
        Text = goalDto.Text,
        Progress = 0,
        UserId = userId,
        ParentGoalId = goalDto.ParentGoalId,
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now
      };

      _context.ProgressBars.Add(progressBar);
      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (ProgressBarExists(progressBar.GoalId))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }

      return CreatedAtAction("AddProgressBar", progressBar);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Goal>> DeleteProgressBar(string id)
    {
      var progressBar = await _context.ProgressBars.FindAsync(id);
      if (progressBar == null)
      {
        return NotFound();
      }

      _context.ProgressBars.Remove(progressBar);
      await _context.SaveChangesAsync();

      return progressBar;
    }

    private bool ProgressBarExists(string id)
    {
      return _context.ProgressBars.Any(pb => pb.GoalId == id);
    }

    private static ProgressBarDto ConvertProgressBarToDto(ProgressBar progressBar)
    {
      return new ProgressBarDto
      {
        GoalId = progressBar.GoalId,
        Text = progressBar.Text,
        Progress = progressBar.Progress,
        ParentGoalId = progressBar.ParentGoalId,
        DayCounters = progressBar.DayCounters?.Select(dayCounter => new DayCounterDto
        {
          GoalId = dayCounter.GoalId,
          Text = dayCounter.Text,
          StartingDate = dayCounter.StartingDate.ToString("yyyy-MM-dd"),
          DayGoal = dayCounter.DayGoal,
          ParentGoalId = dayCounter.ParentGoalId
        }).ToList(),
        SubGoals = progressBar.SubGoals?.Select(checkbox => new CheckBoxDto
        {
          GoalId = checkbox.GoalId,
          Text = checkbox.Text,
          Checked = checkbox.Checked,
          ParentGoalId = checkbox.ParentGoalId
        }).ToList(),
        ChildBars = progressBar.ChildBars?.Select(g => ConvertProgressBarToDto(g)).ToList(),
      };
    }
  }
}
